'use client';

import React, { useState } from 'react';
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES, ExpenseFilters } from '@/types/expense';
import ExpenseItem from './ExpenseItem';
import { Search, Download, FolderOpen } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  filters: ExpenseFilters;
  onFilterChange: (filters: ExpenseFilters) => void;
}

export default function ExpenseList({
  expenses,
  onEdit,
  onDelete,
  filters,
  onFilterChange,
}: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const availableMonths = Array.from(
    new Set(expenses.map((exp) => exp.date.substring(0, 7)))
  )
    .sort()
    .reverse();

  const filteredExpenses = expenses.filter((exp) => {
    if (filters.month && filters.month !== 'ALL') {
      if (!exp.date.startsWith(filters.month)) return false;
    }
    if (filters.category && filters.category !== 'ALL') {
      if (exp.category !== filters.category) return false;
    }
    if (filters.search && filters.search.trim() !== '') {
      const query = filters.search.toLowerCase();
      const desc = (exp.description || '').toLowerCase();
      const cat = exp.category.toLowerCase();
      const amt = exp.amount.toString();
      if (!desc.includes(query) && !cat.includes(query) && !amt.includes(query)) {
        return false;
      }
    }
    return true;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onFilterChange({ ...filters, search: val });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, month: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, category: e.target.value as ExpenseCategory | 'ALL' });
  };

  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) return;

    const headers = ['ID', 'Fecha', 'Monto', 'Categoría', 'Descripción', 'Creado'];
    const rows = filteredExpenses.map((exp) => [
      exp.id,
      exp.date,
      exp.amount.toFixed(2),
      `"${exp.category}"`,
      `"${(exp.description || '').replace(/"/g, '""')}"`,
      exp.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `gastos_personales_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Historial de Gastos</h2>
          <p className="text-xs text-slate-500">
            Mostrando {filteredExpenses.length} de {expenses.length} registros
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredExpenses.length === 0}
          className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition disabled:opacity-40"
        >
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por descripción..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition text-slate-800"
          />
        </div>

        <div className="relative">
          <select
            value={filters.month || 'ALL'}
            onChange={handleMonthChange}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition text-slate-800"
          >
            <option value="ALL">Todos los meses</option>
            {availableMonths.map((m) => {
              const [y, mm] = m.split('-');
              const dateObj = new Date(Number(y), Number(mm) - 1, 1);
              const formattedMonthName = new Intl.DateTimeFormat('es-ES', {
                month: 'long',
                year: 'numeric',
              }).format(dateObj);
              return (
                <option key={m} value={m}>
                  {formattedMonthName.charAt(0).toUpperCase() + formattedMonthName.slice(1)}
                </option>
              );
            })}
          </select>
        </div>

        <div className="relative">
          <select
            value={filters.category || 'ALL'}
            onChange={handleCategoryChange}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition text-slate-800"
          >
            <option value="ALL">Todas las categorías</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-100 rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">No se encontraron gastos</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {expenses.length === 0
              ? 'Aún no has registrado ningún gasto. Utiliza el formulario superior para comenzar.'
              : 'Prueba cambiando los filtros de búsqueda o categoría.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}