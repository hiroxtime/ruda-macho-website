'use client'

import Link from 'next/link'
import { useState } from 'react'

// Tipos de lecciones
interface Leccion {
  id: string
  titulo: string
  icono: string
  estado: 'bloqueado' | 'disponible' | 'completado'
  xp: number
  duracion: string
}

// Datos de las lecciones - Reglamento World Rugby 2024
const lecciones: Leccion[] = [
  { id: 'espiritu', titulo: 'El Espíritu del Juego', icono: '💎', estado: 'disponible', xp: 20, duracion: '4 min' },
  { id: 'estructura', titulo: 'Estructura del Partido', icono: '👥', estado: 'bloqueado', xp: 25, duracion: '5 min' },
  { id: 'puntuacion', titulo: 'Sistema de Puntuación', icono: '🏆', estado: 'bloqueado', xp: 20, duracion: '4 min' },
  { id: 'contacto', titulo: 'Contacto y Fases', icono: '🤼', estado: 'bloqueado', xp: 30, duracion: '5 min' },
  { id: 'reinicios', titulo: 'Reinicios y Formaciones', icono: '🔄', estado: 'bloqueado', xp: 30, duracion: '5 min' },
  { id: 'infracciones', titulo: 'Infracciones y Juego Sucio', icono: '⚠️', estado: 'bloqueado', xp: 25, duracion: '5 min' },
  { id: 'quiz', titulo: 'Quiz Final URBA', icono: '🎯', estado: 'bloqueado', xp: 50, duracion: '6 min' },
]

// Componente de video del Rudasaurio
function RudasaurioVideo({ 
  tipo, 
  onComplete 
}: { 
  tipo: 'intro' | 'celebrating' | 'woop' | 'error' | 'molesto'
  onComplete?: () => void 
}) {
  const [videoTerminado, setVideoTerminado] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  const videos: Record<string, string> = {
    intro: '/assets/Rudasaurio/Rudasaurio%20Woop.mp4',
    celebrating: '/assets/Rudasaurio/Rudasaurio%20Celebrating%20Lesson%20completed.mp4',
    woop: '/assets/Rudasaurio/Rudasaurio%20Woop.mp4',
    error: '/assets/Rudasaurio/Rudasaurio%20Error.mp4',
    molesto: '/assets/Rudasaurio/Rudasaurio%20Molesto.mp4',
  }

  const mensajes: Record<string, string> = {
    intro: '¡Hola! Soy Rudasaurio. Vamos a aprender rugby juntos.',
    celebrating: '¡Excelente! ¡Lección completada! 🎉',
    woop: '¡Correcto! ¡Seguí así!',
    error: 'Casi... Intentá de nuevo.',
    molesto: '¡No te rindas! Podés hacerlo.',
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-900 rounded-3xl p-8 max-w-md text-center border-2 border-ruda-gold">
        {cargando && (
          <div className="w-80 h-80 mx-auto mb-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-ruda-gold border-t-transparent"></div>
          </div>
        )}
        <video 
          src={videos[tipo]} 
          autoPlay 
          playsInline
          muted
          preload="auto"
          onLoadedData={() => setCargando(false)}
          onEnded={() => {
            setVideoTerminado(true)
          }}
          onError={() => {
            setError(true)
            setCargando(false)
            setVideoTerminado(true)
          }}
          className={`w-80 h-80 mx-auto mb-4 object-contain rounded-xl ${cargando ? 'hidden' : ''}`}
        />
        {error && (
          <div className="w-80 h-80 mx-auto mb-4 flex items-center justify-center bg-ruda-green/20 rounded-xl">
            <span className="text-6xl">🏉</span>
          </div>
        )}
        <p className="text-xl font-bold text-white mb-4">{mensajes[tipo]}</p>
        
        {videoTerminado && !cargando && (
          <button 
            onClick={() => {
              onComplete?.()
            }}
            className="bg-ruda-gold text-ruda-black px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-all hover:scale-105"
          >
            Continuar →
          </button>
        )}
      </div>
    </div>
  )
}

// Componente de lección individual en el mapa
function LeccionCard({ 
  leccion, 
  onClick, 
  index 
}: { 
  leccion: Leccion
  onClick: () => void
  index: number
}) {
  const esPar = index % 2 === 0
  
  return (
    <div 
      className={`flex items-center gap-4 ${esPar ? 'flex-row' : 'flex-row-reverse'}`}
      style={{ marginLeft: esPar ? '0' : '20%', marginRight: esPar ? '20%' : '0' }}
    >
      <button
        onClick={onClick}
        disabled={leccion.estado === 'bloqueado'}
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center text-3xl
          transition-all duration-300 hover:scale-110
          ${leccion.estado === 'completado' ? 'bg-green-500 shadow-lg shadow-green-500/50' : ''}
          ${leccion.estado === 'disponible' ? 'bg-ruda-gold shadow-lg shadow-ruda-gold/50 animate-pulse' : ''}
          ${leccion.estado === 'bloqueado' ? 'bg-gray-700 cursor-not-allowed' : ''}
        `}
      >
        {leccion.estado === 'completado' ? '✓' : leccion.icono}
        
        {leccion.estado === 'disponible' && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs">
            !
          </div>
        )}
      </button>
      
      <div className={`flex-1 ${leccion.estado === 'bloqueado' ? 'opacity-50' : ''}`}>
        <h3 className="font-bold text-white">{leccion.titulo}</h3>
        <p className="text-sm text-gray-400">{leccion.duracion} • {leccion.xp} XP</p>
      </div>
    </div>
  )
}

// Componente para pasos de información
function InfoPaso({ 
  pasoActual, 
  onNext 
}: { 
  pasoActual: any
  onNext: () => void 
}) {
  const [videoTerminado, setVideoTerminado] = useState(!pasoActual.imagen)

  return (
    <div className="text-center">
      {pasoActual.imagen && (
        <video 
          src={pasoActual.imagen} 
          autoPlay 
          playsInline
          onEnded={() => setVideoTerminado(true)}
          className="w-48 h-48 mx-auto mb-4 object-contain rounded-lg"
        />
      )}
      <h2 className="text-2xl font-bold text-ruda-gold mb-4">{pasoActual.titulo}</h2>
      <p className="text-lg text-gray-300 mb-6">{pasoActual.texto}</p>
      
      {videoTerminado && (
        <button
          onClick={onNext}
          className="bg-ruda-green text-white px-8 py-3 rounded-xl font-bold hover:bg-ruda-dark-green"
        >
          Continuar →
        </button>
      )}
    </div>
  )
}

// Contenido de lección tipo Duolingo
function ContenidoLeccion({ 
  leccion, 
  onComplete 
}: { 
  leccion: Leccion
  onComplete: () => void 
}) {
  const [paso, setPaso] = useState(0)
  const [respuesta, setRespuesta] = useState<string | null>(null)
  const [mostrarFeedback, setMostrarFeedback] = useState(false)
  const [rudasaurioState, setRudasaurioState] = useState<'woop' | 'error' | 'molesto' | null>(null)
  const [intentos, setIntentos] = useState(0)

  // Contenido por lección - Reglamento World Rugby 2024
  const contenido: Record<string, any[]> = {
    espiritu: [
      {
        tipo: 'info',
        titulo: '💎 Los 5 Valores del Rugby',
        texto: 'Integridad, Pasión, Solidaridad, Disciplina y Respeto. Estos valores definen el espíritu del juego.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuáles son los 5 valores del rugby?',
        opciones: ['Fuerza, Velocidad, Agresividad, Victoria, Orgullo', 'Integridad, Pasión, Solidaridad, Disciplina, Respeto', 'Ganar, Competir, Luchar, Sufrir, Triunfar', 'Equipo, Pelota, Cancha, Árbitro, Público'],
        correcta: 'Integridad, Pasión, Solidaridad, Disciplina, Respeto'
      },
      {
        tipo: 'info',
        titulo: '🏟️ El Campo de Juego',
        texto: 'Dimensiones máximas: 100 metros de largo × 70 metros de ancho. Zona de in-goal: 5-22 metros.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuáles son las dimensiones máximas del campo?',
        opciones: ['90m × 60m', '100m × 70m', '110m × 80m', '80m × 50m'],
        correcta: '100m × 70m'
      },
      {
        tipo: 'info',
        titulo: '🏈 La Pelota Oficial',
        texto: 'Forma ovalada, compuesta por 4 gajos. Peso: 410-460 gramos.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuántos gajos tiene la pelota de rugby?',
        opciones: ['2', '3', '4', '6'],
        correcta: '4'
      }
    ],
    estructura: [
      {
        tipo: 'info',
        titulo: '👥 Los Jugadores',
        texto: '15 jugadores máximos en campo por equipo. 8 reemplazos permitidos en rugby XV.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuántos jugadores máximos puede tener un equipo en el campo?',
        opciones: ['13', '14', '15', '16'],
        correcta: '15'
      },
      {
        tipo: 'info',
        titulo: '⏱️ Duración del Partido',
        texto: '80 minutos en total. Dos tiempos de 40 minutos. Entretiempo máximo: 15 minutos.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuánto dura un partido de rugby?',
        opciones: ['60 minutos', '70 minutos', '80 minutos', '90 minutos'],
        correcta: '80 minutos'
      },
      {
        tipo: 'info',
        titulo: '🎖️ El Árbitro Principal',
        texto: 'Único juez de hechos y leyes. Puede ser asistido por jueces de touch y TMO.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Quién es el único juez de hechos y leyes en el campo?',
        opciones: ['El capitán', 'El árbitro principal', 'Los jueces de touch', 'El TMO'],
        correcta: 'El árbitro principal'
      }
    ],
    puntuacion: [
      {
        tipo: 'info',
        titulo: '🏆 El TRY',
        texto: '5 puntos. Apoyar la pelota en el in-goal rival con presión del rival.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuántos puntos vale un TRY?',
        opciones: ['3 puntos', '5 puntos', '7 puntos', '2 puntos'],
        correcta: '5 puntos'
      },
      {
        tipo: 'info',
        titulo: '⭐ TRY PENAL',
        texto: '7 puntos. Otorgado por juego sucio que impide un try probable. No requiere conversión.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuántos puntos vale un TRY PENAL?',
        opciones: ['5 puntos', '6 puntos', '7 puntos', '8 puntos'],
        correcta: '7 puntos'
      },
      {
        tipo: 'info',
        titulo: '🎯 Conversión, Penal y Drop',
        texto: 'Conversión = 2 pts (tras try). Penal = 3 pts (patada al arco). Drop = 3 pts (en juego abierto).',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuántos puntos vale una CONVERSIÓN?',
        opciones: ['1 punto', '2 puntos', '3 puntos', '5 puntos'],
        correcta: '2 puntos'
      }
    ],
    contacto: [
      {
        tipo: 'info',
        titulo: '🤼 El Tackle',
        texto: 'Ocurre cuando el portador es agarrado y llevado al suelo. El tackleador debe soltar y alejarse.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué debe hacer el tackleador después del tackle?',
        opciones: ['Quedarse sobre el jugador', 'Soltar y alejarse inmediatamente', 'Tomar la pelota', 'Esperar que venga su equipo'],
        correcta: 'Soltar y alejarse inmediatamente'
      },
      {
        tipo: 'info',
        titulo: '📐 El RUCK',
        texto: 'Fase donde jugadores de pie (mínimo 1 por equipo) compiten por la pelota en el suelo. Solo se entra desde atrás.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Desde dónde se debe entrar a un ruck?',
        opciones: ['Desde cualquier lado', 'Desde adelante', 'Desde atrás (por la puerta)', 'Desde los costados'],
        correcta: 'Desde atrás (por la puerta)'
      },
      {
        tipo: 'info',
        titulo: '🏃 El MAUL',
        texto: 'Jugadores asidos y de pie, desplazándose. La pelota está en las manos, no en el suelo.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuál es la diferencia entre RUCK y MAUL?',
        opciones: ['Son lo mismo', 'En el ruck la pelota está en las manos', 'En el maul la pelota está en las manos', 'El maul es solo para forwards'],
        correcta: 'En el maul la pelota está en las manos'
      }
    ],
    reinicios: [
      {
        tipo: 'info',
        titulo: '🏉 El SCRUM',
        texto: '8 jugadores por equipo se asen juntos. Reinicia tras knock-on o pase forward.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuántos jugadores forman un SCRUM por equipo?',
        opciones: ['6', '7', '8', '9'],
        correcta: '8'
      },
      {
        tipo: 'info',
        titulo: '📤 El LINEOUT',
        texto: 'Reinicio cuando la pelota sale por touch. Mínimo 2 jugadores por equipo en hilera. Se puede levantar a un compañero.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué es un LINEOUT?',
        opciones: ['Una patada de salida', 'Reinicio cuando la pelota sale por touch', 'Un tipo de tackle', 'Una infracción'],
        correcta: 'Reinicio cuando la pelota sale por touch'
      },
      {
        tipo: 'info',
        titulo: '✨ Ley de Ventaja',
        texto: 'El árbitro permite continuar tras infracción si el equipo no infractor obtiene ventaja táctica o territorial.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué es la LEY DE VENTAJA?',
        opciones: ['El equipo que anota sigue jugando', 'El árbitro permite continuar si el equipo no infractor obtiene ventaja', 'Dar ventaja al equipo local', 'Una regla solo para profesionales'],
        correcta: 'El árbitro permite continuar si el equipo no infractor obtiene ventaja'
      }
    ],
    infracciones: [
      {
        tipo: 'info',
        titulo: '❌ KNOCK-ON',
        texto: 'Cuando la pelota se cae hacia adelante y toca el suelo u otro jugador. Sanción: scrum para el rival.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué es un KNOCK-ON?',
        opciones: ['Una patada hacia adelante', 'Cuando la pelota se cae hacia adelante y toca el suelo', 'Un tipo de tackle', 'Una patada de despeje'],
        correcta: 'Cuando la pelota se cae hacia adelante y toca el suelo'
      },
      {
        tipo: 'info',
        titulo: '📏 OFFSIDE',
        texto: 'Un jugador está en offside si está delante de un compañero que porta la pelota. No puede interferir en el juego.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuándo un jugador está en OFFSIDE?',
        opciones: ['Cuando está detrás del portador', 'Cuando está delante de un compañero que porta la pelota', 'Cuando está en su zona de try', 'Cuando sale de la cancha'],
        correcta: 'Cuando está delante de un compañero que porta la pelota'
      },
      {
        tipo: 'info',
        titulo: '🟨🟥 Tarjetas',
        texto: 'Amarilla = 10 minutos fuera. Roja = exclusión definitiva del partido.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuánto dura una TARJETA AMARILLA?',
        opciones: ['5 minutos', '10 minutos', '15 minutos', 'Todo el partido'],
        correcta: '10 minutos'
      }
    ],
    quiz: [
      {
        tipo: 'quiz',
        pregunta: '¿Cuántos puntos vale un try + conversión?',
        opciones: ['5', '6', '7', '8'],
        correcta: '7'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuántos reemplazos se permiten en rugby XV?',
        opciones: ['5', '6', '7', '8'],
        correcta: '8'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué vale un DROP GOAL?',
        opciones: ['2 puntos', '3 puntos', '5 puntos', '7 puntos'],
        correcta: '3 puntos'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué implica una TARJETA ROJA?',
        opciones: ['Amonestación verbal', '10 minutos fuera', 'Exclusión definitiva del partido', 'Suspensión de 1 partido'],
        correcta: 'Exclusión definitiva del partido'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuánto pesa la pelota oficial?',
        opciones: ['300-350 gramos', '410-460 gramos', '500-550 gramos', '380-420 gramos'],
        correcta: '410-460 gramos'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué valor representa "No hacer trampas"?',
        opciones: ['Pasión', 'Solidaridad', 'Integridad', 'Disciplina'],
        correcta: 'Integridad'
      }
    ]
  }

  const pasos = contenido[leccion.id] || []
  const pasoActual = pasos[paso]

  const verificarRespuesta = (opcion: string) => {
    setRespuesta(opcion)
    setMostrarFeedback(true)
    
    if (opcion === pasoActual.correcta) {
      setRudasaurioState('woop')
      setTimeout(() => {
        setMostrarFeedback(false)
        setRespuesta(null)
        setRudasaurioState(null)
        if (paso < pasos.length - 1) {
          setPaso(paso + 1)
        } else {
          onComplete()
        }
      }, 3500)
    } else {
      setIntentos(intentos + 1)
      if (intentos >= 1) {
        setRudasaurioState('molesto')
      } else {
        setRudasaurioState('error')
      }
      setTimeout(() => {
        setMostrarFeedback(false)
        setRespuesta(null)
        setRudasaurioState(null)
      }, 3000)
    }
  }

  if (!pasoActual) return null

  return (
    <div className="max-w-2xl mx-auto">
      {/* Barra de progreso */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Paso {paso + 1} de {pasos.length}</span>
          <span>{leccion.titulo}</span>
        </div>
        <div className="bg-gray-700 h-3 rounded-full">
          <div 
            className="bg-ruda-gold h-3 rounded-full transition-all"
            style={{ width: `${((paso + 1) / pasos.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-white/10">
        {pasoActual.tipo === 'info' && (
          <InfoPaso 
            pasoActual={pasoActual} 
            onNext={() => {
              if (paso < pasos.length - 1) {
                setPaso(paso + 1)
              } else {
                onComplete()
              }
            }}
          />
        )}

        {pasoActual.tipo === 'quiz' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6 text-center">{pasoActual.pregunta}</h2>
            
            <div className="space-y-3">
              {pasoActual.opciones.map((opcion: string) => (
                <button
                  key={opcion}
                  onClick={() => !mostrarFeedback && verificarRespuesta(opcion)}
                  disabled={mostrarFeedback}
                  className={`
                    w-full p-4 rounded-xl text-left font-bold transition-all
                    ${respuesta === opcion 
                      ? opcion === pasoActual.correcta 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                    }
                  `}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rudasaurio feedback */}
      {rudasaurioState && <RudasaurioVideo tipo={rudasaurioState} />}
    </div>
  )
}

export default function Nivel2Page() {
  const [leccionActiva, setLeccionActiva] = useState<string | null>(null)
  const [mostrarIntro, setMostrarIntro] = useState(true)
  const [leccionesState, setLeccionesState] = useState(lecciones)
  const [mostrandoCelebracion, setMostrandoCelebracion] = useState(false)

  const completarLeccion = (id: string) => {
    setMostrandoCelebracion(true)
    
    setTimeout(() => {
      setMostrandoCelebracion(false)
      setLeccionesState(prev => {
        const nuevo = prev.map(l => {
          if (l.id === id) return { ...l, estado: 'completado' as const }
          const index = prev.findIndex(x => x.id === id)
          if (index < prev.length - 1 && prev[index + 1].estado === 'bloqueado') {
            return l
          }
          return l
        })
        // Desbloquear la siguiente
        const index = prev.findIndex(x => x.id === id)
        if (index < prev.length - 1 && nuevo[index + 1].estado === 'bloqueado') {
          nuevo[index + 1] = { ...nuevo[index + 1], estado: 'disponible' as const }
        }
        return nuevo
      })
      setLeccionActiva(null)
    }, 4000)
  }

  const xpTotal = leccionesState.reduce((acc, l) => acc + l.xp, 0)
  const xpGanado = leccionesState.filter(l => l.estado === 'completado').reduce((acc, l) => acc + l.xp, 0)
  const progreso = Math.round((leccionesState.filter(l => l.estado === 'completado').length / leccionesState.length) * 100)

  // Intro con Rudasaurio
  if (mostrarIntro) {
    return <RudasaurioVideo tipo="intro" onComplete={() => setMostrarIntro(false)} />
  }

  // Modal de lección activa
  if (leccionActiva) {
    const leccion = leccionesState.find(l => l.id === leccionActiva)
    if (!leccion) return null

    return (
      <div className="fixed inset-0 bg-ruda-black z-50 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => setLeccionActiva(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕ Cerrar
            </button>
            <div className="text-center">
              <p className="text-ruda-gold text-sm font-bold">NIVEL 2: URBA</p>
              <p className="text-white font-bold">{leccion.titulo}</p>
            </div>
            <div className="text-ruda-gold font-bold">{leccion.xp} XP</div>
          </div>

          {/* Contenido */}
          <ContenidoLeccion 
            leccion={leccion} 
            onComplete={() => completarLeccion(leccion.id)}
          />
        </div>

        {/* Celebración */}
        {mostrandoCelebracion && <RudasaurioVideo tipo="celebrating" />}
      </div>
    )
  }

  // Vista principal - Mapa de lecciones
  return (
    <div className="min-h-screen bg-ruda-black text-white">
      {/* Header */}
      <header className="bg-ruda-black/80 dark:bg-gray-900 border-b border-white/10 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/ruda-school" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Volver
            </Link>
            <div className="h-6 w-px bg-gray-700"></div>
            <div>
              <p className="text-ruda-gold text-sm font-bold">NIVEL 2</p>
              <h1 className="text-xl font-black">URBA - Reglamento Oficial</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-ruda-green/20 to-ruda-gold/20 dark:from-ruda-green/30 dark:to-ruda-gold/30 rounded-2xl p-8 mb-8 border border-ruda-gold/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-ruda-green rounded-2xl flex items-center justify-center text-3xl">
              📚
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Reglamento World Rugby 2024</h2>
              <p className="text-gray-400">Aprende las reglas oficiales paso a paso con Rudasaurio</p>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-6">
            <div className="bg-ruda-black/50 dark:bg-gray-900/50 rounded-lg px-4 py-2">
              <p className="text-ruda-gold font-bold text-xl">{xpGanado} / {xpTotal} XP</p>
              <p className="text-gray-500 text-sm">Progreso total</p>
            </div>
            <div className="bg-ruda-black/50 dark:bg-gray-900/50 rounded-lg px-4 py-2">
              <p className="text-white font-bold text-xl">{leccionesState.filter(l => l.estado === 'completado').length} / {leccionesState.length}</p>
              <p className="text-gray-500 text-sm">Lecciones</p>
            </div>
          </div>
        </div>

        {/* Mapa de lecciones estilo Duolingo */}
        <div className="space-y-8 mb-12">
          {leccionesState.map((leccion, index) => (
            <LeccionCard
              key={leccion.id}
              leccion={leccion}
              index={index}
              onClick={() => {
                if (leccion.estado !== 'bloqueado') {
                  setLeccionActiva(leccion.id)
                }
              }}
            />
          ))}
        </div>

        {/* Progreso */}
        <div className="mt-12 bg-gray-800/30 dark:bg-gray-800/50 rounded-2xl p-6 border border-white/10 dark:border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">📊 Tu Progreso</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-700/50 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-ruda-green to-ruda-gold h-full rounded-full transition-all duration-500"
                style={{ width: `${progreso}%` }}
              ></div>
            </div>
            <p className="text-gray-400 font-bold">{progreso}%</p>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            {progreso === 100 ? '🎉 ¡Completaste el nivel! Sos un experto en el reglamento.' : 'Completá todas las lecciones para dominar el reglamento World Rugby.'}
          </p>
        </div>
      </div>
    </div>
  )
}