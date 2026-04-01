'use client'

import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type EstadoPrevio = 'voy' | 'no_voy' | 'voy_tarde' | 'por_definir' | 'exceptuado'
type EstadoPost = 'asistio' | 'llego_tarde' | 'no_asistio' | 'por_verificar'

interface AsistenciaRow {
  nombre: string
  jugador_id: string | null
  registrado: boolean
  fechas: Record<string, { estado_previo: EstadoPrevio; estado_post: EstadoPost }>
}

const ESTADOS_PREVIO_COLORS: Record<EstadoPrevio, { bg: string; text: string; label: string }> = {
  voy: { bg: 'bg-green-100', text: 'text-green-800', label: 'Voy' },
  no_voy: { bg: 'bg-red-100', text: 'text-red-800', label: 'No voy' },
  voy_tarde: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Tarde' },
  por_definir: { bg: 'bg-gray-100', text: 'text-gray-600', label: '?' },
  exceptuado: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Exc' },
}

const ESTADOS_POST_COLORS: Record<EstadoPost, { bg: string; text: string; label: string }> = {
  asistio: { bg: 'bg-green-500', text: 'text-white', label: 'A' },
  llego_tarde: { bg: 'bg-yellow-500', text: 'text-white', label: 'T' },
  no_asistio: { bg: 'bg-red-500', text: 'text-white', label: 'F' },
  por_verificar: { bg: 'bg-gray-300', text: 'text-gray-700', label: '-' },
}

export default function AsistenciasPublicas() {
  const { user } = useAuth()
  const [jugadores, setJugadores] = useState<AsistenciaRow[]>([])
  const [fechas, setFechas] = useState<string[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    cargarAsistencias()
  }, [])

  const cargarAsistencias = async () => {
    try {
      setCargando(true)
      
      const fechaInicio = new Date()
      fechaInicio.setMonth(fechaInicio.getMonth() - 2)
      
      const { data } = await supabase
        .from('asistencias')
        .select(`
          jugador_id,
          nombre_jugador,
          fecha,
          estado_previo,
          estado_post,
          jugador:jugador_id (
            nombre_completo
          )
        `)
        .gte('fecha', fechaInicio.toISOString().split('T')[0])
        .order('fecha', { ascending: true })
      
      if (data) {
        // Función para obtener día de la semana con zona horaria correcta
        const getDiaSemana = (fechaStr: string) => {
          const d = new Date(fechaStr + 'T00:00:00-03:00')
          return d.getDay()
        }
        
        // Filtrar solo entrenamientos (Martes=2, Jueves=4)
        const entrenamientos = data.filter((a: any) => {
          const dia = getDiaSemana(a.fecha)
          return dia === 2 || dia === 4 // Martes o Jueves
        })
        
        // Agrupar por nombre
        const jugadoresMap = new Map<string, AsistenciaRow>()
        
        entrenamientos.forEach((a: any) => {
          // Usar nombre del jugador registrado o nombre_jugador del Excel
          const nombre = a.jugador?.nombre_completo || a.nombre_jugador || 'Sin nombre'
          const key = a.jugador_id || a.nombre_jugador || 'unknown'
          
          if (!jugadoresMap.has(key)) {
            jugadoresMap.set(key, {
              nombre,
              jugador_id: a.jugador_id,
              registrado: !!a.jugador_id,
              fechas: {}
            })
          }
          
          const jugador = jugadoresMap.get(key)!
          jugador.fechas[a.fecha] = {
            estado_previo: a.estado_previo as EstadoPrevio,
            estado_post: a.estado_post as EstadoPost
          }
        })
        
        // Extraer fechas únicas de entrenamientos
        const fechasUnicas = Array.from(new Set(entrenamientos.map((a: any) => a.fecha))).sort()
        setFechas(fechasUnicas)
        setJugadores(Array.from(jugadoresMap.values()))
      }
    } catch (err) {
      console.error('Error cargando asistencias:', err)
    } finally {
      setCargando(false)
    }
  }

  const jugadoresFiltrados = jugadores
    .filter(j => j.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => a.nombre.localeCompare(b.nombre))

  const formatFecha = (fecha: string) => {
    // Forzar zona horaria de Argentina (GMT-3) para evitar bug de UTC
    const d = new Date(fecha + 'T00:00:00-03:00')
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    return {
      dia: dias[d.getDay()],
      num: d.getDate(),
      mes: d.getMonth() + 1
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/perfil" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Asistencias</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Aviso entrenamientos */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-green-800 dark:text-green-200">Entrenamientos</div>
              <div className="text-sm text-green-600 dark:text-green-300">
                <strong>Martes y Jueves</strong> de 20:30 a 22:30 · Av. Pres. Figueroa Alcorta 6600, CABA
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar jugador..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {jugadoresFiltrados.length} jugadores
            </div>
          </div>
        </div>

        {/* Leyenda */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Estado final:</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-6 h-6 rounded bg-green-500 text-white text-xs flex items-center justify-center font-medium">A</span>
              <span className="text-gray-600 dark:text-gray-400">Asistió</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-6 h-6 rounded bg-yellow-500 text-white text-xs flex items-center justify-center font-medium">T</span>
              <span className="text-gray-600 dark:text-gray-400">Tarde</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-6 h-6 rounded bg-red-500 text-white text-xs flex items-center justify-center font-medium">F</span>
              <span className="text-gray-600 dark:text-gray-400">Falta</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-6 h-6 rounded bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs flex items-center justify-center font-medium">-</span>
              <span className="text-gray-600 dark:text-gray-400">Pendiente</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs flex items-center justify-center font-medium border border-purple-200 dark:border-purple-700">EX</span>
              <span className="text-gray-600 dark:text-gray-400">Exceptuado</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            EX = Exceptuado: jugador justificado (lesión, viaje, etc.)
          </p>
        </div>

        {cargando ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 sticky left-0 bg-gray-50 dark:bg-gray-700 z-10 min-w-[200px]">
                      Jugador
                    </th>
                    {fechas.map(f => {
                      const { dia, num, mes } = formatFecha(f)
                      return (
                        <th key={f} className="px-2 py-3 text-center font-semibold text-gray-700 dark:text-gray-300 min-w-[50px]">
                          <div className="text-xs text-gray-500 dark:text-gray-400">{dia}</div>
                          <div className="font-bold">{num}/{mes}</div>
                        </th>
                      )
                    })}
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300 min-w-[80px]">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {jugadoresFiltrados.map((jugador) => {
                    const totalAsistencias = Object.values(jugador.fechas).filter(f => f.estado_post === 'asistio').length
                    const totalTarde = Object.values(jugador.fechas).filter(f => f.estado_post === 'llego_tarde').length
                    const totalFaltas = Object.values(jugador.fechas).filter(f => f.estado_post === 'no_asistio').length
                    const totalEntrenamientos = Object.keys(jugador.fechas).length
                    const porcentaje = totalEntrenamientos > 0 ? Math.round((totalAsistencias + totalTarde) / totalEntrenamientos * 100) : 0
                    
                    return (
                      <tr 
                        key={jugador.jugador_id || jugador.nombre}
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 py-3 sticky left-0 bg-white dark:bg-gray-800 z-10">
                          <div className="font-medium text-gray-900 dark:text-white">{jugador.nombre}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {jugador.registrado ? 'Registrado' : 'Pendiente'}
                          </div>
                        </td>
                        {fechas.map(f => {
                          const asistencia = jugador.fechas[f]
                          if (!asistencia) {
                            return (
                              <td key={f} className="px-2 py-3 text-center">
                                <span className="text-gray-300 dark:text-gray-600">-</span>
                              </td>
                            )
                          }
                          const estado = ESTADOS_POST_COLORS[asistencia.estado_post] || ESTADOS_POST_COLORS.por_verificar
                          return (
                            <td key={f} className="px-2 py-3 text-center">
                              <span className={`w-7 h-7 rounded inline-flex items-center justify-center text-xs font-bold ${estado.bg} ${estado.text}`}>
                                {estado.label}
                              </span>
                            </td>
                          )
                        })}
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="font-bold text-gray-900 dark:text-white">{totalAsistencias + totalTarde}/{totalEntrenamientos}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              porcentaje >= 80 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                              porcentaje >= 50 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                              'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            }`}>
                              {porcentaje}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Los jugadores marcados como "Pendiente" aún no han creado su cuenta.
        </div>
      </div>
    </div>
  )
}