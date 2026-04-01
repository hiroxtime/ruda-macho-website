'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface Perfil {
  id: string
  tipo_jugador: 'activo' | 'asociado'
  posicion_preferida: string
  fecha_inicio_ruda: string
  estado_cuota: boolean
  privacidad_cuota: boolean
  nombre_completo: string
  telefono: string
  fecha_nacimiento: string
  numero_camiseta?: number
  avatar_url?: string
  es_madrina?: boolean
  perfil_completo?: boolean
  rol?: 'jugador' | 'moderador' | 'tesorero' | 'admin'
  qr_token?: string
  es_becado?: boolean
  fecha_vencimiento_beca?: string
}

interface PerfilMadrina {
  id: string
  madrina_id: string
  ahijado_id: string
  fecha_creacion: string
}

interface AuthContextType {
  user: User | null
  perfil: Perfil | null
  loading: boolean
  signUp: (email: string, password: string, data: Partial<Perfil>) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInWithMagicLink: (email: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateAvatar: (avatarUrl: string) => Promise<{ error: any }>
  checkProfileComplete: () => Promise<boolean>
  refreshPerfil: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchPerfil(session.user.id)
      }
      setLoading(false)
    })

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchPerfil(session.user.id)
      } else {
        setPerfil(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchPerfil = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        // Si el perfil no existe, crear uno básico
        if (error.code === 'PGRST116') {
          console.log('Perfil no encontrado, creando uno nuevo...')
          const { data: newPerfil, error: createError } = await supabase
            .from('perfiles')
            .insert({
              id: userId,
              nombre_completo: 'Nuevo Jugador',
              tipo_jugador: 'activo',
              posicion_preferida: 'A definir',
              fecha_inicio_ruda: new Date().toISOString().split('T')[0],
              perfil_completo: false,
            })
            .select()
            .single()
          
          if (createError) {
            console.error('Error al crear perfil:', createError)
          } else {
            setPerfil(newPerfil)
          }
        } else {
          console.error('Error al cargar perfil:', error)
        }
      } else if (data) {
        setPerfil(data)
      }
    } catch (err) {
      console.error('Error inesperado al cargar perfil:', err)
    }
  }

  const signUp = async (email: string, password: string, data: Partial<Perfil>) => {
    // Crear usuario en auth con metadata para el trigger
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre_completo: data.nombre_completo || 'Nuevo Jugador',
          tipo_jugador: data.tipo_jugador || 'activo',
          posicion_preferida: data.posicion_preferida || 'A definir',
          fecha_inicio_ruda: data.fecha_inicio_ruda || new Date().toISOString().split('T')[0],
          telefono: data.telefono || null,
          fecha_nacimiento: data.fecha_nacimiento || null,
          numero_camiseta: data.numero_camiseta?.toString() || null,
        }
      }
    })

    if (authError) {
      console.error('Error en signUp:', authError)
      return { error: authError }
    }

    // Si el trigger falló, crear el perfil manualmente
    if (authData?.user) {
      console.log('Usuario creado:', authData.user.id)
      
      // Esperar un momento para que el trigger se ejecute
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verificar si el perfil fue creado por el trigger
      const { data: existingPerfil, error: checkError } = await supabase
        .from('perfiles')
        .select('id')
        .eq('id', authData.user.id)
        .single()
      
      if (checkError || !existingPerfil) {
        console.log('Trigger no creó perfil, creando manualmente...')
        
        // Crear perfil manualmente
        const { error: insertError } = await supabase
          .from('perfiles')
          .insert({
            id: authData.user.id,
            nombre_completo: data.nombre_completo || 'Nuevo Jugador',
            tipo_jugador: data.tipo_jugador || 'activo',
            posicion_preferida: data.posicion_preferida || 'A definir',
            fecha_inicio_ruda: data.fecha_inicio_ruda || new Date().toISOString().split('T')[0],
            perfil_completo: false,
          })
        
        if (insertError) {
          console.error('Error creando perfil manual:', insertError)
          return { error: { message: 'Usuario creado pero error al crear perfil: ' + insertError.message } }
        }
      }
    }

    return { error: null }
  }

  const signIn = async (email: string, password: string) => {
    console.log('Intentando login con:', email)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.error('Error de Supabase:', error.message, error)
    } else {
      console.log('Login exitoso:', data)
      // Actualizar el estado local inmediatamente
      setUser(data.user)
      if (data.user) {
        fetchPerfil(data.user.id)
      }
    }
    
    return { error }
  }

  const signInWithMagicLink = async (email: string) => {
    console.log('Enviando magic link a:', email)
    const redirectUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : 'https://rudamachorugby.netlify.app/auth/callback'
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })
    
    if (error) {
      console.error('Error magic link:', error.message)
    }
    
    return { error }
  }

  const checkProfileComplete = async (): Promise<boolean> => {
    if (!user) return false
    
    const { data } = await supabase
      .from('perfiles')
      .select('perfil_completo')
      .eq('id', user.id)
      .single()
    
    return data?.perfil_completo ?? false
  }

  const signOut = async () => {
    try {
      // Cerrar sesión en Supabase y limpiar storage
      await supabase.auth.signOut()
      // Limpiar localStorage manualmente
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token')
        // Limpiar todas las claves de Supabase
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key)
          }
        })
      }
    } catch (err) {
      console.error('Error en signOut:', err)
      // Forzar limpieza aunque falle
      if (typeof window !== 'undefined') {
        localStorage.clear()
      }
    } finally {
      // Siempre limpiar el estado local
      setUser(null)
      setPerfil(null)
    }
  }

  const updateAvatar = async (avatarUrl: string) => {
    if (!user) return { error: 'No user' }
    
    const { error } = await supabase
      .from('perfiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id)
    
    if (!error && perfil) {
      setPerfil({ ...perfil, avatar_url: avatarUrl })
    }
    
    return { error }
  }

  const refreshPerfil = async () => {
    if (!user) return
    await fetchPerfil(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, perfil, loading, signUp, signIn, signInWithMagicLink, signOut, updateAvatar, checkProfileComplete, refreshPerfil }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
