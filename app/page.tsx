'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

// Pantalla de carga con animaciones
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 1
      })
    }, 80)
    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-ruda-black flex flex-col items-center justify-center p-4">
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 193, 7, 0.4), 0 0 40px rgba(255, 193, 7, 0.2); }
          50% { box-shadow: 0 0 40px rgba(255, 193, 7, 0.8), 0 0 60px rgba(255, 193, 7, 0.4), 0 0 80px rgba(255, 193, 7, 0.2); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(25deg); }
          100% { transform: translateX(200%) rotate(25deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes particle-float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
        }
      `}</style>

      <div className="w-full max-w-5xl flex flex-col items-center">
        
        <div className="w-full max-w-3xl mb-8">
          <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-ruda-gold/20">
            <div className="absolute inset-0 border-2 border-ruda-gold/30 rounded-xl z-20 pointer-events-none" />
            <div className="absolute inset-0 border border-white/10 rounded-xl z-20 pointer-events-none m-1" />
            
            <div className="relative aspect-[16/9] bg-ruda-black overflow-hidden">
              <video 
                autoPlay 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'center 20%' }}
              >
                <source src="/assets/Animación_de_Carga_Minimalista_y_Fluida.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-ruda-black/60 via-transparent to-ruda-black/60 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-ruda-black/30 via-transparent to-ruda-black/30 pointer-events-none" />
            </div>
            
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-ruda-gold rounded-tl-lg z-30" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-ruda-gold rounded-tr-lg z-30" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-ruda-gold rounded-bl-lg z-30" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-ruda-gold rounded-br-lg z-30" />
          </div>
        </div>

        <div className="relative w-48 h-48 mb-8">
          
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, transparent 0%, #FFC107 ${progress/2}%, #FFC107 ${progress}%, transparent ${progress}%)`,
              padding: '4px',
              animation: progress < 100 ? 'rotate-slow 8s linear infinite' : 'none'
            }}
          >
            <div className="w-full h-full rounded-full bg-ruda-black" />
          </div>

          <div 
            className="absolute inset-0 rounded-full"
            style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
          />

          <div 
            className="absolute inset-2 rounded-full overflow-hidden bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center"
            style={{ animation: 'float 3s ease-in-out infinite' }}
          >
            
            <img
              src="/assets/Logo%20Ruda%20Macho.png"
              alt="Ruda"
              className="w-36 h-36 object-contain opacity-20"
            />
            
            <div 
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
              style={{ 
                clipPath: `inset(${100 - progress}% 0 0 0)`,
                transition: 'clip-path 0.1s linear'
              }}
            >
              <img
                src="/assets/Logo%20Ruda%20Macho.png"
                alt="Ruda"
                className="w-36 h-36 object-contain"
                style={{ 
                  filter: 'drop-shadow(0 0 20px rgba(255, 193, 7, 0.8))',
                  transform: progress === 100 ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.3s ease-out'
                }}
              />
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-1/2"
                style={{ animation: 'shimmer 2s infinite' }}
              />
            </div>

            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
          </div>

          <svg className="absolute -inset-4 w-56 h-56 transform -rotate-90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFC107" />
                <stop offset="50%" stopColor="#FFD54F" />
                <stop offset="100%" stopColor="#FFC107" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="none" stroke="#1f2937" strokeWidth="2" />
            <circle
              cx="50" cy="50" r="46"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.89} 289`}
              className="transition-all duration-100"
              style={{ filter: 'drop-shadow(0 0 8px rgba(255,193,7,1))' }}
            />
          </svg>

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-1.5 h-1.5 bg-ruda-gold rounded-full" style={{ top: '5%', left: '-8%', animation: 'particle-float 3s ease-in-out infinite', boxShadow: '0 0 10px rgba(255, 193, 7, 1)' }} />
            <div className="absolute w-1 h-1 bg-ruda-gold rounded-full" style={{ top: '85%', left: '-5%', animation: 'particle-float 2.5s ease-in-out infinite 0.5s', boxShadow: '0 0 8px rgba(255, 193, 7, 1)' }} />
            <div className="absolute w-1.5 h-1.5 bg-ruda-gold rounded-full" style={{ top: '15%', right: '-8%', animation: 'particle-float 2.8s ease-in-out infinite 1s', boxShadow: '0 0 10px rgba(255, 193, 7, 1)' }} />
            <div className="absolute w-1 h-1 bg-ruda-gold rounded-full" style={{ top: '75%', right: '-5%', animation: 'particle-float 3.2s ease-in-out infinite 0.3s', boxShadow: '0 0 8px rgba(255, 193, 7, 1)' }} />
            <div className="absolute w-1 h-1 bg-ruda-gold rounded-full" style={{ top: '50%', left: '-10%', animation: 'particle-float 2.2s ease-in-out infinite 0.7s', boxShadow: '0 0 6px rgba(255, 193, 7, 0.8)' }} />
            <div className="absolute w-1 h-1 bg-ruda-gold rounded-full" style={{ top: '45%', right: '-10%', animation: 'particle-float 2.7s ease-in-out infinite 0.2s', boxShadow: '0 0 6px rgba(255, 193, 7, 0.8)' }} />
          </div>
        </div>

        <div className="text-center">
          <p className="text-ruda-gold font-black text-xl tracking-[0.5em] mb-4 animate-pulse">
            CARGANDO
          </p>          
          <div className="w-56 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto mb-3">
            <div 
              className="h-full bg-gradient-to-r from-ruda-gold via-ruda-gold-light to-ruda-gold rounded-full"
              style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
            />
          </div>
          
          <p className="text-white/50 font-mono text-lg">{progress}%</p>
        </div>
      </div>
    </div>
  )
}

// Hero con efectos 'a lo Fang'
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ruda-black">
      <style>{`
        @keyframes float-logo {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255,193,7,0.4)); }
          50% { filter: drop-shadow(0 0 40px rgba(255,193,7,0.8)) drop-shadow(0 0 60px rgba(255,193,7,0.4)); }
        }
        @keyframes text-shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div className="absolute inset-0 bg-gradient-to-br from-ruda-green-dark via-ruda-black to-ruda-black" />
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,193,7,0.1) 50px, rgba(255,193,7,0.1) 51px)'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Logo - Primero en móvil, segundo en desktop */}
          <div className="order-1 lg:order-2">
            <div 
              className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-full lg:max-w-md mx-auto"
              style={{ animation: 'float-logo 4s ease-in-out infinite' }}
            >
              <div className="absolute inset-0 bg-ruda-gold/20 blur-3xl rounded-full" />
              <img
                src="/assets/Logo%20Ruda%20Macho.png"
                alt="Ruda Rugby Club"
                className="relative w-full h-full object-contain"
                style={{ animation: 'glow-pulse 2s ease-in-out infinite' }}
              />
            </div>
          </div>
          
          {/* Texto - Segundo en móvil, primero en desktop */}
          <div className="order-2 lg:order-1">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-6">
              <span className="block">NUESTRA LUCHA</span>
              <span 
                className="block"
                style={{
                  background: 'linear-gradient(90deg, #FFC107, #FFD54F, #FFC107)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'text-shine 3s linear infinite'
                }}
              >
                ES JUGANDO
              </span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-lg">
              Más que un club. Somos una familia unida por la pasión del rugby.
            </p>

            <Link 
              href="/ruda-school" 
              className="inline-block px-8 py-4 bg-ruda-gold text-ruda-black font-black text-lg rounded-lg transition-all hover:scale-110 hover:shadow-xl hover:shadow-ruda-gold/30"
            >
              COMENZAR RUDA SCHOOL
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Nosotros + Equipo con efectos
function AboutSection() {
  return (
    <section id="nosotros" className="py-24 bg-white relative overflow-hidden">
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(255, 193, 7, 0.2); }
          50% { border-color: rgba(255, 193, 7, 0.6); }
        }
        @keyframes float-card {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shine-text {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .card-team:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
      `}</style>

      <div className="absolute top-0 right-0 w-96 h-96 bg-ruda-green/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-ruda-gold/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-ruda-gold font-black text-sm tracking-widest">SOBRE NOSOTROS</span>
          <h2 className="text-4xl md:text-5xl font-black text-ruda-black mt-2 mb-4">
            QUIÉNES <span className="text-ruda-green">SOMOS</span>
          </h2>
        </div>

        <div 
          className="bg-ruda-black rounded-2xl p-8 md:p-12 mb-16 text-center relative overflow-hidden"
          style={{ animation: 'fade-in-up 0.8s ease-out 0.2s forwards', opacity: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-ruda-green/20 to-ruda-gold/20" />
          <div className="relative z-10">
            <p 
              className="text-ruda-gold font-black text-lg tracking-widest mb-4"
              style={{ animation: 'pulse 2s infinite' }}
            >
              NUESTRO LEMA
            </p>
            <h3 
              className="text-4xl md:text-6xl font-black text-white italic"
              style={{
                background: 'linear-gradient(90deg, #fff, #FFC107, #fff)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shine-text 4s linear infinite'
              }}
            >
              "LA LUCHA ES JUGANDO"
            </h3>
          </div>
        </div>

        <div className="mb-16">
          <h3 
            className="text-3xl font-black text-center text-ruda-black mb-12"
            style={{ animation: 'fade-in-up 0.8s ease-out 0.4s forwards', opacity: 0 }}
          >
            NUESTRO <span className="text-ruda-gold">EQUIPO</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div 
              className="bg-gray-50 rounded-2xl p-8 text-center shadow-lg card-team transition-all duration-300"
              style={{ 
                animation: 'fade-in-up 0.8s ease-out 0.6s forwards', 
                opacity: 0,
                animationDelay: '0.6s'
              }}
            >
              <div 
                className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-200 overflow-hidden border-4 transition-all duration-300"
                style={{ animation: 'pulse-border 2s infinite' }}
              >
                <img src="/assets/Presidente%20Ruda.png" alt="Fabián Fretti" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-xl font-black text-ruda-black">Fabián Luciano Fretti</h4>
              <p className="text-ruda-gold font-bold">PRESIDENTE</p>
            </div>

            <div 
              className="bg-gray-50 rounded-2xl p-8 text-center shadow-lg card-team transition-all duration-300"
              style={{ 
                animation: 'fade-in-up 0.8s ease-out 0.8s forwards', 
                opacity: 0,
                animationDelay: '0.8s'
              }}
            >
              <div 
                className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-200 overflow-hidden border-4 transition-all duration-300"
                style={{ animation: 'pulse-border 2s infinite 0.5s' }}
              >
                <img src="/assets/Miembro%20fundador.png" alt="Eduardo Gusa" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-xl font-black text-ruda-black">Eduardo Gusa del Valle</h4>
              <p className="text-ruda-gold font-bold">MIEMBRO FUNDADOR</p>
            </div>
          </div>
        </div>

        <div 
          className="grid md:grid-cols-4 gap-6"
          style={{ animation: 'fade-in-up 0.8s ease-out 1s forwards', opacity: 0 }}
        >
          {['PASIÓN', 'COMPAÑERISMO', 'ENTREGA', 'MEJORA'].map((item, i) => (
            <div 
              key={item} 
              className="bg-gray-50 rounded-xl p-6 text-center shadow hover:shadow-lg hover:bg-ruda-green hover:text-white transition-all duration-300 group cursor-default"
              style={{ animationDelay: `${1 + i * 0.1}s` }}
            >
              <h3 className="text-xl font-black text-ruda-green group-hover:text-white transition-colors">{item}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="bg-ruda-black py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-600">© 2024 Ruda Rugby Club. La Lucha es Jugando.</p>
      </div>
    </footer>
  )
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      {!isLoading && (
        <>
          <main className="pt-0">
            <HeroSection />
            <AboutSection />
          </main>
          <Footer />
        </>
      )}
    </>
  )
}
