"""
Liability routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.crud import liability as crud_liability
from app.schemas.liability import LiabilityCreate, LiabilityUpdate, LiabilityResponse

router = APIRouter()


@router.get("/", response_model=List[LiabilityResponse])
def get_liabilities(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get all liabilities for current user"""
    liabilities = crud_liability.get_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return liabilities


@router.get("/{liability_id}", response_model=LiabilityResponse)
def get_liability(
    liability_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get specific liability"""
    liability = crud_liability.get(db, id=liability_id)
    if not liability:
        raise HTTPException(status_code=404, detail="Liability not found")
    if liability.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return liability


@router.post("/", response_model=LiabilityResponse, status_code=201)
def create_liability(
    liability_in: LiabilityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Create new liability"""
    liability = crud_liability.create(db, obj_in=liability_in, user_id=current_user.id)
    return liability


@router.put("/{liability_id}", response_model=LiabilityResponse)
def update_liability(
    liability_id: int,
    liability_in: LiabilityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update liability"""
    liability = crud_liability.get(db, id=liability_id)
    if not liability:
        raise HTTPException(status_code=404, detail="Liability not found")
    if liability.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    liability = crud_liability.update(db, db_obj=liability, obj_in=liability_in)
    return liability


@router.delete("/{liability_id}")
def delete_liability(
    liability_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Delete liability"""
    liability = crud_liability.get(db, id=liability_id)
    if not liability:
        raise HTTPException(status_code=404, detail="Liability not found")
    if liability.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    crud_liability.delete(db, id=liability_id)
    return {"message": "Liability deleted successfully"}
