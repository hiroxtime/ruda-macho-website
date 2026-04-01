'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message || 'Email o contraseña incorrectos')
    } else {
      window.location.href = '/perfil'
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-ruda-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <img 
              src="/assets/Logo%20Ruda%20Macho.png" 
              alt="Ruda Macho" 
              className="h-24 mx-auto mb-4"
            />
          </Link>
          <h1 className="text-3xl font-black text-white">INGRESAR 🏉</h1>
          <p className="text-ruda-gold mt-2">Accedé a tu cuenta de Ruda</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-gray-900 font-bold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-ruda-green text-gray-900 bg-white"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-900 font-bold mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-ruda-green text-gray-900 bg-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ruda-green text-white font-bold py-4 rounded-full hover:bg-ruda-dark-green transition-colors disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : '¡ENTRAR!'}
            </button>
          </div>

          <p className="text-center mt-6 text-gray-600">
            ¿No tenés cuenta?{' '}
            <Link href="/registro" className="text-ruda-green font-bold hover:underline">
              Registrate acá
            </Link>
          </p>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link href="/" className="text-gray-500 hover:text-ruda-green">
              ← Volver al inicio
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}