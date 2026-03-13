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
  signInWithGoogle: () => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateAvatar: (avatarUrl: string) => Promise<{ error: any }>
  checkProfileComplete: () => Promise<boolean>
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
    const { data } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (data) {
      setPerfil(data)
    }
  }

  const signUp = async (email: string, password: string, data: Partial<Perfil>) => {
    // Crear usuario en auth con metadata para el trigger
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre_completo: data.nombre_completo,
          tipo_jugador: data.tipo_jugador,
          posicion_preferida: data.posicion_preferida,
          fecha_inicio_ruda: data.fecha_inicio_ruda,
          telefono: data.telefono,
          fecha_nacimiento: data.fecha_nacimiento,
          numero_camiseta: data.numero_camiseta?.toString(),
        }
      }
    })

    if (authError) {
      return { error: authError }
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

  const signInWithGoogle = async () => {
    console.log('Iniciando login con Google...')
    const redirectUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : 'https://rudamachorugby.netlify.app/auth/callback'
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    })
    
    if (error) {
      console.error('Error de Google OAuth:', error.message, error)
    } else {
      console.log('Redirigiendo a Google...', data)
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
    await supabase.auth.signOut()
    setPerfil(null)
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

  return (
    <AuthContext.Provider value={{ user, perfil, loading, signUp, signIn, signInWithGoogle, signOut, updateAvatar, checkProfileComplete }}>
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
