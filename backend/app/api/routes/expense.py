"""
Expense routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.models.expense import Expense
from app.crud import expense as crud_expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse

router = APIRouter()


@router.get("/", response_model=List[ExpenseResponse])
def get_expenses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get all expenses for current user"""
    expenses = crud_expense.get_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    
    # Convert tags from comma-separated string to list
    for expense in expenses:
        if expense.tags:
            expense.tags = [tag.strip() for tag in expense.tags.split(',')]
        else:
            expense.tags = []
    
    return expenses


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get specific expense"""
    expense = crud_expense.get(db, id=expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    if expense.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Convert tags
    if expense.tags:
        expense.tags = [tag.strip() for tag in expense.tags.split(',')]
    else:
        expense.tags = []
    
    return expense


@router.post("/", response_model=ExpenseResponse, status_code=201)
def create_expense(
    expense_in: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Create new expense"""
    # Convert tags list to comma-separated string
    expense_data = expense_in.dict()
    if expense_data.get('tags'):
        expense_data['tags'] = ','.join(expense_data['tags'])
    
    expense = Expense(**expense_data, user_id=current_user.id)
    db.add(expense)
    db.commit()
    db.refresh(expense)
    
    # Convert back to list for response
    if expense.tags:
        expense.tags = [tag.strip() for tag in expense.tags.split(',')]
    else:
        expense.tags = []
    
    return expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    expense_in: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update expense"""
    expense = crud_expense.get(db, id=expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    if expense.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Convert tags list to comma-separated string
    update_data = expense_in.dict(exclude_unset=True)
    if 'tags' in update_data and update_data['tags']:
        update_data['tags'] = ','.join(update_data['tags'])
    
    expense = crud_expense.update(db, db_obj=expense, obj_in=update_data)
    
    # Convert back to list for response
    if expense.tags:
        expense.tags = [tag.strip() for tag in expense.tags.split(',')]
    else:
        expense.tags = []
    
    return expense


@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Delete expense"""
    expense = crud_expense.get(db, id=expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    if expense.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    crud_expense.delete(db, id=expense_id)
    return {"message": "Expense deleted successfully"}
