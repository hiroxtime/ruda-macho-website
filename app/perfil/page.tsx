'use client'

import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Perfil() {
  const { user, perfil, loading, signOut } = useAuth()
  const router = useRouter()
  const [privacidad, setPrivacidad] = useState(false)
  const [finanzasExpandido, setFinanzasExpandido] = useState(false)
  const [rudaSchoolExpandido, setRudaSchoolExpandido] = useState(false)
  const [editarPerfilExpandido, setEditarPerfilExpandido] = useState(false)
  const [madrinaExpandido, setMadrinaExpandido] = useState(false)
  const [esMadrina, setEsMadrina] = useState(perfil?.es_madrina || false)
  const [ahijados, setAhijados] = useState<any[]>([])
  const [ahijadosSeleccionados, setAhijadosSeleccionados] = useState<string[]>([])
  const [jugadoresDisponibles, setJugadoresDisponibles] = useState<any[]>([])
  const [ahijadosPendientes, setAhijadosPendientes] = useState<any[]>([])
  const [nuevoAhijadoNombre, setNuevoAhijadoNombre] = useState('')
  const [nuevoAhijadoEmail, setNuevoAhijadoEmail] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [localPerfil, setLocalPerfil] = useState(perfil)

  useEffect(() => {
    setLocalPerfil(perfil)
  }, [perfil])

  // Cargar ahijados si es madrina
  useEffect(() => {
    const fetchAhijados = async () => {
      if (!user || !perfil?.es_madrina) return
      
      const { data } = await supabase
        .from('madrinas_ahijados')
        .select(`
          ahijado:ahijado_id (
            id,
            nombre_completo,
            posicion_preferida,
            avatar_url
          )
        `)
        .eq('madrina_id', user.id)
      
      if (data) {
        setAhijados(data.map((item: any) => item.ahijado))
      }
    }
    
    fetchAhijados()
  }, [user, perfil])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-ruda-black flex items-center justify-center">
        <div className="text-white">Cargando... 🏉</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!perfil) {
    return (
      <div className="min-h-screen bg-ruda-black py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">🏉</div>
          <h1 className="text-3xl font-black text-white mb-4">¡Bienvenido a Ruda! 🎉</h1>
          <p className="text-ruda-gold mb-8">Tu cuenta ha sido creada exitosamente.</p>
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <p className="text-gray-600 mb-6">
              Estamos cargando tu perfil... Si esto persiste, recargá la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-ruda-green text-white font-bold py-3 px-8 rounded-full hover:bg-ruda-dark-green transition-colors"
            >
              Recargar página
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  // Cargar jugadores disponibles para ser ahijados
  useEffect(() => {
    const fetchJugadores = async () => {
      if (!user) return
      
      const { data } = await supabase
        .from('perfiles')
        .select('id, nombre_completo, avatar_url')
        .neq('id', user.id)
        .order('nombre_completo')
      
      if (data) {
        setJugadoresDisponibles(data)
      }
    }
    
    fetchJugadores()
  }, [user])

  // Cargar ahijados pendientes
  useEffect(() => {
    const fetchAhijadosPendientes = async () => {
      if (!user || !perfil?.es_madrina) return
      
      const { data } = await supabase
        .from('ahijados_pendientes')
        .select('*')
        .eq('madrina_id', user.id)
        .is('perfil_id', null)
      
      if (data) {
        setAhijadosPendientes(data)
      }
    }
    
    fetchAhijadosPendientes()
  }, [user, perfil])

  const agregarAhijadoPendiente = async () => {
    if (!nuevoAhijadoNombre.trim() || !user) return
    
    const { data, error } = await supabase
      .from('ahijados_pendientes')
      .insert({
        madrina_id: user.id,
        nombre_completo: nuevoAhijadoNombre.trim(),
        email: nuevoAhijadoEmail.trim() || null
      })
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
    const { error } = await supabase
      .from('ahijados_pendientes')
      .delete()
      .eq('id', id)
    
    if (error) {
      alert('Error al eliminar: ' + error.message)
    } else {
      setAhijadosPendientes(ahijadosPendientes.filter(a => a.id !== id))
    }
  }

  const handleToggleMadrina = async (value: boolean) => {
    setEsMadrina(value)
    
    if (!user) return
    
    // Actualizar en Supabase
    const { error } = await supabase
      .from('perfiles')
      .update({ es_madrina: value })
      .eq('id', user.id)
    
    if (error) {
      alert('Error al actualizar: ' + error.message)
      setEsMadrina(!value) // Revertir
    } else {
      // Actualizar estado local
      if (localPerfil) {
        setLocalPerfil({ ...localPerfil, es_madrina: value })
      }
    }
  }

  const toggleAhijado = (id: string) => {
    setAhijadosSeleccionados(prev => 
      prev.includes(id) 
        ? prev.filter(a => a !== id)
        : [...prev, id]
    )
  }

  const handleGuardarPerfil = async () => {
    if (!user) return
    
    setGuardando(true)
    
    try {
      // Guardar relaciones de ahijados
      if (esMadrina && ahijadosSeleccionados.length > 0) {
        // Primero borrar relaciones existentes
        await supabase
          .from('madrinas_ahijados')
          .delete()
          .eq('madrina_id', user.id)
        
        // Insertar nuevas relaciones
        const relaciones = ahijadosSeleccionados.map(ahijadoId => ({
          madrina_id: user.id,
          ahijado_id: ahijadoId
        }))
        
        await supabase
          .from('madrinas_ahijados')
          .insert(relaciones)
      }
      
      // Marcar perfil como completo
      await supabase
        .from('perfiles')
        .update({ perfil_completo: true })
        .eq('id', user.id)
      
      alert('¡Perfil actualizado exitosamente! ✓')
      setEditarPerfilExpandido(false)
      
      // Recargar para ver cambios
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
      // Subir a Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)
      
      if (uploadError) {
        alert('Error al subir imagen: ' + uploadError.message)
        return
      }
      
      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
      
      // Actualizar perfil
      const { error: updateError } = await supabase
        .from('perfiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)
      
      if (updateError) {
        alert('Error al actualizar perfil: ' + updateError.message)
        return
      }
      
      // Actualizar estado local
      if (localPerfil) {
        setLocalPerfil({ ...localPerfil, avatar_url: publicUrl })
      }
      
      alert('¡Foto de perfil actualizada!')
    } catch (err) {
      alert('Error: ' + (err as Error).message)
    }
  }

  // Datos mock de Ruda School (después se conectan a la base de datos)
  const rudaSchoolStats = {
    nivel: 2,
    leccionesCompletadas: 8,
    totalLecciones: 24,
    xp: 450,
    badges: ['🎯 Especialista', '🏃 Jugador Activo'],
    ultimaLeccion: 'Técnica de pase - Avanzado'
  }

  return (
    <div className="min-h-screen bg-ruda-black">
      {/* Hero Section - Estilo "a lo Fang" */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ruda-green/20 via-transparent to-ruda-gold/10" />
        <div className="max-w-4xl mx-auto px-4 py-16 relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <Link href="/" className="flex items-center gap-3 group">
              <img 
                src="/assets/Logo%20Ruda%20Macho.png" 
                alt="Ruda Macho" 
                className="h-12 group-hover:scale-110 transition-transform"
              />
              <span className="text-white font-bold text-lg hidden sm:block">← Volver</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="text-ruda-gold hover:text-white font-bold text-sm transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Profile Hero */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar con opción de cambiar */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-ruda-green to-ruda-dark-green p-1">
                <div className="w-full h-full rounded-full bg-ruda-black flex items-center justify-center text-5xl overflow-hidden">
                  {localPerfil?.avatar_url ? (
                    <img src={localPerfil.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{localPerfil?.tipo_jugador === 'activo' ? '🏃' : '🤝'}</span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => document.getElementById('avatar-input')?.click()}
                className="absolute -bottom-2 -right-2 bg-ruda-gold text-ruda-black w-10 h-10 rounded-full flex items-center justify-center font-bold hover:bg-yellow-400 transition-colors shadow-lg cursor-pointer"
                title="Cambiar foto de perfil"
              >
                📷
              </button>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleChangeAvatar}
                className="hidden"
              />
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                {localPerfil?.nombre_completo}
              </h1>
              <p className="text-ruda-gold text-xl font-bold mb-4">
                {localPerfil?.tipo_jugador === 'activo' ? 'Jugador Activo' : 'Miembro Asociado'}
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <span className="px-4 py-2 bg-white/10 rounded-full text-white text-sm">
                  🏉 {localPerfil?.posicion_preferida}
                </span>
                <span className="px-4 py-2 bg-white/10 rounded-full text-white text-sm">
                  📅 Desde {new Date(localPerfil?.fecha_inicio_ruda || '').toLocaleDateString('es-AR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 pb-12 space-y-4">
        
        {/* Info de contacto */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 border border-white/10">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-400 text-sm mb-1">Email</h3>
              <p className="text-white font-medium">{user?.email}</p>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm mb-1">Teléfono</h3>
              <p className="text-white font-medium">{localPerfil?.telefono || 'No registrado'}</p>
            </div>
          </div>
        </div>

        {/* Ruda School - Colapsable */}
        <div className="bg-gradient-to-r from-ruda-green/20 to-ruda-dark-green/20 rounded-2xl border border-ruda-green/30 overflow-hidden">
          <button
            onClick={() => setRudaSchoolExpandido(!rudaSchoolExpandido)}
            className="w-full p-6 flex items-center justify-between hover:bg-ruda-green/10 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-ruda-green rounded-xl flex items-center justify-center text-2xl">
                🎓
              </div>
              <div className="text-left">
                <h2 className="text-xl font-black text-white">Ruda School</h2>
                <p className="text-ruda-gold text-sm">Nivel {rudaSchoolStats.nivel} • {rudaSchoolStats.leccionesCompletadas}/{rudaSchoolStats.totalLecciones} lecciones</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <span className="text-2xl font-black text-ruda-gold">{rudaSchoolStats.xp} XP</span>
              </div>
              <span className="text-2xl text-white">
                {rudaSchoolExpandido ? '▼' : '▶'}
              </span>
            </div>
          </button>
          
          {rudaSchoolExpandido && (
            <div className="px-6 pb-6">
              {/* Barra de progreso */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Progreso general</span>
                  <span>{Math.round((rudaSchoolStats.leccionesCompletadas / rudaSchoolStats.totalLecciones) * 100)}%</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-ruda-green to-ruda-gold rounded-full transition-all duration-500"
                    style={{ width: `${(rudaSchoolStats.leccionesCompletadas / rudaSchoolStats.totalLecciones) * 100}%` }}
                  />
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-ruda-black/50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-1">📚</div>
                  <div className="text-2xl font-black text-white">{rudaSchoolStats.leccionesCompletadas}</div>
                  <div className="text-xs text-gray-400">Lecciones</div>
                </div>
                <div className="bg-ruda-black/50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-1">⭐</div>
                  <div className="text-2xl font-black text-ruda-gold">{rudaSchoolStats.xp}</div>
                  <div className="text-xs text-gray-400">XP Total</div>
                </div>
                <div className="bg-ruda-black/50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-1">🏆</div>
                  <div className="text-2xl font-black text-white">{rudaSchoolStats.badges.length}</div>
                  <div className="text-xs text-gray-400">Badges</div>
                </div>
                <div className="bg-ruda-black/50 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-1">🎯</div>
                  <div className="text-2xl font-black text-white">Nivel {rudaSchoolStats.nivel}</div>
                  <div className="text-xs text-gray-400">Actual</div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {rudaSchoolStats.badges.map((badge, idx) => (
                  <span key={idx} className="px-3 py-1 bg-ruda-gold/20 text-ruda-gold rounded-full text-sm font-bold">
                    {badge}
                  </span>
                ))}
              </div>

              {/* Última actividad */}
              <div className="bg-ruda-black/30 rounded-lg p-4">
                <span className="text-gray-400 text-sm">Última lección:</span>
                <p className="text-white font-medium">{rudaSchoolStats.ultimaLeccion}</p>
              </div>

              <Link 
                href="/ruda-school"
                className="block w-full mt-4 bg-ruda-green text-white font-bold py-3 rounded-xl text-center hover:bg-ruda-dark-green transition-colors"
              >
                Continuar aprendiendo →
              </Link>
            </div>
          )}
        </div>

        {/* Finanzas - Colapsable */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-white/10 overflow-hidden">
          <button
            onClick={() => setFinanzasExpandido(!finanzasExpandido)}
            className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-ruda-gold/20 rounded-xl flex items-center justify-center text-2xl">
                💰
              </div>
              <div className="text-left">
                <h2 className="text-xl font-black text-white">Mis Finanzas</h2>
                <p className="text-gray-400 text-sm">{localPerfil?.estado_cuota ? '✅ Al día' : '❌ Pendiente'}</p>
              </div>
            </div>
            <span className="text-2xl text-gray-400">
              {finanzasExpandido ? '▼' : '▶'}
            </span>
          </button>
          
          {finanzasExpandido && (
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-gray-400">Ocultar/mostrar montos</span>
                
                <button
                  onClick={() => setPrivacidad(!privacidad)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-gray-300 hover:bg-white/20 transition-colors"
                >
                  <span className="text-xl">{privacidad ? '👁️' : '🙈'}</span>
                  <span className="text-sm font-bold">{privacidad ? 'Mostrar' : 'Ocultar'}</span>
                </button>
              </div>

              <div className="bg-ruda-black rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Estado de cuenta:</span>
                  <span className={`font-bold ${localPerfil?.estado_cuota ? 'text-green-400' : 'text-red-400'}`}>
                    {localPerfil?.estado_cuota ? '✅ Al día' : '❌ Pendiente'}
                  </span>
                </div>
                
                <div className="border-t border-gray-700 pt-4 mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Monto mensual:</span>
                    <span className="text-2xl font-black text-white">
                      {privacidad ? '****' : '$35.000'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Próximo vencimiento:</span>
                    <span className="text-lg font-bold text-white">
                      {privacidad ? '****' : '15/04/2026'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Completar Perfil - Colapsable */}
        <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-2xl border border-blue-500/30 overflow-hidden">
          <button
            onClick={() => setEditarPerfilExpandido(!editarPerfilExpandido)}
            className="w-full p-6 flex items-center justify-between hover:bg-blue-500/10 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center text-2xl">
                ✏️
              </div>
              <div className="text-left">
                <h2 className="text-xl font-black text-white">Completar Perfil</h2>
                <p className="text-blue-400 text-sm">
                  {localPerfil?.perfil_completo ? 'Perfil completo ✓' : 'Faltan datos por completar'}
                </p>
              </div>
            </div>
            <span className="text-2xl text-white">
              {editarPerfilExpandido ? '▼' : '▶'}
            </span>
          </button>
          
          {editarPerfilExpandido && (
            <div className="px-6 pb-6 space-y-4">
              {/* Toggle Madrina */}
              <div className="bg-ruda-black/30 rounded-xl p-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-white font-medium">¿Sos madrina/padrino? 👑</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={esMadrina}
                      onChange={(e) => handleToggleMadrina(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-14 h-8 rounded-full transition-colors ${esMadrina ? 'bg-ruda-gold' : 'bg-gray-600'}`}>
                      <div className={`w-6 h-6 bg-white rounded-full mt-1 transition-transform ${esMadrina ? 'translate-x-7' : 'translate-x-1'}`} />
                    </div>
                  </div>
                </label>
              </div>

              {/* Selección de Ahijados (solo si es madrina) */}
              {esMadrina && (
                <div className="bg-ruda-black/30 rounded-xl p-4 space-y-4">
                  <h3 className="text-white font-bold">Tus ahijados:</h3>
                  
                  {/* Lista de ahijados pendientes */}
                  {ahijadosPendientes.length > 0 && (
                    <div className="space-y-2">
                      {ahijadosPendientes.map((ahijado) => (
                        <div key={ahijado.id} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🏃</span>
                            <div>
                              <p className="text-white font-medium">{ahijado.nombre_completo}</p>
                              {ahijado.email && <p className="text-gray-400 text-sm">{ahijado.email}</p>}
                              <p className="text-yellow-500 text-xs">⏳ Pendiente de registro</p>
                            </div>
                          </div>
                          <button
                            onClick={() => eliminarAhijadoPendiente(ahijado.id)}
                            className="text-red-400 hover:text-red-300 px-2"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Formulario para agregar nuevo ahijado */}
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-gray-400 text-sm mb-3">Agregar ahijado (aún no registrado):</p>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        value={nuevoAhijadoNombre}
                        onChange={(e) => setNuevoAhijadoNombre(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruda-gold"
                      />
                      <input
                        type="email"
                        placeholder="Email (opcional)"
                        value={nuevoAhijadoEmail}
                        onChange={(e) => setNuevoAhijadoEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ruda-gold"
                      />
                      <button
                        type="button"
                        onClick={agregarAhijadoPendiente}
                        disabled={!nuevoAhijadoNombre.trim()}
                        className="w-full bg-ruda-gold/20 text-ruda-gold font-bold py-2 rounded-lg hover:bg-ruda-gold/30 transition-colors disabled:opacity-50"
                      >
                        + Agregar ahijado
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón Guardar */}
              <button
                onClick={handleGuardarPerfil}
                disabled={guardando}
                className="w-full bg-ruda-green text-white font-bold py-3 rounded-xl hover:bg-ruda-dark-green transition-colors disabled:opacity-50"
              >
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          )}
        </div>

        {/* Madrina/Padrino - Colapsable */}
        <div className="bg-gradient-to-r from-ruda-gold/20 to-yellow-900/20 rounded-2xl border border-ruda-gold/30 overflow-hidden">
          <button
            onClick={() => setMadrinaExpandido(!madrinaExpandido)}
            className="w-full p-6 flex items-center justify-between hover:bg-ruda-gold/10 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-ruda-gold/30 rounded-xl flex items-center justify-center text-2xl">
                👑
              </div>
              <div className="text-left">
                <h2 className="text-xl font-black text-white">Madrina/Padrino</h2>
                <p className="text-ruda-gold text-sm">
                  {localPerfil?.es_madrina 
                    ? `${ahijados.length + ahijadosPendientes.length} ahijado${(ahijados.length + ahijadosPendientes.length) !== 1 ? 's' : ''}` 
                    : 'No sos madrina/padrino'}
                </p>
              </div>
            </div>
            <span className="text-2xl text-white">
              {madrinaExpandido ? '▼' : '▶'}
            </span>
          </button>
          
          {madrinaExpandido && (
            <div className="px-6 pb-6">
              {!localPerfil?.es_madrina ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 mb-4">
                    ¿Querés ser madrina/padrino y ayudar a los jugadores nuevos?
                  </p>
                  <Link
                    href="/completar-perfil"
                    className="inline-block bg-ruda-gold text-ruda-black font-bold py-3 px-6 rounded-full hover:bg-ruda-gold-light transition-colors"
                  >
                    Activar madrina/padrino
                  </Link>
                </div>
              ) : ahijados.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-400 mb-4">
                    Aún no tenés ahijados asignados.
                  </p>
                  <Link
                    href="/completar-perfil"
                    className="inline-block bg-ruda-gold/20 text-ruda-gold font-bold py-3 px-6 rounded-full hover:bg-ruda-gold/30 transition-colors"
                  >
                    Agregar ahijados
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-ruda-gold font-bold mb-4">Tus ahijados:</p>
                  {ahijados.map((ahijado) => (
                    <div
                      key={ahijado.id}
                      className="flex items-center gap-4 p-4 bg-ruda-black/30 rounded-xl"
                    >
                      <div className="w-12 h-12 rounded-full bg-ruda-green flex items-center justify-center text-xl overflow-hidden">
                        {ahijado.avatar_url ? (
                          <img 
                            src={ahijado.avatar_url} 
                            alt="" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          '🏉'
                        )}
                      </div>
                      <div>
                        <p className="text-white font-bold">{ahijado.nombre_completo}</p>
                        <p className="text-gray-400 text-sm">{ahijado.posicion_preferida || 'Sin posición'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
