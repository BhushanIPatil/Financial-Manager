"""
API dependencies
"""
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_active_user
from app.models.user import User


async def get_current_user_dep(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> User:
    """Get current user dependency"""
    return current_user
