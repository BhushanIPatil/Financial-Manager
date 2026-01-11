"""
Income routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.crud import income as crud_income
from app.schemas.income import IncomeCreate, IncomeUpdate, IncomeResponse

router = APIRouter()


@router.get("/", response_model=List[IncomeResponse])
def get_incomes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get all incomes for current user"""
    incomes = crud_income.get_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return incomes


@router.get("/{income_id}", response_model=IncomeResponse)
def get_income(
    income_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get specific income"""
    income = crud_income.get(db, id=income_id)
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")
    if income.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return income


@router.post("/", response_model=IncomeResponse, status_code=201)
def create_income(
    income_in: IncomeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Create new income"""
    income = crud_income.create(db, obj_in=income_in, user_id=current_user.id)
    return income


@router.put("/{income_id}", response_model=IncomeResponse)
def update_income(
    income_id: int,
    income_in: IncomeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update income"""
    income = crud_income.get(db, id=income_id)
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")
    if income.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    income = crud_income.update(db, db_obj=income, obj_in=income_in)
    return income


@router.delete("/{income_id}")
def delete_income(
    income_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Delete income"""
    income = crud_income.get(db, id=income_id)
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")
    if income.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    crud_income.delete(db, id=income_id)
    return {"message": "Income deleted successfully"}
