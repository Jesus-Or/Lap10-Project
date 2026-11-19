'use client';

import React, { useState, useEffect } from 'react';
import { Expense } from '@/types/expense';
import { formatCurrency } from '@/lib/formatters';
import { Target, AlertTriangle, CheckCircle2, Settings2 } from 'lucide-react';

interface BudgetBarProps {
  expenses: Expense[];
  currentMonthFilter?: string; // YYYY-MM or ALL
}

const BUDGET_STORAGE_KEY = 'personal_expenses_budget_v1';
const DEFAULT_BUDGET = 1000;

export default function BudgetBar({ expenses, currentMonthFilter }: BudgetBarProps) {
  const now = new Date();
  const defaultYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const targetMonth =
    currentMonthFilter && currentMonthFilter !== 'ALL' ? currentMonthFilter : defaultYearMonth;

  const [budget, setBudget] = useState<number>(() => {
    if (typeof window === 'undefined') return DEFAULT_BUDGET;
    try {
      const saved = localStorage.getItem(BUDGET_STORAGE_KEY);
      return saved ? Number(saved) : DEFAULT_BUDGET;
    } catch {
      return DEFAULT_BUDGET;
    }
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempBudget, setTempBudget] = useState<string>(budget.toString());

  useEffect(() => {
    try {
      localStorage.setItem(BUDGET_STORAGE_KEY, budget.toString());
    } catch (e) {
      console.error(e);
    }
  }, [budget]);

  const monthExpenses = expenses.filter((exp) => exp.date.startsWith(targetMonth));
  const totalSpent = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const percentage = budget > 0 ? (totalSpent / budget) * 100 : 0;
  const clampedPercentage = Math.min(percentage, 100);
  const isOver100 = percentage >= 100;
  const isOver80 = percentage >= 80 && percentage < 100;

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(tempBudget);
    if (!isNaN(val) && val > 0) {
      setBudget(val);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Presupuesto Mensual ({targetMonth})
        </h2>

        {!isEditing ? (
          <button
            onClick={() => {
              setTempBudget(budget.toString());
              setIsEditing(true);
            }}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition"
          >
            <Settings2 className="w-3.5 h-3.5" /> Configurar Presupuesto
          </button>
        ) : (
          <form onSubmit={handleSaveBudget} className="flex items-center gap-2">
            <input
              type="number"
              step="1"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              className="w-28 px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              placeholder="Presupuesto"
              autoFocus
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1 rounded-lg transition"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
            >
              Cancelar
            </button>
          </form>
        )}
      </div>

      <div className="flex justify-between items-baseline mb-2">
        <div>
          <span className="text-2xl font-black text-slate-900">{formatCurrency(totalSpent)}</span>
          <span className="text-xs text-slate-400 ml-2">de {formatCurrency(budget)} presupuesto</span>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            isOver100
              ? 'bg-rose-100 text-rose-700'
              : isOver80
              ? 'bg-amber-100 text-amber-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {percentage.toFixed(1)}% utilizado
        </span>
      </div>

      <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isOver100 ? 'bg-rose-500' : isOver80 ? 'bg-amber-500' : 'bg-indigo-600'
          }`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>

      {isOver100 && (
        <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-700 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            <strong>¡Alerta de Presupuesto Superado!</strong> Has rebasado el 100% de tu presupuesto
            asignado para este mes.
          </span>
        </div>
      )}

      {isOver80 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-amber-700 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            <strong>¡Atención!</strong> Has superado el 80% de tu presupuesto mensual. Controla tus
            gastos próximos.
          </span>
        </div>
      )}

      {!isOver80 && !isOver100 && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-700 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            ¡Excelente control! Tus gastos se encuentran dentro del rango saludable de tu presupuesto.
          </span>
        </div>
      )}
    </div>
  );
}