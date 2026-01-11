"""
Main FastAPI application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich import box

from app.core.config import settings
from app.core.database import init_db
from app.api.api import api_router

console = Console()

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production-ready Personal Finance Management API",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Event handlers
@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    console.print("\n" + "="*60)
    console.print(f"[bold cyan]>>> Starting {settings.APP_NAME}[/bold cyan] [dim]v{settings.APP_VERSION}[/dim]")
    console.print("="*60 + "\n")
    
    # Create info table
    info_table = Table(show_header=False, box=box.SIMPLE)
    info_table.add_column("Key", style="cyan")
    info_table.add_column("Value", style="white")
    
    info_table.add_row("Server", f"{settings.DB_SERVER}")
    info_table.add_row("Database", f"{settings.DB_NAME}")
    info_table.add_row("API Port", f"{settings.API_PORT}")
    info_table.add_row("Debug Mode", f"{'Enabled' if settings.DEBUG else 'Disabled'}")
    
    console.print(info_table)
    console.print()
    
    try:
        with console.status("[bold green]Initializing database...", spinner="dots"):
            init_db()
        console.print("[bold green]SUCCESS: Database initialized[/bold green]\n")
        
        # Show API endpoints
        endpoints_panel = Panel(
            "[cyan]Swagger UI:[/cyan] http://localhost:8000/docs\n"
            "[cyan]ReDoc:[/cyan] http://localhost:8000/redoc\n"
            "[cyan]API:[/cyan] http://localhost:8000/api",
            title="API Endpoints",
            border_style="green",
            box=box.ROUNDED
        )
        console.print(endpoints_panel)
        console.print()
        
    except Exception as e:
        console.print(f"[bold red]ERROR: Database initialization failed[/bold red]")
        console.print(Panel(str(e), border_style="red", title="Error"))
        raise


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    console.print(f"\n[bold yellow]>>> Shutting down {settings.APP_NAME}[/bold yellow]\n")


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Financial Manager API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "status": "running"
    }


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse(
        status_code=200,
        content={
            "status": "healthy",
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION
        }
    )


# Include API router
app.include_router(api_router, prefix="/api")


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "message": str(exc) if settings.DEBUG else "An error occurred"
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_RELOAD,
        log_level="info"
    )
