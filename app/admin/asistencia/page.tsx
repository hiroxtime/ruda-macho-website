'use client'

import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import QRScanner from '@/components/QRScanner'

// Horarios de entrenamiento
const HORARIOS_ENTRENAMIENTO = {
  martes: { inicio: '20:30', fin: '22:30' },
  jueves: { inicio: '20:30', fin: '22:30' },
}

export default function AdminAsistencia() {
  const { user, perfil, loading } = useAuth()
  const router = useRouter()
  const [escaneando, setEscaneando] = useState(false)
  const [jugadorEncontrado, setJugadorEncontrado] = useState<any | null>(null)
  const [registrando, setRegistrando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [esAdmin, setEsAdmin] = useState(false)
  
  // Estado para registro rápido
  const [mostrarRegistroRapido, setMostrarRegistroRapido] = useState(false)
  const [nuevoJugador, setNuevoJugador] = useState({
    nombre: '',
    email: '',
    telefono: ''
  })
  const [guardandoNuevo, setGuardandoNuevo] = useState(false)

  // Verificar si es admin/moderador
  useEffect(() => {
    if (perfil?.rol && ['admin', 'moderador'].includes(perfil.rol)) {
      setEsAdmin(true)
    }
  }, [perfil])

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  // Verificar acceso de admin
  useEffect(() => {
    if (!loading && user && !esAdmin) {
      setMensaje('No tenés permisos de administrador.')
    }
  }, [loading, user, esAdmin])

  const handleScan = async (qrToken: string) => {
    setEscaneando(false)
    setMensaje('Buscando jugador...')
    
    try {
      // Buscar jugador por QR token
      const { data: jugador, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('qr_token', qrToken)
        .single()
      
      if (error || !jugador) {
        setMensaje('QR no válido o jugador no encontrado.')
        // Ofrecer registro rápido
        setMostrarRegistroRapido(true)
        return
      }
      
      setJugadorEncontrado(jugador)
      setMensaje('')
    } catch (err) {
      setMensaje('Error al buscar jugador.')
    }
  }

  const calcularEstadoLlegada = (): 'a tiempo' | 'tarde' => {
    const ahora = new Date()
    const horaActual = ahora.getHours() * 60 + ahora.getMinutes() // minutos desde medianoche
    const horaInicio = 20 * 60 + 30 // 20:30 = 1230 minutos
    
    // Si llega después de 20:45 (15 min de tolerancia), es tarde
    const horaLimite = horaInicio + 15
    
    return horaActual > horaLimite ? 'tarde' : 'a tiempo'
  }

  const registrarAsistencia = async (estado: 'a tiempo' | 'tarde') => {
    if (!jugadorEncontrado || !user) return
    
    setRegistrando(true)
    
    try {
      const { error } = await supabase
        .from('asistencias')
        .upsert({
          jugador_id: jugadorEncontrado.id,
          fecha: new Date().toISOString().split('T')[0],
          tipo: 'entrenamiento',
          estado_llegada: estado,
          registrado_por: user.id
        }, {
          onConflict: 'jugador_id,fecha,tipo'
        })
      
      if (error) throw error
      
      setMensaje(`✅ Asistencia registrada: ${jugadorEncontrado.nombre_completo} - ${estado.toUpperCase()}`)
      setJugadorEncontrado(null)
      
      // Resetear después de 3 segundos
      setTimeout(() => {
        setMensaje('')
        setEscaneando(true)
      }, 3000)
    } catch (err) {
      setMensaje('Error al registrar asistencia.')
    } finally {
      setRegistrando(false)
    }
  }

  const guardarRegistroRapido = async () => {
    if (!nuevoJugador.nombre.trim() || !user) return
    
    setGuardandoNuevo(true)
    
    try {
      const { data, error } = await supabase
        .from('registros_rapidos')
        .insert({
          nombre: nuevoJugador.nombre.trim(),
          email: nuevoJugador.email.trim() || null,
          telefono: nuevoJugador.telefono.trim() || null,
          registrado_por: user.id
        })
        .select()
      
      if (error) throw error
      
      // También registrar asistencia para este nuevo
      if (data && data[0]) {
        await supabase
          .from('asistencias')
          .insert({
            jugador_id: data[0].id,
            fecha: new Date().toISOString().split('T')[0],
            tipo: 'entrenamiento',
            estado_llegada: calcularEstadoLlegada(),
            registrado_por: user.id,
            notas: `Registro rápido - ${nuevoJugador.nombre}`
          })
      }
      
      setMensaje(`✅ ${nuevoJugador.nombre} registrado y asistencia marcada.`)
      setMostrarRegistroRapido(false)
      setNuevoJugador({ nombre: '', email: '', telefono: '' })
      
      setTimeout(() => {
        setMensaje('')
        setEscaneando(true)
      }, 3000)
    } catch (err) {
      setMensaje('Error al guardar registro.')
    } finally {
      setGuardandoNuevo(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ruda-black flex items-center justify-center">
        <div className="text-white">Cargando... 🏉</div>
      </div>
    )
  }

  if (!esAdmin) {
    return (
      <div className="min-h-screen bg-ruda-black py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-black text-white mb-4">Acceso Denegado</h1>
          <p className="text-gray-400 mb-8">{mensaje || 'Necesitás permisos de administrador para acceder a esta página.'}</p>
          <Link href="/perfil" className="text-ruda-gold hover:underline">
            Volver al perfil →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ruda-black">
      {/* Header */}
      <div className="bg-ruda-green py-6 px-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/perfil" className="text-white font-bold">
            ← Volver
          </Link>
          <h1 className="text-xl font-black text-white">Control de Asistencia</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        {/* Info del día */}
        <div className="bg-white/10 rounded-xl p-4 mb-6 text-center">
          <p className="text-ruda-gold font-bold">{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <p className="text-white text-sm">Entrenamiento: 20:30 - 22:30</p>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div className={`rounded-xl p-4 mb-6 text-center font-bold ${
            mensaje.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {mensaje}
          </div>
        )}

        {/* Scanner o Resultado */}
        {!jugadorEncontrado && !mostrarRegistroRapido && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-ruda-black font-black text-xl mb-4 text-center">
              Escaneá el QR del jugador
            </h2>
            
            {escaneando ? (
              <QRScanner onScan={handleScan} />
            ) : (
              <button
                onClick={() => setEscaneando(true)}
                className="w-full bg-ruda-green text-white font-bold py-4 rounded-xl hover:bg-ruda-dark-green transition-colors"
              >
                📷 Iniciar Escáner
              </button>
            )}
            
            <p className="text-gray-500 text-sm text-center mt-4">
              Los jugadores deben mostrar su QR desde su perfil
            </p>
          </div>
        )}

        {/* Jugador encontrado - Confirmar asistencia */}
        {jugadorEncontrado && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-ruda-green flex items-center justify-center text-4xl mb-4">
                {jugadorEncontrado.avatar_url ? (
                  <img src={jugadorEncontrado.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  '🏉'
                )}
              </div>
              <h2 className="text-ruda-black font-black text-2xl">{jugadorEncontrado.nombre_completo}</h2>
              <p className="text-gray-500">{jugadorEncontrado.posicion_preferida || 'Sin posición'}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => registrarAsistencia('a tiempo')}
                disabled={registrando}
                className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {registrando ? 'Registrando...' : '✅ Llegó a Tiempo'}
              </button>
              
              <button
                onClick={() => registrarAsistencia('tarde')}
                disabled={registrando}
                className="w-full bg-yellow-500 text-white font-bold py-4 rounded-xl hover:bg-yellow-600 transition-colors disabled:opacity-50"
              >
                {registrando ? 'Registrando...' : '⏰ Llegó Tarde'}
              </button>
              
              <button
                onClick={() => {
                  setJugadorEncontrado(null)
                  setEscaneando(true)
                }}
                disabled={registrando}
                className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Registro rápido */}
        {mostrarRegistroRapido && (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">👤</div>
              <h2 className="text-ruda-black font-black text-xl">Registro Rápido</h2>
              <p className="text-gray-500 text-sm">El jugador no tiene cuenta. Registralo para marcar su asistencia.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre completo *</label>
                <input
                  type="text"
                  value={nuevoJugador.nombre}
                  onChange={(e) => setNuevoJugador({...nuevoJugador, nombre: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-ruda-green"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={nuevoJugador.email}
                  onChange={(e) => setNuevoJugador({...nuevoJugador, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-ruda-green"
                  placeholder="juan@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={nuevoJugador.telefono}
                  onChange={(e) => setNuevoJugador({...nuevoJugador, telefono: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-ruda-green"
                  placeholder="+54 11 1234 5678"
                />
              </div>

              <div className="pt-4 space-y-3">
                <button
                  onClick={guardarRegistroRapido}
                  disabled={guardandoNuevo || !nuevoJugador.nombre.trim()}
                  className="w-full bg-ruda-green text-white font-bold py-4 rounded-xl hover:bg-ruda-dark-green transition-colors disabled:opacity-50"
                >
                  {guardandoNuevo ? 'Guardando...' : '💾 Guardar y Registrar Asistencia'}
                </button>
                
                <button
                  onClick={() => {
                    setMostrarRegistroRapido(false)
                    setEscaneando(true)
                  }}
                  className="w-full bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Volver al escáner
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
