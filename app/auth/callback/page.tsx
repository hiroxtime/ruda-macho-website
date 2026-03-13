'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Obtener la sesión actual
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error en callback:', error)
          router.push('/login?error=auth')
          return
        }

        if (!session?.user) {
          router.push('/login')
          return
        }

        // Verificar si el perfil existe y está completo
        const { data: perfil } = await supabase
          .from('perfiles')
          .select('perfil_completo')
          .eq('id', session.user.id)
          .single()

        // Si el perfil no existe o no está completo, redirigir a completar perfil
        if (!perfil || !perfil.perfil_completo) {
          router.push('/completar-perfil')
        } else {
          // Perfil completo, ir al dashboard/perfil
          router.push('/perfil')
        }
      } catch (err) {
        console.error('Error inesperado:', err)
        router.push('/login?error=unknown')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-ruda-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🏉</div>
        <h1 className="text-2xl font-black text-white mb-2">Procesando login...</h1>
        <p className="text-gray-400">Un momento por favor</p>
      </div>
    </div>
  )
}
