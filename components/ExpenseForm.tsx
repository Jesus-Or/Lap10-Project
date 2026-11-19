'use client';

import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES } from '@/types/expense';
import { expenseFormSchema } from '@/lib/validations';
import { PlusCircle, Save, X } from 'lucide-react';

interface ExpenseFormProps {
  onSubmitExpense: (data: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  initialData?: Expense | null;
  onCancelEdit?: () => void;
}

export default function ExpenseForm({
  onSubmitExpense,
  initialData,
  onCancelEdit,
}: ExpenseFormProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('Alimentación');
  const [date, setDate] = useState<string>(todayStr);
  const [description, setDescription] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDate(initialData.date);
      setDescription(initialData.description || '');
    } else {
      setAmount('');
      setCategory('Alimentación');
      setDate(todayStr);
      setDescription('');
    }
  }, [initialData, todayStr]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage(null);

    const result = expenseFormSchema.safeParse({
      amount: amount === '' ? NaN : Number(amount),
      category,
      date,
      description,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        if (path) {
          fieldErrors[path] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmitExpense({
        amount: result.data.amount,
        category: result.data.category as ExpenseCategory,
        date: result.data.date,
        description: result.data.description,
      });

      setSuccessMessage(
        initialData ? '¡Gasto actualizado con éxito!' : '¡Gasto registrado con éxito!'
      );

      if (!initialData) {
        setAmount('');
        setDescription('');
        setDate(todayStr);
        setCategory('Alimentación');
      }

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setErrors({ form: 'Ocurrió un error al guardar el gasto.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          {initialData ? (
            <>
              <Save className="w-5 h-5 text-indigo-600" />
              Editar Gasto
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              Registrar Nuevo Gasto
            </>
          )}
        </h2>
        {initialData && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition"
          >
            <X className="w-3.5 h-3.5" /> Cancelar
          </button>
        )}
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl">
          {successMessage}
        </div>
      )}

      {errors.form && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Monto ($) *
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-3.5 py-2.5 text-slate-800 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition ${
                errors.amount
                  ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
                  : 'border-slate-200 focus:ring-indigo-500 focus:bg-white'
              }`}
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Categoría *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className={`w-full px-3.5 py-2.5 text-slate-800 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition ${
                errors.category
                  ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
                  : 'border-slate-200 focus:ring-indigo-500 focus:bg-white'
              }`}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.category}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Fecha *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-3.5 py-2.5 text-slate-800 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition ${
                errors.date
                  ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
                  : 'border-slate-200 focus:ring-indigo-500 focus:bg-white'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Descripción (opcional)
            </label>
            <input
              type="text"
              maxLength={120}
              placeholder="Ej. Compras en el mercado"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3.5 py-2.5 text-slate-800 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition ${
                errors.description
                  ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
                  : 'border-slate-200 focus:ring-indigo-500 focus:bg-white'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description ? (
                <p className="text-xs text-rose-600 font-medium">{errors.description}</p>
              ) : (
                <span />
              )}
              <span className="text-[10px] text-slate-400">{description.length}/120</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-sm shadow-indigo-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : initialData ? (
              <>
                <Save className="w-4 h-4" /> Actualizar Gasto
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" /> Registrar Gasto
              </>
            )}
          </button>
          {initialData && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}