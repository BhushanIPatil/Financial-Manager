"""
Database configuration and session management
"""
from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import NullPool
from typing import Generator

from app.core.config import settings


# Create SQLAlchemy engine
engine = create_engine(
    settings.database_url,
    poolclass=NullPool,  # SQL Server works better without connection pooling in some cases
    echo=settings.DEBUG,  # Log SQL queries in debug mode
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()


# Database event listeners for SQL Server optimization
@event.listens_for(engine, "connect")
def set_sql_server_options(dbapi_conn, connection_record):
    """Set SQL Server connection options"""
    cursor = dbapi_conn.cursor()
    # Set options for better performance
    cursor.execute("SET NOCOUNT ON")
    cursor.execute("SET ARITHABORT ON")
    cursor.close()


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to get database session
    Usage: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Initialize database - create all tables"""
    Base.metadata.create_all(bind=engine)
    print("SUCCESS: Database tables created successfully")


def drop_db() -> None:
    """Drop all database tables - USE WITH CAUTION"""
    Base.metadata.drop_all(bind=engine)
    print("WARNING: All database tables dropped")
