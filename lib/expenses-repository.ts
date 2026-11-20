import { Expense, ExpenseCategory } from '@/types/expense';
import { supabase } from '@/lib/supabase';

export const expensesRepository = {
  list: async (): Promise<Expense[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('expenses')
      .select('id, amount, category, date, description, created_at')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching expenses from Supabase:', error);
      throw new Error(error.message);
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      amount: Number(item.amount),
      category: item.category as ExpenseCategory,
      date: item.date,
      description: item.description || '',
      createdAt: item.created_at,
    }));
  },

  create: async (expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        amount: expenseData.amount,
        category: expenseData.category,
        date: expenseData.date,
        description: expenseData.description,
      })
      .select('id, amount, category, date, description, created_at')
      .single();

    if (error) {
      console.error('Error creating expense in Supabase:', error);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      amount: Number(data.amount),
      category: data.category as ExpenseCategory,
      date: data.date,
      description: data.description || '',
      createdAt: data.created_at,
    };
  },

  update: async (id: string, expenseData: Partial<Omit<Expense, 'id' | 'createdAt'>>): Promise<Expense> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const updatePayload: any = {};
    if (expenseData.amount !== undefined) updatePayload.amount = expenseData.amount;
    if (expenseData.category !== undefined) updatePayload.category = expenseData.category;
    if (expenseData.date !== undefined) updatePayload.date = expenseData.date;
    if (expenseData.description !== undefined) updatePayload.description = expenseData.description;

    const { data, error } = await supabase
      .from('expenses')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, amount, category, date, description, created_at')
      .single();

    if (error) {
      console.error('Error updating expense in Supabase:', error);
      throw new Error(error.message);
    }

    return {
      id: data.id,
      amount: Number(data.amount),
      category: data.category as ExpenseCategory,
      date: data.date,
      description: data.description || '',
      createdAt: data.created_at,
    };
  },

  remove: async (id: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing expense from Supabase:', error);
      throw new Error(error.message);
    }
  },
};
