"""
Family Members API routes
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.crud.family_member import family_member
from app.schemas.family_member import (
    FamilyMember,
    FamilyMemberCreate,
    FamilyMemberUpdate,
    FamilyMemberWithStats
)
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[FamilyMember])
def get_family_members(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> List[FamilyMember]:
    """
    Get all family members for the current user
    """
    members = family_member.get_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return members


@router.get("/active", response_model=List[FamilyMember])
def get_active_family_members(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> List[FamilyMember]:
    """
    Get all active family members for the current user
    """
    members = family_member.get_active_by_user(db, user_id=current_user.id)
    return members


@router.get("/{member_id}", response_model=FamilyMember)
def get_family_member(
    member_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> FamilyMember:
    """
    Get a specific family member
    """
    member = family_member.get(db, id=member_id)
    if not member or member.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Family member not found"
        )
    return member


@router.get("/{member_id}/stats", response_model=FamilyMemberWithStats)
def get_family_member_stats(
    member_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Get family member with income/expense statistics
    """
    member_with_stats = family_member.get_with_stats(
        db, member_id=member_id, user_id=current_user.id
    )
    if not member_with_stats:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Family member not found"
        )
    return member_with_stats


@router.post("/", response_model=FamilyMember, status_code=status.HTTP_201_CREATED)
def create_family_member(
    member_in: FamilyMemberCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> FamilyMember:
    """
    Create a new family member
    """
    member = family_member.create_with_user(db, obj_in=member_in, user_id=current_user.id)
    return member


@router.put("/{member_id}", response_model=FamilyMember)
def update_family_member(
    member_id: int,
    member_in: FamilyMemberUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> FamilyMember:
    """
    Update a family member
    """
    member = family_member.get(db, id=member_id)
    if not member or member.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Family member not found"
        )
    member = family_member.update(db, db_obj=member, obj_in=member_in)
    return member


@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_family_member(
    member_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Delete a family member
    """
    member = family_member.get(db, id=member_id)
    if not member or member.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Family member not found"
        )
    family_member.remove(db, id=member_id)
    return None
