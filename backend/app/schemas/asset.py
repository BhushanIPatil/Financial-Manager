"""
Asset schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.asset import AssetType


class AssetBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    type: AssetType
    value: float = Field(..., gt=0)
    date: datetime


class AssetCreate(AssetBase):
    pass


class AssetUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    type: Optional[AssetType] = None
    value: Optional[float] = Field(None, gt=0)
    date: Optional[datetime] = None


class AssetResponse(AssetBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
