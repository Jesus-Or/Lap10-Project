import React from 'react';
import { Expense, EXPENSE_CATEGORIES } from '@/types/expense';
import { formatCurrency } from '@/lib/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface CategoryChartProps {
  expenses: Expense[];
  currentMonthFilter?: string; // YYYY-MM or ALL
}

const CATEGORY_COLORS: Record<string, string> = {
  'Alimentación': '#f59e0b', // amber
  'Transporte': '#3b82f6',  // blue
  'Vivienda': '#8b5cf6',    // purple
  'Ocio': '#ec4899',        // pink
  'Salud': '#10b981',       // emerald
  'Otros': '#64748b',       // slate
};

export default function CategoryChart({
  expenses,
  currentMonthFilter,
}: CategoryChartProps) {
  const now = new Date();
  const defaultYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const targetMonth = currentMonthFilter && currentMonthFilter !== 'ALL' ? currentMonthFilter : defaultYearMonth;

  const monthExpenses = expenses.filter((exp) => exp.date.startsWith(targetMonth));

  const chartData = EXPENSE_CATEGORIES.map((cat) => {
    const total = monthExpenses
      .filter((exp) => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      category: cat,
      amount: total,
    };
  }).filter((item) => item.amount > 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-indigo-600" />
          Gastos por Categoría
        </h2>
        <span className="text-xs text-slate-400">{targetMonth}</span>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400">
          <p className="text-sm">No hay datos suficientes para graficar en este periodo.</p>
        </div>
      ) : (
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 11, fill: '#64748b' }}
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                formatter={(value: any) => [formatCurrency(Number(value)), 'Gastado']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.category}`} fill={CATEGORY_COLORS[entry.category] || '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
