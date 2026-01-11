"""
Income schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.income import IncomeCategory, RecurrenceType


class IncomeBase(BaseModel):
    source: str = Field(..., min_length=1, max_length=255)
    amount: float = Field(..., gt=0)
    category: IncomeCategory
    family_member_id: Optional[int] = None
    is_recurring: bool = False
    recurrence: Optional[RecurrenceType] = RecurrenceType.NONE
    date: datetime
    description: Optional[str] = Field(None, max_length=1000)


class IncomeCreate(IncomeBase):
    pass


class IncomeUpdate(BaseModel):
    source: Optional[str] = Field(None, min_length=1, max_length=255)
    amount: Optional[float] = Field(None, gt=0)
    category: Optional[IncomeCategory] = None
    family_member_id: Optional[int] = None
    is_recurring: Optional[bool] = None
    recurrence: Optional[RecurrenceType] = None
    date: Optional[datetime] = None
    description: Optional[str] = Field(None, max_length=1000)


class IncomeResponse(IncomeBase):
    id: int
    user_id: int
    family_member_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class IncomeWithMemberName(IncomeResponse):
    family_member_name: Optional[str] = None
