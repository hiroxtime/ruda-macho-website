'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  // No renderizar user hasta estar montado
  const showUser = mounted && user

  return (
    <header className="sticky top-0 z-50 bg-ruda-green/95 dark:bg-gray-900/95 border-b border-white/10 dark:border-gray-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/assets/Logo%20Ruda%20Macho.png" 
              alt="Ruda Macho" 
              className="h-10 w-auto"
            />
            <span className="text-white font-bold text-lg hidden sm:block">Ruda Macho</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Inicio
            </Link>
            <Link href="/ruda-school" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Ruda School
            </Link>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {showUser ? (
              <Link 
                href="/perfil" 
                className="bg-ruda-gold text-ruda-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors"
              >
                Mi Perfil
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  Ingresar
                </Link>
                <Link 
                  href="/registro" 
                  className="bg-ruda-gold text-ruda-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 text-white active:scale-95 transition-transform"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-ruda-green/95 dark:bg-gray-900/95 border-t border-white/10 absolute left-0 right-0 shadow-xl z-[60] overflow-y-auto max-h-[calc(100vh-4rem)] backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            <Link 
              href="/" 
              onClick={closeMenu}
              className="block text-white/80 hover:text-white hover:bg-white/10 py-3 px-4 rounded-lg transition-colors"
            >
              Inicio
            </Link>
            <Link 
              href="/ruda-school" 
              onClick={closeMenu}
              className="block text-white/80 hover:text-white hover:bg-white/10 py-3 px-4 rounded-lg transition-colors"
            >
              Ruda School
            </Link>
            
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 py-3 px-4 rounded-lg transition-colors"
            >
              {theme === 'light' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Modo oscuro
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Modo claro
                </>
              )}
            </button>

            {showUser ? (
              <Link 
                href="/perfil" 
                onClick={closeMenu}
                className="block bg-ruda-gold text-ruda-black py-3 px-4 rounded-lg text-center font-bold mt-4"
              >
                Mi Perfil
              </Link>
            ) : (
              <div className="space-y-2 mt-4">
                <Link 
                  href="/login" 
                  onClick={closeMenu}
                  className="block text-white/80 hover:text-white hover:bg-white/10 py-3 px-4 rounded-lg transition-colors"
                >
                  Ingresar
                </Link>
                <Link 
                  href="/registro" 
                  onClick={closeMenu}
                  className="block bg-ruda-gold text-ruda-black py-3 px-4 rounded-lg text-center font-bold"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}