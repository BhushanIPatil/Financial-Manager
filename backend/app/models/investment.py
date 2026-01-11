"""
Investment model
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base


class InvestmentType(str, enum.Enum):
    MUTUAL_FUND = "mutual_fund"
    STOCK = "stock"
    FD = "fd"
    BOND = "bond"
    GOLD = "gold"
    CRYPTO = "crypto"


class Investment(Base):
    __tablename__ = "investments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(SQLEnum(InvestmentType), nullable=False)
    invested_amount = Column(Float, nullable=False)
    current_value = Column(Float, nullable=False)
    quantity = Column(Float, nullable=True)
    purchase_date = Column(DateTime, nullable=False)
    notes = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="investments")
