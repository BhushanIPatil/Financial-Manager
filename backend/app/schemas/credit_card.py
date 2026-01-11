"""
Credit Card schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CreditCardBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    bank_name: str = Field(..., min_length=1, max_length=255)
    outstanding_balance: float = Field(..., ge=0)
    credit_limit: float = Field(..., gt=0)
    interest_rate: float = Field(..., ge=0, le=100)
    due_date: datetime
    minimum_payment: float = Field(..., ge=0)
    is_active: bool = True
    notes: Optional[str] = Field(None, max_length=1000)


class CreditCardCreate(CreditCardBase):
    pass


class CreditCardUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    bank_name: Optional[str] = Field(None, min_length=1, max_length=255)
    outstanding_balance: Optional[float] = Field(None, ge=0)
    credit_limit: Optional[float] = Field(None, gt=0)
    interest_rate: Optional[float] = Field(None, ge=0, le=100)
    due_date: Optional[datetime] = None
    minimum_payment: Optional[float] = Field(None, ge=0)
    is_active: Optional[bool] = None
    notes: Optional[str] = Field(None, max_length=1000)


class CreditCardResponse(CreditCardBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
