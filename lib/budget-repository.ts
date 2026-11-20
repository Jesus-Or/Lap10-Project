import { supabase } from '@/lib/supabase';

export const DEFAULT_BUDGET = 1000;

export const budgetRepository = {
  /** Devuelve el presupuesto del usuario, o null si aún no lo ha configurado. */
  async get(): Promise<number | null> {
    const { data, error } = await supabase
      .from('budgets')
      .select('amount')
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? Number(data.amount) : null;
  },

  /** Crea o actualiza el presupuesto del usuario con sesión iniciada. */
  async save(amount: number): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('No hay sesión iniciada.');

    const { error } = await supabase
      .from('budgets')
      .upsert(
        { user_id: user.id, amount, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );
    if (error) throw new Error(error.message);
  },
};