"""
Asset routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.crud import asset as crud_asset
from app.schemas.asset import AssetCreate, AssetUpdate, AssetResponse

router = APIRouter()


@router.get("/", response_model=List[AssetResponse])
def get_assets(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get all assets for current user"""
    assets = crud_asset.get_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return assets


@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get specific asset"""
    asset = crud_asset.get(db, id=asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    if asset.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return asset


@router.post("/", response_model=AssetResponse, status_code=201)
def create_asset(
    asset_in: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Create new asset"""
    asset = crud_asset.create(db, obj_in=asset_in, user_id=current_user.id)
    return asset


@router.put("/{asset_id}", response_model=AssetResponse)
def update_asset(
    asset_id: int,
    asset_in: AssetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update asset"""
    asset = crud_asset.get(db, id=asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    if asset.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    asset = crud_asset.update(db, db_obj=asset, obj_in=asset_in)
    return asset


@router.delete("/{asset_id}")
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Delete asset"""
    asset = crud_asset.get(db, id=asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    if asset.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    crud_asset.delete(db, id=asset_id)
    return {"message": "Asset deleted successfully"}
