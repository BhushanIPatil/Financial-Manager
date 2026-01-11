"""
Liability schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.liability import LiabilityType


class LiabilityBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    type: LiabilityType
    amount: float = Field(..., gt=0)
    date: datetime


class LiabilityCreate(LiabilityBase):
    pass


class LiabilityUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    type: Optional[LiabilityType] = None
    amount: Optional[float] = Field(None, gt=0)
    date: Optional[datetime] = None


class LiabilityResponse(LiabilityBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
