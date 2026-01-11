"""
Credit Card routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User
from app.crud import credit_card as crud_credit_card
from app.schemas.credit_card import CreditCardCreate, CreditCardUpdate, CreditCardResponse

router = APIRouter()


@router.get("/", response_model=List[CreditCardResponse])
def get_credit_cards(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get all credit cards for current user"""
    cards = crud_credit_card.get_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return cards


@router.get("/{card_id}", response_model=CreditCardResponse)
def get_credit_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get specific credit card"""
    card = crud_credit_card.get(db, id=card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Credit card not found")
    if card.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return card


@router.post("/", response_model=CreditCardResponse, status_code=201)
def create_credit_card(
    card_in: CreditCardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Create new credit card"""
    card = crud_credit_card.create(db, obj_in=card_in, user_id=current_user.id)
    return card


@router.put("/{card_id}", response_model=CreditCardResponse)
def update_credit_card(
    card_id: int,
    card_in: CreditCardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update credit card"""
    card = crud_credit_card.get(db, id=card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Credit card not found")
    if card.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    card = crud_credit_card.update(db, db_obj=card, obj_in=card_in)
    return card


@router.delete("/{card_id}")
def delete_credit_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Delete credit card"""
    card = crud_credit_card.get(db, id=card_id)
    if not card:
        raise HTTPException(status_code=404, detail="Credit card not found")
    if card.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    crud_credit_card.delete(db, id=card_id)
    return {"message": "Credit card deleted successfully"}
