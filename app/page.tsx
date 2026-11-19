'use client';

import React, { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { Expense, ExpenseFilters } from '@/types/expense';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import SummaryCards from '@/components/SummaryCards';
import CategoryChart from '@/components/CategoryChart';
import BudgetBar from '@/components/BudgetBar';
import { WalletCards, ShieldCheck, RefreshCw } from 'lucide-react';

export default function Home() {
  const { expenses, loading, error, addExpense, updateExpense, removeExpense, refreshExpenses } = useExpenses();
  
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filters, setFilters] = useState<ExpenseFilters>({
    month: 'ALL',
    category: 'ALL',
    search: '',
  });

  const handleFormSubmit = async (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, data);
      setEditingExpense(null);
    } else {
      await addExpense(data);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    // Scroll smoothly to top form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <WalletCards className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">Control de Gastos</h1>
              <p className="text-[11px] text-slate-400">MVP Next.js + Tailwind CSS</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 font-medium">
              <ShieldCheck className="w-4 h-4" /> Almacenamiento Local Seguro
            </div>
            <button
              onClick={refreshExpenses}
              title="Actualizar datos"
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={refreshExpenses} className="underline text-xs font-semibold">Reintentar</button>
          </div>
        )}

        {loading && expenses.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-500 font-medium">Cargando tus registros...</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <SummaryCards expenses={expenses} currentMonthFilter={filters.month} />

            {/* Budget & Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BudgetBar expenses={expenses} currentMonthFilter={filters.month} />
              <CategoryChart expenses={expenses} currentMonthFilter={filters.month} />
            </div>

            {/* Form & List Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <ExpenseForm
                    onSubmitExpense={handleFormSubmit}
                    initialData={editingExpense}
                    onCancelEdit={handleCancelEdit}
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <ExpenseList
                  expenses={expenses}
                  onEdit={handleEdit}
                  onDelete={removeExpense}
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
