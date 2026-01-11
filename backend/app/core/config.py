"""
Application configuration settings
"""
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # Database
    DB_SERVER: str
    DB_NAME: str
    DB_TRUSTED_CONNECTION: str = "yes"
    DB_USERNAME: str = ""
    DB_PASSWORD: str = ""
    
    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_RELOAD: bool = True
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    
    # Application
    APP_NAME: str = "Financial Manager API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    @property
    def database_url(self) -> str:
        """Generate SQL Server connection string"""
        if self.DB_TRUSTED_CONNECTION.lower() == "yes":
            # Windows Authentication
            return (
                f"mssql+pyodbc://@{self.DB_SERVER}/{self.DB_NAME}"
                f"?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
            )
        else:
            # SQL Server Authentication
            return (
                f"mssql+pyodbc://{self.DB_USERNAME}:{self.DB_PASSWORD}"
                f"@{self.DB_SERVER}/{self.DB_NAME}"
                f"?driver=ODBC+Driver+17+for+SQL+Server"
            )
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
