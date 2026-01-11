import type {
  Income,
  Expense,
  Investment,
  CreditCard,
  Loan,
  Asset,
  Liability,
  UserSettings,
} from '@/types';
import { subMonths, format } from 'date-fns';

/**
 * Mock data service with realistic financial data
 * This simulates what will eventually come from FastAPI backend
 */

const now = new Date();
const currentMonth = format(now, 'yyyy-MM-dd');
const lastMonth = format(subMonths(now, 1), 'yyyy-MM-dd');
const twoMonthsAgo = format(subMonths(now, 2), 'yyyy-MM-dd');

// ============================================
// INCOME DATA
// ============================================

export const MOCK_INCOME: Income[] = [
  {
    id: '1',
    source: 'Monthly Salary',
    amount: 150000,
    category: 'salary',
    isRecurring: true,
    recurrence: 'monthly',
    date: currentMonth,
    description: 'Regular monthly salary',
    createdAt: currentMonth,
    updatedAt: currentMonth,
  },
  {
    id: '2',
    source: 'Freelance Project',
    amount: 45000,
    category: 'freelance',
    isRecurring: false,
    date: lastMonth,
    description: 'Web development project',
    createdAt: lastMonth,
    updatedAt: lastMonth,
  },
  {
    id: '3',
    source: 'Dividend Income',
    amount: 8500,
    category: 'investment',
    isRecurring: false,
    date: twoMonthsAgo,
    description: 'Stock dividends',
    createdAt: twoMonthsAgo,
    updatedAt: twoMonthsAgo,
  },
  {
    id: '4',
    source: 'Monthly Salary',
    amount: 150000,
    category: 'salary',
    isRecurring: true,
    recurrence: 'monthly',
    date: lastMonth,
    description: 'Regular monthly salary',
    createdAt: lastMonth,
    updatedAt: lastMonth,
  },
  {
    id: '5',
    source: 'Monthly Salary',
    amount: 150000,
    category: 'salary',
    isRecurring: true,
    recurrence: 'monthly',
    date: twoMonthsAgo,
    description: 'Regular monthly salary',
    createdAt: twoMonthsAgo,
    updatedAt: twoMonthsAgo,
  },
];

// ============================================
// EXPENSE DATA
// ============================================

export const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    title: 'Rent',
    amount: 35000,
    category: 'housing',
    isFixed: true,
    isRecurring: true,
    recurrence: 'monthly',
    date: currentMonth,
    description: 'Monthly apartment rent',
    createdAt: currentMonth,
    updatedAt: currentMonth,
  },
  {
    id: '2',
    title: 'Groceries',
    amount: 12000,
    category: 'food',
    isFixed: false,
    isRecurring: false,
    date: currentMonth,
    description: 'Monthly grocery shopping',
    createdAt: currentMonth,
    updatedAt: currentMonth,
  },
  {
    id: '3',
    title: 'Electricity Bill',
    amount: 2500,
    category: 'utilities',
    isFixed: false,
    isRecurring: true,
    recurrence: 'monthly',
    date: currentMonth,
    createdAt: currentMonth,
    updatedAt: currentMonth,
  },
  {
    id: '4',
    title: 'Internet & Mobile',
    amount: 1800,
    category: 'utilities',
    isFixed: true,
    isRecurring: true,
    recurrence: 'monthly',
    date: currentMonth,
    createdAt: currentMonth,
    updatedAt: currentMonth,
  },
  {
    id: '5',
    title: 'Fuel',
    amount: 4500,
    category: 'transportation',
    isFixed: false,
    isRecurring: false,
    date: currentMonth,
    createdAt: currentMonth,
    updatedAt: currentMonth,
  },
  {
    id: '6',
    title: 'Netflix & Spotify',
    amount: 1200,
    category: 'entertainment',
    isFixed: true,
    isRecurring: true,
    recurrence: 'monthly',
    date: currentMonth,
    tags: ['subscription'],
    createdAt: currentMonth,
    updatedAt: currentMonth,
  },
  {
    id: '7',
    title: 'Dining Out',
    amount: 8500,
    category: 'food',
    isFixed: false,
    isRecurring: false,
    date: currentMonth,
    createdAt: currentMonth,
    updatedAt: currentMonth,
  },
  {
    id: '8',
    title: 'Shopping - Clothes',
    amount: 15000,
    category: 'shopping',
    isFixed: false,
    isRecurring: false,
    date: currentMonth,
    createdAt: currentMonth,
    updatedAt: currentMonth,
  },
  {
    id: '9',
    title: 'Gym Membership',
    amount: 2000,
    category: 'healthcare',
    isFixed: true,
    isRecurring: true,
    recurrence: 'monthly',
    date: currentMonth,
    createdAt: currentMonth,
    updatedAt: currentMonth,
  },
  {
    id: '10',
    title: 'Health Insurance Premium',
    amount: 4500,
    category: 'insurance',
    isFixed: true,
    isRecurring: true,
    recurrence: 'monthly',
    date: currentMonth,
    createdAt: currentMonth,
    updatedAt: currentMonth,
  },
  {
    id: '11',
    title: 'Credit Card Payment',
    amount: 18000,
    category: 'debt',
    isFixed: false,
    isRecurring: true,
    recurrence: 'monthly',
    date: currentMonth,
    createdAt: currentMonth,
    updatedAt: currentMonth,
  },
  {
    id: '12',
    title: 'Movie Tickets',
    amount: 1500,
    category: 'entertainment',
    isFixed: false,
    isRecurring: false,
    date: lastMonth,
    createdAt: lastMonth,
    updatedAt: lastMonth,
  },
];

// ============================================
// INVESTMENT DATA
// ============================================

export const MOCK_INVESTMENTS: Investment[] = [
  {
    id: '1',
    name: 'Axis Bluechip Fund',
    type: 'mutual_fund',
    investedAmount: 250000,
    currentValue: 285000,
    purchaseDate: '2023-01-15',
    notes: 'SIP of ₹10,000/month',
    createdAt: '2023-01-15',
    updatedAt: currentMonth,
  },
  {
    id: '2',
    name: 'Reliance Industries',
    type: 'stock',
    investedAmount: 150000,
    currentValue: 165000,
    quantity: 60,
    purchaseDate: '2023-06-10',
    createdAt: '2023-06-10',
    updatedAt: currentMonth,
  },
  {
    id: '3',
    name: 'HDFC Bank Fixed Deposit',
    type: 'fd',
    investedAmount: 500000,
    currentValue: 535000,
    purchaseDate: '2022-12-01',
    notes: '7% p.a., 3-year tenure',
    createdAt: '2022-12-01',
    updatedAt: currentMonth,
  },
  {
    id: '4',
    name: 'Government Bonds',
    type: 'bond',
    investedAmount: 200000,
    currentValue: 215000,
    purchaseDate: '2023-03-20',
    createdAt: '2023-03-20',
    updatedAt: currentMonth,
  },
  {
    id: '5',
    name: 'Gold ETF',
    type: 'gold',
    investedAmount: 100000,
    currentValue: 108000,
    purchaseDate: '2023-07-15',
    createdAt: '2023-07-15',
    updatedAt: currentMonth,
  },
  {
    id: '6',
    name: 'Bitcoin',
    type: 'crypto',
    investedAmount: 50000,
    currentValue: 62000,
    quantity: 0.015,
    purchaseDate: '2023-09-01',
    createdAt: '2023-09-01',
    updatedAt: currentMonth,
  },
];

// ============================================
// CREDIT CARD DATA
// ============================================

export const MOCK_CREDIT_CARDS: CreditCard[] = [
  {
    id: '1',
    name: 'HDFC Regalia',
    bankName: 'HDFC Bank',
    outstandingBalance: 45000,
    creditLimit: 200000,
    interestRate: 42,
    dueDate: '2026-01-25',
    minimumPayment: 2250,
    isActive: true,
    notes: 'Primary card for rewards',
    createdAt: '2022-05-01',
    updatedAt: currentMonth,
  },
  {
    id: '2',
    name: 'SBI Elite',
    bankName: 'State Bank of India',
    outstandingBalance: 28000,
    creditLimit: 150000,
    interestRate: 38,
    dueDate: '2026-01-20',
    minimumPayment: 1400,
    isActive: true,
    createdAt: '2022-08-15',
    updatedAt: currentMonth,
  },
  {
    id: '3',
    name: 'ICICI Amazon Pay',
    bankName: 'ICICI Bank',
    outstandingBalance: 0,
    creditLimit: 100000,
    interestRate: 36,
    dueDate: '2026-01-15',
    minimumPayment: 0,
    isActive: true,
    notes: 'For online shopping',
    createdAt: '2023-02-10',
    updatedAt: currentMonth,
  },
];

// ============================================
// LOAN DATA
// ============================================

export const MOCK_LOANS: Loan[] = [
  {
    id: '1',
    name: 'Car Loan',
    lender: 'HDFC Bank',
    principalAmount: 600000,
    outstandingBalance: 380000,
    interestRate: 8.5,
    emiAmount: 15000,
    startDate: '2022-06-01',
    endDate: '2027-06-01',
    type: 'car',
    createdAt: '2022-06-01',
    updatedAt: currentMonth,
  },
  {
    id: '2',
    name: 'Personal Loan',
    lender: 'ICICI Bank',
    principalAmount: 200000,
    outstandingBalance: 125000,
    interestRate: 12.5,
    emiAmount: 8500,
    startDate: '2023-01-15',
    endDate: '2025-01-15',
    type: 'personal',
    createdAt: '2023-01-15',
    updatedAt: currentMonth,
  },
];

// ============================================
// ASSETS
// ============================================

export const MOCK_ASSETS: Asset[] = [
  {
    id: '1',
    name: 'Savings Account',
    type: 'cash',
    value: 250000,
    date: currentMonth,
    createdAt: currentMonth,
    updatedAt: currentMonth,
  },
  {
    id: '2',
    name: 'Honda City',
    type: 'vehicle',
    value: 800000,
    date: currentMonth,
    createdAt: '2022-06-01',
    updatedAt: currentMonth,
  },
];

// ============================================
// LIABILITIES
// ============================================

export const MOCK_LIABILITIES: Liability[] = [
  {
    id: '1',
    name: 'Credit Cards Total',
    type: 'credit_card',
    amount: 73000,
    date: currentMonth,
    createdAt: currentMonth,
    updatedAt: currentMonth,
  },
  {
    id: '2',
    name: 'Car Loan',
    type: 'loan',
    amount: 380000,
    date: currentMonth,
    createdAt: currentMonth,
    updatedAt: currentMonth,
  },
  {
    id: '3',
    name: 'Personal Loan',
    type: 'loan',
    amount: 125000,
    date: currentMonth,
    createdAt: currentMonth,
    updatedAt: currentMonth,
  },
];

// ============================================
// USER SETTINGS
// ============================================

export const MOCK_SETTINGS: UserSettings = {
  currency: 'INR',
  locale: 'en-IN',
  theme: 'light',
  monthlyBudget: 120000,
  emergencyFundGoal: 600000,
  defaultExpenseCategory: 'other',
  creditCardStrategy: 'avalanche',
  notifications: {
    expenseAlerts: true,
    investmentUpdates: true,
    debtReminders: true,
  },
};
