"""
Expense schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.expense import ExpenseCategory, RecurrenceType


class ExpenseBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    amount: float = Field(..., gt=0)
    category: ExpenseCategory
    family_member_id: Optional[int] = None
    is_fixed: bool = False
    is_recurring: bool = False
    recurrence: Optional[RecurrenceType] = RecurrenceType.NONE
    date: datetime
    description: Optional[str] = Field(None, max_length=1000)
    tags: Optional[List[str]] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    amount: Optional[float] = Field(None, gt=0)
    category: Optional[ExpenseCategory] = None
    family_member_id: Optional[int] = None
    is_fixed: Optional[bool] = None
    is_recurring: Optional[bool] = None
    recurrence: Optional[RecurrenceType] = None
    date: Optional[datetime] = None
    description: Optional[str] = Field(None, max_length=1000)
    tags: Optional[List[str]] = None


class ExpenseResponse(BaseModel):
    id: int
    user_id: int
    family_member_id: Optional[int] = None
    title: str
    amount: float
    category: ExpenseCategory
    is_fixed: bool
    is_recurring: bool
    recurrence: Optional[RecurrenceType]
    date: datetime
    description: Optional[str]
    tags: Optional[List[str]]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ExpenseWithMemberName(ExpenseResponse):
    family_member_name: Optional[str] = None
