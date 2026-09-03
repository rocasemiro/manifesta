import { Category, SupplierCreditor, Transaction } from '../types';
import { INITIAL_CATEGORIES, INITIAL_SUPPLIERS_CREDITORS, INITIAL_TRANSACTIONS } from '../data/initialData';

const STORAGE_KEYS = {
  CATEGORIES: 'manifesta_categories_v1',
  SUPPLIERS: 'manifesta_suppliers_v1',
  TRANSACTIONS: 'manifesta_transactions_v1',
  AFFIRMATION: 'manifesta_daily_affirmation_v1',
};

export function loadCategories(): Category[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading categories from storage:', e);
  }
  saveCategories(INITIAL_CATEGORIES);
  return INITIAL_CATEGORIES;
}

export function saveCategories(categories: Category[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Error saving categories:', e);
  }
}

export function loadSuppliers(): SupplierCreditor[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading suppliers:', e);
  }
  saveSuppliers(INITIAL_SUPPLIERS_CREDITORS);
  return INITIAL_SUPPLIERS_CREDITORS;
}

export function saveSuppliers(suppliers: SupplierCreditor[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  } catch (e) {
    console.error('Error saving suppliers:', e);
  }
}

export function loadTransactions(): Transaction[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading transactions:', e);
  }
  saveTransactions(INITIAL_TRANSACTIONS);
  return INITIAL_TRANSACTIONS;
}

export function saveTransactions(transactions: Transaction[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.error('Error saving transactions:', e);
  }
}

export function resetAllDataToDefault() {
  saveCategories(INITIAL_CATEGORIES);
  saveSuppliers(INITIAL_SUPPLIERS_CREDITORS);
  saveTransactions(INITIAL_TRANSACTIONS);
}

export function exportDataAsJSON() {
  const data = {
    app: 'Manifesta - Gestão Financeira Espiritual',
    exportedAt: new Date().toISOString(),
    categories: loadCategories(),
    suppliersCreditors: loadSuppliers(),
    transactions: loadTransactions(),
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `manifesta_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
