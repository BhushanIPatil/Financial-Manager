"""
Credit Card model
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


class CreditCard(Base):
    __tablename__ = "credit_cards"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    bank_name = Column(String(255), nullable=False)
    outstanding_balance = Column(Float, nullable=False, default=0.0)
    credit_limit = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)  # Annual percentage
    due_date = Column(DateTime, nullable=False)
    minimum_payment = Column(Float, nullable=False, default=0.0)
    is_active = Column(Boolean, default=True)
    notes = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="credit_cards")
