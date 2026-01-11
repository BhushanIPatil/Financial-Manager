import { useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { AlertCard } from '@/components/common/AlertCard';
import { BarChartCard } from '@/components/charts/BarChartCard';
import { PieChartCard } from '@/components/charts/PieChartCard';
import { AreaChartCard } from '@/components/charts/AreaChartCard';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CreditCard,
  Target,
} from 'lucide-react';
import useFinancialStore from '@/store/useFinancialStore';
import { calculateFinancialOverview, calculateExpensesByCategory, calculateMonthlyMetrics } from '@/services/calculations';
import { recommendationsEngine } from '@/engine/recommendationsEngine';
import { formatCurrency, formatPercentage, getLastNMonths, getMonthLabel } from '@/lib/utils';
import { CHART_COLORS, CATEGORY_COLORS } from '@/constants';

export function Dashboard() {
  const {
    incomes,
    expenses,
    investments,
    creditCards,
    loans,
    assets,
    settings,
  } = useFinancialStore();

  // Calculate financial overview
  const overview = useMemo(() => {
    const liquidAssets = assets.find(a => a.type === 'cash')?.value || 0;
    return calculateFinancialOverview(
      incomes,
      expenses,
      investments,
      creditCards,
      loans,
      liquidAssets
    );
  }, [incomes, expenses, investments, creditCards, loans, assets]);

  // Generate recommendations
  const recommendations = useMemo(() => {
    return recommendationsEngine.analyze(
      overview,
      incomes,
      expenses,
      investments,
      creditCards,
      loans
    );
  }, [overview, incomes, expenses, investments, creditCards, loans]);

  // Calculate monthly metrics for the last 6 months
  const monthlyMetrics = useMemo(() => {
    const months = getLastNMonths(6);
    return calculateMonthlyMetrics(incomes, expenses, months).map(metric => ({
      month: getMonthLabel(metric.month),
      income: metric.income,
      expenses: metric.expenses,
      savings: metric.savings,
    }));
  }, [incomes, expenses]);

  // Calculate expense categories
  const expenseCategories = useMemo(() => {
    const categories = calculateExpensesByCategory(expenses);
    return categories.slice(0, 5).map(cat => ({
      name: cat.category,
      value: cat.amount,
    }));
  }, [expenses]);

  const categoryColors = expenseCategories.map(
    cat => CATEGORY_COLORS[cat.name as keyof typeof CATEGORY_COLORS]
  );

  return (
    <div>
      <PageHeader
        title="Financial Dashboard"
        description="Your complete financial overview at a glance"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Net Worth"
          value={formatCurrency(overview.netWorth, settings.currency)}
          subtitle={`Assets: ${formatCurrency(overview.totalAssets)} | Liabilities: ${formatCurrency(overview.totalLiabilities)}`}
          icon={Wallet}
          variant={overview.netWorth > 0 ? 'success' : 'danger'}
        />
        
        <StatCard
          title="Monthly Income"
          value={formatCurrency(overview.totalIncome, settings.currency)}
          subtitle="This month's total income"
          icon={TrendingUp}
          variant="default"
        />
        
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(overview.totalExpenses, settings.currency)}
          subtitle="This month's total expenses"
          icon={TrendingDown}
          variant="default"
        />
        
        <StatCard
          title="Net Savings"
          value={formatCurrency(overview.netSavings, settings.currency)}
          subtitle={`Savings Rate: ${formatPercentage(overview.savingsRate)}`}
          icon={PiggyBank}
          variant={overview.savingsRate > 20 ? 'success' : overview.savingsRate > 10 ? 'warning' : 'danger'}
        />
        
        <StatCard
          title="Total Investments"
          value={formatCurrency(overview.investmentValue, settings.currency)}
          subtitle={`Returns: ${formatCurrency(overview.investmentReturns)} (${formatPercentage((overview.investmentReturns / (overview.investmentValue - overview.investmentReturns)) * 100)})`}
          icon={Target}
          variant={overview.investmentReturns > 0 ? 'success' : 'warning'}
        />
        
        <StatCard
          title="Total Debt"
          value={formatCurrency(overview.creditCardDebt + overview.loanDebt, settings.currency)}
          subtitle={`Credit Cards: ${formatCurrency(overview.creditCardDebt)} | Loans: ${formatCurrency(overview.loanDebt)}`}
          icon={CreditCard}
          variant={overview.creditCardDebt > 0 ? 'warning' : 'success'}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BarChartCard
          title="Income vs Expenses (Last 6 Months)"
          description="Track your monthly cash flow"
          data={monthlyMetrics}
          xAxisKey="month"
          bars={[
            { dataKey: 'income', color: CHART_COLORS.income, name: 'Income' },
            { dataKey: 'expenses', color: CHART_COLORS.expense, name: 'Expenses' },
            { dataKey: 'savings', color: CHART_COLORS.savings, name: 'Savings' },
          ]}
        />
        
        <PieChartCard
          title="Expense Breakdown"
          description="Top 5 expense categories"
          data={expenseCategories}
          dataKey="value"
          nameKey="name"
          colors={categoryColors}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 mb-6">
        <AreaChartCard
          title="Savings Trend"
          description="Your monthly savings over time"
          data={monthlyMetrics}
          dataKey="savings"
          xAxisKey="month"
          color={CHART_COLORS.savings}
        />
      </div>

      {/* Financial Recommendations */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Smart Recommendations</h2>
            <p className="text-muted-foreground">AI-powered financial insights</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recommendations.slice(0, 6).map((recommendation) => (
            <AlertCard key={recommendation.id} recommendation={recommendation} />
          ))}
          
          {recommendations.length === 0 && (
            <div className="col-span-2 text-center py-8 text-muted-foreground">
              <p>🎉 Great job! No critical financial issues detected.</p>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Fund Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Emergency Fund Status</h3>
        <p className="text-muted-foreground mb-4">
          You have {overview.emergencyFundMonths.toFixed(1)} months of expenses saved.
        </p>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="bg-primary h-full transition-all"
            style={{
              width: `${Math.min((overview.emergencyFundMonths / 6) * 100, 100)}%`,
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>0 months</span>
          <span>Target: 6 months</span>
        </div>
      </div>
    </div>
  );
}
