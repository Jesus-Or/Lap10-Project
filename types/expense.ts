export type ExpenseCategory = 
  | 'Alimentación'
  | 'Transporte'
  | 'Vivienda'
  | 'Ocio'
  | 'Salud'
  | 'Otros';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Alimentación',
  'Transporte',
  'Vivienda',
  'Ocio',
  'Salud',
  'Otros'
];

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  description?: string;
  createdAt: string; // ISO string
}

export interface ExpenseFilters {
  month?: string; // YYYY-MM
  category?: ExpenseCategory | 'ALL';
  search?: string;
}
