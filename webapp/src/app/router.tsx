import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import { FamilyMembersPage } from '@/pages/FamilyMembers/FamilyMembersPage';
import { InterFamilyLoansPage } from '@/pages/InterFamilyLoans/InterFamilyLoansPage';
import { Income } from '@/pages/Income/Income';
import { Expenses } from '@/pages/Expenses/Expenses';
import { Investments } from '@/pages/Investments/Investments';
import { CreditCards } from '@/pages/CreditCards/CreditCards';
import { NetWorth } from '@/pages/NetWorth/NetWorth';
import { Settings } from '@/pages/Settings/Settings';
import { ROUTES } from '@/constants';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout><Dashboard /></AppLayout>,
  },
  {
    path: ROUTES.familyMembers,
    element: <AppLayout><FamilyMembersPage /></AppLayout>,
  },
  {
    path: ROUTES.interFamilyLoans,
    element: <AppLayout><InterFamilyLoansPage /></AppLayout>,
  },
  {
    path: ROUTES.income,
    element: <AppLayout><Income /></AppLayout>,
  },
  {
    path: ROUTES.expenses,
    element: <AppLayout><Expenses /></AppLayout>,
  },
  {
    path: ROUTES.investments,
    element: <AppLayout><Investments /></AppLayout>,
  },
  {
    path: ROUTES.creditCards,
    element: <AppLayout><CreditCards /></AppLayout>,
  },
  {
    path: ROUTES.netWorth,
    element: <AppLayout><NetWorth /></AppLayout>,
  },
  {
    path: ROUTES.settings,
    element: <AppLayout><Settings /></AppLayout>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
