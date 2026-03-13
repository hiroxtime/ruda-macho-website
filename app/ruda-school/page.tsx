'use client'

import Link from 'next/link'
import { useState } from 'react'

// Niveles de Ruda School
const niveles = [
  {
    id: 1,
    titulo: 'FUNDAMENTOS',
    descripcion: 'Historia del rugby, valores del juego y reglas básicas.',
    lecciones: 8,
    xp: 100,
    color: 'from-green-600 to-green-800',
    icono: '🏉',
    bloqueado: false
  },
  {
    id: 2,
    titulo: 'URBA',
    descripcion: 'Regulaciones oficiales de la Unión de Rugby Buenos Aires.',
    lecciones: 6,
    xp: 150,
    color: 'from-blue-600 to-blue-800',
    icono: '📋',
    bloqueado: true
  },
  {
    id: 3,
    titulo: 'POSICIONES',
    descripcion: 'Roles, responsabilidades y características de cada posición.',
    lecciones: 15,
    xp: 200,
    color: 'from-purple-600 to-purple-800',
    icono: '👥',
    bloqueado: true
  },
  {
    id: 4,
    titulo: 'TÉCNICA',
    descripcion: 'Pase, tackle, ruck, maul y lineout.',
    lecciones: 12,
    xp: 250,
    color: 'from-orange-600 to-orange-800',
    icono: '💪',
    bloqueado: true
  },
  {
    id: 5,
    titulo: 'TÁCTICA',
    descripcion: 'Estrategias de juego, defensa y ataque.',
    lecciones: 10,
    xp: 300,
    color: 'from-red-600 to-red-800',
    icono: '🧠',
    bloqueado: true
  },
  {
    id: 6,
    titulo: 'PREPARACIÓN FÍSICA',
    descripcion: 'Condición física, nutrición y prevención de lesiones.',
    lecciones: 8,
    xp: 350,
    color: 'from-yellow-600 to-yellow-800',
    icono: '⚡',
    bloqueado: true
  }
]

// Badges
const badges = [
  { nombre: 'Rookie', icono: '🥉', desc: 'Completaste tu primera lección' },
  { nombre: 'Jugador', icono: '🥈', desc: 'Terminaste el Nivel 1' },
  { nombre: 'Veterano', icono: '🥇', desc: 'Completaste 3 niveles' },
  { nombre: 'Ruda Legend', icono: '🏆', desc: 'Maestría completa' }
]

export default function RudaSchool() {
  const [nivelSeleccionado, setNivelSeleccionado] = useState(1)
  const [visorAbierto, setVisorAbierto] = useState(false)
  const [pdfSeleccionado, setPdfSeleccionado] = useState('xv')

  const [seccionesExpandidas, setSeccionesExpandidas] = useState({
    terreno: true,
    puntos: true,
    valores: true
  })

  const toggleSeccion = (seccion: string) => {
    setSeccionesExpandidas(prev => ({
      ...prev,
      [seccion]: !prev[seccion as keyof typeof prev]
    }))
  }

  return (
    <div className="min-h-screen bg-ruda-black">
      <style>{`
        @keyframes float-card {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(255, 193, 7, 0); }
        }
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
        }
      `}</style>

      { /* Header */ }
      <header className="bg-ruda-black/95 backdrop-blur-md border-b border-ruda-gold/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <img src="/assets/Logo%20Ruda%20School.png" alt="Ruda School" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-white font-black text-lg">RUDA</span>
                <span className="text-ruda-gold text-xs block -mt-1 font-bold">SCHOOL</span>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-white/5 rounded-full px-4 py-2">
                <span className="text-ruda-gold">⚡</span>
                <span className="text-white font-bold">0 XP</span>
              </div>
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        { /* Hero de Ruda School */ }
        <div className="text-center mb-12">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-ruda-gold/20 rounded-full animate-ping" />
            <img 
              src="/assets/Logo%20Ruda%20School.png" 
              alt="Ruda School" 
              className="relative w-full h-full object-contain drop-shadow-[0_0_20px_rgba(255,193,7,0.5)]"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            BIENVENIDO A <span className="text-ruda-gold">RUDA SCHOOL</span>
          </h1>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            La primera plataforma de aprendizaje de rugby diseñada para adultos. 
            Aprende desde los fundamentos hasta táctica avanzada, a tu ritmo.
          </p>
        </div>

        { /* Introducción Obligatoria - Fundamentos */ }
        <div className="mb-12 bg-gradient-to-br from-ruda-green/20 to-ruda-dark-green/20 rounded-2xl border border-ruda-green/30 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-ruda-green rounded-lg flex items-center justify-center text-xl">📚</div>
              <h2 className="text-2xl font-black text-white">INTRODUCCIÓN OBLIGATORIA</h2>
              <span className="ml-auto bg-ruda-gold/20 text-ruda-gold px-3 py-1 rounded-full text-sm font-bold">Nivel 1</span>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="grid md:grid-cols-2 gap-6 text-gray-300">
                <div>
                  <h3 className="text-ruda-gold font-bold mb-2">🎯 ¿Qué es el Rugby?</h3>
                  <p className="text-sm mb-4">
                    Deporte de equipo de contacto con balón ovalado. 
                    <strong className="text-white">No hay pases hacia adelante</strong> — 
                    solo hacia atrás o laterales. El objetivo: apoyar el balón en el try enemigo.
                  </p>

                  <h3 className="text-ruda-gold font-bold mb-2">📊 Sistema de Puntos</h3>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li><strong>Try:</strong> 5 puntos (apoyar en zona de try)</li>
                    <li><strong>Conversión:</strong> 2 puntos (patada tras try)</li>
                    <li><strong>Penalty/Drop:</strong> 3 puntos</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-ruda-gold font-bold mb-2">🏉 Posiciones Básicas</h3>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li><strong>Delanteros (1-8):</strong> Scrum, line-out, tackle</li>
                    <li><strong>Backs (9-15):</strong> Velocidad, pases, patadas</li>
                    <li><strong>9 - Medio scrum:</strong> Distribuye el balón</li>
                    <li><strong>10 - Apertura:</strong> Toma decisiones</li>
                  </ul>

                  <h3 className="text-ruda-gold font-bold mb-2 mt-4">❌ Reglas Clave</h3>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>No pases hacia adelante</li>
                    <li>Tackle solo por debajo de hombros</li>
                    <li>Offside = detrás del último pie</li>
                    <li>Respeto absoluto al árbitro</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-ruda-black/50 rounded-xl border border-ruda-gold/30">
                <p className="text-ruda-gold font-bold text-center">
                  🏆 "NUESTRA LUCHA ES JUGANDO" — Valores: Integridad, Pasión, Solidaridad, Disciplina, Respeto
                </p>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/ruda-school/nivel-1"
                  className="inline-flex items-center gap-2 bg-ruda-gold text-ruda-black px-8 py-4 rounded-full font-black text-lg hover:bg-yellow-400 transition-all hover:scale-105 shadow-lg shadow-ruda-gold/30"
                >
                  📚 Comenzar Nivel 1: Fundamentos
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <p className="text-gray-400 text-sm mt-2">8 lecciones • 100 XP</p>
              </div>

              {/* EL TERRENO - La Cancha */}
              <div className="mt-8 bg-ruda-black/30 rounded-2xl overflow-hidden border border-white/10">
                <button
                  onClick={() => toggleSeccion('terreno')}
                  className="w-full flex items-center justify-between gap-3 p-6 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🏟️</div>
                    <h3 className="text-xl font-black text-white">EL TERRENO: La Cancha de Rugby</h3>
                  </div>
                  <span className="text-ruda-gold text-xl">
                    {seccionesExpandidas.terreno ? '▼' : '▶'}
                  </span>
                </button>

                {seccionesExpandidas.terreno && (
                  <div className="px-6 pb-6">
                    {/* Imagen del terreno */}
                    <div className="mb-6 rounded-xl overflow-hidden border-2 border-ruda-gold/30">
                      <img 
                        src="/assets/el-terreno.png" 
                        alt="Diagrama de la cancha de rugby"
                        className="w-full h-auto"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-ruda-gold font-bold mb-3">📏 Dimensiones</h4>
                        <ul className="text-sm space-y-2 text-gray-300">
                          <li>• <strong>Largo:</strong> 100 metros (campo de juego)</li>
                          <li>• <strong>Ancho:</strong> 70 metros</li>
                          <li>• <strong>Zona de Try:</strong> 5-22 metros (donde se anota)</li>
                          <li>• <strong>Total con try zones:</strong> 120m × 70m aprox.</li>
                        </ul>

                        <h4 className="text-ruda-gold font-bold mb-3 mt-6">🎯 Zonas Clave</h4>
                        <ul className="text-sm space-y-2 text-gray-300">
                          <li>• <strong>Try Zone (5-22m):</strong> ¡Aquí se anota! Apoyar el balón</li>
                          <li>• <strong>Línea de 22:</strong> Kicks de despeje táctico</li>
                          <li>• <strong>Área de Melé (Scrum):</strong> Marcada con línea de 10m</li>
                          <li>• <strong>Medio Campo:</strong> Reinicios y patadas iniciales</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-ruda-gold font-bold mb-3">📐 Estructura Táctica</h4>
                        <ul className="text-sm space-y-2 text-gray-300">
                          <li>• <strong>Canales:</strong> La cancha se divide en 15 canchas verticales</li>
                          <li>• <strong>1er canal (5m):</strong> Cerca de las bandas</li>
                          <li>• <strong>Canales centrales:</strong> Donde se juega la mayoría del rugby</li>
                          <li>• <strong>Las bandas:</strong> Espacio para jugar abierto</li>
                        </ul>

                        <h4 className="text-ruda-gold font-bold mb-3 mt-6">💡 Conceptos Clave</h4>
                        <ul className="text-sm space-y-2 text-gray-300">
                          <li>• <strong>Campo propio vs. Campo rival:</strong> Estrategia territorial</li>
                          <li>• <strong>Las 22:</strong> Zona peligrosa — cuidado con los kicks</li>
                          <li>• <strong>El "túnel":</strong> Espacio para entrar al ruck</li>
                          <li>• <strong>Bandas:</strong> Cuidado — si el balón sale, es line-out</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-ruda-green/10 rounded-xl border border-ruda-green/30">
                      <p className="text-white text-sm">
                        <strong>🧠 Dato mental:</strong> En rugby no hay "cancha propia" fija. 
                        Atacás hacia una try zone y defendés la otra. Cada vez que se anota, 
                        se invierten los roles.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* SISTEMA DE PUNTOS EXPANDIDO */}
              <div className="mt-8 bg-ruda-black/30 rounded-2xl overflow-hidden border border-white/10">
                <button
                  onClick={() => toggleSeccion('puntos')}
                  className="w-full flex items-center justify-between gap-3 p-6 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🏆</div>
                    <h3 className="text-xl font-black text-white">SISTEMA DE PUNTOS DETALLADO</h3>
                  </div>
                  <span className="text-ruda-gold text-xl">
                    {seccionesExpandidas.puntos ? '▼' : '▶'}
                  </span>
                </button>

                {seccionesExpandidas.puntos && (
                  <div className="px-6 pb-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-ruda-black/50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🏉</span>
                          <h4 className="text-ruda-gold font-bold">TRY — 5 Puntos</h4>
                        </div>
                        <p className="text-sm text-gray-300">
                          Apoyar el balón con control en la zona de try enemiga. 
                          Es la forma más importante de anotar. Demuestra dominio territorial.
                        </p>
                      </div>

                      <div className="bg-ruda-black/50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🦶</span>
                          <h4 className="text-ruda-gold font-bold">CONVERSIÓN — 2 Puntos</h4>
                        </div>
                        <p className="text-sm text-gray-300">
                          Patada entre los palos tras un try. Se patea desde la línea 
                          paralela al punto donde se anotó el try.
                        </p>
                      </div>

                      <div className="bg-ruda-black/50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🚩</span>
                          <h4 className="text-ruda-gold font-bold">PENALTY — 3 Puntos</h4>
                        </div>
                        <p className="text-sm text-gray-300">
                          Patada por falta del rival. El equipo puede optar por:
                          patar a los palos, hacer touch (line-out), o scrum.
                        </p>
                      </div>

                      <div className="bg-ruda-black/50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">⚽</span>
                          <h4 className="text-ruda-gold font-bold">DROP GOAL — 3 Puntos</h4>
                        </div>
                        <p className="text-sm text-gray-300">
                          Patada durante el juego donde el balón toca el suelo antes de ser pateado. 
                          Útil para cerrar partidos apretados.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-ruda-gold/10 rounded-xl border border-ruda-gold/30">
                      <p className="text-ruda-gold font-bold text-center">
                        💡 Regla de oro: El try vale más que la Patada. Siempre buscar el try primero.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* REGLAS FUNDAMENTALES EXPANDIDAS */}
              <div className="mt-8 bg-ruda-black/30 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">📜</div>
                  <h3 className="text-xl font-black text-white">REGLAS FUNDAMENTALES</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl">
                    <h4 className="text-red-400 font-bold mb-2">❌ NO PASAR HACIA ADELANTE</h4>
                    <p className="text-sm text-gray-300">
                      <strong>La regla más importante:</strong> Nunca podés pasar el balón hacia adelante. 
                      Solo hacia atrás o laterales. Si pasa adelante: scrum para el rival (knock-on).
                    </p>
                  </div>

                  <div className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-xl">
                    <h4 className="text-orange-400 font-bold mb-2">🤼 TACKLE LEGAL</h4>
                    <p className="text-sm text-gray-300">
                      Solo por debajo de los hombros. No agarrar cuello/cabeza. 
                      No empujar hacia adelante. Después del tackle, soltar inmediatamente.
                    </p>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
                    <h4 className="text-blue-400 font-bold mb-2">📏 OFFSIDE (FUERA DE JUEGO)</h4>
                    <p className="text-sm text-gray-300">
                      En defensa: debés estar detrás del último pie del ruck/scrum. 
                      En ataque: no podés adelantarte al que lleva la pelota.
                    </p>
                  </div>

                  <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-xl">
                    <h4 className="text-green-400 font-bold mb-2">🙋 RESPETO AL ÁRABITRO</h4>
                    <p className="text-sm text-gray-300">
                      El árbitro se llama "señor" o "señora". No se discuten sus decisiones. 
                      Solo el capitán puede hablar con él/ella.
                    </p>
                  </div>
                </div>
              </div>

              {/* VALORES DEL RUGBY */}
              <div className="mt-8 bg-ruda-black/30 rounded-2xl overflow-hidden border border-white/10">
                <button
                  onClick={() => toggleSeccion('valores')}
                  className="w-full flex items-center justify-between gap-3 p-6 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🤝</div>
                    <h3 className="text-xl font-black text-white">VALORES DEL RUGBY</h3>
                  </div>
                  <span className="text-ruda-gold text-xl">
                    {seccionesExpandidas.valores ? '▼' : '▶'}
                  </span>
                </button>

                {seccionesExpandidas.valores && (
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {['INTEGRIDAD', 'PASIÓN', 'SOLIDARIDAD', 'DISCIPLINA', 'RESPETO'].map((valor, idx) => (
                        <div key={valor} className="bg-ruda-black/50 p-4 rounded-xl text-center">
                          <div className="text-2xl mb-2">
                            {['⚖️', '🔥', '🤗', '📋', '🙏'][idx]}
                          </div>
                          <p className="text-ruda-gold font-bold text-sm">{valor}</p>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-center text-gray-400 text-sm">
                      En Ruda Macho vivimos estos valores. No solo se aplican en la cancha, 
                      sino en todo lo que hacemos.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 text-center">
                <Link 
                  href="/docs/RUDA_SCHOOL_NIVEL_1.md"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-ruda-gold hover:text-white font-bold transition-colors"
                >
                  📖 Ver guía completa de fundamentos
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        { /* Stats del jugador */ }
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-3xl font-black text-ruda-gold">0</p>
            <p className="text-gray-500 text-sm">Nivel</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-3xl font-black text-ruda-gold">0</p>
            <p className="text-gray-500 text-sm">Lecciones</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-3xl font-black text-ruda-gold">0</p>
            <p className="text-gray-500 text-sm">Badges</p>
          </div>
        </div>

        { /* Niveles */ }
        <div className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center">
            <span className="w-2 h-8 bg-ruda-gold rounded-full mr-3"></span>
            NIVELES DE APRENDIZAJE
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {niveles.map((nivel, index) => (
              <Link
                key={nivel.id}
                href={nivel.bloqueado ? '#' : `/ruda-school/nivel-${nivel.id}`}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 card-hover ${
                  nivel.bloqueado ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={(e) => nivel.bloqueado && e.preventDefault()}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${nivel.color} opacity-90`} />
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{nivel.icono}</span>
                    <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-bold text-white">
                      {nivel.bloqueado ? '🔒 BLOQUEADO' : '✓ DISPONIBLE'}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white mb-2">{nivel.titulo}</h3>
                  <p className="text-white/80 text-sm mb-4">{nivel.descripcion}</p>

                  <div className="flex items-center justify-between text-white/60 text-sm">
                    <span>{nivel.lecciones} lecciones</span>
                    <span className="flex items-center">
                      <span className="text-ruda-gold mr-1">⚡</span>
                      {nivel.xp} XP
                    </span>
                  </div>

                  {nivel.bloqueado && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        { /* Badges */ }
        <div className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center">
            <span className="w-2 h-8 bg-ruda-gold rounded-full mr-3"></span>
            BADGES A DESBLOQUEAR
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div
                key={badge.nombre}
                className="bg-white/5 rounded-xl p-4 text-center border border-white/10 opacity-40"
              >
                <span className="text-4xl mb-2 block">{badge.icono}</span>
                <h4 className="text-white font-bold text-sm mb-1">{badge.nombre}</h4>
                <p className="text-gray-500 text-xs">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>

        { /* Rugby con Luca */ }
        <div className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center">
            <span className="w-2 h-8 bg-ruda-gold rounded-full mr-3"></span>
            RUGBY CON LUCA
          </h2>

          <p className="text-gray-400 mb-6">
            Material complementario de la serie "Rugby con Luca" - aprende rugby de forma divertida con Lucas.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-ruda-gold/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                </div>
                <span className="text-ruda-gold text-sm font-bold">PDF</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Rugby con Luca - Dossier</h3>
              <p className="text-gray-500 text-sm mb-4">Guía completa de rugby XV con los personajes de la serie.</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setPdfSeleccionado('xv')
                    setVisorAbierto(true)
                  }}
                  className="flex-1 bg-ruda-gold text-ruda-black font-bold py-2 px-4 rounded-lg hover:bg-ruda-gold-light transition-colors text-sm"
                >
                  📖 Miralo Aquí
                </button>
                <a 
                  href="/assets/Rugby%20con%20Luca%20-%20dossier.pdf" 
                  target="_blank"
                  className="inline-flex items-center justify-center bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors text-sm"
                >
                  ↗️ Abrir
                </a>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-ruda-gold/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                </div>
                <span className="text-ruda-gold text-sm font-bold">PDF</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Rugby con Luca 7s</h3>
              <p className="text-gray-500 text-sm mb-4">Versión especial de Rugby 7s - más rápido, más dinámico.</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setPdfSeleccionado('7s')
                    setVisorAbierto(true)
                  }}
                  className="flex-1 bg-ruda-gold text-ruda-black font-bold py-2 px-4 rounded-lg hover:bg-ruda-gold-light transition-colors text-sm"
                >
                  📖 Miralo Aquí
                </button>
                <a 
                  href="/assets/Rugby-con-Luca7s-dossier.pdf" 
                  target="_blank"
                  className="inline-flex items-center justify-center bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors text-sm"
                >
                  ↗️ Abrir
                </a>
              </div>
            </div>
          </div>

          { /* Visor PDF Colapsable */ }
          {visorAbierto && (
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden animate-fade-in">
              <div className="bg-ruda-black/50 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-white font-bold">
                  {pdfSeleccionado === 'xv' ? 'Rugby con Luca - Dossier' : 'Rugby con Luca 7s'}
                </span>
                <button 
                  onClick={() => setVisorAbierto(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="aspect-[4/3] bg-gray-900">
                <iframe 
                  src={pdfSeleccionado === 'xv' ? '/assets/Rugby%20con%20Luca%20-%20dossier.pdf' : '/assets/Rugby-con-Luca7s-dossier.pdf'}
                  className="w-full h-full"
                  title="Rugby con Luca"
                />
              </div>
            </div>
          )}
        </div>

        { /* CTA */ }
        <div className="text-center">
          <Link
            href="#"
            className="inline-flex items-center px-8 py-4 bg-ruda-gold text-ruda-black font-black text-lg rounded-xl hover:bg-ruda-gold-light transition-all hover:scale-105"
          >
            COMENZAR NIVEL 1
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  )
}
