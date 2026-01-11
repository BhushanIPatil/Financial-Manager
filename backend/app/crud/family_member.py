"""
CRUD operations for Family Members
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.family_member import FamilyMember
from app.models.income import Income
from app.models.expense import Expense
from app.schemas.family_member import FamilyMemberCreate, FamilyMemberUpdate
from app.crud.base import CRUDBase


class CRUDFamilyMember(CRUDBase[FamilyMember, FamilyMemberCreate, FamilyMemberUpdate]):
    def get_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[FamilyMember]:
        """Get all family members for a user"""
        return (
            db.query(FamilyMember)
            .filter(FamilyMember.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_active_by_user(self, db: Session, *, user_id: int) -> List[FamilyMember]:
        """Get all active family members for a user"""
        return (
            db.query(FamilyMember)
            .filter(FamilyMember.user_id == user_id, FamilyMember.is_active == 1)
            .all()
        )
    
    def get_with_stats(self, db: Session, *, member_id: int, user_id: int) -> Optional[dict]:
        """Get family member with income/expense statistics"""
        member = db.query(FamilyMember).filter(
            FamilyMember.id == member_id, 
            FamilyMember.user_id == user_id
        ).first()
        
        if not member:
            return None
        
        # Calculate statistics
        total_income = db.query(func.sum(Income.amount)).filter(
            Income.family_member_id == member_id,
            Income.user_id == user_id
        ).scalar() or 0.0
        
        total_expense = db.query(func.sum(Expense.amount)).filter(
            Expense.family_member_id == member_id,
            Expense.user_id == user_id
        ).scalar() or 0.0
        
        return {
            **member.__dict__,
            "total_income": total_income,
            "total_expense": total_expense,
            "net_contribution": total_income - total_expense
        }
    
    def create_with_user(
        self, db: Session, *, obj_in: FamilyMemberCreate, user_id: int
    ) -> FamilyMember:
        """Create a family member for a user"""
        db_obj = FamilyMember(
            **obj_in.model_dump(),
            user_id=user_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


family_member = CRUDFamilyMember(FamilyMember)
