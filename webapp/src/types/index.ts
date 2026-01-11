// ============================================
// CORE DOMAIN TYPES
// ============================================

export type Currency = 'INR' | 'USD' | 'EUR';

export type TransactionType = 'income' | 'expense';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export type InvestmentType = 'mutual_fund' | 'stock' | 'fd' | 'bond' | 'gold' | 'crypto';

export type CreditCardStrategy = 'snowball' | 'avalanche';

export type MemberRelation = 
  | 'self' 
  | 'spouse' 
  | 'parent' 
  | 'child' 
  | 'sibling' 
  | 'grandparent' 
  | 'grandchild' 
  | 'other';

export type LoanStatus = 'active' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';

// ============================================
// FAMILY MEMBERS
// ============================================

export interface FamilyMember {
  id: string;
  name: string;
  relation: MemberRelation;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMemberWithStats extends FamilyMember {
  totalIncome: number;
  totalExpense: number;
  netContribution: number;
  loansGiven: number;
  loansTaken: number;
}

// ============================================
// INTER-FAMILY LOANS
// ============================================

export interface InterFamilyLoan {
  id: string;
  lenderId: string;
  lenderName?: string;
  borrowerId: string;
  borrowerName?: string;
  amount: number;
  amountPaid: number;
  interestRate: number;
  loanDate: string;
  dueDate?: string;
  lastPaymentDate?: string;
  status: LoanStatus;
  description?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterFamilyLoanWithDetails extends InterFamilyLoan {
  remainingAmount: number;
  isOverdue: boolean;
}

// ============================================
// INCOME
// ============================================

export interface Income {
  id: string;
  source: string;
  amount: number;
  category: 'salary' | 'freelance' | 'business' | 'investment' | 'other';
  familyMemberId?: string;
  familyMemberName?: string;
  isRecurring: boolean;
  recurrence?: RecurrenceType;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// EXPENSE
// ============================================

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  familyMemberId?: string;
  familyMemberName?: string;
  isFixed: boolean;
  isRecurring: boolean;
  recurrence?: RecurrenceType;
  date: string;
  description?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory =
  | 'housing'
  | 'food'
  | 'transportation'
  | 'utilities'
  | 'healthcare'
  | 'entertainment'
  | 'shopping'
  | 'education'
  | 'insurance'
  | 'debt'
  | 'savings'
  | 'investment'
  | 'other';

// ============================================
// INVESTMENT
// ============================================

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  investedAmount: number;
  currentValue: number;
  quantity?: number;
  purchaseDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentSummary {
  totalInvested: number;
  currentValue: number;
  totalReturns: number;
  returnsPercentage: number;
  byType: Record<InvestmentType, { invested: number; current: number }>;
}

// ============================================
// CREDIT CARD & DEBT
// ============================================

export interface CreditCard {
  id: string;
  name: string;
  bankName: string;
  outstandingBalance: number;
  creditLimit: number;
  interestRate: number; // Annual percentage
  dueDate: string;
  minimumPayment: number;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  name: string;
  lender: string;
  principalAmount: number;
  outstandingBalance: number;
  interestRate: number;
  emiAmount: number;
  startDate: string;
  endDate: string;
  type: 'home' | 'car' | 'personal' | 'education' | 'other';
  createdAt: string;
  updatedAt: string;
}

// ============================================
// NET WORTH
// ============================================

export interface Asset {
  id: string;
  name: string;
  type: 'real_estate' | 'vehicle' | 'investment' | 'cash' | 'other';
  value: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Liability {
  id: string;
  name: string;
  type: 'loan' | 'credit_card' | 'other';
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface NetWorthSnapshot {
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

// ============================================
// FINANCIAL INSIGHTS
// ============================================

export type RecommendationType = 
  | 'warning' 
  | 'suggestion' 
  | 'alert' 
  | 'success' 
  | 'info';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'expense' | 'income' | 'investment' | 'debt' | 'savings' | 'general';
  actionable: boolean;
  action?: string;
  createdAt: string;
}

// ============================================
// ANALYTICS & METRICS
// ============================================

export interface MonthlyMetrics {
  month: string;
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
  netWorth: number;
}

export interface CategoryExpense {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  count: number;
}

export interface FinancialOverview {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  investmentValue: number;
  investmentReturns: number;
  creditCardDebt: number;
  loanDebt: number;
  emergencyFundMonths: number;
  familyMembersCount?: number;
  interFamilyLoansTotal?: number;
}

// ============================================
// SETTINGS & USER PREFERENCES
// ============================================

export interface UserSettings {
  currency: Currency;
  locale: string;
  theme: 'light' | 'dark' | 'system';
  monthlyBudget?: number;
  emergencyFundGoal?: number;
  defaultExpenseCategory: ExpenseCategory;
  creditCardStrategy: CreditCardStrategy;
  notifications: {
    expenseAlerts: boolean;
    investmentUpdates: boolean;
    debtReminders: boolean;
  };
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
