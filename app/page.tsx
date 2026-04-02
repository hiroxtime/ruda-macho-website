'use client'

// Cache bust: 1743447600
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registrar plugins de GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Función para crear emojis volando
function createEmoji(event: React.MouseEvent, emoji: string) {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;
  
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('div');
    el.textContent = emoji;
    const angle = (Math.random() * 360) * (Math.PI / 180);
    const velocity = 60 + Math.random() * 80;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 30 - Math.random() * 50;
    const rotation = (Math.random() - 0.5) * 720;
    const scale = 0.6 + Math.random() * 0.6;
    
    el.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      font-size: ${20 + scale * 16}px;
      transform: translate(-50%, -50%) rotate(0deg);
      opacity: 1;
      z-index: 9999;
      pointer-events: none;
      transition: all 0.6s ease-out;
    `;
    
    document.body.appendChild(el);
    
    requestAnimationFrame(() => {
      el.style.left = `${startX + vx}px`;
      el.style.top = `${startY + vy}px`;
      el.style.opacity = '0';
      el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0.2)`;
    });
    
    setTimeout(() => el.remove(), 700);
  }
}

// Pantalla de carga con animaciones GSAP
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const logoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Animación inicial del logo
    gsap.fromTo(logoRef.current,
      { opacity: 0, scale: 0.5, rotation: -10 },
      { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' }
    )

    // Animación del texto con scramble
    gsap.fromTo(textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.3 }
    )

    // Animación continua de partículas orbitales
    gsap.to('.particle-orbital', {
      rotation: 360,
      duration: 3,
      repeat: -1,
      ease: 'none',
      stagger: {
        each: 0.5,
        from: 'random'
      }
    })

    // Pulso del logo durante carga
    gsap.to(logoRef.current?.querySelector('.logo-inner') || logoRef.current,
      { 
        scale: 1.02,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      }
    )

  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          // Animación de salida dramática
          if (containerRef.current) {
            gsap.to(containerRef.current, {
              opacity: 0,
              scale: 1.1,
              duration: 0.6,
              ease: 'power2.inOut',
              onComplete
            })
          } else {
            setTimeout(onComplete, 500)
          }
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

      <div ref={containerRef} className="w-full max-w-5xl flex flex-col items-center">
        
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

        <div ref={logoRef} className="relative w-48 h-48 mb-8">
          
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

        <div ref={textRef} className="text-center">
          <p className="text-ruda-gold font-black text-xl tracking-[0.5em] mb-4 animate-pulse">
            CARGANDO
          </p>          
          <div ref={progressRef} className="w-56 h-2 bg-gray-800 rounded-full overflow-hidden mx-auto mb-3">
            <div 
              className="h-full bg-gradient-to-r from-ruda-gold via-ruda-gold-light to-ruda-gold rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
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
  const heroRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Animación del logo
      gsap.fromTo(logoRef.current, 
        { opacity: 0, scale: 0.8, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      )

      // Animación del texto con stagger
      gsap.fromTo(textRef.current?.children || [], 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.3 }
      )

      // Animación de los botones
      gsap.fromTo(buttonsRef.current?.children || [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)', delay: 0.8 }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ruda-black">
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
          <div ref={logoRef} className="order-1 lg:order-2">
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
          <div ref={textRef} className="order-2 lg:order-1">
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

            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start flex-wrap">
              <Link 
                href="/ruda-school" 
                className="inline-block px-8 py-4 bg-ruda-gold text-ruda-black font-black text-lg rounded-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-ruda-gold/30 text-center"
              >
                COMENZAR RUDA SCHOOL
              </Link>
              <Link 
                href="/ruda-tv" 
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg rounded-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30 text-center flex items-center justify-center gap-2"
              >
                <span>🎬</span>
                <span>RUDA TV</span>
              </Link>
              <Link 
                href="/streaming" 
                className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-black text-lg rounded-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-green-500/30 text-center flex items-center justify-center gap-2"
              >
                <span>🏉</span>
                <span>STREAMING</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Nosotros + Comisión con efectos
function AboutSection() {
  const [historiaExpandida, setHistoriaExpandida] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Animación del lema
      gsap.fromTo('.lema-container',
        { opacity: 0, y: 50 },
        { 
          opacity: 1, y: 0, 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.lema-container',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Animación de las stats cards
      gsap.fromTo(statsRef.current?.children || [],
        { opacity: 0, y: 30, scale: 0.9 },
        { 
          opacity: 1, y: 0, scale: 1,
          duration: 0.6, 
          stagger: 0.1,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Animación de las cards de comisión
      gsap.fromTo('.card-team',
        { opacity: 0, y: 40, scale: 0.95 },
        { 
          opacity: 1, y: 0, scale: 1,
          duration: 0.8, 
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Animación de los pilares
      gsap.fromTo('.pilar-card',
        { opacity: 0, y: 20 },
        { 
          opacity: 1, y: 0,
          duration: 0.5, 
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.pilares-grid',
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="nosotros" className="py-24 bg-white relative overflow-hidden">
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(255, 193, 7, 0.2); }
          50% { border-color: rgba(255, 193, 7, 0.6); }
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
        
        {/* LEMA - Primero y destacado */}
        <div 
          className="bg-ruda-black rounded-2xl p-8 md:p-12 mb-12 text-center relative overflow-hidden"
          style={{ animation: 'fade-in-up 0.8s ease-out forwards', opacity: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-ruda-green/20 to-ruda-gold/20" />
          <div className="relative z-10">
            <p 
              className="text-ruda-gold font-bold text-sm tracking-widest mb-3"
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
              "NUESTRA LUCHA ES JUGANDO"
            </h3>
          </div>
        </div>

        {/* QUIÉNES SOMOS - Resumen */}
        <div className="text-center mb-12">
          <span className="text-ruda-gold font-black text-sm tracking-widest">SOBRE NOSOTROS</span>
          <h2 className="text-4xl md:text-5xl font-black text-ruda-black mt-2 mb-6">
            QUIÉNES <span className="text-ruda-green">SOMOS</span>
          </h2>
          
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            <strong className="text-ruda-black">Ruda Macho Rugby</strong> es un club de rugby inclusivo de CABA. 
            Nacimos para ofrecer un espacio de pertenencia y competitividad, 
            <span className="text-ruda-green font-semibold"> rompiendo prejuicios</span> en un ámbito tradicionalmente machista.
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            <div 
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 md:p-5 hover:scale-105 transition-transform cursor-pointer group relative overflow-hidden"
              onClick={(e) => {
                if (typeof window !== 'undefined') {
                  for (let i = 0; i < 5; i++) {
                    setTimeout(() => createEmoji(e, '🏳️‍🌈'), i * 50);
                  }
                }
              }}
            >
              <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform">🏳️‍🌈</div>
              <p className="font-bold text-ruda-black text-sm md:text-base">Inclusivo</p>
              <p className="text-xs md:text-sm text-gray-600">Orgullo en la cancha</p>
            </div>
            <div 
              className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 md:p-5 hover:scale-105 transition-transform cursor-pointer group relative overflow-hidden"
              onClick={(e) => {
                if (typeof window !== 'undefined') {
                  for (let i = 0; i < 5; i++) {
                    setTimeout(() => createEmoji(e, '🏆'), i * 50);
                  }
                }
              }}
            >
              <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform">🏆</div>
              <p className="font-bold text-ruda-black text-sm md:text-base">Competitivo</p>
              <p className="text-xs md:text-sm text-gray-600">Ganas de ganar</p>
            </div>
            <div 
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 md:p-5 hover:scale-105 transition-transform cursor-pointer group relative overflow-hidden"
              onClick={(e) => {
                if (typeof window !== 'undefined') {
                  for (let i = 0; i < 5; i++) {
                    setTimeout(() => createEmoji(e, '✈️'), i * 50);
                  }
                }
              }}
            >
              <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform">✈️</div>
              <p className="font-bold text-ruda-black text-sm md:text-base">Internacional</p>
              <p className="text-xs md:text-sm text-gray-600">Conexión global IGR</p>
            </div>
            <div 
              className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 md:p-5 hover:scale-105 transition-transform cursor-pointer group relative overflow-hidden ring-2 ring-pink-300"
              onClick={(e) => {
                if (typeof window !== 'undefined') {
                  for (let i = 0; i < 5; i++) {
                    setTimeout(() => createEmoji(e, '🏉'), i * 50);
                  }
                }
              }}
            >
              <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-bl-lg font-bold">¡NUEVO!</div>
              <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform">🏉</div>
              <p className="font-bold text-ruda-black text-sm md:text-base">Rugby Femenino</p>
              <p className="text-xs md:text-sm text-gray-600">¡Ya sumamos!</p>
            </div>
          </div>

          {/* Botón expandir */}
          <button
            onClick={() => setHistoriaExpandida(!historiaExpandida)}
            className="inline-flex items-center gap-2 text-ruda-green font-bold hover:text-ruda-gold transition-colors"
          >
            {historiaExpandida ? 'Ver menos' : 'Conocé nuestra historia completa'}
            <svg 
              className={`w-5 h-5 transition-transform ${historiaExpandida ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Historia expandible */}
        {historiaExpandida && (
          <div className="mb-16 max-w-4xl mx-auto animate-fade-in-up">
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg mb-6">
                Iniciamos este camino como un equipo conformado mayoritariamente por varones gays, enfocados en visibilizar y celebrar la diversidad sexual en el deporte. Hoy, <span className="text-ruda-gold font-semibold">nuestro equipo no para de crecer</span>.
              </p>

              {/* Rugby Femenino */}
              <div className="bg-gradient-to-r from-ruda-green/10 to-ruda-gold/10 rounded-xl p-6 mb-6 border-l-4 border-ruda-green">
                <h4 className="text-xl font-black text-ruda-black mb-2">🏉 ¡Ahora también Rugby Femenino!</h4>
                <p className="text-gray-700">
                  Fieles a nuestra premisa de abrir la cancha y abrazar la diversidad en todas sus formas, estamos incorporando nuestra rama de rugby femenino. Queremos que cada vez más mujeres encuentren en Ruda Macho un espacio seguro para formarse, competir y disfrutar de la pasión por este deporte sin barreras.
                </p>
              </div>

              {/* Competitividad */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="text-xl font-black text-ruda-black mb-4">🏆 Competitividad y Proyección Internacional</h4>
                <p className="text-gray-700 mb-4">
                  Nuestro proyecto no es solo recreativo; nacimos con un lineamiento puramente deportivo y competitivo.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="font-bold text-ruda-green mb-1">📍 A nivel local</p>
                    <p className="text-gray-600">Participamos activamente en el exigente torneo Empresarial de la URBA (Unión de Rugby de Buenos Aires).</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="font-bold text-ruda-gold mb-1">🌍 A nivel global</p>
                    <p className="text-gray-600">Formamos parte de la red de equipos miembros de la IGR (International Gay Rugby) con lazos fuertes en toda Latinoamérica.</p>
                  </div>
                </div>
              </div>

              {/* Filosofía */}
              <div className="bg-ruda-black rounded-xl p-6 text-white">
                <h4 className="text-xl font-black mb-4 text-center">Nuestra Filosofía</h4>
                <p className="text-gray-300 text-center mb-6">
                  Reivindicamos los valores históricos del rugby, adaptándolos a una visión moderna, libre y diversa.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-ruda-gold rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-ruda-black text-xl">🤝</span>
                    </div>
                    <p className="font-bold text-ruda-gold">Amistad</p>
                    <p className="text-sm text-gray-400">Somos una gran familia elegida, dentro y fuera del club.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-ruda-gold rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-ruda-black text-xl">✊</span>
                    </div>
                    <p className="font-bold text-ruda-gold">Integridad y Respeto</p>
                    <p className="text-sm text-gray-400">Cada persona puede ser 100% auténtica.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-ruda-gold rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-ruda-black text-xl">💪</span>
                    </div>
                    <p className="font-bold text-ruda-gold">Solidaridad</p>
                    <p className="text-sm text-gray-400">Derribamos barreras juntos, sin importar orientación o identidad.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-16">
          <h3 
            className="text-3xl font-black text-center text-ruda-black mb-12"
            style={{ animation: 'fade-in-up 0.8s ease-out 0.4s forwards', opacity: 0 }}
          >
            NUESTRA <span className="text-ruda-gold">COMISIÓN</span>
          </h3>
          
          {/* Primera fila: Presidente y Fundador */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
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

          {/* Segunda fila: Tesorero, Manager, Secretario */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div 
              className="bg-gray-50 rounded-2xl p-6 text-center shadow-lg card-team transition-all duration-300"
              style={{ 
                animation: 'fade-in-up 0.8s ease-out 1s forwards', 
                opacity: 0,
                animationDelay: '1s'
              }}
            >
              <div 
                className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg"
                style={{ animation: 'pulse-border 2s infinite' }}
              >
                <img src="/assets/Tesorero.png" alt="Ari Gallo" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-lg font-black text-ruda-black">Ari Gallo</h4>
              <p className="text-ruda-gold font-bold text-sm">TESORERO</p>
            </div>

            <div 
              className="bg-gray-50 rounded-2xl p-6 text-center shadow-lg card-team transition-all duration-300"
              style={{ 
                animation: 'fade-in-up 0.8s ease-out 1.1s forwards', 
                opacity: 0,
                animationDelay: '1.1s'
              }}
            >
              <div 
                className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg"
                style={{ animation: 'pulse-border 2s infinite 0.3s' }}
              >
                <img src="/assets/Manager.png" alt="Gustavo Yaquers" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-lg font-black text-ruda-black">Gustavo Yaquers</h4>
              <p className="text-ruda-gold font-bold text-sm">MANAGER</p>
            </div>

            <div 
              className="bg-gray-50 rounded-2xl p-6 text-center shadow-lg card-team transition-all duration-300"
              style={{ 
                animation: 'fade-in-up 0.8s ease-out 1.2s forwards', 
                opacity: 0,
                animationDelay: '1.2s'
              }}
            >
              <div 
                className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg"
                style={{ animation: 'pulse-border 2s infinite 0.6s' }}
              >
                <img src="/assets/Secretario.png" alt="Agustin Gomez" className="w-full h-full object-cover" />
              </div>
              <h4 className="text-lg font-black text-ruda-black">Agustin Gomez</h4>
              <p className="text-ruda-gold font-bold text-sm">SECRETARIO</p>
            </div>
          </div>
        </div>

        <div 
          className="grid md:grid-cols-4 gap-6"
          style={{ animation: 'fade-in-up 0.8s ease-out 1s forwards', opacity: 0 }}
        >
          <div 
            className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 text-center shadow hover:shadow-lg transition-all duration-300 group cursor-default"
            style={{ animationDelay: '1s' }}
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🔥</div>
            <h3 className="text-xl font-black text-ruda-green">PASIÓN</h3>
            <p className="text-sm text-gray-600 mt-1">Lo entregamos todo en cada partido</p>
          </div>
          <div 
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center shadow hover:shadow-lg transition-all duration-300 group cursor-default"
            style={{ animationDelay: '1.1s' }}
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🤝</div>
            <h3 className="text-xl font-black text-ruda-green">COMPAÑERISMO</h3>
            <p className="text-sm text-gray-600 mt-1">Somos un equipo, somos familia</p>
          </div>
          <div 
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center shadow hover:shadow-lg transition-all duration-300 group cursor-default"
            style={{ animationDelay: '1.2s' }}
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">💪</div>
            <h3 className="text-xl font-black text-ruda-green">ENTREGA</h3>
            <p className="text-sm text-gray-600 mt-1">100% compromiso con el club</p>
          </div>
          <div 
            className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 text-center shadow hover:shadow-lg transition-all duration-300 group cursor-default"
            style={{ animationDelay: '1.3s' }}
          >
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📈</div>
            <h3 className="text-xl font-black text-ruda-green">MEJORA</h3>
            <p className="text-sm text-gray-600 mt-1">Siempre hay un paso más</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Sección de Instagram
function InstagramSection() {
  // Fotos del carrusel
  const fotos = [
    { img: '/assets/carrusel/foto-ruda-1.png', alt: 'Ruda Macho Rugby' },
    { img: '/assets/carrusel/foto-ruda-2.png', alt: 'Ruda Macho Rugby' },
    { img: '/assets/carrusel/partido-ensenada.png', alt: 'Partido vs Ensenada' },
    { img: '/assets/carrusel/rugby-femenino.png', alt: 'Rugby Femenino' },
    { img: '/assets/carrusel/veni-a-ser-parte.png', alt: 'Vení a ser parte' },
  ]

  return (
    <section id="instagram-section" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 15a3 3 0 110-6 3 3 0 010 6zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-ruda-black">
              Seguinos en <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">Instagram</span>
            </h2>
          </div>
          <p className="text-gray-600 text-lg mb-6">
            @rudamachorugby • Enterate de todo lo que pasa en el club
          </p>
          <a 
            href="https://www.instagram.com/rudamachorugby"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 15a3 3 0 110-6 3 3 0 010 6zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            Ver perfil
          </a>
        </div>

        {/* Grid de fotos - Tamaño grande */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {fotos.map((foto, i) => (
            <div 
              key={i}
              className="aspect-square bg-gray-200 rounded-2xl overflow-hidden relative group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow"
            >
              <img 
                src={foto.img} 
                alt={foto.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 15a3 3 0 110-6 3 3 0 010 6zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 text-sm mt-4">
          📸 Seguinos en Instagram para ver más fotos del club
        </p>
      </div>
    </section>
  )
}

// Sección de Comunicaciones (WhatsApp)
function ComunicacionesSection() {
  const comunicaciones: Array<{
    fecha: string;
    titulo: string;
    mensaje: string;
    detalles?: string;
    link?: string;
    tipo: string;
  }> = [
    {
      fecha: '31 Mar 2026',
      titulo: '📍 CAMBIO DE LUGAR - HOY',
      mensaje: '¡Hola Ruditas! Hoy hay un evento musical en River y por cuestiones de traslado y seguridad, movemos el lugar de entrenamiento solo por hoy.',
      detalles: 'Los esperamos a partir las 20:30 en Parque Berlín. Planifiquen con anticipación la salida desde sus hogares y trabajos. Madrinas, sepan enviar este mensaje a ahijados. ¡Nos vemos!',
      link: 'https://maps.app.goo.gl/SWzqsorDb7oit5x89',
      tipo: 'urgente'
    }
  ]

  return (
    <section className="py-16 bg-ruda-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.093 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.412z"/>
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Comunicaciones
            </h2>
          </div>
          <p className="text-gray-400 mb-6">
            Últimas novedades del grupo oficial de WhatsApp
          </p>
        </div>

        <div className="space-y-4">
          {comunicaciones.map((com, idx) => (
            <div 
              key={idx}
              className={`rounded-2xl p-6 border transition-all ${
                com.tipo === 'urgente' 
                  ? 'bg-gradient-to-r from-red-900/30 to-orange-900/20 border-red-500/40 hover:border-red-500/60' 
                  : 'bg-gradient-to-r from-green-900/20 to-green-800/10 border-green-500/20 hover:border-green-500/40'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  com.tipo === 'urgente' ? 'bg-red-500/20' :
                  com.tipo === 'traslado' ? 'bg-purple-500/20' : 
                  com.tipo === 'info' ? 'bg-blue-500/20' : 
                  com.tipo === 'entrenamiento' ? 'bg-orange-500/20' : 'bg-ruda-green/20'
                }`}>
                  <span className="text-2xl">
                    {com.tipo === 'urgente' ? '🚨' :
                     com.tipo === 'traslado' ? '🚗' : 
                     com.tipo === 'info' ? '📢' : 
                     com.tipo === 'entrenamiento' ? '💪' : '🏉'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-green-400 text-sm font-bold">{com.fecha}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      com.tipo === 'urgente'
                        ? 'bg-red-500/30 text-red-300 animate-pulse'
                        : com.tipo === 'traslado' 
                        ? 'bg-purple-500/20 text-purple-300' 
                        : com.tipo === 'info'
                        ? 'bg-blue-500/20 text-blue-300'
                        : com.tipo === 'entrenamiento'
                        ? 'bg-orange-500/20 text-orange-300'
                        : 'bg-ruda-green/20 text-ruda-green'
                    }`}>
                      {com.tipo === 'urgente' ? '¡URGENTE!' :
                       com.tipo === 'traslado' ? 'Traslado' : 
                       com.tipo === 'info' ? 'Info' : 
                       com.tipo === 'entrenamiento' ? 'Entrenamiento' : 'Partido'}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{com.titulo}</h3>
                  <p className="text-gray-300 mb-2">{com.mensaje}</p>
                  {com.detalles && (
                    <p className="text-gray-400 text-sm whitespace-pre-line">{com.detalles}</p>
                  )}
                  {com.link && (
                    <a 
                      href={com.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-ruda-gold hover:underline text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Ver ubicación
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Link a Planilla de Asistencia */}
        <div className="mt-8">
          <a 
            href="https://docs.google.com/spreadsheets/d/1Qb2OlOj9SOhIDjz_3nY9xr05g6XDVUFvu-blVFLRpHw/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-2xl p-6 border border-emerald-500/30 hover:border-emerald-500/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center text-2xl">
                📊
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">Planilla de Asistencia</h3>
                <p className="text-emerald-400 text-sm">Ver asistencia completa en Google Sheets</p>
              </div>
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>
        </div>

        <div className="mt-8 text-center">
          <button 
            disabled
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-gray-400 font-bold rounded-full cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.093 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.412z"/>
            </svg>
            Grupo de WhatsApp - Próximamente
          </button>
          <p className="text-gray-500 text-sm mt-2">El grupo es por invitación. Contactá a un miembro de la comisión.</p>
        </div>
      </div>
    </section>
  )
}

// Sección Entrena con Nosotros (visible en hero)
function EntrenaSection() {
  const [modalAbierto, setModalAbierto] = useState(false)

  const irAInstagram = () => {
    setModalAbierto(false)
    setTimeout(() => {
      const instagramSection = document.getElementById('instagram-section')
      if (instagramSection) {
        instagramSection.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  return (
    <>
      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in-up">
            <button 
              onClick={() => setModalAbierto(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🏉</span>
              </div>
              
              <h3 className="text-2xl font-black text-ruda-black mb-4">¿Querés entrenar con nosotros?</h3>
              
              <p className="text-gray-600 mb-6">
                <strong>Escribinos por mensaje directo a Instagram o preséntate en nuestros horarios y dirección detalladas en esta sección.</strong>
              </p>
              
              <button 
                onClick={irAInstagram}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold rounded-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441c.795 0 1.439-.645 1.439-1.441s-.644-1.44-1.439-1.44z"/>
                </svg>
                Ir a Instagram
              </button>
            </div>
          </div>
        </div>
      )}

      <section id="entrena" className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Info */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-ruda-green rounded-full flex items-center justify-center">
                  <span className="text-3xl">📍</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-ruda-black">Parque Güemes - Temporada 2026</h3>
                  <p className="text-gray-500">Lugar de entrenamientos</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="font-semibold text-ruda-black">Ubicación</p>
                    <p className="text-gray-600">Parque con estatua de Guemes</p>
                    <p className="text-gray-600">Av. Pres. Figueroa Alcorta 6600, CABA</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-xl">🕐</span>
                  <div>
                    <p className="font-semibold text-ruda-black">Horarios</p>
                    <p className="text-gray-600">Martes y Jueves: 20:30</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-xl">🏉</span>
                  <div>
                    <p className="font-semibold text-ruda-black">Requisitos</p>
                    <p className="text-gray-600">Actitud positiva y ganas de aprender</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setModalAbierto(true)}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg hover:scale-105 transition-all"
              >
                <span>💬</span>
                <span>CONTACTANOS PARA ENTRENAR</span>
              </button>
              
              <a 
                href="https://maps.app.goo.gl/suT7Mx6keLFoS7fd8"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-ruda-green text-white font-bold rounded-lg hover:bg-green-700 transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Abrir en Google Maps
              </a>
            </div>

            {/* Mapa */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3286.0871045475988!2d-58.4359055!3d-34.55134989999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5105c6a5be5%3A0xc415975f53f04b8!2sRuda%20Macho%20Rugby!5e0!3m2!1ses!2sar!4v1774990478628!5m2!1ses!2sar"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Ruda Macho Rugby Club"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// Footer
function Footer() {
  return (
    <footer className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left">
            <img 
              src="/assets/Logo%20Ruda%20Macho.png" 
              alt="Ruda Macho" 
              className="h-16 mx-auto md:mx-0 mb-4"
            />
            <p className="text-gray-400">Club de Rugby Ruda Macho</p>
            <p className="text-ruda-gold font-bold">"Nuestra Lucha es Jugando"</p>
          </div>
          
          <div className="text-center">
            <h4 className="text-white font-bold mb-4">Seguinos</h4>
            <div className="flex justify-center gap-4">
              <a 
                href="https://www.instagram.com/rudamachorugby"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 15a3 3 0 110-6 3 3 0 010 6zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <h4 className="text-white font-bold mb-4">Contacto</h4>
            <p className="text-gray-400 text-sm">Entrenamientos: Martes y Jueves 20:30</p>
            <a 
              href="https://maps.app.goo.gl/suT7Mx6keLFoS7fd8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 text-sm hover:text-ruda-gold transition-colors block"
            >
              📍 Av. Pres. Figueroa Alcorta 6600, CABA
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-600">© 2024 Ruda Rugby Club. Nuestra Lucha es Jugando.</p>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // Verificar si ya se mostró la animación en esta sesión
    const animated = sessionStorage.getItem('ruda-animation-shown')
    if (animated === 'true') {
      setIsLoading(false)
      setHasAnimated(true)
    }
    
    // Registrar Service Worker para PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope)
        })
        .catch((error) => {
          console.log('SW registration failed:', error)
        })
    }
  }, [])

  const handleAnimationComplete = () => {
    setIsLoading(false)
    setHasAnimated(true)
    sessionStorage.setItem('ruda-animation-shown', 'true')
  }

  return (
    <>
      {isLoading && !hasAnimated && <LoadingScreen onComplete={handleAnimationComplete} />}
      
      {!isLoading && (
        <>
          <main className="pt-0">
            <HeroSection />
            <EntrenaSection />
            <AboutSection />
            <InstagramSection />
            <ComunicacionesSection />
          </main>
          <Footer />
        </>
      )}
    </>
  )
}
