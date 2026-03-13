'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

// Tipos de lecciones
interface Leccion {
  id: string
  titulo: string
  icono: string
  estado: 'bloqueado' | 'disponible' | 'completado'
  xp: number
  duracion: string
}

// Datos de las lecciones
const lecciones: Leccion[] = [
  { id: 'intro', titulo: 'El Origen', icono: '🏉', estado: 'disponible', xp: 10, duracion: '3 min' },
  { id: 'valores', titulo: 'Los 5 Valores', icono: '💎', estado: 'bloqueado', xp: 15, duracion: '4 min' },
  { id: 'puntuacion', titulo: 'Puntuación', icono: '🏆', estado: 'bloqueado', xp: 15, duracion: '4 min' },
  { id: 'reglas', titulo: 'Reglas', icono: '📋', estado: 'bloqueado', xp: 20, duracion: '5 min' },
  { id: 'castigos', titulo: 'Sanciones', icono: '⚖️', estado: 'bloqueado', xp: 15, duracion: '4 min' },
  { id: 'quiz', titulo: 'Quiz Final', icono: '🎯', estado: 'bloqueado', xp: 25, duracion: '5 min' },
]

// Componente de video del Rudasaurio
function RudasaurioVideo({ 
  tipo, 
  onComplete 
}: { 
  tipo: 'intro' | 'celebrating' | 'woop' | 'error' | 'molesto'
  onComplete?: () => void 
}) {
  const [mostrar, setMostrar] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrar(false)
      onComplete?.()
    }, 5000) // 5 segundos (duración del video)
    return () => clearTimeout(timer)
  }, [onComplete])

  if (!mostrar) return null

  const videos: Record<string, string> = {
    intro: '/assets/Rudasaurio/Web%20Ellis.mp4',
    celebrating: '/assets/Rudasaurio/Rudasaurio%20Celebrating%20Lesson%20completed.mp4',
    woop: '/assets/Rudasaurio/Rudasaurio%20Woop.mp4',
    error: '/assets/Rudasaurio/Rudasaurio%20Error.mp4',
    molesto: '/assets/Rudasaurio/RudaSaurio%20Molesto%20.mp4',
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
        <video 
          src={videos[tipo]} 
          autoPlay 
          loop
          className="w-80 h-80 mx-auto mb-4 object-contain rounded-xl"
        />
        <p className="text-xl font-bold text-white mb-4">{mensajes[tipo]}</p>
        
        <button 
          onClick={() => {
            setMostrar(false)
            onComplete?.()
          }}
          className="bg-ruda-gold text-ruda-black px-6 py-2 rounded-full font-bold hover:bg-yellow-400"
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}

// Componente de lección individual
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

  // Contenido por lección
  const contenido: Record<string, any[]> = {
    intro: [
      {
        tipo: 'info',
        titulo: '¿Quién fue William Webb Ellis?',
        texto: 'En 1823, durante un partido de fútbol en Rugby, Inglaterra, un joven levantó la pelota y corrió con ella. Ese acto rebelde dio origen al rugby.',
        imagen: '/assets/Rudasaurio/Web%20Ellis.mp4'
      },
      {
        tipo: 'quiz',
        pregunta: '¿En qué año nació la leyenda de Webb Ellis?',
        opciones: ['1823', '1845', '1900', '1987'],
        correcta: '1823'
      },
      {
        tipo: 'info',
        titulo: 'El Espíritu del Rugby',
        texto: 'El rugby se juega con 5 valores: Integridad, Pasión, Solidaridad, Disciplina y Respeto.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuántos valores tiene el rugby?',
        opciones: ['3', '4', '5', '6'],
        correcta: '5'
      }
    ],
    valores: [
      {
        tipo: 'info',
        titulo: 'Integridad ⚖️',
        texto: 'Honestidad y rectitud. No hacemos trampas, no simulamos faltas.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué significa integridad en rugby?',
        opciones: ['Ganar a toda costa', 'Honestidad y juego limpio', 'Ser el mejor', 'No hacer tackles'],
        correcta: 'Honestidad y juego limpio'
      },
      {
        tipo: 'info',
        titulo: 'Pasión 🔥',
        texto: 'Dar el 100% en cada entrenamiento. Defender los colores con orgullo.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué significa "Nuestra lucha es jugando"?',
        opciones: ['Pelear en la cancha', 'Dar todo en el entrenamiento', 'Jugar agresivo', 'No entrenar'],
        correcta: 'Dar todo en el entrenamiento'
      }
    ],
    puntuacion: [
      {
        tipo: 'info',
        titulo: 'Sistema de Puntos',
        texto: 'Try = 5 puntos. Conversión = 2 puntos. Penal/Drop = 3 puntos.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuántos puntos vale un try?',
        opciones: ['2', '3', '5', '7'],
        correcta: '5'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuántos puntos vale una conversión?',
        opciones: ['1', '2', '3', '5'],
        correcta: '2'
      }
    ],
    reglas: [
      {
        tipo: 'info',
        titulo: 'Pase Adelante Prohibido',
        texto: 'La pelota solo se pasa con las manos hacia atrás o al costado. Si se pasa adelante: penal.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Hacia dónde se puede pasar la pelota?',
        opciones: ['Hacia adelante', 'Hacia atrás o al costado', 'Solo hacia adelante', 'En cualquier dirección'],
        correcta: 'Hacia atrás o al costado'
      },
      {
        tipo: 'info',
        titulo: 'Tackle',
        texto: 'Solo al portador de la pelota, por debajo de los hombros.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Dónde se puede tacklear?',
        opciones: ['Por encima de los hombros', 'Por debajo de los hombros', 'En cualquier lado', 'Solo en las piernas'],
        correcta: 'Por debajo de los hombros'
      }
    ],
    castigos: [
      {
        tipo: 'info',
        titulo: 'Penal',
        texto: 'Otorgado tras falta grave. Opciones: patear al arco (3 pts), patear al lateral, tap y correr, o scrum.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuántos puntos vale un penal si se patea al arco?',
        opciones: ['2', '3', '5', '7'],
        correcta: '3'
      },
      {
        tipo: 'info',
        titulo: 'Tarjetas',
        texto: '🟨 Amarilla = 10 minutos fuera. 🟥 Roja = expulsión definitiva.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuánto dura una tarjeta amarilla?',
        opciones: ['5 minutos', '10 minutos', 'Toda la cancha', '20 minutos'],
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
        pregunta: '¿Qué valor representa "No hacer trampas"?',
        opciones: ['Pasión', 'Solidaridad', 'Integridad', 'Disciplina'],
        correcta: 'Integridad'
      },
      {
        tipo: 'quiz',
        pregunta: '¿En qué año se fundó la RFU?',
        opciones: ['1823', '1845', '1871', '1899'],
        correcta: '1871'
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
      }, 2000)
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
      }, 2000)
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
          <div className="text-center">
            {pasoActual.imagen && (
              <video 
                src={pasoActual.imagen} 
                autoPlay 
                loop
                className="w-48 h-48 mx-auto mb-4 object-contain rounded-lg"
              />
            )}
            <h2 className="text-2xl font-bold text-ruda-gold mb-4">{pasoActual.titulo}</h2>
            <p className="text-lg text-gray-300 mb-6">{pasoActual.texto}</p>
            
            <button
              onClick={() => {
                if (paso < pasos.length - 1) {
                  setPaso(paso + 1)
                } else {
                  onComplete()
                }
              }}
              className="bg-ruda-green text-white px-8 py-3 rounded-xl font-bold hover:bg-ruda-dark-green"
            >
              Continuar →
            </button>
          </div>
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

export default function Nivel1Gamificado() {
  const [leccionActiva, setLeccionActiva] = useState<string | null>(null)
  const [progreso, setProgreso] = useState(0)
  const [mostrarIntro, setMostrarIntro] = useState(true)
  const [leccionesState, setLeccionesState] = useState(lecciones)

  const completarLeccion = (id: string) => {
    setLeccionesState(prev => {
      const nuevo = prev.map(l => {
        if (l.id === id) return { ...l, estado: 'completado' as const }
        const index = prev.findIndex(x => x.id === id)
        const nextIndex = index + 1
        if (nextIndex < prev.length && prev[nextIndex].id === l.id) {
          return { ...l, estado: 'disponible' as const }
        }
        return l
      })
      return nuevo
    })
    
    setProgreso(prev => Math.min(prev + 15, 100))
    setLeccionActiva(null)
  }

  const leccionActual = leccionesState.find(l => l.id === leccionActiva)

  return (
    <div className="min-h-screen bg-ruda-black">
      {/* Intro del Rudasaurio */}
      {mostrarIntro && <RudasaurioVideo tipo="intro" onComplete={() => setMostrarIntro(false)} />}
      
      {/* Celebración al completar */}
      {progreso >= 100 && <RudasaurioVideo tipo="celebrating" />}

      {/* Header */}
      <header className="bg-ruda-black/95 backdrop-blur-md border-b border-ruda-gold/20 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/ruda-school" className="flex items-center gap-2 text-gray-400 hover:text-white">
              <span>←</span>
              <span className="hidden sm:inline">Volver</span>
            </Link>
            
            <div className="text-center">
              <p className="text-ruda-gold text-sm font-bold">NIVEL 1</p>
              <h1 className="text-white font-black text-lg">FUNDAMENTOS</h1>
            </div>
            
            <div className="w-20">
              <div className="bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-ruda-green to-ruda-gold h-2 rounded-full transition-all"
                  style={{ width: `${progreso}%` }}
                />
              </div>
              <p className="text-right text-xs text-gray-500 mt-1">{progreso}%</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {leccionActiva && leccionActual ? (
          <ContenidoLeccion 
            leccion={leccionActual} 
            onComplete={() => completarLeccion(leccionActiva)}
          />
        ) : (
          <>
            {/* Título */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <video 
                  src="/assets/Rudasaurio/Rudasaurio%20Woop.mp4" 
                  autoPlay 
                  loop
                  className="w-24 h-24 object-contain rounded-lg"
                />
                <div>
                  <h1 className="text-3xl font-black text-white">¡Aprende con Rudasaurio!</h1>
                  <p className="text-gray-400">Completa las lecciones para desbloquear el Nivel 2</p>
                </div>
              </div>
            </div>

            {/* Mapa de lecciones */}
            <div className="space-y-8 relative">
              {/* Línea conectora */}
              <div className="absolute left-10 top-10 bottom-10 w-1 bg-gradient-to-b from-ruda-gold via-green-500 to-gray-700" />

              {leccionesState.map((leccion, index) => (
                <LeccionCard
                  key={leccion.id}
                  leccion={leccion}
                  index={index}
                  onClick={() => setLeccionActiva(leccion.id)}
                />
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 bg-gray-800/50 rounded-2xl p-6 text-center">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-3xl font-black text-ruda-gold">{leccionesState.filter(l => l.estado === 'completado').length}</p>
                  <p className="text-sm text-gray-400">Completadas</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-ruda-gold">{progreso}%</p>
                  <p className="text-sm text-gray-400">Progreso</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-ruda-gold">{leccionesState.filter(l => l.estado === 'completado').reduce((acc, l) => acc + l.xp, 0)}</p>
                  <p className="text-sm text-gray-400">XP Total</p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
