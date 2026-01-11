import { useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, Target, PieChart as PieChartIcon } from 'lucide-react';
import useFinancialStore from '@/store/useFinancialStore';
import { calculateInvestmentSummary } from '@/services/calculations';
import { formatCurrency, formatDate, formatPercentage } from '@/lib/utils';
import { INVESTMENT_TYPES } from '@/constants';
import { EmptyState } from '@/components/common/EmptyState';
import { PieChartCard } from '@/components/charts/PieChartCard';

export function Investments() {
  const { investments, settings } = useFinancialStore();

  const summary = useMemo(() => {
    return calculateInvestmentSummary(investments);
  }, [investments]);

  const investmentsByType = useMemo(() => {
    return Object.entries(summary.byType).map(([type, data]) => ({
      name: INVESTMENT_TYPES.find((t) => t.value === type)?.label || type,
      value: data.current,
    }));
  }, [summary]);

  const typeColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

  const getTypeIcon = (type: string) => {
    return INVESTMENT_TYPES.find((t) => t.value === type)?.icon || '📊';
  };

  return (
    <div>
      <PageHeader
        title="Investment Portfolio"
        description="Track and grow your wealth"
        action={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Investment
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Invested"
          value={formatCurrency(summary.totalInvested, settings.currency)}
          icon={Target}
          variant="default"
        />
        <StatCard
          title="Current Value"
          value={formatCurrency(summary.currentValue, settings.currency)}
          icon={PieChartIcon}
          variant="default"
        />
        <StatCard
          title="Total Returns"
          value={formatCurrency(summary.totalReturns, settings.currency)}
          subtitle={`${formatPercentage(summary.returnsPercentage)}`}
          icon={TrendingUp}
          variant={summary.totalReturns > 0 ? 'success' : 'danger'}
        />
        <StatCard
          title="Total Holdings"
          value={investments.length}
          subtitle="Active investments"
          icon={PieChartIcon}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Investment Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            {investments.length === 0 ? (
              <EmptyState
                icon={Target}
                title="No investments yet"
                description="Start investing to build wealth for the future"
                action={{ label: 'Add Investment', onClick: () => {} }}
              />
            ) : (
              <div className="space-y-3">
                {investments.map((investment) => {
                  const returns = investment.currentValue - investment.investedAmount;
                  const returnsPercentage = (returns / investment.investedAmount) * 100;

                  return (
                    <div
                      key={investment.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-2xl">{getTypeIcon(investment.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{investment.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {INVESTMENT_TYPES.find((t) => t.value === investment.type)?.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Invested: {formatCurrency(investment.investedAmount, settings.currency)}
                            {investment.quantity && ` • Qty: ${investment.quantity}`}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Since {formatDate(investment.purchaseDate)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {formatCurrency(investment.currentValue, settings.currency)}
                        </p>
                        <p
                          className={`text-sm font-semibold ${
                            returns > 0 ? 'text-success' : 'text-danger'
                          }`}
                        >
                          {returns > 0 ? '+' : ''}
                          {formatCurrency(returns, settings.currency)} ({formatPercentage(returnsPercentage)})
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <PieChartCard
            title="Asset Allocation"
            description="Diversification by type"
            data={investmentsByType}
            dataKey="value"
            nameKey="name"
            colors={typeColors}
          />
        </div>
      </div>
    </div>
  );
}
