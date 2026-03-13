'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Registro() {
  const { signUp, signInWithGoogle } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre_completo: '',
    tipo_jugador: 'activo',
    posicion_preferida: '',
    fecha_inicio_ruda: '',
    telefono: '',
    fecha_nacimiento: '',
    numero_camiseta: '',
  })
  
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    const { error } = await signUp(
      formData.email,
      formData.password,
      {
        nombre_completo: formData.nombre_completo,
        tipo_jugador: formData.tipo_jugador as 'activo' | 'asociado',
        posicion_preferida: formData.posicion_preferida,
        fecha_inicio_ruda: formData.fecha_inicio_ruda,
        telefono: formData.telefono,
        fecha_nacimiento: formData.fecha_nacimiento,
        numero_camiseta: formData.numero_camiseta ? parseInt(formData.numero_camiseta) : undefined,
      }
    )

    if (error) {
      setError(error.message || 'Error al registrar')
    } else {
      setSuccess(true)
    }
    
    setLoading(false)
  }

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    setError('')

    try {
      const { error } = await signInWithGoogle()

      if (error) {
        console.error('Error de registro con Google:', error)
        setError(error.message || 'Error al registrarse con Google')
      }
      // No necesitamos setSuccess aquí porque el redirect de OAuth maneja la redirección
    } catch (err: any) {
      console.error('Error inesperado:', err)
      setError('Error al intentar registrarse con Google: ' + (err?.message || String(err)))
    }

    setGoogleLoading(false)
  }

  const posiciones = [
    'Pilar (1)',
    'Hooker (2)',
    'Pilar (3)',
    'Segunda Línea (4)',
    'Segunda Línea (5)',
    'Ala (6)',
    'Número 8 (8)',
    'Ala (7)',
    'Medio Scrum (9)',
    'Apertura (10)',
    'Centro (12)',
    'Centro (13)',
    'Wing (11)',
    'Wing (14)',
    'Full Back (15)',
    'A definir',
  ]

  if (success) {
    return (
      <div className="min-h-screen bg-ruda-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">🏉</div>
          <h2 className="text-2xl font-black text-ruda-green mb-4">¡Bienvenido a Ruda! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Tu cuenta ha sido creada. Revisá tu email para confirmar el registro.
          </p>
          <Link 
            href="/"
            className="inline-block bg-ruda-green text-white font-bold py-3 px-8 rounded-full hover:bg-ruda-dark-green transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ruda-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <img 
              src="/assets/Logo%20Ruda%20Macho.png" 
              alt="Ruda Macho" 
              className="h-20 mx-auto mb-4"
            />
          </Link>
          <h1 className="text-3xl font-black text-white">REGISTRATE EN RUDA 🏉</h1>
          <p className="text-ruda-gold mt-2">Formá parte de nuestra familia rugbier</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div className="col-span-2">
              <label className="block text-ruda-black font-bold mb-2">Nombre Completo *</label>
              <input
                type="text"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-ruda-green"
                placeholder="Tu nombre y apellido"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-ruda-black font-bold mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-ruda-green"
                placeholder="tu@email.com"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-ruda-black font-bold mb-2">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-ruda-green"
                placeholder="+54 9 11 1234-5678"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-ruda-black font-bold mb-2">Contraseña *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-ruda-green"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-ruda-black font-bold mb-2">Confirmar Contraseña *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-ruda-green"
                placeholder="Repetí la contraseña"
              />
            </div>

            {/* Tipo de Jugador */}
            <div className="col-span-2">
              <label className="block text-ruda-black font-bold mb-2">Tipo de Miembro *</label>
              <div className="grid md:grid-cols-2 gap-4">
                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.tipo_jugador === 'activo' ? 'border-ruda-green bg-ruda-green/10' : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="tipo_jugador"
                    value="activo"
                    checked={formData.tipo_jugador === 'activo'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="text-center w-full">
                    <div className="text-3xl mb-2">🏃</div>
                    <div className="font-bold text-ruda-black">Jugador Activo</div>
                    <div className="text-sm text-gray-600">Pago cuota completa, entreno y juego</div>
                  </div>
                </label>

                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.tipo_jugador === 'asociado' ? 'border-ruda-gold bg-ruda-gold/10' : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="tipo_jugador"
                    value="asociado"
                    checked={formData.tipo_jugador === 'asociado'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="text-center w-full">
                    <div className="text-3xl mb-2">🤝</div>
                    <div className="font-bold text-ruda-black">Miembro Asociado</div>
                    <div className="text-sm text-gray-600">Pago mitad, apoyo al club, no juego</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Posición */}
            <div>
              <label className="block text-ruda-black font-bold mb-2">Posición Preferida</label>
              <select
                name="posicion_preferida"
                value={formData.posicion_preferida}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-ruda-green"
              >
                <option value="">Seleccioná tu posición</option>
                {posiciones.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            {/* Número de camiseta */}
            <div>
              <label className="block text-ruda-black font-bold mb-2">N° Camiseta</label>
              <input
                type="number"
                name="numero_camiseta"
                value={formData.numero_camiseta}
                onChange={handleChange}
                min="1"
                max="99"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-ruda-green"
                placeholder="Ej: 10"
              />
            </div>

            {/* Fecha inicio */}
            <div>
              <label className="block text-ruda-black font-bold mb-2">¿Cuándo empezaste en Ruda? *</label>
              <input
                type="date"
                name="fecha_inicio_ruda"
                value={formData.fecha_inicio_ruda}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-ruda-green"
              />
            </div>

            {/* Fecha nacimiento */}
            <div>
              <label className="block text-ruda-black font-bold mb-2">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-ruda-green"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-ruda-green text-white font-bold py-4 rounded-full hover:bg-ruda-dark-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : '¡SUMARME A RUDA!'}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O registrate con</span>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? 'Conectando...' : 'Continuar con Google'}
          </button>

          <p className="text-center mt-4 text-gray-600">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-ruda-green font-bold hover:underline">
              Ingresá acá
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
