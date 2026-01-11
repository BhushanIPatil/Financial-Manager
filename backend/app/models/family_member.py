"""
Family Member model
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base


class MemberRelation(str, enum.Enum):
    SELF = "self"
    SPOUSE = "spouse"
    PARENT = "parent"
    CHILD = "child"
    SIBLING = "sibling"
    GRANDPARENT = "grandparent"
    GRANDCHILD = "grandchild"
    OTHER = "other"


class FamilyMember(Base):
    __tablename__ = "family_members"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    relation = Column(SQLEnum(MemberRelation), nullable=False, default=MemberRelation.OTHER)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    is_active = Column(Integer, default=1)  # Using Integer for SQL Server compatibility
    notes = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="family_members")
    incomes = relationship("Income", back_populates="family_member")
    expenses = relationship("Expense", back_populates="family_member")
    loans_given = relationship("InterFamilyLoan", foreign_keys="[InterFamilyLoan.lender_id]", back_populates="lender")
    loans_taken = relationship("InterFamilyLoan", foreign_keys="[InterFamilyLoan.borrower_id]", back_populates="borrower")
