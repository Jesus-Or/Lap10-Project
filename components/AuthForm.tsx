'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'

const schema = z.object({
  email: z.string().email('Correo electrónico inválido.'),
  password: z.string().min(6, 'Mínimo 6 caracteres.'),
})

type FormData = z.infer<typeof schema>

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email: data.email, password: data.password })
        if (error) {
          setErrorMsg(error.message.includes('already registered') ? 'Este correo ya está registrado.' : error.message)
        } else {
          setSuccessMsg('¡Cuenta creada con éxito! Inicia sesión.')
          reset()
          setIsSignUp(false)
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password })
        if (error) {
          setErrorMsg(error.message.includes('Invalid login credentials') ? 'Correo o contraseña incorrectos.' : error.message)
        }
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow border dark:border-gray-700">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {isSignUp ? 'Crear cuenta' : 'Iniciar Sesión'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isSignUp ? 'Regístrate para continuar' : 'Control de Gastos Personales'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-3 rounded text-sm border border-red-200">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 text-green-700 p-3 rounded text-sm border border-green-200">
            {successMsg}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo</label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm"
              placeholder="correo@ejemplo.com"
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
            <input
              type="password"
              {...register('password')}
              className="mt-1 w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white text-sm"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {loading ? 'Procesando...' : isSignUp ? 'Registrarse' : 'Iniciar Sesión'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(null); setSuccessMsg(null); reset(); }}
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
