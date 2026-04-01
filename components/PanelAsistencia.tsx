'use client'

import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type EstadoPrevio = 'voy' | 'no_voy' | 'voy_tarde' | 'por_definir' | 'exceptuado'
type EstadoPost = 'asistio' | 'llego_tarde' | 'no_asistio' | 'por_verificar'

interface Asistencia {
  fecha: string
  estado_previo: EstadoPrevio
  estado_post: EstadoPost
}

const ESTADOS_PREVIO: { value: EstadoPrevio; label: string; bg: string; text: string; bgDark: string; textDark: string }[] = [
  { value: 'voy', label: 'Voy', bg: 'bg-green-100', text: 'text-green-800', bgDark: 'dark:bg-green-900', textDark: 'dark:text-green-200' },
  { value: 'no_voy', label: 'No voy', bg: 'bg-red-100', text: 'text-red-800', bgDark: 'dark:bg-red-900', textDark: 'dark:text-red-200' },
  { value: 'voy_tarde', label: 'Tarde', bg: 'bg-yellow-100', text: 'text-yellow-800', bgDark: 'dark:bg-yellow-900', textDark: 'dark:text-yellow-200' },
  { value: 'por_definir', label: '?', bg: 'bg-gray-100', text: 'text-gray-600', bgDark: 'dark:bg-gray-700', textDark: 'dark:text-gray-300' },
]

const ESTADOS_POST_COLORS: Record<EstadoPost, { bg: string; text: string; label: string }> = {
  asistio: { bg: 'bg-green-500', text: 'text-white', label: 'A' },
  llego_tarde: { bg: 'bg-yellow-500', text: 'text-white', label: 'T' },
  no_asistio: { bg: 'bg-red-500', text: 'text-white', label: 'F' },
  por_verificar: { bg: 'bg-gray-300', text: 'text-gray-700', label: '-' },
}

export default function PanelAsistencia() {
  const { user, perfil } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [expandido, setExpandido] = useState(false)
  const [asistencias, setAsistencias] = useState<Map<string, Asistencia>>(new Map())
  const [cargando, setCargando] = useState(true)
  const [marcando, setMarcando] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!user || !mounted) return
    cargarAsistencias()
  }, [user, mounted])

  const cargarAsistencias = async () => {
    try {
      setCargando(true)
      
      const fechaInicio = new Date()
      fechaInicio.setMonth(fechaInicio.getMonth() - 2)
      
      const { data } = await supabase
        .from('asistencias')
        .select('fecha, estado_previo, estado_post')
        .eq('jugador_id', user!.id)
        .gte('fecha', fechaInicio.toISOString().split('T')[0])
        .order('fecha', { ascending: true })
      
      if (data) {
        const map = new Map<string, Asistencia>()
        data.forEach((a: any) => {
          map.set(a.fecha, {
            fecha: a.fecha,
            estado_previo: a.estado_previo,
            estado_post: a.estado_post
          })
        })
        setAsistencias(map)
      }
    } catch (err) {
      console.error('Error cargando asistencias:', err)
    } finally {
      setCargando(false)
    }
  }

  const generarEntrenamientos = () => {
    const entrenamientos: Date[] = []
    const hoy = new Date()
    
    for (let i = -60; i < 30; i++) {
      const fecha = new Date(hoy)
      fecha.setDate(fecha.getDate() + i)
      const dia = fecha.getDay()
      if (dia === 2 || dia === 4) {
        entrenamientos.push(fecha)
      }
    }
    
    return entrenamientos
  }

  const marcarEstado = async (fecha: Date, estado: EstadoPrevio) => {
    if (!user) return
    
    const fechaStr = fecha.toISOString().split('T')[0]
    setMarcando(fechaStr)
    
    try {
      const { data, error } = await supabase
        .from('asistencias')
        .upsert({
          jugador_id: user.id,
          fecha: fechaStr,
          tipo: 'entrenamiento',
          estado_previo: estado,
          estado_post: 'por_verificar',
        }, { onConflict: 'jugador_id,fecha,tipo' })
        .select()
      
      if (error) throw error
      
      if (data && data[0]) {
        setAsistencias(prev => {
          const nuevo = new Map(prev)
          nuevo.set(fechaStr, {
            fecha: fechaStr,
            estado_previo: estado,
            estado_post: 'por_verificar'
          })
          return nuevo
        })
      }
    } catch (err) {
      console.error('Error marcando asistencia:', err)
      alert('Error al marcar asistencia')
    } finally {
      setMarcando(null)
    }
  }

  const marcarSemana = async (estado: EstadoPrevio) => {
    if (!user) return
    
    // Obtener entrenamientos de esta semana (martes y jueves)
    const hoy = new Date()
    const diaSemana = hoy.getDay() // 0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb
    
    // Calcular inicio de semana (lunes)
    const inicioSemana = new Date(hoy)
    inicioSemana.setDate(hoy.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1))
    
    const entrenamientosSemana: Date[] = []
    
    // Martes
    const martes = new Date(inicioSemana)
    martes.setDate(inicioSemana.getDate() + 1)
    if (martes >= hoy || martes.toDateString() === hoy.toDateString()) {
      entrenamientosSemana.push(martes)
    }
    
    // Jueves
    const jueves = new Date(inicioSemana)
    jueves.setDate(inicioSemana.getDate() + 3)
    if (jueves >= hoy || jueves.toDateString() === hoy.toDateString()) {
      entrenamientosSemana.push(jueves)
    }
    
    if (entrenamientosSemana.length === 0) {
      alert('No hay entrenamientos esta semana')
      return
    }
    
    setMarcando('semana')
    
    try {
      const inserts = entrenamientosSemana.map(f => ({
        jugador_id: user.id,
        fecha: f.toISOString().split('T')[0],
        tipo: 'entrenamiento',
        estado_previo: estado,
        estado_post: 'por_verificar',
      }))
      
      const { error } = await supabase
        .from('asistencias')
        .upsert(inserts, { onConflict: 'jugador_id,fecha,tipo' })
      
      if (error) throw error
      
      // Actualizar estado local
      setAsistencias(prev => {
        const nuevo = new Map(prev)
        entrenamientosSemana.forEach(f => {
          const fechaStr = f.toISOString().split('T')[0]
          nuevo.set(fechaStr, {
            fecha: fechaStr,
            estado_previo: estado,
            estado_post: 'por_verificar'
          })
        })
        return nuevo
      })
    } catch (err) {
      console.error('Error marcando semana:', err)
      alert('Error al marcar la semana')
    } finally {
      setMarcando(null)
    }
  }

  const marcarProximaSemana = async (estado: EstadoPrevio) => {
    if (!user) return
    
    // Próxima semana: martes y jueves
    const hoy = new Date()
    
    const proximoMartes = new Date(hoy)
    // Encontrar próximo martes
    let diasHastaMartes = (2 - hoy.getDay() + 7) % 7
    if (diasHastaMartes === 0) diasHastaMartes = 7 // Si hoy es martes, próximo es en 7 días
    proximoMartes.setDate(hoy.getDate() + diasHastaMartes)
    
    const proximoJueves = new Date(proximoMartes)
    proximoJueves.setDate(proximoMartes.getDate() + 2)
    
    setMarcando('proxima')
    
    try {
      const inserts = [
        { jugador_id: user.id, fecha: proximoMartes.toISOString().split('T')[0], tipo: 'entrenamiento', estado_previo: estado, estado_post: 'por_verificar' },
        { jugador_id: user.id, fecha: proximoJueves.toISOString().split('T')[0], tipo: 'entrenamiento', estado_previo: estado, estado_post: 'por_verificar' },
      ]
      
      const { error } = await supabase
        .from('asistencias')
        .upsert(inserts, { onConflict: 'jugador_id,fecha,tipo' })
      
      if (error) throw error
      
      setAsistencias(prev => {
        const nuevo = new Map(prev)
        nuevo.set(proximoMartes.toISOString().split('T')[0], {
          fecha: proximoMartes.toISOString().split('T')[0],
          estado_previo: estado,
          estado_post: 'por_verificar'
        })
        nuevo.set(proximoJueves.toISOString().split('T')[0], {
          fecha: proximoJueves.toISOString().split('T')[0],
          estado_previo: estado,
          estado_post: 'por_verificar'
        })
        return nuevo
      })
    } catch (err) {
      console.error('Error marcando próxima semana:', err)
      alert('Error al marcar la próxima semana')
    } finally {
      setMarcando(null)
    }
  }

  const formatFecha = (fecha: Date) => {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    return {
      dia: dias[fecha.getDay()],
      num: fecha.getDate(),
      mes: fecha.getMonth() + 1,
      fechaStr: fecha.toISOString().split('T')[0]
    }
  }

  const esFuturo = (fecha: Date) => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    return fecha >= hoy
  }

  const esHoy = (fecha: Date) => {
    const hoy = new Date()
    return fecha.toDateString() === hoy.toDateString()
  }

  if (!mounted) return null

  const entrenamientos = generarEntrenamientos()
  
  // Stats
  const asistidas = Array.from(asistencias.values()).filter(a => a.estado_post === 'asistio').length
  const tarde = Array.from(asistencias.values()).filter(a => a.estado_post === 'llego_tarde').length
  const faltas = Array.from(asistencias.values()).filter(a => a.estado_post === 'no_asistio').length
  const total = asistencias.size

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
      {/* Header colapsable */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-700 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-900 dark:text-white">Mis Asistencias</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {cargando ? 'Cargando...' : `${asistidas + tarde} de ${total} entrenamientos`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex gap-3 text-sm">
            <span className="text-green-600 dark:text-green-400">{asistidas} asistidas</span>
            <span className="text-yellow-600 dark:text-yellow-400">{tarde} tarde</span>
            <span className="text-red-600 dark:text-red-400">{faltas} faltas</span>
          </div>
          <svg className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${expandido ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Contenido expandible */}
      {expandido && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Info entrenamientos */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-300">
            <strong>Martes y Jueves</strong> de 20:30 a 22:30 · Av. Pres. Figueroa Alcorta 6600, CABA
          </div>

          {/* Botones para marcar semana */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/30">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Marcar semana completa:</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => marcarSemana('voy')}
                disabled={marcando === 'semana'}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  marcando === 'semana' 
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-wait' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {marcando === 'semana' ? 'Guardando...' : 'Esta semana: Voy ✓'}
              </button>
              <button
                onClick={() => marcarProximaSemana('voy')}
                disabled={marcando === 'proxima'}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  marcando === 'proxima' 
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-wait' 
                    : 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-700'
                }`}
              >
                {marcando === 'proxima' ? 'Guardando...' : 'Próxima semana: Voy'}
              </button>
            </div>
          </div>

          {cargando ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Cargando...</div>
          ) : (
            <>
              {/* Tabla de entrenamientos */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Fecha</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700 dark:text-gray-300">Tu estado</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700 dark:text-gray-300">Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entrenamientos.slice().reverse().slice(0, 16).reverse().map((fecha) => {
                      const { dia, num, mes, fechaStr } = formatFecha(fecha)
                      const asistencia = asistencias.get(fechaStr)
                      const futuro = esFuturo(fecha)
                      const hoy = esHoy(fecha)
                      const marcandoEste = marcando === fechaStr
                      
                      const estadoPrevio = asistencia?.estado_previo || 'por_definir'
                      const estadoPost = asistencia?.estado_post || 'por_verificar'
                      const postColor = ESTADOS_POST_COLORS[estadoPost] || ESTADOS_POST_COLORS.por_verificar

                      return (
                        <tr key={fechaStr} className={`border-b border-gray-100 dark:border-gray-700 ${hoy ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 dark:text-gray-400 text-xs">{dia}</span>
                              <span className="font-medium text-gray-900 dark:text-white">{num}/{mes}</span>
                              {hoy && (
                                <span className="px-1.5 py-0.5 bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 text-xs rounded font-medium">
                                  HOY
                                </span>
                              )}
                              {!futuro && !asistencia && (
                                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300 text-xs rounded">
                                  Sin registrar
                                </span>
                              )}
                            </div>
                          </td>
                          
                          <td className="px-4 py-2">
                            {futuro ? (
                              <div className="flex gap-1 justify-center">
                                {ESTADOS_PREVIO.map(estado => (
                                  <button
                                    key={estado.value}
                                    onClick={() => marcarEstado(fecha, estado.value)}
                                    disabled={marcandoEste}
                                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                      estadoPrevio === estado.value
                                        ? `${estado.bg} ${estado.text} ${estado.bgDark} ${estado.textDark} ring-2 ring-gray-400 dark:ring-gray-500`
                                        : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                                    } ${marcandoEste ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                                  >
                                    {estado.label}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  ESTADOS_PREVIO.find(e => e.value === estadoPrevio)?.bg || 'bg-gray-100'
                                } ${
                                  ESTADOS_PREVIO.find(e => e.value === estadoPrevio)?.text || 'text-gray-600'
                                } ${
                                  ESTADOS_PREVIO.find(e => e.value === estadoPrevio)?.bgDark || ''
                                } ${
                                  ESTADOS_PREVIO.find(e => e.value === estadoPrevio)?.textDark || ''
                                }`}>
                                  {ESTADOS_PREVIO.find(e => e.value === estadoPrevio)?.label || '?'}
                                </span>
                              </div>
                            )}
                          </td>
                          
                          <td className="px-4 py-2 text-center">
                            <span className={`w-7 h-7 rounded inline-flex items-center justify-center text-xs font-bold ${postColor.bg} ${postColor.text}`}>
                              {postColor.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Link a todas las asistencias */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/asistencias"
                  className="block w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-center text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
                >
                  Ver todas las asistencias del equipo →
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}