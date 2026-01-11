"""
Loan model
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base


class LoanType(str, enum.Enum):
    HOME = "home"
    CAR = "car"
    PERSONAL = "personal"
    EDUCATION = "education"
    OTHER = "other"


class Loan(Base):
    __tablename__ = "loans"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    lender = Column(String(255), nullable=False)
    principal_amount = Column(Float, nullable=False)
    outstanding_balance = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    emi_amount = Column(Float, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    type = Column(SQLEnum(LoanType), nullable=False, default=LoanType.OTHER)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="loans")
