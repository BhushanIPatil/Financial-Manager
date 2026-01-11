"""
Loan routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.crud import loan as crud_loan
from app.schemas.loan import LoanCreate, LoanUpdate, LoanResponse

router = APIRouter()


@router.get("/", response_model=List[LoanResponse])
def get_loans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get all loans for current user"""
    loans = crud_loan.get_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return loans


@router.get("/{loan_id}", response_model=LoanResponse)
def get_loan(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get specific loan"""
    loan = crud_loan.get(db, id=loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    if loan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return loan


@router.post("/", response_model=LoanResponse, status_code=201)
def create_loan(
    loan_in: LoanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Create new loan"""
    loan = crud_loan.create(db, obj_in=loan_in, user_id=current_user.id)
    return loan


@router.put("/{loan_id}", response_model=LoanResponse)
def update_loan(
    loan_id: int,
    loan_in: LoanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update loan"""
    loan = crud_loan.get(db, id=loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    if loan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    loan = crud_loan.update(db, db_obj=loan, obj_in=loan_in)
    return loan


@router.delete("/{loan_id}")
def delete_loan(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Delete loan"""
    loan = crud_loan.get(db, id=loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    if loan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    crud_loan.delete(db, id=loan_id)
    return {"message": "Loan deleted successfully"}
