"""
Inter-Family Loans API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.api import deps
from app.crud.inter_family_loan import inter_family_loan
from app.schemas.inter_family_loan import (
    InterFamilyLoan,
    InterFamilyLoanCreate,
    InterFamilyLoanUpdate,
    InterFamilyLoanWithDetails
)
from app.models.user import User

router = APIRouter()


class PaymentRequest(BaseModel):
    amount: float


@router.get("/", response_model=List[InterFamilyLoan])
def get_inter_family_loans(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> List[InterFamilyLoan]:
    """
    Get all inter-family loans for the current user
    """
    loans = inter_family_loan.get_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return loans


@router.get("/active", response_model=List[InterFamilyLoan])
def get_active_loans(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> List[InterFamilyLoan]:
    """
    Get all active loans for the current user
    """
    loans = inter_family_loan.get_active_loans(db, user_id=current_user.id)
    return loans


@router.get("/overdue", response_model=List[InterFamilyLoan])
def get_overdue_loans(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> List[InterFamilyLoan]:
    """
    Get all overdue loans for the current user
    """
    loans = inter_family_loan.get_overdue_loans(db, user_id=current_user.id)
    return loans


@router.get("/member/{member_id}", response_model=List[InterFamilyLoan])
def get_loans_by_member(
    member_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> List[InterFamilyLoan]:
    """
    Get all loans for a specific family member
    """
    loans = inter_family_loan.get_by_member(
        db, member_id=member_id, user_id=current_user.id
    )
    return loans


@router.get("/{loan_id}", response_model=InterFamilyLoan)
def get_inter_family_loan(
    loan_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> InterFamilyLoan:
    """
    Get a specific inter-family loan
    """
    loan = inter_family_loan.get(db, id=loan_id)
    if not loan or loan.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found"
        )
    return loan


@router.post("/", response_model=InterFamilyLoan, status_code=status.HTTP_201_CREATED)
def create_inter_family_loan(
    loan_in: InterFamilyLoanCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> InterFamilyLoan:
    """
    Create a new inter-family loan
    """
    # Validate that lender and borrower are different
    if loan_in.lender_id == loan_in.borrower_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lender and borrower must be different"
        )
    
    loan = inter_family_loan.create_with_user(db, obj_in=loan_in, user_id=current_user.id)
    return loan


@router.put("/{loan_id}", response_model=InterFamilyLoan)
def update_inter_family_loan(
    loan_id: int,
    loan_in: InterFamilyLoanUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> InterFamilyLoan:
    """
    Update an inter-family loan
    """
    loan = inter_family_loan.get(db, id=loan_id)
    if not loan or loan.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found"
        )
    loan = inter_family_loan.update(db, db_obj=loan, obj_in=loan_in)
    return loan


@router.post("/{loan_id}/payment", response_model=InterFamilyLoan)
def make_loan_payment(
    loan_id: int,
    payment: PaymentRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> InterFamilyLoan:
    """
    Record a payment on a loan
    """
    if payment.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment amount must be greater than 0"
        )
    
    loan = inter_family_loan.make_payment(
        db, loan_id=loan_id, user_id=current_user.id, payment_amount=payment.amount
    )
    
    if not loan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found"
        )
    
    return loan


@router.delete("/{loan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inter_family_loan(
    loan_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Delete an inter-family loan
    """
    loan = inter_family_loan.get(db, id=loan_id)
    if not loan or loan.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan not found"
        )
    inter_family_loan.remove(db, id=loan_id)
    return None
