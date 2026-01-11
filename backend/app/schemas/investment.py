"""
Investment schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.investment import InvestmentType


class InvestmentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    type: InvestmentType
    invested_amount: float = Field(..., gt=0)
    current_value: float = Field(..., ge=0)
    quantity: Optional[float] = Field(None, gt=0)
    purchase_date: datetime
    notes: Optional[str] = Field(None, max_length=1000)


class InvestmentCreate(InvestmentBase):
    pass


class InvestmentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    type: Optional[InvestmentType] = None
    invested_amount: Optional[float] = Field(None, gt=0)
    current_value: Optional[float] = Field(None, ge=0)
    quantity: Optional[float] = Field(None, gt=0)
    purchase_date: Optional[datetime] = None
    notes: Optional[str] = Field(None, max_length=1000)


class InvestmentResponse(InvestmentBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
