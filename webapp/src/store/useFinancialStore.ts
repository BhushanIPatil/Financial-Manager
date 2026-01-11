import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Income,
  Expense,
  Investment,
  CreditCard,
  Loan,
  Asset,
  Liability,
  UserSettings,
  FamilyMember,
  InterFamilyLoan,
} from '@/types';
import { StorageService, STORAGE_KEYS } from '@/utils/storage';
import {
  MOCK_INCOME,
  MOCK_EXPENSES,
  MOCK_INVESTMENTS,
  MOCK_CREDIT_CARDS,
  MOCK_LOANS,
  MOCK_ASSETS,
  MOCK_LIABILITIES,
  MOCK_SETTINGS,
} from '@/services/mockData';

/**
 * Global financial state management using Zustand
 * Persisted to localStorage with automatic sync
 */

interface FinancialState {
  // Data
  familyMembers: FamilyMember[];
  interFamilyLoans: InterFamilyLoan[];
  incomes: Income[];
  expenses: Expense[];
  investments: Investment[];
  creditCards: CreditCard[];
  loans: Loan[];
  assets: Asset[];
  liabilities: Liability[];
  settings: UserSettings;
  selectedMemberId: string | null; // For filtering by family member
  
  // Family member actions
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (id: string, member: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;
  setSelectedMember: (id: string | null) => void;
  
  // Inter-family loan actions
  addInterFamilyLoan: (loan: InterFamilyLoan) => void;
  updateInterFamilyLoan: (id: string, loan: Partial<InterFamilyLoan>) => void;
  deleteInterFamilyLoan: (id: string) => void;
  
  // Income actions
  addIncome: (income: Income) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  
  // Expense actions
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  // Investment actions
  addInvestment: (investment: Investment) => void;
  updateInvestment: (id: string, investment: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;
  
  // Credit card actions
  addCreditCard: (card: CreditCard) => void;
  updateCreditCard: (id: string, card: Partial<CreditCard>) => void;
  deleteCreditCard: (id: string) => void;
  
  // Loan actions
  addLoan: (loan: Loan) => void;
  updateLoan: (id: string, loan: Partial<Loan>) => void;
  deleteLoan: (id: string) => void;
  
  // Asset actions
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  
  // Liability actions
  addLiability: (liability: Liability) => void;
  updateLiability: (id: string, liability: Partial<Liability>) => void;
  deleteLiability: (id: string) => void;
  
  // Settings actions
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  // Utility actions
  resetToMockData: () => void;
  clearAllData: () => void;
}

const useFinancialStore = create<FinancialState>()(
  persist(
    (set) => ({
      // Initial state with mock data
      familyMembers: [],
      interFamilyLoans: [],
      incomes: MOCK_INCOME,
      expenses: MOCK_EXPENSES,
      investments: MOCK_INVESTMENTS,
      creditCards: MOCK_CREDIT_CARDS,
      loans: MOCK_LOANS,
      assets: MOCK_ASSETS,
      liabilities: MOCK_LIABILITIES,
      settings: MOCK_SETTINGS,
      selectedMemberId: null,
      
      // Family member actions
      addFamilyMember: (member) =>
        set((state) => ({ familyMembers: [...state.familyMembers, member] })),
      
      updateFamilyMember: (id, updatedMember) =>
        set((state) => ({
          familyMembers: state.familyMembers.map((member) =>
            member.id === id ? { ...member, ...updatedMember, updatedAt: new Date().toISOString() } : member
          ),
        })),
      
      deleteFamilyMember: (id) =>
        set((state) => ({
          familyMembers: state.familyMembers.filter((member) => member.id !== id),
        })),
      
      setSelectedMember: (id) =>
        set({ selectedMemberId: id }),
      
      // Inter-family loan actions
      addInterFamilyLoan: (loan) =>
        set((state) => ({ interFamilyLoans: [...state.interFamilyLoans, loan] })),
      
      updateInterFamilyLoan: (id, updatedLoan) =>
        set((state) => ({
          interFamilyLoans: state.interFamilyLoans.map((loan) =>
            loan.id === id ? { ...loan, ...updatedLoan, updatedAt: new Date().toISOString() } : loan
          ),
        })),
      
      deleteInterFamilyLoan: (id) =>
        set((state) => ({
          interFamilyLoans: state.interFamilyLoans.filter((loan) => loan.id !== id),
        })),
      
      // Income actions
      addIncome: (income) =>
        set((state) => ({ incomes: [...state.incomes, income] })),
      
      updateIncome: (id, updatedIncome) =>
        set((state) => ({
          incomes: state.incomes.map((income) =>
            income.id === id ? { ...income, ...updatedIncome, updatedAt: new Date().toISOString() } : income
          ),
        })),
      
      deleteIncome: (id) =>
        set((state) => ({
          incomes: state.incomes.filter((income) => income.id !== id),
        })),
      
      // Expense actions
      addExpense: (expense) =>
        set((state) => ({ expenses: [...state.expenses, expense] })),
      
      updateExpense: (id, updatedExpense) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updatedExpense, updatedAt: new Date().toISOString() } : expense
          ),
        })),
      
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),
      
      // Investment actions
      addInvestment: (investment) =>
        set((state) => ({ investments: [...state.investments, investment] })),
      
      updateInvestment: (id, updatedInvestment) =>
        set((state) => ({
          investments: state.investments.map((investment) =>
            investment.id === id ? { ...investment, ...updatedInvestment, updatedAt: new Date().toISOString() } : investment
          ),
        })),
      
      deleteInvestment: (id) =>
        set((state) => ({
          investments: state.investments.filter((investment) => investment.id !== id),
        })),
      
      // Credit card actions
      addCreditCard: (card) =>
        set((state) => ({ creditCards: [...state.creditCards, card] })),
      
      updateCreditCard: (id, updatedCard) =>
        set((state) => ({
          creditCards: state.creditCards.map((card) =>
            card.id === id ? { ...card, ...updatedCard, updatedAt: new Date().toISOString() } : card
          ),
        })),
      
      deleteCreditCard: (id) =>
        set((state) => ({
          creditCards: state.creditCards.filter((card) => card.id !== id),
        })),
      
      // Loan actions
      addLoan: (loan) =>
        set((state) => ({ loans: [...state.loans, loan] })),
      
      updateLoan: (id, updatedLoan) =>
        set((state) => ({
          loans: state.loans.map((loan) =>
            loan.id === id ? { ...loan, ...updatedLoan, updatedAt: new Date().toISOString() } : loan
          ),
        })),
      
      deleteLoan: (id) =>
        set((state) => ({
          loans: state.loans.filter((loan) => loan.id !== id),
        })),
      
      // Asset actions
      addAsset: (asset) =>
        set((state) => ({ assets: [...state.assets, asset] })),
      
      updateAsset: (id, updatedAsset) =>
        set((state) => ({
          assets: state.assets.map((asset) =>
            asset.id === id ? { ...asset, ...updatedAsset, updatedAt: new Date().toISOString() } : asset
          ),
        })),
      
      deleteAsset: (id) =>
        set((state) => ({
          assets: state.assets.filter((asset) => asset.id !== id),
        })),
      
      // Liability actions
      addLiability: (liability) =>
        set((state) => ({ liabilities: [...state.liabilities, liability] })),
      
      updateLiability: (id, updatedLiability) =>
        set((state) => ({
          liabilities: state.liabilities.map((liability) =>
            liability.id === id ? { ...liability, ...updatedLiability, updatedAt: new Date().toISOString() } : liability
          ),
        })),
      
      deleteLiability: (id) =>
        set((state) => ({
          liabilities: state.liabilities.filter((liability) => liability.id !== id),
        })),
      
      // Settings actions
      updateSettings: (updatedSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...updatedSettings },
        })),
      
      // Utility actions
      resetToMockData: () =>
        set({
          familyMembers: [],
          interFamilyLoans: [],
          incomes: MOCK_INCOME,
          expenses: MOCK_EXPENSES,
          investments: MOCK_INVESTMENTS,
          creditCards: MOCK_CREDIT_CARDS,
          loans: MOCK_LOANS,
          assets: MOCK_ASSETS,
          liabilities: MOCK_LIABILITIES,
          settings: MOCK_SETTINGS,
          selectedMemberId: null,
        }),
      
      clearAllData: () =>
        set({
          familyMembers: [],
          interFamilyLoans: [],
          incomes: [],
          expenses: [],
          investments: [],
          creditCards: [],
          loans: [],
          assets: [],
          liabilities: [],
          settings: MOCK_SETTINGS,
          selectedMemberId: null,
        }),
    }),
    {
      name: 'financial-storage',
    }
  )
);

export default useFinancialStore;
