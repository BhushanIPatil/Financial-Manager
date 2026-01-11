"""
Family Member schemas
"""
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class FamilyMemberBase(BaseModel):
    name: str
    relation: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    is_active: Optional[int] = 1
    notes: Optional[str] = None


class FamilyMemberCreate(FamilyMemberBase):
    pass


class FamilyMemberUpdate(BaseModel):
    name: Optional[str] = None
    relation: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    is_active: Optional[int] = None
    notes: Optional[str] = None


class FamilyMemberInDBBase(FamilyMemberBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FamilyMember(FamilyMemberInDBBase):
    pass


class FamilyMemberWithStats(FamilyMember):
    """Family member with income/expense statistics"""
    total_income: float = 0.0
    total_expense: float = 0.0
    net_contribution: float = 0.0
    loans_given: float = 0.0
    loans_taken: float = 0.0
