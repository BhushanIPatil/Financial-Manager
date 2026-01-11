"""
User Settings model
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class Currency(str, enum.Enum):
    INR = "INR"
    USD = "USD"
    EUR = "EUR"


class Theme(str, enum.Enum):
    LIGHT = "light"
    DARK = "dark"
    SYSTEM = "system"


class CreditCardStrategy(str, enum.Enum):
    AVALANCHE = "avalanche"
    SNOWBALL = "snowball"


class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # General settings
    currency = Column(SQLEnum(Currency), default=Currency.INR)
    locale = Column(String(10), default="en-IN")
    theme = Column(SQLEnum(Theme), default=Theme.LIGHT)
    
    # Financial goals
    monthly_budget = Column(Float, nullable=True)
    emergency_fund_goal = Column(Float, nullable=True)
    default_expense_category = Column(String(50), default="other")
    credit_card_strategy = Column(SQLEnum(CreditCardStrategy), default=CreditCardStrategy.AVALANCHE)
    
    # Notifications
    expense_alerts = Column(Boolean, default=True)
    investment_updates = Column(Boolean, default=True)
    debt_reminders = Column(Boolean, default=True)
    
    # Relationships
    user = relationship("User", back_populates="settings")
