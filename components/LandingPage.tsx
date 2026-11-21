'use client'

import { useState } from 'react'
import { AuthForm } from './AuthForm'
import { WalletCards, ShieldCheck, PieChart, TrendingUp, Lock, ArrowRight } from 'lucide-react'

export function LandingPage() {
  const [showAuth, setShowAuth] = useState(false)
  const [initialIsSignUp, setInitialIsSignUp] = useState(false)

  if (showAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-6 left-6">
          <button
            onClick={() => setShowAuth(false)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-gray-300 bg-white dark:bg-gray-800 px-4 py-2.5 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700 transition"
          >
            ← Volver a la presentación
          </button>
        </div>

        <div className="flex justify-center w-full">
          <AuthForm />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-gray-100 flex flex-col justify-between">
      <header className="w-full border-b border-slate-200/80 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-none">
              <WalletCards className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Control de Gastos
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAuth(true)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition"
            >
              Acceder <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-28 lg:pb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 border border-indigo-100 dark:border-indigo-900">
            <ShieldCheck className="w-4 h-4" /> Sincronización en tiempo real con Supabase
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Toma el control absoluto de tus <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">finanzas personales</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
            Registra gastos, establece presupuestos mensuales, analiza categorías con gráficos interactivos y mantén tus datos seguros en la nube.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowAuth(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none transition"
            >
              Comenzar ahora gratis <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowAuth(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold text-slate-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 px-8 py-4 rounded-2xl border border-slate-200 dark:border-gray-700 transition"
            >
              Ya tengo una cuenta
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200/60 dark:border-gray-800/80">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Todo lo que necesitas para ahorrar más</h2>
            <p className="text-slate-600 dark:text-gray-400 mt-2">Herramientas potentes y fáciles de usar en cualquier dispositivo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-slate-100 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Gráficos por Categoría</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400">Visualiza exactamente en qué gastas tu dinero cada mes con gráficos circulares y barras detalladas.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-slate-100 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Presupuestos Inteligentes</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400">Establece límites de gasto mensuales y recibe indicadores visuales en tiempo real sobre tu progreso.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-slate-100 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Seguridad Garantizada</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400">Tus datos están cifrados y respaldados de forma segura con autenticación robusta mediante Supabase.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Control de Gastos. Todos los derechos reservados.
      </footer>
    </div>
  )
}
