import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { CURRENCY_SYMBOLS, DATE_FORMATS } from '@/constants';
import type { Currency } from '@/types';

// ============================================
// CLASS NAME UTILITIES
// ============================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// CURRENCY FORMATTING
// ============================================

export function formatCurrency(amount: number, currency: Currency = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const absAmount = Math.abs(amount);
  
  // Indian numbering system for INR
  if (currency === 'INR') {
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(absAmount);
    return `${symbol}${formatted}`;
  }
  
  // Standard formatting for other currencies
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(absAmount);
  
  return `${symbol}${formatted}`;
}

export function formatCurrencyCompact(amount: number, currency: Currency = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const absAmount = Math.abs(amount);
  
  if (absAmount >= 10000000) {
    return `${symbol}${(absAmount / 10000000).toFixed(2)}Cr`;
  }
  if (absAmount >= 100000) {
    return `${symbol}${(absAmount / 100000).toFixed(2)}L`;
  }
  if (absAmount >= 1000) {
    return `${symbol}${(absAmount / 1000).toFixed(1)}K`;
  }
  
  return formatCurrency(amount, currency);
}

// ============================================
// PERCENTAGE FORMATTING
// ============================================

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// ============================================
// DATE FORMATTING
// ============================================

export function formatDate(date: string | Date, formatStr: keyof typeof DATE_FORMATS = 'display'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, DATE_FORMATS[formatStr]);
}

export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

export function getMonthLabel(monthStr: string): string {
  return format(parseISO(`${monthStr}-01`), 'MMM yyyy');
}

export function getLastNMonths(n: number): string[] {
  const months: string[] = [];
  const now = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    const month = subMonths(now, i);
    months.push(format(month, 'yyyy-MM'));
  }
  
  return months;
}

export function isInCurrentMonth(date: string): boolean {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  const checkDate = parseISO(date);
  
  return isWithinInterval(checkDate, { start, end });
}

// ============================================
// NUMBER UTILITIES
// ============================================

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function calculateCAGR(initialValue: number, finalValue: number, years: number): number {
  if (initialValue === 0 || years === 0) return 0;
  return (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
}

export function calculateCompoundInterest(
  principal: number,
  rate: number,
  years: number,
  frequency: number = 12
): number {
  return principal * Math.pow(1 + rate / 100 / frequency, frequency * years);
}

// ============================================
// VALIDATION
// ============================================

export function isValidAmount(value: string | number): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && num >= 0;
}

export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ============================================
// ARRAY UTILITIES
// ============================================

export function sortByDate<T extends { date: string }>(items: T[], order: 'asc' | 'desc' = 'desc'): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function sumBy<T>(array: T[], key: keyof T): number {
  return array.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
}

// ============================================
// ID GENERATION
// ============================================

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// DEBOUNCE
// ============================================

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
