'use client'

import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function RegistroRapido() {
  const { user, perfil, refreshPerfil } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [paso, setPaso] = useState<'formulario' | 'exito'>('formulario')
  const [registrando, setRegistrando] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
  })

  useEffect(() => {
    if (user && perfil && token) {
      registrarAsistenciaExistente()
    }
  }, [user, perfil, token])

  const registrarAsistenciaExistente = async () => {
    if (!user || !token) return
    setRegistrando(true)
    
    try {
      const hoy = new Date().toISOString().split('T')[0]
      const horaActual = new Date().getHours() * 60 + new Date().getMinutes()
      const horaLimite = 20 * 60 + 45 // 20:45
      const estadoPrevio = horaActual > horaLimite ? 'voy_tarde' : 'voy'

      await supabase.from('asistencias').upsert({
        jugador_id: user.id,
        fecha: hoy,
        tipo: 'entrenamiento',
        estado_previo: estadoPrevio,
        estado_post: 'por_verificar',
      }, { onConflict: 'jugador_id,fecha,tipo' })

      setPaso('exito')
    } catch (err) {
      setError('Error al registrar asistencia.')
    } finally {
      setRegistrando(false)
    }
  }

  const handleRegistroManual = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nombre.trim()) return
    
    setRegistrando(true)
    setError('')
    
    try {
      await supabase.from('registros_rapidos').insert({
        nombre: formData.nombre.trim(),
        email: formData.email.trim() || null,
        telefono: formData.telefono.trim() || null,
      })
      
      setPaso('exito')
    } catch (err) {
      setError('Error al registrar. Intentá de nuevo.')
    } finally {
      setRegistrando(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-ruda-black flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-black text-white mb-4">Token Inválido</h1>
          <p className="text-gray-400 mb-8">
            Este link de registro no es válido. Pedile a un administrador que te muestre el QR del día.
          </p>
          <Link href="/" className="text-ruda-gold hover:underline">← Volver al inicio</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ruda-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-ruda-green flex items-center justify-center text-4xl">
            🏉
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Ruda Macho Rugby</h1>
          <p className="text-ruda-gold">Registro de Asistencia</p>
        </div>

        {paso === 'formulario' && (
          <>
            {/* Usuario ya loggeado */}
            {user && perfil ? (
              <div className="bg-white/10 rounded-2xl p-6 text-center">
                <p className="text-white mb-2">
                  Hola, <strong>{perfil.nombre_completo || 'Jugador'}</strong>
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  ¿Confirmás tu asistencia para hoy?
                </p>
                
                {error && (
                  <p className="text-red-400 text-sm mb-4">{error}</p>
                )}
                
                <button
                  onClick={registrarAsistenciaExistente}
                  disabled={registrando}
                  className="w-full py-4 bg-ruda-green text-white font-bold rounded-xl hover:bg-ruda-dark-green transition-colors disabled:opacity-50"
                >
                  {registrando ? 'Registrando...' : '✅ Confirmar Asistencia'}
                </button>
                
                <p className="text-gray-500 text-xs mt-4">
                  {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  <br />
                  Entrenamiento: 20:30 - 22:30
                </p>
              </div>
            ) : (
              /* Usuario no loggeado */
              <div className="bg-white/10 rounded-2xl p-6">
                <p className="text-gray-400 text-center mb-6">
                  No estás loggeado. Podés registrarte rápido o iniciar sesión.
                </p>
                
                {error && (
                  <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
                )}
                
                <form onSubmit={handleRegistroManual} className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-bold mb-1 block">Nombre *</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Tu nombre completo"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-ruda-gold"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-white text-sm font-bold mb-1 block">Email (opcional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="tu@email.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-ruda-gold"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white text-sm font-bold mb-1 block">Teléfono (opcional)</label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      placeholder="+54 11 1234-5678"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-ruda-gold"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={registrando || !formData.nombre.trim()}
                    className="w-full py-4 bg-ruda-green text-white font-bold rounded-xl hover:bg-ruda-dark-green transition-colors disabled:opacity-50"
                  >
                    {registrando ? 'Registrando...' : 'Registrar Asistencia'}
                  </button>
                </form>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-gray-400 text-center text-sm mb-4">
                    ¿Ya tenés cuenta?
                  </p>
                  <Link
                    href="/login"
                    className="block w-full py-3 bg-white/10 text-white font-bold rounded-xl text-center hover:bg-white/20 transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              </div>
            )}
          </>
        )}

        {paso === 'exito' && (
          <div className="bg-white/10 rounded-2xl p-6 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-black text-white mb-2">¡Listo!</h2>
            <p className="text-gray-400 mb-6">
              Tu asistencia fue registrada correctamente.
            </p>
            <p className="text-ruda-gold font-bold">
              🏉 Nos vemos en el entrenamiento
            </p>
            
            {user ? (
              <Link
                href="/perfil"
                className="block w-full mt-6 py-3 bg-ruda-green text-white font-bold rounded-xl text-center hover:bg-ruda-dark-green transition-colors"
              >
                Ver mi perfil
              </Link>
            ) : (
              <p className="text-gray-500 text-sm mt-6">
                Si querés ver tu historial de asistencias, creá una cuenta.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}