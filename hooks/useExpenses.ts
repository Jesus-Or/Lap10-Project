import { useState, useEffect, useCallback } from 'react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { expensesRepository } from '@/lib/expenses-repository';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expensesRepository.list();
      // Sort by date descending, then createdAt descending
      data.sort((a, b) => {
        const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateCompare !== 0) return dateCompare;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los gastos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      await expensesRepository.create(expenseData);
      await loadExpenses();
    } catch (err) {
      console.error(err);
      setError('No se pudo registrar el gasto.');
      throw err;
    }
  };

  const updateExpense = async (id: string, expenseData: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
    try {
      setError(null);
      await expensesRepository.update(id, expenseData);
      await loadExpenses();
    } catch (err) {
      console.error(err);
      setError('No se pudo actualizar el gasto.');
      throw err;
    }
  };

  const removeExpense = async (id: string) => {
    try {
      setError(null);
      await expensesRepository.remove(id);
      await loadExpenses();
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar el gasto.');
      throw err;
    }
  };

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    removeExpense,
    refreshExpenses: loadExpenses,
  };
}
