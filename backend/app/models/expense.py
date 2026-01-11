"""
Expense model
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base


class ExpenseCategory(str, enum.Enum):
    HOUSING = "housing"
    FOOD = "food"
    TRANSPORTATION = "transportation"
    UTILITIES = "utilities"
    HEALTHCARE = "healthcare"
    ENTERTAINMENT = "entertainment"
    SHOPPING = "shopping"
    EDUCATION = "education"
    INSURANCE = "insurance"
    DEBT = "debt"
    SAVINGS = "savings"
    INVESTMENT = "investment"
    OTHER = "other"


class RecurrenceType(str, enum.Enum):
    NONE = "none"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"


class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    family_member_id = Column(Integer, ForeignKey("family_members.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(SQLEnum(ExpenseCategory), nullable=False, default=ExpenseCategory.OTHER)
    is_fixed = Column(Boolean, default=False)
    is_recurring = Column(Boolean, default=False)
    recurrence = Column(SQLEnum(RecurrenceType), nullable=True, default=RecurrenceType.NONE)
    date = Column(DateTime, nullable=False)
    description = Column(String(1000), nullable=True)
    tags = Column(String(500), nullable=True)  # Comma-separated tags
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="expenses")
    family_member = relationship("FamilyMember", back_populates="expenses")