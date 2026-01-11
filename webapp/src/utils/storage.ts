/**
 * LocalStorage abstraction layer
 * Provides type-safe storage operations with error handling
 */

const STORAGE_PREFIX = 'fin_manager_';

export class StorageService {
  private static getKey(key: string): string {
    return `${STORAGE_PREFIX}${key}`;
  }

  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }

  static exists(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null;
  }
}

// ============================================
// STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  INCOME: 'income',
  EXPENSES: 'expenses',
  INVESTMENTS: 'investments',
  CREDIT_CARDS: 'credit_cards',
  LOANS: 'loans',
  ASSETS: 'assets',
  LIABILITIES: 'liabilities',
  SETTINGS: 'settings',
  NET_WORTH_HISTORY: 'net_worth_history',
} as const;
