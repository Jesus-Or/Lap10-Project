import { Expense, ExpenseCategory } from '@/types/expense';

const STORAGE_KEY = 'personal_expenses_mvp_v1';

const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    amount: 45.50,
    category: 'Alimentación',
    date: new Date().toISOString().split('T')[0],
    description: 'Supermercado semanal',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-2',
    amount: 15.00,
    category: 'Transporte',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    description: 'Taxi a reunión',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'exp-3',
    amount: 350.00,
    category: 'Vivienda',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    description: 'Servicios de luz y agua',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'exp-4',
    amount: 25.00,
    category: 'Ocio',
    date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    description: 'Cine con amigos',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  }
];

export const expensesRepository = {
  list: async (): Promise<Expense[]> => {
    if (typeof window === 'undefined') {
      return INITIAL_EXPENSES;
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EXPENSES));
        return INITIAL_EXPENSES;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading expenses from localStorage', error);
      return INITIAL_EXPENSES;
    }
  },

  create: async (expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
    const expenses = await expensesRepository.list();
    const newExpense: Expense = {
      ...expenseData,
      id: 'exp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    const updated = [newExpense, ...expenses];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return newExpense;
  },

  update: async (id: string, expenseData: Partial<Omit<Expense, 'id' | 'createdAt'>>): Promise<Expense> => {
    const expenses = await expensesRepository.list();
    let updatedExpense: Expense | null = null;
    const updated = expenses.map((exp) => {
      if (exp.id === id) {
        updatedExpense = { ...exp, ...expenseData };
        return updatedExpense;
      }
      return exp;
    });
    if (!updatedExpense) {
      throw new Error(`Expense with id ${id} not found`);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return updatedExpense;
  },

  remove: async (id: string): Promise<void> => {
    const expenses = await expensesRepository.list();
    const updated = expenses.filter((exp) => exp.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  },
};
