import { startOfMonth, endOfMonth, parseISO, isWithinInterval, differenceInMonths } from 'date-fns';
import type {
  Income,
  Expense,
  Investment,
  CreditCard,
  Loan,
  MonthlyMetrics,
  CategoryExpense,
  InvestmentSummary,
  FinancialOverview,
  ExpenseCategory,
} from '@/types';
import { calculatePercentage, sumBy, groupBy } from '@/lib/utils';

/**
 * Financial calculations service
 * Pure functions for all financial computations
 */

// ============================================
// INCOME CALCULATIONS
// ============================================

export function calculateTotalIncome(incomes: Income[], month?: string): number {
  const filtered = month ? filterByMonth(incomes, month) : incomes;
  return sumBy(filtered, 'amount');
}

export function calculateIncomeByCategory(incomes: Income[], month?: string) {
  const filtered = month ? filterByMonth(incomes, month) : incomes;
  const grouped = groupBy(filtered, 'category');
  
  return Object.entries(grouped).map(([category, items]) => ({
    category,
    amount: sumBy(items, 'amount'),
    count: items.length,
  }));
}

// ============================================
// EXPENSE CALCULATIONS
// ============================================

export function calculateTotalExpenses(expenses: Expense[], month?: string): number {
  const filtered = month ? filterByMonth(expenses, month) : expenses;
  return sumBy(filtered, 'amount');
}

export function calculateExpensesByCategory(
  expenses: Expense[],
  month?: string
): CategoryExpense[] {
  const filtered = month ? filterByMonth(expenses, month) : expenses;
  const total = sumBy(filtered, 'amount');
  const grouped = groupBy(filtered, 'category');
  
  return Object.entries(grouped).map(([category, items]) => {
    const amount = sumBy(items, 'amount');
    return {
      category: category as ExpenseCategory,
      amount,
      percentage: calculatePercentage(amount, total),
      count: items.length,
    };
  }).sort((a, b) => b.amount - a.amount);
}

export function calculateFixedExpenses(expenses: Expense[], month?: string): number {
  const filtered = month ? filterByMonth(expenses, month) : expenses;
  return filtered.filter(e => e.isFixed).reduce((sum, e) => sum + e.amount, 0);
}

export function calculateVariableExpenses(expenses: Expense[], month?: string): number {
  const filtered = month ? filterByMonth(expenses, month) : expenses;
  return filtered.filter(e => !e.isFixed).reduce((sum, e) => sum + e.amount, 0);
}

// ============================================
// SAVINGS CALCULATIONS
// ============================================

export function calculateSavings(income: number, expenses: number): number {
  return income - expenses;
}

export function calculateSavingsRate(income: number, expenses: number): number {
  if (income === 0) return 0;
  return calculatePercentage(income - expenses, income);
}

// ============================================
// INVESTMENT CALCULATIONS
// ============================================

export function calculateInvestmentSummary(investments: Investment[]): InvestmentSummary {
  const totalInvested = sumBy(investments, 'investedAmount');
  const currentValue = sumBy(investments, 'currentValue');
  const totalReturns = currentValue - totalInvested;
  const returnsPercentage = calculatePercentage(totalReturns, totalInvested);
  
  const byType = investments.reduce((acc, inv) => {
    if (!acc[inv.type]) {
      acc[inv.type] = { invested: 0, current: 0 };
    }
    acc[inv.type].invested += inv.investedAmount;
    acc[inv.type].current += inv.currentValue;
    return acc;
  }, {} as InvestmentSummary['byType']);
  
  return {
    totalInvested,
    currentValue,
    totalReturns,
    returnsPercentage,
    byType,
  };
}

export function calculateInvestmentReturns(invested: number, current: number): number {
  return current - invested;
}

export function calculateInvestmentReturnsPercentage(invested: number, current: number): number {
  if (invested === 0) return 0;
  return calculatePercentage(current - invested, invested);
}

// ============================================
// DEBT CALCULATIONS
// ============================================

export function calculateTotalCreditCardDebt(cards: CreditCard[]): number {
  return cards.filter(c => c.isActive).reduce((sum, c) => sum + c.outstandingBalance, 0);
}

export function calculateTotalLoanDebt(loans: Loan[]): number {
  return sumBy(loans, 'outstandingBalance');
}

export function calculateCreditUtilization(card: CreditCard): number {
  if (card.creditLimit === 0) return 0;
  return calculatePercentage(card.outstandingBalance, card.creditLimit);
}

export function calculateMonthlyInterestLoss(balance: number, annualRate: number): number {
  return (balance * annualRate) / 100 / 12;
}

export function calculateAnnualInterestLoss(balance: number, annualRate: number): number {
  return (balance * annualRate) / 100;
}

/**
 * Snowball method: Pay off smallest balance first
 */
export function calculateSnowballStrategy(cards: CreditCard[]): CreditCard[] {
  return [...cards]
    .filter(c => c.isActive && c.outstandingBalance > 0)
    .sort((a, b) => a.outstandingBalance - b.outstandingBalance);
}

/**
 * Avalanche method: Pay off highest interest rate first
 */
export function calculateAvalancheStrategy(cards: CreditCard[]): CreditCard[] {
  return [...cards]
    .filter(c => c.isActive && c.outstandingBalance > 0)
    .sort((a, b) => b.interestRate - a.interestRate);
}

// ============================================
// NET WORTH CALCULATIONS
// ============================================

export function calculateNetWorth(totalAssets: number, totalLiabilities: number): number {
  return totalAssets - totalLiabilities;
}

export function calculateEmergencyFundMonths(
  liquidAssets: number,
  monthlyExpenses: number
): number {
  if (monthlyExpenses === 0) return 0;
  return liquidAssets / monthlyExpenses;
}

// ============================================
// MONTHLY METRICS
// ============================================

export function calculateMonthlyMetrics(
  incomes: Income[],
  expenses: Expense[],
  months: string[]
): MonthlyMetrics[] {
  return months.map(month => {
    const monthIncome = calculateTotalIncome(incomes, month);
    const monthExpenses = calculateTotalExpenses(expenses, month);
    const savings = calculateSavings(monthIncome, monthExpenses);
    const savingsRate = calculateSavingsRate(monthIncome, monthExpenses);
    
    return {
      month,
      income: monthIncome,
      expenses: monthExpenses,
      savings,
      savingsRate,
      netWorth: 0, // This should be calculated from net worth snapshots
    };
  });
}

// ============================================
// FINANCIAL OVERVIEW
// ============================================

export function calculateFinancialOverview(
  incomes: Income[],
  expenses: Expense[],
  investments: Investment[],
  creditCards: CreditCard[],
  loans: Loan[],
  liquidAssets: number,
  month?: string
): FinancialOverview {
  const totalIncome = calculateTotalIncome(incomes, month);
  const totalExpenses = calculateTotalExpenses(expenses, month);
  const netSavings = calculateSavings(totalIncome, totalExpenses);
  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses);
  
  const investmentSummary = calculateInvestmentSummary(investments);
  const creditCardDebt = calculateTotalCreditCardDebt(creditCards);
  const loanDebt = calculateTotalLoanDebt(loans);
  
  const totalAssets = liquidAssets + investmentSummary.currentValue;
  const totalLiabilities = creditCardDebt + loanDebt;
  const netWorth = calculateNetWorth(totalAssets, totalLiabilities);
  
  const monthlyExpenses = calculateTotalExpenses(expenses, month);
  const emergencyFundMonths = calculateEmergencyFundMonths(liquidAssets, monthlyExpenses);
  
  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    totalAssets,
    totalLiabilities,
    netWorth,
    investmentValue: investmentSummary.currentValue,
    investmentReturns: investmentSummary.totalReturns,
    creditCardDebt,
    loanDebt,
    emergencyFundMonths,
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function filterByMonth<T extends { date: string }>(items: T[], month: string): T[] {
  const start = startOfMonth(parseISO(`${month}-01`));
  const end = endOfMonth(start);
  
  return items.filter(item => {
    const itemDate = parseISO(item.date);
    return isWithinInterval(itemDate, { start, end });
  });
}

export function getMonthsDifference(startDate: string, endDate: string): number {
  return differenceInMonths(parseISO(endDate), parseISO(startDate));
}
