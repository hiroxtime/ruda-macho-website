'use client'

import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type EstadoPrevio = 'voy' | 'no_voy' | 'voy_tarde' | 'por_definir' | 'exceptuado'
type EstadoPost = 'asistio' | 'llego_tarde' | 'no_asistio' | 'por_verificar'

interface Asistencia {
  id: string
  fecha: string
  estado_previo: EstadoPrevio
  estado_post: EstadoPost
  jugador: {
    nombre_completo: string
    posicion_preferida: string
    avatar_url?: string
  }
}

const ESTADOS_POST: { value: EstadoPost; label: string; emoji: string; color: string }[] = [
  { value: 'asistio', label: 'Asistió', emoji: '✅', color: 'bg-green-500' },
  { value: 'llego_tarde', label: 'Llegó tarde', emoji: '⏰', color: 'bg-yellow-500' },
  { value: 'no_asistio', label: 'No asistió', emoji: '❌', color: 'bg-red-500' },
  { value: 'por_verificar', label: 'Por verificar', emoji: '❓', color: 'bg-gray-500' },
]

export default function AdminAsistenciaGlobal() {
  const { user, perfil } = useAuth()
  const [esAdmin, setEsAdmin] = useState(false)
  const [asistencias, setAsistencias] = useState<Asistencia[]>([])
  const [fechas, setFechas] = useState<string[]>([])
  const [cargando, setCargando] = useState(true)
  const [actualizando, setActualizando] = useState<string | null>(null)
  const [fechaFiltro, setFechaFiltro] = useState<string>('todas')

  useEffect(() => {
    if (perfil?.rol && ['admin', 'moderador', 'tesorero'].includes(perfil.rol)) {
      setEsAdmin(true)
    }
  }, [perfil])

  useEffect(() => {
    if (!esAdmin) return
    cargarAsistencias()
  }, [esAdmin])

  const cargarAsistencias = async () => {
    setCargando(true)
    try {
      // Obtener todas las asistencias del mes actual
      const fechaInicio = new Date()
      fechaInicio.setDate(1)
      fechaInicio.setMonth(fechaInicio.getMonth() - 1) // Incluir mes anterior
      
      const { data } = await supabase
        .from('asistencias')
        .select(`
          id,
          fecha,
          estado_previo,
          estado_post,
          jugador:jugador_id (
            nombre_completo,
            posicion_preferida,
            avatar_url
          )
        `)
        .gte('fecha', fechaInicio.toISOString().split('T')[0])
        .order('fecha', { ascending: false })
        .order('created_at', { ascending: false })
      
      if (data) {
        // Aplanar el resultado de jugador
        const asistenciasFlat = data.map(a => ({
          ...a,
          jugador: Array.isArray(a.jugador) ? a.jugador[0] : a.jugador
        })) as Asistencia[]
        
        setAsistencias(asistenciasFlat)
        
        // Extraer fechas únicas
        const fechasUnicas = Array.from(new Set(data.map(a => a.fecha))).sort().reverse()
        setFechas(fechasUnicas)
      }
    } catch (err) {
      console.error('Error cargando asistencias:', err)
    } finally {
      setCargando(false)
    }
  }

  const actualizarEstado = async (asistenciaId: string, nuevoEstado: EstadoPost) => {
    setActualizando(asistenciaId)
    try {
      await supabase
        .from('asistencias')
        .update({ estado_post: nuevoEstado })
        .eq('id', asistenciaId)
      
      await cargarAsistencias()
    } catch (err) {
      console.error('Error actualizando:', err)
    } finally {
      setActualizando(null)
    }
  }

  // Agrupar por jugador
  const asistenciasPorJugador = asistencias.reduce((acc, a) => {
    const nombre = a.jugador?.nombre_completo || 'Sin nombre'
    if (!acc[nombre]) {
      acc[nombre] = {
        jugador: a.jugador,
        asistencias: {}
      }
    }
    acc[nombre].asistencias[a.fecha] = {
      id: a.id,
      estado_previo: a.estado_previo,
      estado_post: a.estado_post
    }
    return acc
  }, {} as Record<string, { jugador: Asistencia['jugador']; asistencias: Record<string, { id: string; estado_previo: EstadoPrevio; estado_post: EstadoPost }> }>)

  // Calcular estadísticas
  const calcularStats = (asistencias: Record<string, { estado_post: EstadoPost }>) => {
    const total = Object.keys(asistencias).length
    const asistidas = Object.values(asistencias).filter(a => a.estado_post === 'asistio').length
    const tarde = Object.values(asistencias).filter(a => a.estado_post === 'llego_tarde').length
    const ausentes = Object.values(asistencias).filter(a => a.estado_post === 'no_asistio').length
    return { total, asistidas, tarde, ausentes }
  }

  if (!esAdmin) {
    return (
      <div className="min-h-screen bg-ruda-black py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-black text-white mb-4">Acceso Denegado</h1>
          <p className="text-gray-400 mb-8">Necesitás permisos de administrador.</p>
          <Link href="/perfil" className="text-ruda-gold hover:underline">← Volver al perfil</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ruda-black">
      {/* Header */}
      <div className="bg-ruda-green py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/admin/asistencia" className="text-white font-bold">← Volver</Link>
          <h1 className="text-xl font-black text-white">Historial de Asistencias</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filtros */}
        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <label className="text-white font-bold mb-2 block">Filtrar por fecha:</label>
              <select
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white"
              >
                <option value="todas">Todas las fechas</option>
                {fechas.map(f => (
                  <option key={f} value={f}>
                    {new Date(f).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={cargarAsistencias}
              className="px-4 py-2 bg-ruda-green text-white font-bold rounded-xl hover:bg-ruda-dark-green transition-colors"
            >
              🔄 Actualizar
            </button>
          </div>
        </div>

        {cargando ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Cargando asistencias...</p>
          </div>
        ) : (
          <>
            {/* Tabla de asistencias */}
            <div className="overflow-x-auto">
              <table className="w-full bg-white/5 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-ruda-green/50">
                    <th className="px-4 py-3 text-left text-white font-bold">Jugador</th>
                    {fechas.slice(0, 8).map(f => (
                      <th key={f} className="px-2 py-3 text-center text-white text-xs font-bold whitespace-nowrap">
                        {new Date(f).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-white font-bold">Stats</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(asistenciasPorJugador)
                    .filter(([nombre]) => {
                      if (fechaFiltro === 'todas') return true
                      const jugadorData = asistenciasPorJugador[nombre]
                      return jugadorData.asistencias[fechaFiltro]
                    })
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([nombre, data]) => {
                      const stats = calcularStats(data.asistencias)
                      
                      return (
                        <tr key={nombre} className="border-t border-white/10 hover:bg-white/5">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-ruda-green/20 flex items-center justify-center overflow-hidden">
                                {data.jugador?.avatar_url ? (
                                  <img src={data.jugador.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-sm">🏉</span>
                                )}
                              </div>
                              <div>
                                <p className="text-white font-medium text-sm">{nombre}</p>
                                <p className="text-gray-500 text-xs">{data.jugador?.posicion_preferida || 'Sin posición'}</p>
                              </div>
                            </div>
                          </td>
                          
                          {fechas.slice(0, 8).map(f => {
                            const asistencia = data.asistencias[f]
                            if (!asistencia) {
                              return (
                                <td key={f} className="px-2 py-3 text-center">
                                  <span className="text-gray-600">-</span>
                                </td>
                              )
                            }
                            
                            const estadoPost = ESTADOS_POST.find(e => e.value === asistencia.estado_post) || ESTADOS_POST[3]
                            
                            return (
                              <td key={f} className="px-2 py-3 text-center">
                                <div className="relative group">
                                  <button
                                    onClick={() => actualizarEstado(asistencia.id, cicloEstado(asistencia.estado_post))}
                                    disabled={actualizando === asistencia.id}
                                    className={`w-8 h-8 rounded-full ${estadoPost.color} text-white text-xs flex items-center justify-center mx-auto hover:ring-2 hover:ring-white transition-all disabled:opacity-50`}
                                    title={estadoPost.label}
                                  >
                                    {estadoPost.emoji}
                                  </button>
                                  
                                  {/* Dropdown para cambiar estado */}
                                  <div className="absolute hidden group-hover:block z-10 top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-900 rounded-lg shadow-xl p-1 min-w-[120px]">
                                    {ESTADOS_POST.map(e => (
                                      <button
                                        key={e.value}
                                        onClick={() => actualizarEstado(asistencia.id, e.value)}
                                        className={`w-full text-left px-2 py-1 rounded text-xs text-white hover:bg-white/10 ${asistencia.estado_post === e.value ? 'bg-white/20' : ''}`}
                                      >
                                        {e.emoji} {e.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            )
                          })}
                          
                          <td className="px-4 py-3 text-center">
                            <div className="flex gap-2 justify-center text-xs">
                              <span className="text-green-400" title="Asistidas">{stats.asistidas}✅</span>
                              <span className="text-yellow-400" title="Tarde">{stats.tarde}⏰</span>
                              <span className="text-red-400" title="Ausentes">{stats.ausentes}❌</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>

            {/* Resumen */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {fechas.slice(0, 4).map(f => {
                const asistenciasFecha = asistencias.filter(a => a.fecha === f)
                const asistidas = asistenciasFecha.filter(a => a.estado_post === 'asistio').length
                const tarde = asistenciasFecha.filter(a => a.estado_post === 'llego_tarde').length
                
                return (
                  <div key={f} className="bg-white/10 rounded-xl p-4 text-center">
                    <p className="text-gray-400 text-xs">
                      {new Date(f).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-2xl font-black text-white">{asistidas + tarde}</p>
                    <p className="text-ruda-gold text-xs">asistieron</p>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function cicloEstado(actual: EstadoPost): EstadoPost {
  const orden: EstadoPost[] = ['asistio', 'llego_tarde', 'no_asistio', 'por_verificar']
  const idx = orden.indexOf(actual)
  return orden[(idx + 1) % orden.length]
}