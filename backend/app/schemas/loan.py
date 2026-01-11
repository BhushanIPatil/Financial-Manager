"""
Loan schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.loan import LoanType


class LoanBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    lender: str = Field(..., min_length=1, max_length=255)
    principal_amount: float = Field(..., gt=0)
    outstanding_balance: float = Field(..., ge=0)
    interest_rate: float = Field(..., ge=0, le=100)
    emi_amount: float = Field(..., gt=0)
    start_date: datetime
    end_date: datetime
    type: LoanType


class LoanCreate(LoanBase):
    pass


class LoanUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    lender: Optional[str] = Field(None, min_length=1, max_length=255)
    principal_amount: Optional[float] = Field(None, gt=0)
    outstanding_balance: Optional[float] = Field(None, ge=0)
    interest_rate: Optional[float] = Field(None, ge=0, le=100)
    emi_amount: Optional[float] = Field(None, gt=0)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    type: Optional[LoanType] = None


class LoanResponse(LoanBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
