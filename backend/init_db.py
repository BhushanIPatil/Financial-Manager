"""
Initialize database and create tables
"""
from app.core.database import init_db, engine
from app.models import *  # Import all models
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich import box

console = Console()

if __name__ == "__main__":
    console.print("\n[bold cyan]>>> Initializing Database[/bold cyan]")
    console.print(f"[dim]Server: {engine.url}[/dim]\n")
    
    try:
        with console.status("[bold green]Creating tables...", spinner="dots"):
            init_db()
        
        console.print("[bold green]SUCCESS: Database initialized successfully![/bold green]\n")
        
        # Create a table to show created tables
        table = Table(title="Database Tables Created", box=box.ROUNDED)
        table.add_column("Table Name", style="cyan", no_wrap=True)
        table.add_column("Description", style="white")
        
        table.add_row("users", "User authentication & profiles")
        table.add_row("family_members", "Family member management")
        table.add_row("inter_family_loans", "Loans between family members")
        table.add_row("incomes", "Income tracking (with member link)")
        table.add_row("expenses", "Expense management (with member link)")
        table.add_row("investments", "Investment portfolio")
        table.add_row("credit_cards", "Credit card tracking")
        table.add_row("loans", "External loan management")
        table.add_row("assets", "Asset tracking")
        table.add_row("liabilities", "Liability tracking")
        table.add_row("user_settings", "User preferences")
        
        console.print(table)
        console.print("\n[bold green]>>> Ready to use![/bold green]")
        console.print("[dim]Next: Run 'python run.py' to start the API server[/dim]\n")
        
    except Exception as e:
        console.print(f"\n[bold red]ERROR: Error initializing database:[/bold red]")
        console.print(Panel(str(e), border_style="red", title="Error Details"))
        raise
