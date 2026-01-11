import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import useFinancialStore from '@/store/useFinancialStore';
import { calculateTotalIncome, calculateIncomeByCategory } from '@/services/calculations';
import { formatCurrency, formatDate, getCurrentMonth } from '@/lib/utils';
import { EmptyState } from '@/components/common/EmptyState';

export function Income() {
  const { incomes, settings } = useFinancialStore();
  const [selectedMonth] = useState(getCurrentMonth());

  const monthlyTotal = useMemo(() => {
    return calculateTotalIncome(incomes, selectedMonth);
  }, [incomes, selectedMonth]);

  const totalIncome = useMemo(() => {
    return calculateTotalIncome(incomes);
  }, [incomes]);

  const incomeByCategory = useMemo(() => {
    return calculateIncomeByCategory(incomes, selectedMonth);
  }, [incomes, selectedMonth]);

  const sortedIncomes = useMemo(() => {
    return [...incomes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [incomes]);

  return (
    <div>
      <PageHeader
        title="Income Management"
        description="Track all your income sources"
        action={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Income
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="This Month"
          value={formatCurrency(monthlyTotal, settings.currency)}
          icon={Calendar}
          variant="success"
        />
        <StatCard
          title="Total (All Time)"
          value={formatCurrency(totalIncome, settings.currency)}
          icon={DollarSign}
          variant="default"
        />
        <StatCard
          title="Income Sources"
          value={incomes.length}
          subtitle="Active income streams"
          icon={TrendingUp}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Income</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedIncomes.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                title="No income records"
                description="Start by adding your first income source"
                action={{ label: 'Add Income', onClick: () => {} }}
              />
            ) : (
              <div className="space-y-3">
                {sortedIncomes.map((income) => (
                  <div
                    key={income.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{income.source}</h4>
                        {income.isRecurring && (
                          <Badge variant="secondary" className="text-xs">
                            Recurring
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {income.category}
                        </Badge>
                      </div>
                      {income.description && (
                        <p className="text-sm text-muted-foreground">{income.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(income.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-success">
                        +{formatCurrency(income.amount, settings.currency)}
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
            <div className="space-y-3">
              {incomeByCategory.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium capitalize">{cat.category}</span>
                    <span className="text-sm font-semibold">
                      {formatCurrency(cat.amount, settings.currency)}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-success h-full rounded-full"
                      style={{ width: `${(cat.amount / monthlyTotal) * 100}%` }}
                    />
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
