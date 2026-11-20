-- ====================================================================
-- SCRIPT SQL PARA SUPABASE: Control de Gastos Personales
-- ====================================================================

-- 1. Crear la tabla 'expenses' (Gastos)
CREATE TABLE IF NOT EXISTS public.expenses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid DEFAULT auth.uid() NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount numeric NOT NULL CHECK (amount > 0),
    category text NOT NULL CHECK (category IN ('Alimentación', 'Transporte', 'Vivienda', 'Ocio', 'Salud', 'Otros')),
    date date NOT NULL,
    description text CHECK (char_length(description) <= 120),
    created_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Crear la tabla 'budgets' (Presupuesto mensual por usuario)
CREATE TABLE IF NOT EXISTS public.budgets (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    amount numeric NOT NULL CHECK (amount > 0),
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Crear índice en expenses por (user_id, date desc) para optimizar consultas y listados
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses (user_id, date DESC);

-- 4. Activar Row Level Security (RLS) en ambas tablas
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- 5. Políticas RLS para 'expenses'
-- Cada usuario solo puede ver sus propios gastos
CREATE POLICY "Users can view their own expenses"
    ON public.expenses
    FOR SELECT
    USING (auth.uid() = user_id);

-- Cada usuario solo puede insertar sus propios gastos
CREATE POLICY "Users can insert their own expenses"
    ON public.expenses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Cada usuario solo puede actualizar sus propios gastos
CREATE POLICY "Users can update their own expenses"
    ON public.expenses
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Cada usuario solo puede eliminar sus propios gastos
CREATE POLICY "Users can delete their own expenses"
    ON public.expenses
    FOR DELETE
    USING (auth.uid() = user_id);

-- 6. Políticas RLS para 'budgets'
-- Cada usuario solo puede ver su propio presupuesto
CREATE POLICY "Users can view their own budget"
    ON public.budgets
    FOR SELECT
    USING (auth.uid() = user_id);

-- Cada usuario solo puede insertar su propio presupuesto
CREATE POLICY "Users can insert their own budget"
    ON public.budgets
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Cada usuario solo puede actualizar su propio presupuesto
CREATE POLICY "Users can update their own budget"
    ON public.budgets
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Cada usuario solo puede eliminar su propio presupuesto
CREATE POLICY "Users can delete their own budget"
    ON public.budgets
    FOR DELETE
    USING (auth.uid() = user_id);
