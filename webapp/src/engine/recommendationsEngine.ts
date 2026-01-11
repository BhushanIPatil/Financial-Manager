import type {
  Recommendation,
  Income,
  Expense,
  Investment,
  CreditCard,
  Loan,
  FinancialOverview,
} from '@/types';
import { FINANCIAL_THRESHOLDS } from '@/constants';
import { generateId } from '@/lib/utils';
import {
  calculateCreditUtilization,
  calculateMonthlyInterestLoss,
  calculateExpensesByCategory,
} from '@/services/calculations';

/**
 * AI-Like Financial Recommendations Engine
 * Rule-based system that analyzes financial data and provides actionable insights
 */

export class RecommendationsEngine {
  private recommendations: Recommendation[] = [];

  /**
   * Main analysis function that generates all recommendations
   */
  analyze(
    overview: FinancialOverview,
    incomes: Income[],
    expenses: Expense[],
    investments: Investment[],
    creditCards: CreditCard[],
    loans: Loan[]
  ): Recommendation[] {
    this.recommendations = [];

    // Run all analysis rules
    this.analyzeIncomeVsExpenses(overview);
    this.analyzeSavingsRate(overview);
    this.analyzeEmergencyFund(overview);
    this.analyzeCreditCards(creditCards);
    this.analyzeLoans(loans);
    this.analyzeInvestments(overview, investments);
    this.analyzeExpenseLeakage(expenses);
    this.analyzeNetWorth(overview);
    this.analyzeDebtToIncome(overview, incomes);

    // Sort by priority
    return this.recommendations.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  // ============================================
  // RULE 1: INCOME VS EXPENSES
  // ============================================

  private analyzeIncomeVsExpenses(overview: FinancialOverview): void {
    if (overview.totalExpenses > overview.totalIncome) {
      this.addRecommendation({
        type: 'alert',
        title: 'Expenses Exceed Income',
        message: `You're spending ₹${Math.abs(overview.netSavings).toFixed(0)} more than you earn this month. Immediate action required to avoid debt.`,
        priority: 'critical',
        category: 'expense',
        actionable: true,
        action: 'Review and reduce non-essential expenses',
      });
    } else if (overview.netSavings < overview.totalIncome * 0.05) {
      this.addRecommendation({
        type: 'warning',
        title: 'Very Low Savings',
        message: `You're saving less than 5% of your income. Try to reduce expenses or increase income.`,
        priority: 'high',
        category: 'savings',
        actionable: true,
        action: 'Aim to save at least 10-20% of your income',
      });
    }
  }

  // ============================================
  // RULE 2: SAVINGS RATE ANALYSIS
  // ============================================

  private analyzeSavingsRate(overview: FinancialOverview): void {
    const { savingsRate } = overview;

    if (savingsRate < FINANCIAL_THRESHOLDS.savingsRateWarning) {
      this.addRecommendation({
        type: 'warning',
        title: 'Low Savings Rate',
        message: `Your savings rate is ${savingsRate.toFixed(1)}%. Financial experts recommend saving at least 20% of income.`,
        priority: 'high',
        category: 'savings',
        actionable: true,
        action: 'Identify and cut unnecessary expenses',
      });
    } else if (savingsRate >= FINANCIAL_THRESHOLDS.savingsRateExcellent) {
      this.addRecommendation({
        type: 'success',
        title: 'Excellent Savings Rate!',
        message: `You're saving ${savingsRate.toFixed(1)}% of your income. Great job! Consider increasing investments.`,
        priority: 'low',
        category: 'savings',
        actionable: false,
      });
    } else if (savingsRate >= FINANCIAL_THRESHOLDS.savingsRateGood) {
      this.addRecommendation({
        type: 'success',
        title: 'Good Savings Rate',
        message: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep up the good work!`,
        priority: 'low',
        category: 'savings',
        actionable: false,
      });
    }
  }

  // ============================================
  // RULE 3: EMERGENCY FUND
  // ============================================

  private analyzeEmergencyFund(overview: FinancialOverview): void {
    const { emergencyFundMonths } = overview;

    if (emergencyFundMonths < FINANCIAL_THRESHOLDS.emergencyFundMinMonths) {
      this.addRecommendation({
        type: 'warning',
        title: 'Build Emergency Fund',
        message: `You have only ${emergencyFundMonths.toFixed(1)} months of expenses saved. Aim for at least 3-6 months.`,
        priority: 'high',
        category: 'savings',
        actionable: true,
        action: 'Prioritize building emergency fund before investing',
      });
    } else if (emergencyFundMonths >= FINANCIAL_THRESHOLDS.emergencyFundIdealMonths) {
      this.addRecommendation({
        type: 'success',
        title: 'Strong Emergency Fund',
        message: `You have ${emergencyFundMonths.toFixed(1)} months of expenses saved. Your emergency fund is well-established!`,
        priority: 'low',
        category: 'savings',
        actionable: false,
      });
    }
  }

  // ============================================
  // RULE 4: CREDIT CARD ANALYSIS
  // ============================================

  private analyzeCreditCards(creditCards: CreditCard[]): void {
    const activeCards = creditCards.filter(c => c.isActive);

    // High utilization warning
    activeCards.forEach(card => {
      const utilization = calculateCreditUtilization(card);
      
      if (utilization >= FINANCIAL_THRESHOLDS.creditUtilizationDanger) {
        this.addRecommendation({
          type: 'alert',
          title: `Critical: ${card.name} Utilization`,
          message: `${card.name} is ${utilization.toFixed(0)}% utilized. This negatively impacts your credit score.`,
          priority: 'critical',
          category: 'debt',
          actionable: true,
          action: 'Pay down balance immediately',
        });
      } else if (utilization >= FINANCIAL_THRESHOLDS.creditUtilizationWarning) {
        this.addRecommendation({
          type: 'warning',
          title: `High ${card.name} Utilization`,
          message: `${card.name} is ${utilization.toFixed(0)}% utilized. Try to keep it below 30%.`,
          priority: 'medium',
          category: 'debt',
          actionable: true,
          action: 'Reduce balance to improve credit health',
        });
      }
    });

    // High interest rate warning
    activeCards.forEach(card => {
      if (card.interestRate >= FINANCIAL_THRESHOLDS.highInterestRate && card.outstandingBalance > 0) {
        const monthlyLoss = calculateMonthlyInterestLoss(card.outstandingBalance, card.interestRate);
        
        this.addRecommendation({
          type: 'alert',
          title: `High Interest on ${card.name}`,
          message: `You're losing ₹${monthlyLoss.toFixed(0)}/month on ${card.name} at ${card.interestRate}% APR.`,
          priority: 'high',
          category: 'debt',
          actionable: true,
          action: 'Prioritize paying off this card first',
        });
      }
    });

    // Card closure suggestion for paid off cards
    const paidOffCards = activeCards.filter(c => c.outstandingBalance === 0);
    if (paidOffCards.length > 3) {
      this.addRecommendation({
        type: 'suggestion',
        title: 'Consider Closing Unused Cards',
        message: `You have ${paidOffCards.length} paid-off cards. Consider keeping only 2-3 cards to simplify finances.`,
        priority: 'low',
        category: 'debt',
        actionable: true,
        action: 'Close cards with high fees or low benefits',
      });
    }

    // Total debt warning
    const totalDebt = activeCards.reduce((sum, c) => sum + c.outstandingBalance, 0);
    if (totalDebt > 0) {
      const totalInterest = activeCards.reduce(
        (sum, c) => sum + calculateMonthlyInterestLoss(c.outstandingBalance, c.interestRate),
        0
      );
      
      if (totalInterest > 5000) {
        this.addRecommendation({
          type: 'warning',
          title: 'High Credit Card Interest',
          message: `You're losing ₹${totalInterest.toFixed(0)}/month (₹${(totalInterest * 12).toFixed(0)}/year) in credit card interest.`,
          priority: 'high',
          category: 'debt',
          actionable: true,
          action: 'Create a debt payoff plan using avalanche or snowball method',
        });
      }
    }
  }

  // ============================================
  // RULE 5: LOAN ANALYSIS
  // ============================================

  private analyzeLoans(loans: Loan[]): void {
    loans.forEach(loan => {
      const monthlyInterest = calculateMonthlyInterestLoss(loan.outstandingBalance, loan.interestRate);
      
      if (loan.interestRate >= FINANCIAL_THRESHOLDS.highInterestRate) {
        this.addRecommendation({
          type: 'warning',
          title: `High Interest Loan: ${loan.name}`,
          message: `${loan.name} has ${loan.interestRate}% interest. Consider refinancing or prepayment.`,
          priority: 'medium',
          category: 'debt',
          actionable: true,
          action: 'Explore lower interest rate options',
        });
      }
    });
  }

  // ============================================
  // RULE 6: INVESTMENT ANALYSIS
  // ============================================

  private analyzeInvestments(overview: FinancialOverview, investments: Investment[]): void {
    const { investmentValue, investmentReturns } = overview;

    if (investments.length === 0 && overview.emergencyFundMonths >= 3) {
      this.addRecommendation({
        type: 'suggestion',
        title: 'Start Investing',
        message: `You have a good emergency fund but no investments. Start investing to grow wealth.`,
        priority: 'medium',
        category: 'investment',
        actionable: true,
        action: 'Consider mutual funds or index funds for long-term growth',
      });
    }

    if (investmentReturns < 0 && investmentValue > 0) {
      const lossPercentage = (investmentReturns / (investmentValue - investmentReturns)) * 100;
      this.addRecommendation({
        type: 'info',
        title: 'Investment Losses',
        message: `Your investments are down ${Math.abs(lossPercentage).toFixed(1)}%. Don't panic - markets fluctuate.`,
        priority: 'low',
        category: 'investment',
        actionable: false,
      });
    }

    // Diversification check
    if (investments.length > 0) {
      const types = new Set(investments.map(i => i.type));
      if (types.size === 1) {
        this.addRecommendation({
          type: 'suggestion',
          title: 'Diversify Investments',
          message: `All your investments are in one asset class. Consider diversifying to reduce risk.`,
          priority: 'medium',
          category: 'investment',
          actionable: true,
          action: 'Spread investments across different asset classes',
        });
      }
    }
  }

  // ============================================
  // RULE 7: EXPENSE LEAKAGE DETECTION
  // ============================================

  private analyzeExpenseLeakage(expenses: Expense[]): void {
    const categories = calculateExpensesByCategory(expenses);
    
    // Entertainment and shopping alerts
    const entertainment = categories.find(c => c.category === 'entertainment');
    const shopping = categories.find(c => c.category === 'shopping');
    
    if (entertainment && entertainment.percentage > 15) {
      this.addRecommendation({
        type: 'suggestion',
        title: 'High Entertainment Spending',
        message: `Entertainment is ${entertainment.percentage.toFixed(0)}% of expenses. Consider reducing by ${((entertainment.percentage - 10) / 100 * entertainment.amount).toFixed(0)}`,
        priority: 'medium',
        category: 'expense',
        actionable: true,
        action: 'Review entertainment subscriptions and discretionary spending',
      });
    }

    if (shopping && shopping.percentage > 10) {
      this.addRecommendation({
        type: 'suggestion',
        title: 'High Shopping Expenses',
        message: `Shopping is ${shopping.percentage.toFixed(0)}% of expenses. Potential area for savings.`,
        priority: 'medium',
        category: 'expense',
        actionable: true,
        action: 'Track impulse purchases and set monthly shopping budget',
      });
    }

    // Recurring expense optimization
    const recurringExpenses = expenses.filter(e => e.isRecurring);
    if (recurringExpenses.length > 10) {
      const recurringTotal = recurringExpenses.reduce((sum, e) => sum + e.amount, 0);
      this.addRecommendation({
        type: 'suggestion',
        title: 'Review Recurring Expenses',
        message: `You have ${recurringExpenses.length} recurring expenses totaling ₹${recurringTotal.toFixed(0)}/month.`,
        priority: 'low',
        category: 'expense',
        actionable: true,
        action: 'Cancel unused subscriptions and negotiate bills',
      });
    }
  }

  // ============================================
  // RULE 8: NET WORTH ANALYSIS
  // ============================================

  private analyzeNetWorth(overview: FinancialOverview): void {
    const { netWorth, totalAssets, totalLiabilities } = overview;

    if (netWorth < 0) {
      this.addRecommendation({
        type: 'alert',
        title: 'Negative Net Worth',
        message: `Your liabilities (₹${totalLiabilities.toFixed(0)}) exceed assets (₹${totalAssets.toFixed(0)}). Focus on debt reduction.`,
        priority: 'critical',
        category: 'general',
        actionable: true,
        action: 'Create aggressive debt payoff plan',
      });
    } else if (netWorth > 0 && totalLiabilities > totalAssets * 0.5) {
      this.addRecommendation({
        type: 'warning',
        title: 'High Debt-to-Asset Ratio',
        message: `Liabilities are ${((totalLiabilities / totalAssets) * 100).toFixed(0)}% of assets. Reduce debt burden.`,
        priority: 'high',
        category: 'debt',
        actionable: true,
        action: 'Accelerate debt payments',
      });
    }
  }

  // ============================================
  // RULE 9: DEBT-TO-INCOME RATIO
  // ============================================

  private analyzeDebtToIncome(overview: FinancialOverview, incomes: Income[]): void {
    const monthlyIncome = overview.totalIncome;
    const monthlyDebtPayment = overview.creditCardDebt * 0.05; // Assuming 5% minimum payment
    
    if (monthlyIncome > 0) {
      const dti = (monthlyDebtPayment / monthlyIncome) * 100;
      
      if (dti > 40) {
        this.addRecommendation({
          type: 'alert',
          title: 'High Debt-to-Income Ratio',
          message: `Debt payments are ${dti.toFixed(0)}% of income. This is considered high risk.`,
          priority: 'critical',
          category: 'debt',
          actionable: true,
          action: 'Increase income or aggressively reduce debt',
        });
      } else if (dti > 25) {
        this.addRecommendation({
          type: 'warning',
          title: 'Elevated Debt-to-Income Ratio',
          message: `Debt payments are ${dti.toFixed(0)}% of income. Try to keep below 20%.`,
          priority: 'medium',
          category: 'debt',
          actionable: true,
          action: 'Focus on debt reduction',
        });
      }
    }
  }

  // ============================================
  // HELPER METHOD
  // ============================================

  private addRecommendation(data: Omit<Recommendation, 'id' | 'createdAt'>): void {
    this.recommendations.push({
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
    });
  }
}

// Export singleton instance
export const recommendationsEngine = new RecommendationsEngine();
