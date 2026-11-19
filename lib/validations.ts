import { z } from 'zod';
import { EXPENSE_CATEGORIES } from '@/types/expense';

export const expenseFormSchema = z.object({
  amount: z
    .coerce
    .number({ invalid_type_error: 'El monto debe ser un número válido' })
    .positive('El monto debe ser mayor que 0'),
  category: z.enum(EXPENSE_CATEGORIES as [string, ...string[]], {
    errorMap: () => ({ message: 'Selecciona una categoría válida' }),
  }),
  date: z
    .string()
    .min(1, 'La fecha es obligatoria'),
  description: z
    .string()
    .max(120, 'La descripción no puede superar los 120 caracteres')
    .optional()
    .transform(val => val?.trim() || ''),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
