import { useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, TrendingUp, TrendingDown, Target } from 'lucide-react';
import useFinancialStore from '@/store/useFinancialStore';
import { calculateNetWorth, calculateInvestmentSummary, calculateTotalCreditCardDebt, calculateTotalLoanDebt } from '@/services/calculations';
import { formatCurrency } from '@/lib/utils';
import { AreaChartCard } from '@/components/charts/AreaChartCard';
import { CHART_COLORS } from '@/constants';

export function NetWorth() {
  const { assets, liabilities, investments, creditCards, loans, settings } = useFinancialStore();

  const investmentSummary = useMemo(() => {
    return calculateInvestmentSummary(investments);
  }, [investments]);

  const totalAssets = useMemo(() => {
    const cashAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
    return cashAssets + investmentSummary.currentValue;
  }, [assets, investmentSummary]);

  const totalLiabilities = useMemo(() => {
    return calculateTotalCreditCardDebt(creditCards) + calculateTotalLoanDebt(loans);
  }, [creditCards, loans]);

  const netWorth = useMemo(() => {
    return calculateNetWorth(totalAssets, totalLiabilities);
  }, [totalAssets, totalLiabilities]);

  // Mock historical data for the chart
  const historicalData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      netWorth: netWorth - (5 - index) * 50000,
      assets: totalAssets - (5 - index) * 30000,
      liabilities: totalLiabilities + (5 - index) * 20000,
    }));
  }, [netWorth, totalAssets, totalLiabilities]);

  return (
    <div>
      <PageHeader
        title="Net Worth"
        description="Track your overall financial health"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Net Worth"
          value={formatCurrency(netWorth, settings.currency)}
          subtitle="Assets - Liabilities"
          icon={Wallet}
          variant={netWorth > 0 ? 'success' : 'danger'}
        />
        <StatCard
          title="Total Assets"
          value={formatCurrency(totalAssets, settings.currency)}
          subtitle="Cash + Investments"
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Total Liabilities"
          value={formatCurrency(totalLiabilities, settings.currency)}
          subtitle="Debt obligations"
          icon={TrendingDown}
          variant="warning"
        />
      </div>

      <div className="mb-6">
        <AreaChartCard
          title="Net Worth Trend"
          description="Your financial growth over time"
          data={historicalData}
          dataKey="netWorth"
          xAxisKey="month"
          color={CHART_COLORS.primary}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Assets Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
                  <div>
                    <p className="font-semibold">{asset.name}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {asset.type}
                    </Badge>
                  </div>
                  <p className="text-lg font-bold text-success">
                    {formatCurrency(asset.value, settings.currency)}
                  </p>
                </div>
              ))}

              <div className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
                <div>
                  <p className="font-semibold">Total Investments</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {investments.length} holdings
                  </Badge>
                </div>
                <p className="text-lg font-bold text-success">
                  {formatCurrency(investmentSummary.currentValue, settings.currency)}
                </p>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">Total Assets</p>
                  <p className="text-2xl font-bold text-success">
                    {formatCurrency(totalAssets, settings.currency)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-danger" />
              Liabilities Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {creditCards.filter(c => c.isActive && c.outstandingBalance > 0).map((card) => (
                <div key={card.id} className="flex items-center justify-between p-3 rounded-lg bg-danger/5 border border-danger/20">
                  <div>
                    <p className="font-semibold">{card.name}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      Credit Card
                    </Badge>
                  </div>
                  <p className="text-lg font-bold text-danger">
                    {formatCurrency(card.outstandingBalance, settings.currency)}
                  </p>
                </div>
              ))}

              {loans.map((loan) => (
                <div key={loan.id} className="flex items-center justify-between p-3 rounded-lg bg-danger/5 border border-danger/20">
                  <div>
                    <p className="font-semibold">{loan.name}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {loan.type}
                    </Badge>
                  </div>
                  <p className="text-lg font-bold text-danger">
                    {formatCurrency(loan.outstandingBalance, settings.currency)}
                  </p>
                </div>
              ))}

              {totalLiabilities === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>🎉 No liabilities! You're debt-free!</p>
                </div>
              )}

              {totalLiabilities > 0 && (
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">Total Liabilities</p>
                    <p className="text-2xl font-bold text-danger">
                      {formatCurrency(totalLiabilities, settings.currency)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Financial Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Assets to Liabilities Ratio</span>
                <span className="text-sm font-bold">
                  {totalLiabilities > 0 ? (totalAssets / totalLiabilities).toFixed(2) : '∞'}:1
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {totalLiabilities === 0
                  ? 'Perfect! You have no debt.'
                  : totalAssets / totalLiabilities > 2
                  ? 'Excellent! Your assets significantly exceed liabilities.'
                  : totalAssets / totalLiabilities > 1
                  ? 'Good! Your assets exceed liabilities.'
                  : 'Warning: Your liabilities are high relative to assets.'}
              </p>
            </div>

            <div className="w-full bg-muted rounded-full h-3">
              <div
                className={`h-full rounded-full ${
                  netWorth > totalAssets * 0.5
                    ? 'bg-success'
                    : netWorth > 0
                    ? 'bg-warning'
                    : 'bg-danger'
                }`}
                style={{
                  width: `${Math.min(Math.max((netWorth / totalAssets) * 100, 0), 100)}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
