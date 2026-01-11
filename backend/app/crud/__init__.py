"""
CRUD operations
"""
from app.crud.crud_user import user
from app.crud.base import CRUDBase
from app.models.income import Income
from app.models.expense import Expense
from app.models.investment import Investment
from app.models.credit_card import CreditCard
from app.models.loan import Loan
from app.models.asset import Asset
from app.models.liability import Liability
from app.models.settings import UserSettings
from app.schemas.income import IncomeCreate, IncomeUpdate
from app.schemas.expense import ExpenseCreate, ExpenseUpdate
from app.schemas.investment import InvestmentCreate, InvestmentUpdate
from app.schemas.credit_card import CreditCardCreate, CreditCardUpdate
from app.schemas.loan import LoanCreate, LoanUpdate
from app.schemas.asset import AssetCreate, AssetUpdate
from app.schemas.liability import LiabilityCreate, LiabilityUpdate
from app.schemas.settings import UserSettingsCreate, UserSettingsUpdate

# Create CRUD instances
income = CRUDBase[Income, IncomeCreate, IncomeUpdate](Income)
expense = CRUDBase[Expense, ExpenseCreate, ExpenseUpdate](Expense)
investment = CRUDBase[Investment, InvestmentCreate, InvestmentUpdate](Investment)
credit_card = CRUDBase[CreditCard, CreditCardCreate, CreditCardUpdate](CreditCard)
loan = CRUDBase[Loan, LoanCreate, LoanUpdate](Loan)
asset = CRUDBase[Asset, AssetCreate, AssetUpdate](Asset)
liability = CRUDBase[Liability, LiabilityCreate, LiabilityUpdate](Liability)
settings = CRUDBase[UserSettings, UserSettingsCreate, UserSettingsUpdate](UserSettings)

__all__ = [
    "user",
    "income",
    "expense",
    "investment",
    "credit_card",
    "loan",
    "asset",
    "liability",
    "settings",
]
