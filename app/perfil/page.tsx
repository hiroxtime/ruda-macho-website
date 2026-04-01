'use client'

import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import PanelAsistencia from '@/components/PanelAsistencia'

// SVG Icons
const Icons = {
  user: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  camera: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  qr: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
  ),
  school: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  wallet: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  calendar: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  edit: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  crown: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l3.5 4.5L12 3l3.5 4.5L19 3v13a2 2 0 01-2 2H7a2 2 0 01-2-2V3z" />
    </svg>
  ),
  shield: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  chevronDown: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  eye: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  eyeOff: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.427a3 3 0 114.243 4.242L9.878 15.18a3 3 0 01-4.242-4.242L12.06 9.06m3.5 3.5l3.5 3.5M3 3l18 18" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  book: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  star: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  trophy: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3h14M5 3v4a7 7 0 0014 0V3M5 3H3m16 0h2M12 14v7m-4 0h8" />
    </svg>
  ),
  target: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <circle cx="12" cy="12" r="6" strokeWidth="2" />
      <circle cx="12" cy="12" r="2" strokeWidth="2" />
    </svg>
  ),
  plus: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  logout: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  arrowLeft: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  rugby: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <ellipse cx="12" cy="12" rx="10" ry="6" strokeWidth="2" />
      <path strokeLinecap="round" strokeWidth="2" d="M12 2c3 2 3 18 0 20M12 2c-3 2-3 18 0 20" />
    </svg>
  ),
}

function QRAsistenciaSimple({ qrToken, nombre }: { qrToken: string; nombre: string }) {
  const qrValue = `ruda-macho-asistencia:${qrToken}`
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://rudamachorugby.netlify.app'
  const registroURL = `${baseUrl}/registro-rapido?token=${qrToken}`
  
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
      <div className="inline-block p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
        <QRCodeSVG
          value={registroURL}
          size={160}
          level="H"
          includeMargin={false}
        />
      </div>
      <p className="mt-3 text-gray-900 dark:text-white font-medium">{nombre}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mostrá este código al entrar al entrenamiento</p>
    </div>
  )
}

export default function Perfil() {
  const { user, perfil, loading, signOut, refreshPerfil } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [privacidad, setPrivacidad] = useState(false)
  const [finanzasExpandido, setFinanzasExpandido] = useState(false)
  const [rudaSchoolExpandido, setRudaSchoolExpandido] = useState(false)
  const [editarPerfilExpandido, setEditarPerfilExpandido] = useState(false)
  const [madrinaExpandido, setMadrinaExpandido] = useState(false)
  const [esMadrina, setEsMadrina] = useState(false)
  const [ahijados, setAhijados] = useState<any[]>([])
  const [ahijadosPendientes, setAhijadosPendientes] = useState<any[]>([])
  const [nuevoAhijadoNombre, setNuevoAhijadoNombre] = useState('')
  const [nuevoAhijadoEmail, setNuevoAhijadoEmail] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [localPerfil, setLocalPerfil] = useState<any>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && user && refreshPerfil) refreshPerfil()
  }, [mounted, user, refreshPerfil])

  useEffect(() => {
    if (mounted && perfil) {
      setLocalPerfil(perfil)
      setEsMadrina(perfil.es_madrina || false)
    }
  }, [mounted, perfil])

  useEffect(() => {
    if (!user || !perfil?.qr_token) return
    
    const generarQRToken = async () => {
      const { data, error } = await supabase
        .from('perfiles')
        .update({ qr_token: crypto.randomUUID() })
        .eq('id', user.id)
        .select('qr_token')
        .single()
      
      if (data && !error) {
        setLocalPerfil((prev: any) => prev ? { ...prev, qr_token: data.qr_token } : prev)
      }
    }
    
    if (!localPerfil?.qr_token) generarQRToken()
  }, [user, localPerfil?.qr_token])

  useEffect(() => {
    if (!user || !perfil?.es_madrina) return
    
    const fetchAhijados = async () => {
      const { data } = await supabase
        .from('madrinas_ahijados')
        .select(`ahijado:ahijado_id (id, nombre_completo, posicion_preferida, avatar_url)`)
        .eq('madrina_id', user.id)
      
      if (data) setAhijados(data.map((item: any) => item.ahijado))
    }
    
    fetchAhijados()
  }, [user, perfil?.es_madrina])

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [loading, user, router])

  useEffect(() => {
    if (!user || !perfil?.es_madrina) return
    
    const fetchAhijadosPendientes = async () => {
      const { data } = await supabase
        .from('ahijados_pendientes')
        .select('*')
        .eq('madrina_id', user.id)
        .is('perfil_id', null)
      
      if (data) setAhijadosPendientes(data)
    }
    
    fetchAhijadosPendientes()
  }, [user, perfil?.es_madrina])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    )
  }

  if (!user) return null

  if (!perfil && !localPerfil) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {Icons.user}
          </div>
          <h1 className="text-xl font-bold text-gray-900">Cargando tu perfil...</h1>
        </div>
      </div>
    )
  }

  const displayPerfil = localPerfil || perfil

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  const agregarAhijadoPendiente = async () => {
    if (!nuevoAhijadoNombre.trim() || !user) return
    
    const { data, error } = await supabase
      .from('ahijados_pendientes')
      .insert({ madrina_id: user.id, nombre_completo: nuevoAhijadoNombre.trim(), email: nuevoAhijadoEmail.trim() || null })
      .select()
    
    if (error) {
      alert('Error al agregar ahijado: ' + error.message)
    } else if (data) {
      setAhijadosPendientes([...ahijadosPendientes, data[0]])
      setNuevoAhijadoNombre('')
      setNuevoAhijadoEmail('')
    }
  }

  const eliminarAhijadoPendiente = async (id: string) => {
    const { error } = await supabase.from('ahijados_pendientes').delete().eq('id', id)
    if (error) {
      alert('Error al eliminar: ' + error.message)
    } else {
      setAhijadosPendientes(ahijadosPendientes.filter(a => a.id !== id))
    }
  }

  const handleToggleMadrina = async (value: boolean) => {
    setEsMadrina(value)
    if (!user) return
    
    const { error } = await supabase.from('perfiles').update({ es_madrina: value }).eq('id', user.id)
    
    if (error) {
      alert('Error al actualizar: ' + error.message)
      setEsMadrina(!value)
    } else if (localPerfil) {
      setLocalPerfil({ ...localPerfil, es_madrina: value })
    }
  }

  const handleGuardarPerfil = async () => {
    if (!user) return
    setGuardando(true)
    
    try {
      await supabase.from('perfiles').update({ perfil_completo: true }).eq('id', user.id)
      alert('Perfil actualizado')
      setEditarPerfilExpandido(false)
      window.location.reload()
    } catch (err) {
      alert('Error al guardar: ' + (err as Error).message)
    } finally {
      setGuardando(false)
    }
  }

  const handleChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      
      const { data, error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file)
      if (uploadError) { alert('Error al subir imagen'); return }
      
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)
      
      const { error: updateError } = await supabase.from('perfiles').update({ avatar_url: publicUrl }).eq('id', user.id)
      if (updateError) { alert('Error al actualizar perfil'); return }
      
      if (localPerfil) setLocalPerfil({ ...localPerfil, avatar_url: publicUrl })
      alert('Foto actualizada')
    } catch (err) {
      alert('Error: ' + (err as Error).message)
    }
  }

  const rudaSchoolStats = { nivel: 2, leccionesCompletadas: 8, totalLecciones: 24, xp: 450, badges: ['Especialista', 'Jugador Activo'] }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-green-700 dark:bg-green-800 text-white py-4 px-4 shadow">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-white">
            {Icons.arrowLeft}
            <span className="hidden sm:inline">Volver</span>
          </Link>
          <h1 className="text-lg font-bold">Mi Perfil</h1>
          <button onClick={handleLogout} className="flex items-center gap-1 text-white/90 hover:text-white text-sm">
            {Icons.logout}
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Avatar + Nombre */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center overflow-hidden">
                {displayPerfil?.avatar_url ? (
                  <img src={displayPerfil.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <button 
                onClick={() => document.getElementById('avatar-input')?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-gray-800 dark:bg-gray-600 text-white rounded-full flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-500"
              >
                {Icons.camera}
              </button>
              <input id="avatar-input" type="file" accept="image/*" onChange={handleChangeAvatar} className="hidden" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{displayPerfil?.nombre_completo}</h2>
              <p className="text-gray-600 dark:text-gray-400">{displayPerfil?.tipo_jugador === 'activo' ? 'Jugador Activo' : 'Miembro Asociado'}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                  {displayPerfil?.posicion_preferida || 'Sin posición'}
                </span>
                {displayPerfil?.es_becado && (
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">Becado</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* QR de Asistencia */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-300">
                {Icons.qr}
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Mi código QR</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Mostralo al entrar al entrenamiento</div>
              </div>
            </div>
            <span className="text-gray-400 dark:text-gray-500">{displayPerfil?.qr_token ? 'Listo' : 'Generando...'}</span>
          </button>
          {displayPerfil?.qr_token && (
            <div className="px-4 pb-4">
              <QRAsistenciaSimple qrToken={displayPerfil.qr_token} nombre={displayPerfil.nombre_completo || 'Jugador'} />
            </div>
          )}
        </div>

        {/* Ruda School */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <button
            onClick={() => setRudaSchoolExpandido(!rudaSchoolExpandido)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300">
                {Icons.school}
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Ruda School</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Nivel {rudaSchoolStats.nivel} • {rudaSchoolStats.leccionesCompletadas}/{rudaSchoolStats.totalLecciones} lecciones</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{rudaSchoolStats.xp} XP</span>
              <span className={`text-gray-400 dark:text-gray-500 transition-transform ${rudaSchoolExpandido ? 'rotate-180' : ''}`}>
                {Icons.chevronDown}
              </span>
            </div>
          </button>
          
          {rudaSchoolExpandido && (
            <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span>Progreso</span>
                  <span>{Math.round((rudaSchoolStats.leccionesCompletadas / rudaSchoolStats.totalLecciones) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${(rudaSchoolStats.leccionesCompletadas / rudaSchoolStats.totalLecciones) * 100}%` }} />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <div className="text-green-600 dark:text-green-400 mb-1">{Icons.book}</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{rudaSchoolStats.leccionesCompletadas}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Lecciones</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <div className="text-yellow-600 dark:text-yellow-400 mb-1">{Icons.star}</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{rudaSchoolStats.xp}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">XP Total</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <div className="text-purple-600 dark:text-purple-400 mb-1">{Icons.target}</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">Nivel {rudaSchoolStats.nivel}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Actual</div>
                </div>
              </div>

              <Link href="/ruda-school" className="block w-full mt-4 py-2 bg-green-600 text-white text-center rounded-lg font-medium hover:bg-green-700">
                Continuar aprendiendo
              </Link>
            </div>
          )}
        </div>

        {/* Finanzas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <button
            onClick={() => setFinanzasExpandido(!finanzasExpandido)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center text-yellow-600 dark:text-yellow-300">
                {Icons.wallet}
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Mis Finanzas</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{displayPerfil?.es_becado ? 'Becado' : (displayPerfil?.estado_cuota ? 'Al día' : 'Pendiente')}</div>
              </div>
            </div>
            <span className={`text-gray-400 dark:text-gray-500 transition-transform ${finanzasExpandido ? 'rotate-180' : ''}`}>
              {Icons.chevronDown}
            </span>
          </button>
          
          {finanzasExpandido && (
            <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
              {displayPerfil?.es_becado ? (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300 font-medium">
                    {Icons.trophy}
                    <span>Becado</span>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-2">No tenés que abonar la cuota mensual</p>
                  {displayPerfil?.fecha_vencimiento_beca && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">Vence: {new Date(displayPerfil.fecha_vencimiento_beca).toLocaleDateString('es-AR')}</p>
                  )}
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Monto mensual:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{privacidad ? '****' : '$35.000'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Próximo vencimiento:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{privacidad ? '****' : '15/04/2026'}</span>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setPrivacidad(!privacidad)}
                className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                {privacidad ? Icons.eye : Icons.eyeOff}
                <span>{privacidad ? 'Mostrar montos' : 'Ocultar montos'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Panel de Asistencias */}
        <PanelAsistencia />

        {/* Completar Perfil */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <button
            onClick={() => setEditarPerfilExpandido(!editarPerfilExpandido)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300">
                {Icons.edit}
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Completar Perfil</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{displayPerfil?.perfil_completo ? 'Perfil completo' : 'Faltan datos'}</div>
              </div>
            </div>
            <span className={`text-gray-400 dark:text-gray-500 transition-transform ${editarPerfilExpandido ? 'rotate-180' : ''}`}>
              {Icons.chevronDown}
            </span>
          </button>
          
          {editarPerfilExpandido && (
            <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-900 dark:text-white font-medium">Madrina/Padrino</span>
                  <div className="relative">
                    <input type="checkbox" checked={esMadrina} onChange={(e) => handleToggleMadrina(e.target.checked)} className="sr-only" />
                    <div className={`w-12 h-7 rounded-full transition-colors ${esMadrina ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full mt-1 transition-transform ${esMadrina ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                  </div>
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Ayuda a jugadores nuevos en el club</p>
              </div>

              {esMadrina && ahijadosPendientes.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Ahijados pendientes:</p>
                  {ahijadosPendientes.map((ahijado) => (
                    <div key={ahijado.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-600 p-3 rounded-lg">
                      <span className="text-gray-900 dark:text-white">{ahijado.nombre_completo}</span>
                      <button onClick={() => eliminarAhijadoPendiente(ahijado.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {esMadrina && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Nombre del ahijado"
                    value={nuevoAhijadoNombre}
                    onChange={(e) => setNuevoAhijadoNombre(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <input
                    type="email"
                    placeholder="Email (opcional)"
                    value={nuevoAhijadoEmail}
                    onChange={(e) => setNuevoAhijadoEmail(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    onClick={agregarAhijadoPendiente}
                    disabled={!nuevoAhijadoNombre.trim()}
                    className="w-full mt-2 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-50"
                  >
                    Agregar ahijado
                  </button>
                </div>
              )}

              <button
                onClick={handleGuardarPerfil}
                disabled={guardando}
                className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          )}
        </div>

        {/* Admin Link */}
        {displayPerfil?.rol && ['admin', 'moderador'].includes(displayPerfil.rol) && (
          <Link href="/admin/asistencia" className="block bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-300">
                {Icons.shield}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">Panel de Admin</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Control de asistencia y gestión</div>
              </div>
              <span className="text-gray-400 dark:text-gray-500">{Icons.chevronRight}</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}