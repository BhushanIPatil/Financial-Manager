"""
CRUD operations for Inter-Family Loans
"""
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from datetime import datetime

from app.models.inter_family_loan import InterFamilyLoan, LoanStatus
from app.models.family_member import FamilyMember
from app.schemas.inter_family_loan import InterFamilyLoanCreate, InterFamilyLoanUpdate
from app.crud.base import CRUDBase


class CRUDInterFamilyLoan(CRUDBase[InterFamilyLoan, InterFamilyLoanCreate, InterFamilyLoanUpdate]):
    def get_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[InterFamilyLoan]:
        """Get all inter-family loans for a user"""
        return (
            db.query(InterFamilyLoan)
            .filter(InterFamilyLoan.user_id == user_id)
            .options(
                joinedload(InterFamilyLoan.lender),
                joinedload(InterFamilyLoan.borrower)
            )
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_by_member(
        self, db: Session, *, member_id: int, user_id: int
    ) -> List[InterFamilyLoan]:
        """Get all loans involving a specific family member"""
        return (
            db.query(InterFamilyLoan)
            .filter(
                InterFamilyLoan.user_id == user_id,
                (InterFamilyLoan.lender_id == member_id) | 
                (InterFamilyLoan.borrower_id == member_id)
            )
            .options(
                joinedload(InterFamilyLoan.lender),
                joinedload(InterFamilyLoan.borrower)
            )
            .all()
        )
    
    def get_active_loans(self, db: Session, *, user_id: int) -> List[InterFamilyLoan]:
        """Get all active loans for a user"""
        return (
            db.query(InterFamilyLoan)
            .filter(
                InterFamilyLoan.user_id == user_id,
                InterFamilyLoan.status == LoanStatus.ACTIVE
            )
            .options(
                joinedload(InterFamilyLoan.lender),
                joinedload(InterFamilyLoan.borrower)
            )
            .all()
        )
    
    def get_overdue_loans(self, db: Session, *, user_id: int) -> List[InterFamilyLoan]:
        """Get all overdue loans for a user"""
        current_date = datetime.utcnow()
        return (
            db.query(InterFamilyLoan)
            .filter(
                InterFamilyLoan.user_id == user_id,
                InterFamilyLoan.status == LoanStatus.ACTIVE,
                InterFamilyLoan.due_date < current_date
            )
            .options(
                joinedload(InterFamilyLoan.lender),
                joinedload(InterFamilyLoan.borrower)
            )
            .all()
        )
    
    def make_payment(
        self, db: Session, *, loan_id: int, user_id: int, payment_amount: float
    ) -> Optional[InterFamilyLoan]:
        """Record a payment on a loan"""
        loan = db.query(InterFamilyLoan).filter(
            InterFamilyLoan.id == loan_id,
            InterFamilyLoan.user_id == user_id
        ).first()
        
        if not loan:
            return None
        
        loan.amount_paid += payment_amount
        loan.last_payment_date = datetime.utcnow()
        
        # Update status based on payment
        if loan.amount_paid >= loan.amount:
            loan.status = LoanStatus.PAID
        elif loan.amount_paid > 0:
            loan.status = LoanStatus.PARTIALLY_PAID
        
        db.commit()
        db.refresh(loan)
        return loan
    
    def create_with_user(
        self, db: Session, *, obj_in: InterFamilyLoanCreate, user_id: int
    ) -> InterFamilyLoan:
        """Create an inter-family loan for a user"""
        db_obj = InterFamilyLoan(
            **obj_in.model_dump(),
            user_id=user_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


inter_family_loan = CRUDInterFamilyLoan(InterFamilyLoan)
