import { useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, CreditCard as CreditCardIcon, AlertTriangle, TrendingDown } from 'lucide-react';
import useFinancialStore from '@/store/useFinancialStore';
import {
  calculateTotalCreditCardDebt,
  calculateCreditUtilization,
  calculateMonthlyInterestLoss,
  calculateAvalancheStrategy,
  calculateSnowballStrategy,
} from '@/services/calculations';
import { formatCurrency, formatDate, formatPercentage } from '@/lib/utils';
import { EmptyState } from '@/components/common/EmptyState';

export function CreditCards() {
  const { creditCards, loans, settings } = useFinancialStore();

  const totalDebt = useMemo(() => {
    return calculateTotalCreditCardDebt(creditCards);
  }, [creditCards]);

  const totalMonthlyInterest = useMemo(() => {
    return creditCards
      .filter((c) => c.isActive)
      .reduce((sum, card) => sum + calculateMonthlyInterestLoss(card.outstandingBalance, card.interestRate), 0);
  }, [creditCards]);

  const avalancheStrategy = useMemo(() => {
    return calculateAvalancheStrategy(creditCards);
  }, [creditCards]);

  const snowballStrategy = useMemo(() => {
    return calculateSnowballStrategy(creditCards);
  }, [creditCards]);

  return (
    <div>
      <PageHeader
        title="Credit Cards & Loans"
        description="Manage debt and optimize repayment"
        action={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Credit Card Debt"
          value={formatCurrency(totalDebt, settings.currency)}
          icon={CreditCardIcon}
          variant={totalDebt > 0 ? 'warning' : 'success'}
        />
        <StatCard
          title="Monthly Interest Loss"
          value={formatCurrency(totalMonthlyInterest, settings.currency)}
          subtitle={`${formatCurrency(totalMonthlyInterest * 12, settings.currency)}/year`}
          icon={AlertTriangle}
          variant="danger"
        />
        <StatCard
          title="Active Cards"
          value={creditCards.filter((c) => c.isActive).length}
          subtitle={`${creditCards.filter((c) => !c.isActive).length} inactive`}
          icon={CreditCardIcon}
          variant="default"
        />
      </div>

      <Tabs defaultValue="cards" className="mb-6">
        <TabsList>
          <TabsTrigger value="cards">Credit Cards</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
          <TabsTrigger value="strategy">Payoff Strategy</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Credit Cards</CardTitle>
            </CardHeader>
            <CardContent>
              {creditCards.length === 0 ? (
                <EmptyState
                  icon={CreditCardIcon}
                  title="No credit cards"
                  description="Add your credit cards to track balances and optimize payments"
                  action={{ label: 'Add Card', onClick: () => {} }}
                />
              ) : (
                <div className="space-y-4">
                  {creditCards.map((card) => {
                    const utilization = calculateCreditUtilization(card);
                    const monthlyInterest = calculateMonthlyInterestLoss(card.outstandingBalance, card.interestRate);

                    return (
                      <div
                        key={card.id}
                        className="p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{card.name}</h4>
                              <Badge variant={card.isActive ? 'default' : 'secondary'}>
                                {card.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{card.bankName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              {formatCurrency(card.outstandingBalance, settings.currency)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              of {formatCurrency(card.creditLimit, settings.currency)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-muted-foreground">Utilization</span>
                              <span
                                className={`text-sm font-semibold ${
                                  utilization > 70 ? 'text-danger' : utilization > 30 ? 'text-warning' : 'text-success'
                                }`}
                              >
                                {formatPercentage(utilization)}
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className={`h-full rounded-full ${
                                  utilization > 70 ? 'bg-danger' : utilization > 30 ? 'bg-warning' : 'bg-success'
                                }`}
                                style={{ width: `${Math.min(utilization, 100)}%` }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 pt-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Interest Rate</p>
                              <p className="font-semibold">{card.interestRate}% APR</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Monthly Loss</p>
                              <p className="font-semibold text-danger">
                                {formatCurrency(monthlyInterest, settings.currency)}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Due Date</p>
                              <p className="font-semibold">{formatDate(card.dueDate)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Loans</CardTitle>
            </CardHeader>
            <CardContent>
              {loans.length === 0 ? (
                <EmptyState
                  icon={TrendingDown}
                  title="No loans"
                  description="Track your loans here"
                  action={{ label: 'Add Loan', onClick: () => {} }}
                />
              ) : (
                <div className="space-y-4">
                  {loans.map((loan) => (
                    <div
                      key={loan.id}
                      className="p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">{loan.name}</h4>
                          <p className="text-sm text-muted-foreground">{loan.lender}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {formatCurrency(loan.outstandingBalance, settings.currency)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            of {formatCurrency(loan.principalAmount, settings.currency)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">EMI</p>
                          <p className="font-semibold">{formatCurrency(loan.emiAmount, settings.currency)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Interest Rate</p>
                          <p className="font-semibold">{loan.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">End Date</p>
                          <p className="font-semibold">{formatDate(loan.endDate)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategy" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Avalanche Method</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Pay off highest interest rate first (saves most money)
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {avalancheStrategy.map((card, index) => (
                    <div key={card.id} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{card.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(card.outstandingBalance, settings.currency)} @ {card.interestRate}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Snowball Method</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Pay off smallest balance first (motivational wins)
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {snowballStrategy.map((card, index) => (
                    <div key={card.id} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{card.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(card.outstandingBalance, settings.currency)} @ {card.interestRate}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
