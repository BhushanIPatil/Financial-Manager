"""
Create the FinancialManagerDB database if it doesn't exist
"""
import pyodbc
from rich.console import Console
from rich.panel import Panel
from rich import box

console = Console()

# Connect to SQL Server (master database)
conn_str = (
    r'DRIVER={ODBC Driver 17 for SQL Server};'
    r'SERVER=localhost\SQLEXPRESS;'
    r'DATABASE=master;'
    r'Trusted_Connection=yes;'
)

console.print("\n[bold cyan]>>> Connecting to SQL Server...[/bold cyan]")
console.print("[dim]Server: localhost\\SQLEXPRESS[/dim]\n")

try:
    with console.status("[bold green]Creating database...", spinner="dots"):
        conn = pyodbc.connect(conn_str, autocommit=True)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("""
            IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'FinancialManagerDB')
            BEGIN
                CREATE DATABASE FinancialManagerDB
            END
        """)
        
        cursor.close()
        conn.close()
    
    console.print("[bold green]SUCCESS: Database 'FinancialManagerDB' created successfully![/bold green]\n")
    
    panel = Panel(
        "[green]Database is ready[/green]\n\n"
        "[cyan]Next step:[/cyan]\n"
        "[white]Run: [bold]python init_db.py[/bold][/white]",
        title="Success",
        border_style="green",
        box=box.ROUNDED
    )
    console.print(panel)
    
except Exception as e:
    console.print(f"\n[bold red]ERROR: Failed to create database[/bold red]\n")
    
    error_panel = Panel(
        f"[red]{str(e)}[/red]\n\n"
        "[yellow]Troubleshooting:[/yellow]\n"
        "1. Make sure SQL Server is running\n"
        "2. Check if you have permission to create databases\n"
        "3. Try connecting with SQL Server Management Studio first",
        title="Error Details",
        border_style="red",
        box=box.ROUNDED
    )
    console.print(error_panel)
    raise
