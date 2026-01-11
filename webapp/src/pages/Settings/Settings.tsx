import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, RotateCcw, Database } from 'lucide-react';
import useFinancialStore from '@/store/useFinancialStore';
import { formatCurrency } from '@/lib/utils';

export function Settings() {
  const { settings, updateSettings, resetToMockData } = useFinancialStore();

  const handleExportData = () => {
    const store = useFinancialStore.getState();
    const data = {
      incomes: store.incomes,
      expenses: store.expenses,
      investments: store.investments,
      creditCards: store.creditCards,
      loans: store.loans,
      assets: store.assets,
      liabilities: store.liabilities,
      settings: store.settings,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your preferences and data"
      />

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure basic preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={settings.currency}
                  onValueChange={(value: any) => updateSettings({ currency: value })}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locale">Locale</Label>
                <Select
                  value={settings.locale}
                  onValueChange={(value) => updateSettings({ locale: value })}
                >
                  <SelectTrigger id="locale">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-IN">English (India)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value: any) => updateSettings({ theme: value })}
              >
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Financial Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Goals</CardTitle>
            <CardDescription>Set your financial targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyBudget">Monthly Budget</Label>
              <Input
                id="monthlyBudget"
                type="number"
                placeholder="Enter monthly budget"
                value={settings.monthlyBudget || ''}
                onChange={(e) => updateSettings({ monthlyBudget: Number(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">
                Current: {formatCurrency(settings.monthlyBudget || 0, settings.currency)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyFund">Emergency Fund Goal</Label>
              <Input
                id="emergencyFund"
                type="number"
                placeholder="Enter emergency fund goal"
                value={settings.emergencyFundGoal || ''}
                onChange={(e) => updateSettings({ emergencyFundGoal: Number(e.target.value) })}
              />
              <p className="text-xs text-muted-foreground">
                Target: {formatCurrency(settings.emergencyFundGoal || 0, settings.currency)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategy">Credit Card Payoff Strategy</Label>
              <Select
                value={settings.creditCardStrategy}
                onValueChange={(value: any) => updateSettings({ creditCardStrategy: value })}
              >
                <SelectTrigger id="strategy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="avalanche">Avalanche (Highest interest first)</SelectItem>
                  <SelectItem value="snowball">Snowball (Smallest balance first)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="expense-alerts">Expense Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when expenses exceed budget
                </p>
              </div>
              <Switch
                id="expense-alerts"
                checked={settings.notifications.expenseAlerts}
                onCheckedChange={(checked) =>
                  updateSettings({
                    notifications: { ...settings.notifications, expenseAlerts: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="investment-updates">Investment Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates on investment performance
                </p>
              </div>
              <Switch
                id="investment-updates"
                checked={settings.notifications.investmentUpdates}
                onCheckedChange={(checked) =>
                  updateSettings({
                    notifications: { ...settings.notifications, investmentUpdates: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="debt-reminders">Debt Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Reminders for upcoming debt payments
                </p>
              </div>
              <Switch
                id="debt-reminders"
                checked={settings.notifications.debtReminders}
                onCheckedChange={(checked) =>
                  updateSettings({
                    notifications: { ...settings.notifications, debtReminders: checked },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export or reset your financial data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleExportData} variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export Data (JSON)
              </Button>

              <Button
                onClick={() => {
                  if (confirm('Are you sure you want to reset to demo data? This will replace all current data.')) {
                    resetToMockData();
                  }
                }}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Demo Data
              </Button>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Local Storage</p>
                  <p className="text-xs text-muted-foreground">
                    All your data is stored locally in your browser. No data is sent to any server.
                    Export your data regularly to avoid loss.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Framework</span>
                <span className="font-medium">React 18 + TypeScript</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-success">Production Ready</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm">
                <strong>🚀 Ready for FastAPI Integration</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This application is built with clean service layer abstraction and ready for backend API integration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
