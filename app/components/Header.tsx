'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useAuth()

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-ruda-black/95 backdrop-blur-md border-b border-white/10">
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
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Inicio
            </Link>
            <Link href="/ruda-school" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Ruda School
            </Link>
            {user ? (
              <Link 
                href="/perfil" 
                className="bg-ruda-green text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-ruda-dark-green transition-colors"
              >
                Mi Perfil
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Ingresar
                </Link>
                <Link 
                  href="/registro" 
                  className="bg-ruda-gold text-ruda-black px-4 py-2 rounded-full text-sm font-bold hover:bg-yellow-400 transition-colors"
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
        <div className="md:hidden bg-ruda-black border-t border-white/10 absolute left-0 right-0 top-16 shadow-xl">
          <div className="px-4 py-4 space-y-2">
            <Link 
              href="/" 
              onClick={closeMenu}
              className="block text-gray-300 hover:text-white hover:bg-white/10 py-3 px-4 rounded-lg transition-colors"
            >
              Inicio
            </Link>
            <Link 
              href="/ruda-school" 
              onClick={closeMenu}
              className="block text-gray-300 hover:text-white hover:bg-white/10 py-3 px-4 rounded-lg transition-colors"
            >
              Ruda School
            </Link>
            {user ? (
              <Link 
                href="/perfil" 
                onClick={closeMenu}
                className="block bg-ruda-green text-white py-3 px-4 rounded-lg text-center font-bold mt-4"
              >
                Mi Perfil
              </Link>
            ) : (
              <div className="space-y-2 mt-4">
                <Link 
                  href="/login" 
                  onClick={closeMenu}
                  className="block text-gray-300 hover:text-white hover:bg-white/10 py-3 px-4 rounded-lg transition-colors"
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
