"""
Inter-Family Loan schemas
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class InterFamilyLoanBase(BaseModel):
    lender_id: int
    borrower_id: int
    amount: float
    amount_paid: Optional[float] = 0.0
    interest_rate: Optional[float] = 0.0
    loan_date: datetime
    due_date: Optional[datetime] = None
    status: Optional[str] = "active"
    description: Optional[str] = None
    notes: Optional[str] = None


class InterFamilyLoanCreate(InterFamilyLoanBase):
    pass


class InterFamilyLoanUpdate(BaseModel):
    lender_id: Optional[int] = None
    borrower_id: Optional[int] = None
    amount: Optional[float] = None
    amount_paid: Optional[float] = None
    interest_rate: Optional[float] = None
    loan_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    last_payment_date: Optional[datetime] = None
    status: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None


class InterFamilyLoanInDBBase(InterFamilyLoanBase):
    id: int
    user_id: int
    last_payment_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InterFamilyLoan(InterFamilyLoanInDBBase):
    pass


class InterFamilyLoanWithDetails(InterFamilyLoan):
    """Loan with lender and borrower details"""
    lender_name: Optional[str] = None
    borrower_name: Optional[str] = None
    remaining_amount: float = 0.0
    is_overdue: bool = False
