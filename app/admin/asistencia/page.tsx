'use client'

import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import GoogleSheetsSync from '@/components/GoogleSheetsSync'

type EstadoPrevio = 'voy' | 'no_voy' | 'voy_tarde' | 'por_definir' | 'exceptuado'
type EstadoPost = 'asistio' | 'llego_tarde' | 'no_asistio' | 'por_verificar'

const ESTADOS_POST: { value: EstadoPost; label: string; bg: string; text: string }[] = [
  { value: 'asistio', label: 'Asistió', bg: 'bg-green-500', text: 'text-white' },
  { value: 'llego_tarde', label: 'Tarde', bg: 'bg-yellow-500', text: 'text-white' },
  { value: 'no_asistio', label: 'Falta', bg: 'bg-red-500', text: 'text-white' },
  { value: 'por_verificar', label: 'Pendiente', bg: 'bg-gray-300', text: 'text-gray-700' },
]

const ESTADOS_PREVIO_LABELS: Record<EstadoPrevio, string> = {
  voy: 'Voy',
  no_voy: 'No voy',
  voy_tarde: 'Tarde',
  por_definir: '?',
  exceptuado: 'EX',
}

const ESTADOS_PREVIO_COLORS: Record<EstadoPrevio, string> = {
  voy: 'bg-green-100 text-green-800',
  no_voy: 'bg-red-100 text-red-800',
  voy_tarde: 'bg-yellow-100 text-yellow-800',
  por_definir: 'bg-gray-100 text-gray-600',
  exceptuado: 'bg-purple-100 text-purple-800',
}

function getDiaEntrenamiento(): { esEntrenamiento: boolean; titulo: string; subtitulo: string } {
  const hoy = new Date()
  const dia = hoy.getDay() // 0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb
  
  if (dia === 2) {
    return { esEntrenamiento: true, titulo: 'Entrenamiento de Hoy', subtitulo: 'Martes 20:30 - 22:30' }
  } else if (dia === 4) {
    return { esEntrenamiento: true, titulo: 'Entrenamiento de Hoy', subtitulo: 'Jueves 20:30 - 22:30' }
  } else {
    // Buscar próximo entrenamiento
    const proximo = new Date(hoy)
    let diasHasta = 0
    while (proximo.getDay() !== 2 && proximo.getDay() !== 4) {
      proximo.setDate(proximo.getDate() + 1)
      diasHasta++
    }
    const diaNombre = proximo.getDay() === 2 ? 'Martes' : 'Jueves'
    return { 
      esEntrenamiento: false, 
      titulo: `Próximo: ${diaNombre} ${proximo.getDate()}/${proximo.getMonth() + 1}`,
      subtitulo: 'Horario: 20:30 - 22:30'
    }
  }
}

function getEntrenamientoToken() {
  const hoy = new Date().toISOString().split('T')[0]
  return `ruda-entrenamiento-${hoy}`
}

function getRegistroURL() {
  const token = getEntrenamientoToken()
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://rudamachorugby.netlify.app'
  return `${base}/registro-rapido?token=${token}`
}

export default function AdminAsistencia() {
  const { user, perfil, loading } = useAuth()
  const router = useRouter()
  const [esAdmin, setEsAdmin] = useState(false)
  const [registros, setRegistros] = useState<any[]>([])
  const [registrosHistorial, setRegistrosHistorial] = useState<any[]>([])
  const [cargandoRegistros, setCargandoRegistros] = useState(false)
  const [registroURL, setRegistroURL] = useState('')
  const [jugadores, setJugadores] = useState<any[]>([])
  const [tabActivo, setTabActivo] = useState<'asistencia' | 'historial' | 'becados'>('asistencia')
  const [busquedaJugador, setBusquedaJugador] = useState('')
  const [guardandoBecado, setGuardandoBecado] = useState<string | null>(null)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0])
  const [actualizandoEstado, setActualizandoEstado] = useState<string | null>(null)

  useEffect(() => {
    setRegistroURL(getRegistroURL())
  }, [])

  useEffect(() => {
    if (perfil?.rol && ['admin', 'moderador', 'tesorero'].includes(perfil.rol)) {
      setEsAdmin(true)
    }
  }, [perfil])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    const cargarAsistencias = async () => {
      if (!esAdmin) return
      setCargandoRegistros(true)
      
      const hoy = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('asistencias')
        .select(`
          *,
          jugador:jugador_id (
            nombre_completo,
            posicion_preferida,
            avatar_url
          )
        `)
        .eq('fecha', hoy)
        .order('created_at', { ascending: false })
      
      if (data) setRegistros(data)
      setCargandoRegistros(false)
    }
    
    if (esAdmin) cargarAsistencias()
  }, [esAdmin])

  useEffect(() => {
    const cargarHistorial = async () => {
      if (!esAdmin || tabActivo !== 'historial') return
      setCargandoRegistros(true)
      
      const { data } = await supabase
        .from('asistencias')
        .select(`
          *,
          jugador:jugador_id (
            nombre_completo,
            posicion_preferida,
            avatar_url
          )
        `)
        .eq('fecha', fechaSeleccionada)
        .order('created_at', { ascending: false })
      
      if (data) setRegistrosHistorial(data)
      setCargandoRegistros(false)
    }
    
    cargarHistorial()
  }, [esAdmin, tabActivo, fechaSeleccionada])

  useEffect(() => {
    const cargarJugadores = async () => {
      if (!esAdmin) return
      
      const { data } = await supabase
        .from('perfiles')
        .select('id, nombre_completo, tipo_jugador, es_becado, fecha_vencimiento_beca')
        .order('nombre_completo')
      
      if (data) setJugadores(data)
    }
    
    if (esAdmin && tabActivo === 'becados') cargarJugadores()
  }, [esAdmin, tabActivo])

  const toggleBecado = async (jugadorId: string, esBecado: boolean) => {
    setGuardandoBecado(jugadorId)
    
    try {
      if (esBecado) {
        await supabase
          .from('perfiles')
          .update({ es_becado: false, fecha_vencimiento_beca: null })
          .eq('id', jugadorId)
      } else {
        const fechaVencimiento = new Date()
        fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 1)
        
        await supabase
          .from('perfiles')
          .update({ 
            es_becado: true, 
            fecha_vencimiento_beca: fechaVencimiento.toISOString().split('T')[0]
          })
          .eq('id', jugadorId)
      }
      
      const { data } = await supabase
        .from('perfiles')
        .select('id, nombre_completo, tipo_jugador, es_becado, fecha_vencimiento_beca')
        .order('nombre_completo')
      
      if (data) setJugadores(data)
    } catch (err) {
      console.error('Error al actualizar becado:', err)
    } finally {
      setGuardandoBecado(null)
    }
  }

  const actualizarEstadoPost = async (asistenciaId: string, nuevoEstado: EstadoPost) => {
    setActualizandoEstado(asistenciaId)
    
    try {
      await supabase
        .from('asistencias')
        .update({ estado_post: nuevoEstado })
        .eq('id', asistenciaId)
      
      if (tabActivo === 'historial') {
        const { data } = await supabase
          .from('asistencias')
          .select(`
            *,
            jugador:jugador_id (
              nombre_completo,
              posicion_preferida,
              avatar_url
            )
          `)
          .eq('fecha', fechaSeleccionada)
          .order('created_at', { ascending: false })
        
        if (data) setRegistrosHistorial(data)
      } else {
        const hoy = new Date().toISOString().split('T')[0]
        const { data } = await supabase
          .from('asistencias')
          .select(`
            *,
            jugador:jugador_id (
              nombre_completo,
              posicion_preferida,
              avatar_url
            )
          `)
          .eq('fecha', hoy)
          .order('created_at', { ascending: false })
        
        if (data) setRegistros(data)
      }
    } catch (err) {
      console.error('Error actualizando estado:', err)
    } finally {
      setActualizandoEstado(null)
    }
  }

  const jugadoresFiltrados = jugadores.filter(j => 
    j.nombre_completo?.toLowerCase().includes(busquedaJugador.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    )
  }

  if (!loading && user && !esAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">⛔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-8">Necesitás permisos de administrador.</p>
          <Link href="/perfil" className="text-green-700 hover:underline font-medium">← Volver al perfil</Link>
        </div>
      </div>
    )
  }

  const getNombreJugador = (reg: any) => {
    return reg.jugador?.nombre_completo || reg.nombre_jugador || 'Sin nombre'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-700 py-4 px-4 shadow">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/perfil" className="text-white font-medium">← Volver</Link>
          <h1 className="text-lg font-bold text-white">Panel Admin - Asistencias</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setTabActivo('asistencia')}
            className={`px-4 py-2 font-medium transition-colors ${
              tabActivo === 'asistencia' 
                ? 'text-green-700 border-b-2 border-green-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            QR Hoy
          </button>
          <button
            onClick={() => setTabActivo('historial')}
            className={`px-4 py-2 font-medium transition-colors ${
              tabActivo === 'historial' 
                ? 'text-green-700 border-b-2 border-green-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Historial
          </button>
          <button
            onClick={() => setTabActivo('becados')}
            className={`px-4 py-2 font-medium transition-colors ${
              tabActivo === 'becados' 
                ? 'text-green-700 border-b-2 border-green-700' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Becados
          </button>
        </div>
      </div>

      {tabActivo === 'asistencia' && (
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
          {/* QR Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl">📱</span>
              <h2 className="text-lg font-bold text-gray-900">Código QR del Día</h2>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              Mostrá este QR a los jugadores para que marquen su asistencia.
            </p>
            
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white border-2 border-gray-200 rounded-lg">
                {registroURL && (
                  <QRCodeSVG
                    value={registroURL}
                    size={180}
                    level="H"
                    includeMargin={false}
                  />
                )}
              </div>
            </div>
            
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => window.print()}
                className="px-3 py-2 bg-green-700 text-white font-medium rounded text-sm hover:bg-green-800 transition-colors"
              >
                Imprimir
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(registroURL); alert('Link copiado') }}
                className="px-3 py-2 bg-gray-200 text-gray-700 font-medium rounded text-sm hover:bg-gray-300 transition-colors"
              >
                Copiar Link
              </button>
            </div>
          </div>

          {/* Tabla de asistencias */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Google Sheets Sync */}
            <GoogleSheetsSync />
          </div>

          {/* Tabla de asistencias */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-green-50">
              <h3 className="font-bold text-gray-900">
                {(() => {
                  const { titulo, subtitulo } = getDiaEntrenamiento()
                  return (
                    <>
                      {titulo}
                      <span className="ml-2 text-sm font-normal text-gray-600">{subtitulo}</span>
                    </>
                  )
                })()}
              </h3>
            </div>
            
            {/* Leyenda */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-600">
              <span className="mr-4"><strong>Jugador marcó:</strong> Voy / No voy / Tarde / ? / EX (Exceptuado)</span>
              <span><strong>Resultado:</strong> A=Asistió / T=Tarde / F=Falta / -=Pendiente</span>
            </div>
            
            {cargandoRegistros ? (
              <div className="p-8 text-center text-gray-500">Cargando...</div>
            ) : registros.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay registros aún. Mostrá el QR a los jugadores.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Jugador ({registros.length})</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700">Marcó</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registros.map((reg) => {
                      const estadoPrevio = reg.estado_previo as EstadoPrevio
                      const estadoPost = ESTADOS_POST.find(e => e.value === reg.estado_post) || ESTADOS_POST[3]
                      const previoColor = ESTADOS_PREVIO_COLORS[estadoPrevio] || 'bg-gray-100 text-gray-600'
                      
                      return (
                        <tr key={reg.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {getNombreJugador(reg)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${previoColor}`}>
                              {ESTADOS_PREVIO_LABELS[estadoPrevio] || '?'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 justify-center">
                              {ESTADOS_POST.map(estado => (
                                <button
                                  key={estado.value}
                                  onClick={() => actualizarEstadoPost(reg.id, estado.value)}
                                  disabled={actualizandoEstado === reg.id}
                                  className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-colors ${
                                    reg.estado_post === estado.value
                                      ? `${estado.bg} ${estado.text} ring-2 ring-offset-1 ring-gray-400`
                                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  } ${actualizandoEstado === reg.id ? 'opacity-50' : ''}`}
                                  title={estado.label}
                                >
                                  {estado.value === 'asistio' ? 'A' : estado.value === 'llego_tarde' ? 'T' : estado.value === 'no_asistio' ? 'F' : '-'}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Link al historial */}
          <Link 
            href="/asistencias"
            className="block text-center text-green-700 hover:underline font-medium"
          >
            Ver todas las asistencias →
          </Link>
        </div>
      )}

      {tabActivo === 'historial' && (
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
          {/* Botones rápidos para entrenamientos */}
          <div className="bg-white rounded-lg shadow p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar fecha:</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {(() => {
                const hoy = new Date()
                const dias = []
                // Últimos 4 entrenamientos
                for (let i = 0; i < 30; i++) {
                  const fecha = new Date(hoy)
                  fecha.setDate(hoy.getDate() - i)
                  if (fecha.getDay() === 2 || fecha.getDay() === 4) {
                    dias.push(new Date(fecha))
                  }
                  if (dias.length >= 8) break
                }
                return dias.map(f => {
                  const fechaStr = f.toISOString().split('T')[0]
                  const diaNombre = f.getDay() === 2 ? 'Mar' : 'Jue'
                  const esHoy = f.toDateString() === hoy.toDateString()
                  return (
                    <button
                      key={fechaStr}
                      onClick={() => setFechaSeleccionada(fechaStr)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        fechaSeleccionada === fechaStr
                          ? 'bg-green-600 text-white'
                          : esHoy
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {diaNombre} {f.getDate()}/{f.getMonth() + 1}
                      {esHoy && ' (Hoy)'}
                    </button>
                  )
                })
              })()}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Info del día */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-gray-900">
                  {new Date(fechaSeleccionada).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                <div className="text-sm text-gray-500">
                  {(() => {
                    const dia = new Date(fechaSeleccionada).getDay()
                    if (dia === 2 || dia === 4) {
                      return 'Entrenamiento - 20:30 a 22:30'
                    }
                    return 'No es día de entrenamiento'
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de historial */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900">
                {registrosHistorial.length} {registrosHistorial.length === 1 ? 'registro' : 'registros'}
              </h3>
            </div>
            
            {cargandoRegistros ? (
              <div className="p-8 text-center text-gray-500">Cargando...</div>
            ) : registrosHistorial.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay registros para esta fecha.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Jugador</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700">Marcó</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {registrosHistorial.map((reg) => {
                      const estadoPrevio = reg.estado_previo as EstadoPrevio
                      const estadoPost = ESTADOS_POST.find(e => e.value === reg.estado_post) || ESTADOS_POST[3]
                      
                      return (
                        <tr key={reg.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {getNombreJugador(reg)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                              {ESTADOS_PREVIO_LABELS[estadoPrevio] || '?'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 justify-center">
                              {ESTADOS_POST.map(estado => (
                                <button
                                  key={estado.value}
                                  onClick={() => actualizarEstadoPost(reg.id, estado.value)}
                                  disabled={actualizandoEstado === reg.id}
                                  className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-colors ${
                                    reg.estado_post === estado.value
                                      ? `${estado.bg} ${estado.text} ring-2 ring-offset-1 ring-gray-400`
                                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  } ${actualizandoEstado === reg.id ? 'opacity-50' : ''}`}
                                  title={estado.label}
                                >
                                  {estado.value === 'asistio' ? 'A' : estado.value === 'llego_tarde' ? 'T' : estado.value === 'no_asistio' ? 'F' : '-'}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {tabActivo === 'becados' && (
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
          {/* Búsqueda */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar jugador..."
              value={busquedaJugador}
              onChange={(e) => setBusquedaJugador(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Lista de jugadores */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Jugador</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Tipo</th>
                  <th className="px-4 py-2 text-center font-medium text-gray-700">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jugadoresFiltrados.map((jugador) => (
                  <tr key={jugador.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {jugador.nombre_completo}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {jugador.tipo_jugador === 'activo' ? 'Activo' : 'Asociado'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleBecado(jugador.id, jugador.es_becado)}
                        disabled={guardandoBecado === jugador.id}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          jugador.es_becado
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {guardandoBecado === jugador.id ? '...' : jugador.es_becado ? 'Becado' : 'No'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
            <strong>Info:</strong> Al activar la beca, el jugador no verá el monto de cuota en su perfil. La beca dura 12 meses.
          </div>
        </div>
      )}
    </div>
  )
}