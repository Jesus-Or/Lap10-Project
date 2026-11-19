import React from 'react';
import { Expense } from '@/types/expense';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Pencil, Trash2 } from 'lucide-react';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseItem({
  expense,
  onEdit,
  onDelete,
}: ExpenseItemProps) {
  const handleDeleteClick = () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el gasto "${expense.description || expense.category}" por ${formatCurrency(expense.amount)}?`)) {
      onDelete(expense.id);
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Alimentación':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Transporte':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Vivienda':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Ocio':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Salud':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/80 border border-slate-100 rounded-2xl transition shadow-sm group">
      <div className="flex items-start gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-700 font-bold text-sm">
          {expense.category.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(expense.category)}`}>
              {expense.category}
            </span>
            <span className="text-xs text-slate-400">
              {formatDate(expense.date)}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-800 mt-1 truncate">
            {expense.description || <span className="text-slate-400 italic">Sin descripción</span>}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0 pl-3">
        <span className="text-base font-bold text-slate-900">
          {formatCurrency(expense.amount)}
        </span>
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(expense)}
            title="Editar gasto"
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteClick}
            title="Eliminar gasto"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
