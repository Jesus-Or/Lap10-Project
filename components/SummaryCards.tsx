import React from 'react';
import { Expense } from '@/types/expense';
import { formatCurrency } from '@/lib/formatters';
import { Wallet, TrendingUp, Award, ArrowUpRight } from 'lucide-react';

interface SummaryCardsProps {
  expenses: Expense[];
  currentMonthFilter?: string; // YYYY-MM or undefined/ALL
}

export default function SummaryCards({
  expenses,
  currentMonthFilter,
}: SummaryCardsProps) {
  // Determine target month (default to current month if not specified or ALL)
  const now = new Date();
  const defaultYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const targetMonth = currentMonthFilter && currentMonthFilter !== 'ALL' ? currentMonthFilter : defaultYearMonth;

  // Filter expenses for the target month
  const monthExpenses = expenses.filter((exp) => exp.date.startsWith(targetMonth));

  // 1. Total spent this month
  const totalSpent = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // 2. Daily average for the month
  // If target month is current month, calculate up to today. Otherwise, calculate total days in that month.
  let daysCount = 30;
  const [yearNum, monthNum] = targetMonth.split('-').map(Number);
  if (yearNum && monthNum) {
    const isCurrentMonth = now.getFullYear() === yearNum && (now.getMonth() + 1) === monthNum;
    if (isCurrentMonth) {
      daysCount = Math.max(1, now.getDate());
    } else {
      daysCount = new Date(yearNum, monthNum, 0).getDate(); // last day of month
    }
  }
  const dailyAverage = totalSpent / daysCount;

  // 3. Category with highest spending
  const categoryTotals: Record<string, number> = {};
  monthExpenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  let topCategory = 'N/A';
  let topCategoryAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, amt]) => {
    if (amt > topCategoryAmount) {
      topCategoryAmount = amt;
      topCategory = cat;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Gastado del Mes */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Gastado ({targetMonth})
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {formatCurrency(totalSpent)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-indigo-500" /> {monthExpenses.length} transacciones este mes
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Wallet className="w-6 h-6" />
        </div>
      </div>

      {/* Promedio Diario */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Promedio Diario
          </p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {formatCurrency(dailyAverage)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Calculado en {daysCount} días del periodo
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      {/* Categoría con Mayor Gasto */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Mayor Gasto
          </p>
          <h3 className="text-xl font-black text-slate-900 mt-1 truncate max-w-[180px]">
            {topCategory}
          </h3>
          <p className="text-xs font-semibold text-indigo-600 mt-1">
            {formatCurrency(topCategoryAmount)}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Award className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
