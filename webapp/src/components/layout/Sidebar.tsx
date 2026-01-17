import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Coins,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  PiggyBank,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants';

const navigation = [
  { name: 'Dashboard', href: ROUTES.dashboard, icon: LayoutDashboard },
  { name: 'Family Members', href: ROUTES.familyMembers, icon: Users },
  { name: 'Family Loans', href: ROUTES.interFamilyLoans, icon: Coins },
  { name: 'Income', href: ROUTES.income, icon: TrendingUp },
  { name: 'Expenses', href: ROUTES.expenses, icon: TrendingDown },
  { name: 'Investments', href: ROUTES.investments, icon: Wallet },
  { name: 'Credit Cards', href: ROUTES.creditCards, icon: CreditCard },
  { name: 'Net Worth', href: ROUTES.netWorth, icon: PiggyBank },
  { name: 'Settings', href: ROUTES.settings, icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <PiggyBank className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">FinManager</h1>
            <p className="text-xs text-muted-foreground">Your Personal CA</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-muted rounded-lg p-3">
          <p className="text-xs font-semibold mb-1">💡 Pro Tip</p>
          <p className="text-xs text-muted-foreground">
            Review your expenses weekly to stay on top of your finances.
          </p>
        </div>
      </div>
    </aside>
  );
}
