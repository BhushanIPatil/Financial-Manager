"""
API router aggregation
"""
from fastapi import APIRouter

from app.api.routes import (
    auth,
    family_members,
    inter_family_loans,
    income,
    expense,
    investment,
    credit_card,
    loan,
    asset,
    liability,
    settings,
)

api_router = APIRouter()

# Include all route modules
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(family_members.router, prefix="/family-members", tags=["Family Members"])
api_router.include_router(inter_family_loans.router, prefix="/inter-family-loans", tags=["Inter-Family Loans"])
api_router.include_router(income.router, prefix="/income", tags=["Income"])
api_router.include_router(expense.router, prefix="/expenses", tags=["Expenses"])
api_router.include_router(investment.router, prefix="/investments", tags=["Investments"])
api_router.include_router(credit_card.router, prefix="/credit-cards", tags=["Credit Cards"])
api_router.include_router(loan.router, prefix="/loans", tags=["Loans"])
api_router.include_router(asset.router, prefix="/assets", tags=["Assets"])
api_router.include_router(liability.router, prefix="/liabilities", tags=["Liabilities"])
api_router.include_router(settings.router, prefix="/settings", tags=["Settings"])
