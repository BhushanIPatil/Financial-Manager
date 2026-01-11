"""
Investment routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.crud import investment as crud_investment
from app.schemas.investment import InvestmentCreate, InvestmentUpdate, InvestmentResponse

router = APIRouter()


@router.get("/", response_model=List[InvestmentResponse])
def get_investments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get all investments for current user"""
    investments = crud_investment.get_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return investments


@router.get("/{investment_id}", response_model=InvestmentResponse)
def get_investment(
    investment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get specific investment"""
    investment = crud_investment.get(db, id=investment_id)
    if not investment:
        raise HTTPException(status_code=404, detail="Investment not found")
    if investment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return investment


@router.post("/", response_model=InvestmentResponse, status_code=201)
def create_investment(
    investment_in: InvestmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Create new investment"""
    investment = crud_investment.create(db, obj_in=investment_in, user_id=current_user.id)
    return investment


@router.put("/{investment_id}", response_model=InvestmentResponse)
def update_investment(
    investment_id: int,
    investment_in: InvestmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update investment"""
    investment = crud_investment.get(db, id=investment_id)
    if not investment:
        raise HTTPException(status_code=404, detail="Investment not found")
    if investment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    investment = crud_investment.update(db, db_obj=investment, obj_in=investment_in)
    return investment


@router.delete("/{investment_id}")
def delete_investment(
    investment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Delete investment"""
    investment = crud_investment.get(db, id=investment_id)
    if not investment:
        raise HTTPException(status_code=404, detail="Investment not found")
    if investment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    crud_investment.delete(db, id=investment_id)
    return {"message": "Investment deleted successfully"}
