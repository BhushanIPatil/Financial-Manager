"""
User Settings schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from app.models.settings import Currency, Theme, CreditCardStrategy


class NotificationsSettings(BaseModel):
    expense_alerts: bool = True
    investment_updates: bool = True
    debt_reminders: bool = True


class UserSettingsBase(BaseModel):
    currency: Currency = Currency.INR
    locale: str = Field(default="en-IN", max_length=10)
    theme: Theme = Theme.LIGHT
    monthly_budget: Optional[float] = Field(None, gt=0)
    emergency_fund_goal: Optional[float] = Field(None, gt=0)
    default_expense_category: str = Field(default="other", max_length=50)
    credit_card_strategy: CreditCardStrategy = CreditCardStrategy.AVALANCHE
    expense_alerts: bool = True
    investment_updates: bool = True
    debt_reminders: bool = True


class UserSettingsCreate(UserSettingsBase):
    pass


class UserSettingsUpdate(BaseModel):
    currency: Optional[Currency] = None
    locale: Optional[str] = Field(None, max_length=10)
    theme: Optional[Theme] = None
    monthly_budget: Optional[float] = Field(None, gt=0)
    emergency_fund_goal: Optional[float] = Field(None, gt=0)
    default_expense_category: Optional[str] = Field(None, max_length=50)
    credit_card_strategy: Optional[CreditCardStrategy] = None
    expense_alerts: Optional[bool] = None
    investment_updates: Optional[bool] = None
    debt_reminders: Optional[bool] = None


class UserSettingsResponse(UserSettingsBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True
