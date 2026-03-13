'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Tipos
interface Player {
  id: string
  nombre_completo: string
  posicion_preferida?: string
  avatar_url?: string
}

interface ProfileData {
  telefono: string
  fecha_nacimiento: string
  numero_camiseta: string
  posicion_preferida: string
  tipo_jugador: 'activo' | 'asociado'
  es_madrina: boolean
  ahijados_seleccionados: string[]
}

export default function CompletarPerfil() {
  const { user, perfil, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [jugadores, setJugadores] = useState<Player[]>([])
  const [jugadoresFiltrados, setJugadoresFiltrados] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  
  const [profileData, setProfileData] = useState<ProfileData>({
    telefono: '',
    fecha_nacimiento: '',
    numero_camiseta: '',
    posicion_preferida: '',
    tipo_jugador: 'activo',
    es_madrina: false,
    ahijados_seleccionados: [],
  })

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  // Cargar datos del perfil si existen
  useEffect(() => {
    if (perfil) {
      setProfileData(prev => ({
        ...prev,
        telefono: perfil.telefono || '',
        fecha_nacimiento: perfil.fecha_nacimiento || '',
        numero_camiseta: perfil.numero_camiseta?.toString() || '',
        posicion_preferida: perfil.posicion_preferida || '',
        tipo_jugador: perfil.tipo_jugador || 'activo',
        es_madrina: perfil.es_madrina || false,
      }))
    }
  }, [perfil])

  // Cargar jugadores para selección de ahijados
  useEffect(() => {
    const fetchJugadores = async () => {
      const { data } = await supabase
        .from('perfiles')
        .select('id, nombre_completo, posicion_preferida, avatar_url')
        .neq('id', user?.id || '')
        .order('nombre_completo')
      
      if (data) {
        setJugadores(data)
        setJugadoresFiltrados(data)
      }
    }
    
    if (user) {
      fetchJugadores()
    }
  }, [user])

  // Filtrar jugadores
  useEffect(() => {
    const filtered = jugadores.filter(j => 
      j.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setJugadoresFiltrados(filtered)
  }, [searchTerm, jugadores])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const toggleAhijado = (playerId: string) => {
    setProfileData(prev => ({
      ...prev,
      ahijados_seleccionados: prev.ahijados_seleccionados.includes(playerId)
        ? prev.ahijados_seleccionados.filter(id => id !== playerId)
        : [...prev.ahijados_seleccionados, playerId]
    }))
  }

  const handleSubmit = async () => {
    if (!user) return
    
    setLoading(true)
    setError('')

    try {
      // Actualizar perfil
      const { error: updateError } = await supabase
        .from('perfiles')
        .update({
          telefono: profileData.telefono,
          fecha_nacimiento: profileData.fecha_nacimiento,
          numero_camiseta: profileData.numero_camiseta ? parseInt(profileData.numero_camiseta) : null,
          posicion_preferida: profileData.posicion_preferida,
          tipo_jugador: profileData.tipo_jugador,
          es_madrina: profileData.es_madrina,
          perfil_completo: true,
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Si es madrina, crear relaciones
      if (profileData.es_madrina && profileData.ahijados_seleccionados.length > 0) {
        const relaciones = profileData.ahijados_seleccionados.map(ahijadoId => ({
          madrina_id: user.id,
          ahijado_id: ahijadoId,
        }))

        const { error: relError } = await supabase
          .from('madrinas_ahijados')
          .upsert(relaciones, { onConflict: 'madrina_id,ahijado_id' })

        if (relError) throw relError
      }

      // Redirigir al perfil
      router.push('/perfil')
    } catch (err: any) {
      setError(err.message || 'Error al guardar el perfil')
    }

    setLoading(false)
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

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  // Renderizar barra de progreso
  const ProgressBar = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div
          key={s}
          className={`h-2 rounded-full transition-all duration-300 ${
            s === step ? 'w-8 bg-ruda-gold' : 
            s < step ? 'w-6 bg-ruda-green' : 'w-6 bg-gray-600'
          }`}
        />
      ))}
    </div>
  )

  // Paso 1: Información básica
  const Step1BasicInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">📱</div>
        <h2 className="text-2xl font-black text-white mb-2">Tus Datos de Contacto</h2>
        <p className="text-gray-400">Completá tu información para que el equipo pueda contactarte</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-ruda-gold font-bold mb-2">Teléfono *</label>
          <input
            type="tel"
            name="telefono"
            value={profileData.telefono}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-ruda-gold"
            placeholder="+54 9 11 1234-5678"
          />
        </div>

        <div>
          <label className="block text-ruda-gold font-bold mb-2">Fecha de Nacimiento *</label>
          <input
            type="date"
            name="fecha_nacimiento"
            value={profileData.fecha_nacimiento}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-ruda-gold"
          />
        </div>
      </div>
    </div>
  )

  // Paso 2: Datos de juego
  const Step2GameInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🏉</div>
        <h2 className="text-2xl font-black text-white mb-2">Tus Datos en la Cancha</h2>
        <p className="text-gray-400">Contanos sobre tu posición y número de camiseta</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-ruda-gold font-bold mb-2">Posición Preferida</label>
          <select
            name="posicion_preferida"
            value={profileData.posicion_preferida}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-ruda-gold"
          >
            <option value="" className="bg-ruda-black">Seleccioná tu posición</option>
            {posiciones.map(pos => (
              <option key={pos} value={pos} className="bg-ruda-black">{pos}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-ruda-gold font-bold mb-2">Número de Camiseta</label>
          <input
            type="number"
            name="numero_camiseta"
            value={profileData.numero_camiseta}
            onChange={handleChange}
            min="1"
            max="99"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-ruda-gold"
            placeholder="Ej: 10"
          />
        </div>

        <div>
          <label className="block text-ruda-gold font-bold mb-4">Tipo de Miembro</label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              profileData.tipo_jugador === 'activo' 
                ? 'border-ruda-green bg-ruda-green/20' 
                : 'border-white/20 bg-white/5'
            }`}>
              <input
                type="radio"
                name="tipo_jugador"
                value="activo"
                checked={profileData.tipo_jugador === 'activo'}
                onChange={handleChange}
                className="hidden"
              />
              <div className="text-center">
                <div className="text-3xl mb-2">🏃</div>
                <div className="text-white font-bold">Activo</div>
              </div>
            </label>

            <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              profileData.tipo_jugador === 'asociado' 
                ? 'border-ruda-gold bg-ruda-gold/20' 
                : 'border-white/20 bg-white/5'
            }`}>
              <input
                type="radio"
                name="tipo_jugador"
                value="asociado"
                checked={profileData.tipo_jugador === 'asociado'}
                onChange={handleChange}
                className="hidden"
              />
              <div className="text-center">
                <div className="text-3xl mb-2">🤝</div>
                <div className="text-white font-bold">Asociado</div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  // Paso 3: Sistema Madrina
  const Step3Madrina = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">👑</div>
        <h2 className="text-2xl font-black text-white mb-2">Sistema de Madrinas/Padrinos</h2>
        <p className="text-gray-400">¿Querés ser madrina o padrino de un jugador nuevo?</p>
      </div>

      <div className="space-y-6">
        {/* Toggle Madrina */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">¿Sos madrina/padrino? 👑</h3>
              <p className="text-gray-400 text-sm">Ayudá a los jugadores nuevos a adaptarse al club</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="es_madrina"
                checked={profileData.es_madrina}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-ruda-gold"></div>
            </label>
          </div>
        </div>

        {/* Selección de ahijados */}
        {profileData.es_madrina && (
          <div className="animate-fade-in">
            <div className="mb-4">
              <label className="block text-ruda-gold font-bold mb-2">Seleccioná tus ahijados 🎯</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-ruda-gold"
                placeholder="Buscar jugador..."
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {jugadoresFiltrados.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No se encontraron jugadores</p>
              ) : (
                jugadoresFiltrados.map((jugador) => (
                  <button
                    key={jugador.id}
                    type="button"
                    onClick={() => toggleAhijado(jugador.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      profileData.ahijados_seleccionados.includes(jugador.id)
                        ? 'border-ruda-gold bg-ruda-gold/20'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-ruda-green flex items-center justify-center text-xl">
                      {jugador.avatar_url ? (
                        <img src={jugador.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        '🏉'
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-bold">{jugador.nombre_completo}</p>
                      <p className="text-gray-400 text-sm">{jugador.posicion_preferida || 'Sin posición'}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      profileData.ahijados_seleccionados.includes(jugador.id)
                        ? 'border-ruda-gold bg-ruda-gold'
                        : 'border-gray-500'
                    }`}>
                      {profileData.ahijados_seleccionados.includes(jugador.id) && (
                        <svg className="w-4 h-4 text-ruda-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {profileData.ahijados_seleccionados.length > 0 && (
              <div className="mt-4 p-4 bg-ruda-gold/10 rounded-xl border border-ruda-gold/30">
                <p className="text-ruda-gold font-bold">
                  🎯 {profileData.ahijados_seleccionados.length} ahijado{profileData.ahijados_seleccionados.length > 1 ? 's' : ''} seleccionado{profileData.ahijados_seleccionados.length > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  // Paso 4: Resumen
  const Step4Summary = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-2xl font-black text-white mb-2">¡Listo para jugar! 🏉</h2>
        <p className="text-gray-400">Revisá tus datos antes de confirmar</p>
      </div>

      <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
        <div className="flex justify-between py-2 border-b border-white/10">
          <span className="text-gray-400">Teléfono</span>
          <span className="text-white font-bold">{profileData.telefono || 'No especificado'}</span>
        </div>
        
        <div className="flex justify-between py-2 border-b border-white/10">
          <span className="text-gray-400">Fecha de Nacimiento</span>
          <span className="text-white font-bold">{profileData.fecha_nacimiento || 'No especificada'}</span>
        </div>
        
        <div className="flex justify-between py-2 border-b border-white/10">
          <span className="text-gray-400">Posición</span>
          <span className="text-white font-bold">{profileData.posicion_preferida || 'A definir'}</span>
        </div>
        
        <div className="flex justify-between py-2 border-b border-white/10">
          <span className="text-gray-400">N° Camiseta</span>
          <span className="text-white font-bold">{profileData.numero_camiseta || 'Sin número'}</span>
        </div>
        
        <div className="flex justify-between py-2 border-b border-white/10">
          <span className="text-gray-400">Tipo</span>
          <span className={`font-bold ${profileData.tipo_jugador === 'activo' ? 'text-ruda-green' : 'text-ruda-gold'}`}>
            {profileData.tipo_jugador === 'activo' ? '🏃 Activo' : '🤝 Asociado'}
          </span>
        </div>

        <div className="flex justify-between py-2">
          <span className="text-gray-400">Madrina/Padrino</span>
          <span className={`font-bold ${profileData.es_madrina ? 'text-ruda-gold' : 'text-gray-500'}`}>
            {profileData.es_madrina ? `👑 Sí (${profileData.ahijados_seleccionados.length} ahijados)` : 'No'}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
    </div>
  )

  if (authLoading) {
    return (
      <div className="min-h-screen bg-ruda-black flex items-center justify-center">
        <div className="text-white">Cargando... 🏉</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ruda-black py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <img 
              src="/assets/Logo%20Ruda%20Macho.png" 
              alt="Ruda Macho" 
              className="h-16 mx-auto mb-4"
            />
          </Link>
          <h1 className="text-2xl font-black text-white">Completá tu Perfil</h1>
        </div>

        <ProgressBar />

        {/* Card Container */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          {step === 1 && <Step1BasicInfo />}
          {step === 2 && <Step2GameInfo />}
          {step === 3 && <Step3Madrina />}
          {step === 4 && <Step4Summary />}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-3 px-6 border-2 border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors"
              >
                ← Anterior
              </button>
            ) : (
              <div className="flex-1" />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={step === 1 && (!profileData.telefono || !profileData.fecha_nacimiento)}
                className="flex-1 py-3 px-6 bg-ruda-gold text-ruda-black font-bold rounded-full hover:bg-ruda-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-ruda-green text-white font-bold rounded-full hover:bg-ruda-dark-green transition-colors disabled:opacity-50"
              >
                {loading ? 'Guardando...' : '¡Completar Perfil! 🎉'}
              </button>
            )}
          </div>
        </div>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Paso {step} de 4
        </p>
      </div>
    </div>
  )
}
