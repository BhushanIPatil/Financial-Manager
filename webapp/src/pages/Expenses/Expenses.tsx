import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingDown, Calendar, PieChart } from 'lucide-react';
import useFinancialStore from '@/store/useFinancialStore';
import {
  calculateTotalExpenses,
  calculateExpensesByCategory,
  calculateFixedExpenses,
  calculateVariableExpenses,
} from '@/services/calculations';
import { formatCurrency, formatDate, getCurrentMonth } from '@/lib/utils';
import { EXPENSE_CATEGORIES } from '@/constants';
import { EmptyState } from '@/components/common/EmptyState';

export function Expenses() {
  const { expenses, settings } = useFinancialStore();
  const [selectedMonth] = useState(getCurrentMonth());

  const monthlyTotal = useMemo(() => {
    return calculateTotalExpenses(expenses, selectedMonth);
  }, [expenses, selectedMonth]);

  const fixedExpenses = useMemo(() => {
    return calculateFixedExpenses(expenses, selectedMonth);
  }, [expenses, selectedMonth]);

  const variableExpenses = useMemo(() => {
    return calculateVariableExpenses(expenses, selectedMonth);
  }, [expenses, selectedMonth]);

  const expensesByCategory = useMemo(() => {
    return calculateExpensesByCategory(expenses, selectedMonth);
  }, [expenses, selectedMonth]);

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses]);

  const getCategoryIcon = (category: string) => {
    return EXPENSE_CATEGORIES.find((c) => c.value === category)?.icon || '📦';
  };

  return (
    <div>
      <PageHeader
        title="Expense Management"
        description="Track and optimize your spending"
        action={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(monthlyTotal, settings.currency)}
          subtitle="This month"
          icon={Calendar}
          variant="default"
        />
        <StatCard
          title="Fixed Expenses"
          value={formatCurrency(fixedExpenses, settings.currency)}
          subtitle={`${((fixedExpenses / monthlyTotal) * 100).toFixed(0)}% of total`}
          icon={TrendingDown}
          variant="default"
        />
        <StatCard
          title="Variable Expenses"
          value={formatCurrency(variableExpenses, settings.currency)}
          subtitle={`${((variableExpenses / monthlyTotal) * 100).toFixed(0)}% of total`}
          icon={PieChart}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedExpenses.length === 0 ? (
              <EmptyState
                icon={TrendingDown}
                title="No expense records"
                description="Start tracking your expenses to gain insights"
                action={{ label: 'Add Expense', onClick: () => {} }}
              />
            ) : (
              <div className="space-y-3">
                {sortedExpenses.slice(0, 10).map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-2xl">{getCategoryIcon(expense.category)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{expense.title}</h4>
                          {expense.isRecurring && (
                            <Badge variant="secondary" className="text-xs">
                              Recurring
                            </Badge>
                          )}
                          {expense.isFixed && (
                            <Badge variant="outline" className="text-xs">
                              Fixed
                            </Badge>
                          )}
                        </div>
                        {expense.description && (
                          <p className="text-sm text-muted-foreground">{expense.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(expense.date)} • {expense.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-danger">
                        -{formatCurrency(expense.amount, settings.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>By Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expensesByCategory.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(cat.category)}</span>
                      <span className="text-sm font-medium capitalize">{cat.category}</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatCurrency(cat.amount, settings.currency)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-danger h-full rounded-full"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {cat.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
