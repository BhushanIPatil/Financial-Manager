import type { ExpenseCategory, InvestmentType } from '@/types';

// ============================================
// EXPENSE CATEGORIES
// ============================================

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; icon: string }[] = [
  { value: 'housing', label: 'Housing', icon: '🏠' },
  { value: 'food', label: 'Food & Dining', icon: '🍽️' },
  { value: 'transportation', label: 'Transportation', icon: '🚗' },
  { value: 'utilities', label: 'Utilities', icon: '💡' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'insurance', label: 'Insurance', icon: '🛡️' },
  { value: 'debt', label: 'Debt Payment', icon: '💳' },
  { value: 'savings', label: 'Savings', icon: '💰' },
  { value: 'investment', label: 'Investment', icon: '📈' },
  { value: 'other', label: 'Other', icon: '📦' },
];

// ============================================
// INVESTMENT TYPES
// ============================================

export const INVESTMENT_TYPES: { value: InvestmentType; label: string; icon: string }[] = [
  { value: 'mutual_fund', label: 'Mutual Funds', icon: '📊' },
  { value: 'stock', label: 'Stocks', icon: '📈' },
  { value: 'fd', label: 'Fixed Deposits', icon: '🏦' },
  { value: 'bond', label: 'Bonds', icon: '📜' },
  { value: 'gold', label: 'Gold', icon: '🪙' },
  { value: 'crypto', label: 'Cryptocurrency', icon: '₿' },
];

// ============================================
// CURRENCY SYMBOLS
// ============================================

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
} as const;

// ============================================
// CHART COLORS
// ============================================

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  muted: '#6b7280',
  income: '#10b981',
  expense: '#ef4444',
  savings: '#3b82f6',
  investment: '#8b5cf6',
} as const;

// ============================================
// CATEGORY COLORS
// ============================================

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  housing: '#ef4444',
  food: '#f97316',
  transportation: '#eab308',
  utilities: '#84cc16',
  healthcare: '#22c55e',
  entertainment: '#14b8a6',
  shopping: '#06b6d4',
  education: '#3b82f6',
  insurance: '#6366f1',
  debt: '#8b5cf6',
  savings: '#a855f7',
  investment: '#d946ef',
  other: '#6b7280',
};

// ============================================
// DATE FORMATS
// ============================================

export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  input: 'yyyy-MM-dd',
  month: 'MMM yyyy',
  year: 'yyyy',
  full: 'MMMM dd, yyyy',
} as const;

// ============================================
// RECURRENCE OPTIONS
// ============================================

export const RECURRENCE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
] as const;

// ============================================
// FINANCIAL THRESHOLDS
// ============================================

export const FINANCIAL_THRESHOLDS = {
  savingsRateWarning: 10, // Below 10% savings rate
  savingsRateGood: 20, // Above 20% savings rate
  savingsRateExcellent: 30, // Above 30% savings rate
  creditUtilizationWarning: 70, // Above 70% credit utilization
  creditUtilizationDanger: 90, // Above 90% credit utilization
  emergencyFundMinMonths: 3, // Minimum 3 months
  emergencyFundIdealMonths: 6, // Ideal 6 months
  highInterestRate: 15, // Above 15% APR considered high
  investmentRebalanceThreshold: 10, // 10% deviation from target allocation
} as const;

// ============================================
// ROUTING
// ============================================

export const ROUTES = {
  dashboard: '/',
  familyMembers: '/family-members',
  interFamilyLoans: '/inter-family-loans',
  income: '/income',
  expenses: '/expenses',
  investments: '/investments',
  creditCards: '/credit-cards',
  netWorth: '/net-worth',
  settings: '/settings',
} as const;
