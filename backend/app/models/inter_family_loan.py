"""
Inter-Family Loan model - Track loans between family members
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base


class LoanStatus(str, enum.Enum):
    ACTIVE = "active"
    PAID = "paid"
    PARTIALLY_PAID = "partially_paid"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"


class InterFamilyLoan(Base):
    __tablename__ = "inter_family_loans"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lender_id = Column(Integer, ForeignKey("family_members.id", ondelete="NO ACTION"), nullable=False)
    borrower_id = Column(Integer, ForeignKey("family_members.id", ondelete="NO ACTION"), nullable=False)
    
    amount = Column(Float, nullable=False)
    amount_paid = Column(Float, default=0.0)
    interest_rate = Column(Float, default=0.0)  # Annual interest rate percentage
    
    loan_date = Column(DateTime, nullable=False)
    due_date = Column(DateTime, nullable=True)
    last_payment_date = Column(DateTime, nullable=True)
    
    status = Column(SQLEnum(LoanStatus), nullable=False, default=LoanStatus.ACTIVE)
    description = Column(String(1000), nullable=True)
    notes = Column(String(1000), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="inter_family_loans")
    lender = relationship("FamilyMember", foreign_keys=[lender_id], back_populates="loans_given")
    borrower = relationship("FamilyMember", foreign_keys=[borrower_id], back_populates="loans_taken")
