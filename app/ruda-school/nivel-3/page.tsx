'use client'

import Link from 'next/link'
import { useState } from 'react'

// Tipos de lecciones
interface Leccion {
  id: string
  titulo: string
  subtitulo: string
  numero: number
  icono: string
  estado: 'bloqueado' | 'disponible' | 'completado'
  xp: number
  duracion: string
  tipo: 'forward' | 'back'
}

// Datos de las lecciones - 15 posiciones
const lecciones: Leccion[] = [
  // Forwards (1-8)
  { id: 'pilar-izq', titulo: 'Pilar Izquierdo', subtitulo: 'La fuerza inquebrantable', numero: 1, icono: '🏋️', estado: 'disponible', xp: 20, duracion: '4 min', tipo: 'forward' },
  { id: 'hooker', titulo: 'Hooker', subtitulo: 'El francotirador del pack', numero: 2, icono: '🎯', estado: 'bloqueado', xp: 20, duracion: '4 min', tipo: 'forward' },
  { id: 'pilar-der', titulo: 'Pilar Derecho', subtitulo: 'El ancla del equipo', numero: 3, icono: '⚓', estado: 'bloqueado', xp: 20, duracion: '4 min', tipo: 'forward' },
  { id: 'segunda-saltador', titulo: 'Segunda Línea - Saltador', subtitulo: 'El gigante ágil', numero: 4, icono: '🦒', estado: 'bloqueado', xp: 25, duracion: '5 min', tipo: 'forward' },
  { id: 'segunda-motor', titulo: 'Segunda Línea - Motor', subtitulo: 'La torre de potencia', numero: 5, icono: '⚙️', estado: 'bloqueado', xp: 25, duracion: '5 min', tipo: 'forward' },
  { id: 'ala-ciego', titulo: 'Ala Lado Ciego', subtitulo: 'El tackleador incansable', numero: 6, icono: '🛡️', estado: 'bloqueado', xp: 25, duracion: '5 min', tipo: 'forward' },
  { id: 'ala-abierto', titulo: 'Ala Lado Abierto', subtitulo: 'El cazador', numero: 7, icono: '🦅', estado: 'bloqueado', xp: 25, duracion: '5 min', tipo: 'forward' },
  { id: 'numero-8', titulo: 'Número 8', subtitulo: 'El explosivo', numero: 8, icono: '💥', estado: 'bloqueado', xp: 30, duracion: '5 min', tipo: 'forward' },
  // Backs (9-15)
  { id: 'medio-scrum', titulo: 'Medio Scrum', subtitulo: 'El estratega inquieto', numero: 9, icono: '⚡', estado: 'bloqueado', xp: 25, duracion: '5 min', tipo: 'back' },
  { id: 'apertura', titulo: 'Apertura', subtitulo: 'El director de orquesta', numero: 10, icono: '🎼', estado: 'bloqueado', xp: 30, duracion: '5 min', tipo: 'back' },
  { id: 'wing-izq', titulo: 'Wing Izquierdo', subtitulo: 'El finalizador evasivo', numero: 11, icono: '💨', estado: 'bloqueado', xp: 25, duracion: '4 min', tipo: 'back' },
  { id: 'centro-int', titulo: 'Centro Interior', subtitulo: 'El rompemuros', numero: 12, icono: '🧱', estado: 'bloqueado', xp: 25, duracion: '5 min', tipo: 'back' },
  { id: 'centro-ext', titulo: 'Centro Exterior', subtitulo: 'La cuchilla afilada', numero: 13, icono: '🗡️', estado: 'bloqueado', xp: 25, duracion: '5 min', tipo: 'back' },
  { id: 'wing-der', titulo: 'Wing Derecho', subtitulo: 'El velocista puro', numero: 14, icono: '🚀', estado: 'bloqueado', xp: 25, duracion: '4 min', tipo: 'back' },
  { id: 'full-back', titulo: 'Full Back', subtitulo: 'El guardián del castillo', numero: 15, icono: '🏰', estado: 'bloqueado', xp: 30, duracion: '5 min', tipo: 'back' },
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
  const esForward = leccion.tipo === 'forward'
  
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
          ${leccion.estado === 'disponible' ? (esForward ? 'bg-ruda-gold shadow-lg shadow-ruda-gold/50' : 'bg-blue-500 shadow-lg shadow-blue-500/50') + ' animate-pulse' : ''}
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
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{
            backgroundColor: esForward ? 'rgba(255,193,7,0.2)' : 'rgba(59,130,246,0.2)',
            color: esForward ? '#FFC107' : '#3B82F6'
          }}>
            {leccion.numero}
          </span>
          <h3 className="font-bold text-white">{leccion.titulo}</h3>
        </div>
        <p className="text-sm text-gray-400">{leccion.subtitulo}</p>
        <p className="text-xs text-gray-500">{leccion.duracion} • {leccion.xp} XP</p>
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

  // Contenido por lección - 15 posiciones
  const contenido: Record<string, any[]> = {
    'pilar-izq': [
      {
        tipo: 'info',
        titulo: '🏋️ El Pilar Izquierdo (N° 1)',
        texto: 'Es la fuerza inquebrantable del scrum. Soporta la presión del empuje rival y levanta a sus compañeros en el lineout.',
      },
      {
        tipo: 'info',
        titulo: '💪 Superpoder',
        texto: 'Espalda recta, cabeza baja, empuje con las piernas. Es el motor inicial del scrum.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuál es la función principal del Pilar Izquierdo en el scrum?',
        opciones: ['Lanzar la pelota', 'Soportar la presión y empujar', 'Saltar para atrapar', 'Correr con la pelota'],
        correcta: 'Soportar la presión y empujar'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué debe hacer el Pilar en el lineout?',
        opciones: ['Quedarse atrás', 'Levantar al saltador', 'Lanzar la pelota', 'Correr al try'],
        correcta: 'Levantar al saltador'
      },
    ],
    'hooker': [
      {
        tipo: 'info',
        titulo: '🎯 El Hooker (N° 2)',
        texto: 'El francotirador del pack. Coordinación pura para talonear la pelota en el scrum y lanzarla con precisión en el lineout.',
      },
      {
        tipo: 'info',
        titulo: '👟 Superpoder',
        texto: 'Enganchar la pelota con el pie en el scrum y lanzarla recta en el lineout. Precisión bajo presión.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué significa "talonear" en el scrum?',
        opciones: ['Empujar más fuerte', 'Enganchar la pelota con el pie', 'Gritar instrucciones', 'Saltar más alto'],
        correcta: 'Enganchar la pelota con el pie'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Quién lanza la pelota en el lineout?',
        opciones: ['El Medio Scrum', 'El Pilar', 'El Hooker', 'El Wing'],
        correcta: 'El Hooker'
      },
    ],
    'pilar-der': [
      {
        tipo: 'info',
        titulo: '⚓ El Pilar Derecho (N° 3)',
        texto: 'El ancla del equipo. Recibe la mayor presión física del equipo contrario en el scrum.',
      },
      {
        tipo: 'info',
        titulo: '💪 Estabilidad extrema',
        texto: 'Es usualmente el jugador más fuerte del equipo. Mantiene el scrum estable y da tracción.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Por qué se llama "ancla" al Pilar Derecho?',
        opciones: ['Porque corre más lento', 'Porque sostiene la estructura del scrum', 'Porque es el más alto', 'Porque nunca pasa la pelota'],
        correcta: 'Porque sostiene la estructura del scrum'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué característica física es clave para el Pilar Derecho?',
        opciones: ['Velocidad extrema', 'Fuerza y masa muscular', 'Altura máxima', 'Agilidad'],
        correcta: 'Fuerza y masa muscular'
      },
    ],
    'segunda-saltador': [
      {
        tipo: 'info',
        titulo: '🦒 Segunda Línea - Saltador (N° 4)',
        texto: 'El gigante ágil. Altura dominante para conquistar los cielos en el lineout y robar pelotas rivales.',
      },
      {
        tipo: 'info',
        titulo: '✈️ Superpoder',
        texto: 'Saltar alto, atrapar la pelota en el aire, y competir por la posesión en el lineout.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuál es la función principal del Segunda Línea Saltador?',
        opciones: ['Empujar en el scrum', 'Saltar y atrapar en el lineout', 'Patear al arco', 'Correr tries'],
        correcta: 'Saltar y atrapar en el lineout'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué ventaja tiene un Segunda Línea alto?',
        opciones: ['Corre más rápido', 'Domina el lineout', 'Patea mejor', 'Es más difícil de tacklear'],
        correcta: 'Domina el lineout'
      },
    ],
    'segunda-motor': [
      {
        tipo: 'info',
        titulo: '⚙️ Segunda Línea - Motor (N° 5)',
        texto: 'La torre de potencia. Empuje constante. Es el cuarto de máquinas que da tracción al scrum.',
      },
      {
        tipo: 'info',
        titulo: '🔧 Superpoder',
        texto: 'Tracción, resistencia, potencia. Mantiene el scrum unido y empujando hacia adelante.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Por qué se llama "Motor" al segundo Segunda Línea?',
        opciones: ['Porque corre mucho', 'Porque da tracción y empuje constante', 'Porque habla mucho', 'Porque es el más rápido'],
        correcta: 'Porque da tracción y empuje constante'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué cualidades necesita el Motor?',
        opciones: ['Velocidad y agilidad', 'Tracción y resistencia', 'Visión de juego', 'Buena patada'],
        correcta: 'Tracción y resistencia'
      },
    ],
    'ala-ciego': [
      {
        tipo: 'info',
        titulo: '🛡️ Ala Lado Ciego (N° 6)',
        texto: 'El tackleador incansable. Es el primero en llegar para frenar ataques cerca de las formaciones.',
      },
      {
        tipo: 'info',
        titulo: '🎯 Superpoder',
        texto: 'Defensa de hierro. Llega primero al breakdown, limpia el ruck, y protege la posesión.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué es el "lado ciego" en rugby?',
        opciones: ['El lado donde está el árbitro', 'El lado corto del campo (sin el medio scrum)', 'El lado donde no hay jugadores', 'El lado del try'],
        correcta: 'El lado corto del campo (sin el medio scrum)'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuál es la principal función del Ala Ciego en defensa?',
        opciones: ['Esperar la pelota', 'Frenar ataques y llegar primero al ruck', 'Patear la pelota', 'Correr por la banda'],
        correcta: 'Frenar ataques y llegar primero al ruck'
      },
    ],
    'ala-abierto': [
      {
        tipo: 'info',
        titulo: '🦅 Ala Lado Abierto (N° 7)',
        texto: 'El cazador, también llamado "Pescador". Recupera la pelota en los rucks gracias a su velocidad.',
      },
      {
        tipo: 'info',
        titulo: '🎣 Superpoder',
        texto: 'Técnica corporal baja, velocidad de reacción. "Pescar" la pelota en el ruck cuando es legal.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Por qué se llama "Pescador" al Ala Abierto?',
        opciones: ['Porque le gusta pescar', 'Porque recupera pelotas en el ruck', 'Porque corre rápido', 'Porque salta alto'],
        correcta: 'Porque recupera pelotas en el ruck'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuándo es legal poner las manos en la pelota en el ruck?',
        opciones: ['Siempre', 'Nunca', 'Cuando estás de pie y llegando primero', 'Solo si sos el ala'],
        correcta: 'Cuando estás de pie y llegando primero'
      },
    ],
    'numero-8': [
      {
        tipo: 'info',
        titulo: '💥 El Número 8 (N° 8)',
        texto: 'El explosivo. Combina la fuerza de un forward con la velocidad de un back. Controla la pelota al final del scrum.',
      },
      {
        tipo: 'info',
        titulo: '🎯 Superpoder',
        texto: 'Decisión en el scrum: levantar la pelota y correr, o pasar al Medio Scrum. Línea de ventaja.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Dónde se para el Número 8 en el scrum?',
        opciones: ['Al frente', 'Detrás de los segundos líneas', 'En el medio', 'Afuera del scrum'],
        correcta: 'Detrás de los segundos líneas'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué puede hacer el Número 8 con la pelota en el scrum?',
        opciones: ['Solo pasarla', 'Solo correr', 'Levantarla y correr o pasar', 'Nada, debe esperar'],
        correcta: 'Levantarla y correr o pasar'
      },
    ],
    'medio-scrum': [
      {
        tipo: 'info',
        titulo: '⚡ Medio Scrum (N° 9)',
        texto: 'El estratega inquieto. Conecta forwards con backs. Pases rápidos y visión periférica.',
      },
      {
        tipo: 'info',
        titulo: '🎯 Superpoder',
        texto: 'Distribuir la pelota rápido, liderar la defensa, y tomar decisiones en el ruck.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué número usa el Medio Scrum?',
        opciones: ['N° 6', 'N° 8', 'N° 9', 'N° 10'],
        correcta: 'N° 9'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuál es la función principal del Medio Scrum?',
        opciones: ['Empujar en el scrum', 'Conectar forwards con backs', 'Patear penalties', 'Marcar tries'],
        correcta: 'Conectar forwards con backs'
      },
    ],
    'apertura': [
      {
        tipo: 'info',
        titulo: '🎼 El Apertura (N° 10)',
        texto: 'El director de orquesta. Inteligencia táctica y patada milimétrica. Decide si el equipo corre, pasa o patea.',
      },
      {
        tipo: 'info',
        titulo: '🎯 Superpoder',
        texto: 'Leer el juego, crear espacios, y ejecutar la estrategia del equipo.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Por qué se llama "director de orquesta" al Apertura?',
        opciones: ['Porque toca instrumentos', 'Porque decide la jugada y coordina el ataque', 'Porque es el más alto', 'Porque grita mucho'],
        correcta: 'Porque decide la jugada y coordina el ataque'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué decisiones toma el Apertura?',
        opciones: ['Solo correr', 'Solo pasar', 'Correr, pasar o patear según la situación', 'Solo patear'],
        correcta: 'Correr, pasar o patear según la situación'
      },
    ],
    'wing-izq': [
      {
        tipo: 'info',
        titulo: '💨 Wing Izquierdo (N° 11)',
        texto: 'El finalizador evasivo. Velocidad extrema y quiebre de cintura (step) para dejar atrás a la defensa.',
      },
      {
        tipo: 'info',
        titulo: '🏃 Superpoder',
        texto: 'Correr cerca de la línea de touch, evadir tackles, y apoyar el try.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuál es la función principal del Wing?',
        opciones: ['Empujar en el scrum', 'Finalizar tries y evadir tackles', 'Lanzar en el lineout', 'Patear penalties'],
        correcta: 'Finalizar tries y evadir tackles'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué es el "step" en rugby?',
        opciones: ['Una patada', 'Un quiebre de cintura para evadir', 'Un tipo de tackle', 'Una formación'],
        correcta: 'Un quiebre de cintura para evadir'
      },
    ],
    'centro-int': [
      {
        tipo: 'info',
        titulo: '🧱 Centro Interior (N° 12)',
        texto: 'El rompemuros. Corre líneas directas para ganar metros chocando, o defiende con dureza.',
      },
      {
        tipo: 'info',
        titulo: '💥 Superpoder',
        texto: 'Impacto físico en ataque y defensa. Ganar metros con el cuerpo.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué significa "rompemuros" para el Centro Interior?',
        opciones: ['Romper paredes', 'Ganar metros con impacto físico', 'Esquivar tackles', 'Patear fuerte'],
        correcta: 'Ganar metros con impacto físico'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué es más importante para el Centro Interior?',
        opciones: ['Velocidad pura', 'Impacto físico y lectura defensiva', 'Patada precisa', 'Salto alto'],
        correcta: 'Impacto físico y lectura defensiva'
      },
    ],
    'centro-ext': [
      {
        tipo: 'info',
        titulo: '🗡️ Centro Exterior (N° 13)',
        texto: 'La cuchilla afilada. Aceleración rápida para encontrar huecos en la defensa exterior.',
      },
      {
        tipo: 'info',
        titulo: '🎯 Superpoder',
        texto: 'Leer huecos en la defensa, conectar con los wings, y crear líneas de ataque.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Dónde juega el Centro Exterior?',
        opciones: ['Adentro del Centro Interior', 'Afuera del Centro Interior, cerca del Wing', 'En el scrum', 'Detrás del Full Back'],
        correcta: 'Afuera del Centro Interior, cerca del Wing'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué busca el Centro Exterior en ataque?',
        opciones: ['Empujar en el ruck', 'Encontrar huecos en la defensa', 'Patear siempre', 'Saltar en el lineout'],
        correcta: 'Encontrar huecos en la defensa'
      },
    ],
    'wing-der': [
      {
        tipo: 'info',
        titulo: '🚀 Wing Derecho (N° 14)',
        texto: 'El velocista puro. Arma letal para apoyar el try usando pura aceleración.',
      },
      {
        tipo: 'info',
        titulo: '⚡ Superpoder',
        texto: 'Velocidad terminal. Acabar jugadas y correr hasta el try.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué número usa el Wing Derecho?',
        opciones: ['N° 11', 'N° 13', 'N° 14', 'N° 15'],
        correcta: 'N° 14'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Cuál es la mayor virtud de un Wing?',
        opciones: ['Fuerza para empujar', 'Velocidad y finalización', 'Salto alto', 'Patada precisa'],
        correcta: 'Velocidad y finalización'
      },
    ],
    'full-back': [
      {
        tipo: 'info',
        titulo: '🏰 Full Back (N° 15)',
        texto: 'El guardián del castillo. Última línea de defensa. Seguridad absoluta para atrapar pelotas altas y contraatacar.',
      },
      {
        tipo: 'info',
        titulo: '🛡️ Superpoder',
        texto: 'Atrapar pelotas altas, leer el juego, y lanzar el contraataque.',
      },
      {
        tipo: 'quiz',
        pregunta: '¿Dónde se posiciona el Full Back?',
        opciones: ['En el scrum', 'Detrás de todos, como última línea', 'En la línea de touch', 'En el lineout'],
        correcta: 'Detrás de todos, como última línea'
      },
      {
        tipo: 'quiz',
        pregunta: '¿Qué debe hacer el Full Back con pelotas altas?',
        opciones: ['Dejarlas caer', 'Atraparlas con seguridad', 'Patearlas de vuelta inmediatamente', 'Correr sin mirar'],
        correcta: 'Atraparlas con seguridad'
      },
    ],
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
          <span>{leccion.numero}. {leccion.titulo}</span>
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

export default function Nivel3Page() {
  const [leccionActiva, setLeccionActiva] = useState<string | null>(null)
  const [mostrarIntro, setMostrarIntro] = useState(true)
  const [leccionesState, setLeccionesState] = useState(lecciones)
  const [mostrandoCelebracion, setMostrandoCelebracion] = useState(false)

  const completarLeccion = (id: string) => {
    setMostrandoCelebracion(true)
    
    setTimeout(() => {
      setMostrandoCelebracion(false)
      setLeccionesState(prev => {
        const nuevo = [...prev]
        const index = nuevo.findIndex(l => l.id === id)
        if (index !== -1) {
          nuevo[index] = { ...nuevo[index], estado: 'completado' as const }
          // Desbloquear la siguiente
          if (index < nuevo.length - 1 && nuevo[index + 1].estado === 'bloqueado') {
            nuevo[index + 1] = { ...nuevo[index + 1], estado: 'disponible' as const }
          }
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
              <p className="text-ruda-gold text-sm font-bold">NIVEL 3: POSICIONES</p>
              <p className="text-white font-bold">{leccion.numero}. {leccion.titulo}</p>
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
              <p className="text-ruda-gold text-sm font-bold">NIVEL 3</p>
              <h1 className="text-xl font-black">POSICIONES - XV y VII</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-ruda-green/20 to-ruda-gold/20 dark:from-ruda-green/30 dark:to-ruda-gold/30 rounded-2xl p-8 mb-8 border border-ruda-gold/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-ruda-green rounded-2xl flex items-center justify-center text-3xl">
              🏉
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Conocé las 15 Posiciones</h2>
              <p className="text-gray-400">Forwards (El Pack de Hierro) + Backs (La Línea de Velocidad)</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="bg-ruda-black/50 dark:bg-gray-900/50 rounded-lg px-4 py-2">
              <p className="text-ruda-gold font-bold text-xl">{xpGanado} / {xpTotal} XP</p>
              <p className="text-gray-500 text-sm">Progreso total</p>
            </div>
            <div className="bg-ruda-black/50 dark:bg-gray-900/50 rounded-lg px-4 py-2">
              <p className="text-white font-bold text-xl">{leccionesState.filter(l => l.estado === 'completado').length} / {leccionesState.length}</p>
              <p className="text-gray-500 text-sm">Posiciones</p>
            </div>
          </div>
        </div>

        {/* Sección Forwards */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-ruda-gold rounded-lg flex items-center justify-center text-xl">🏋️</div>
            <h2 className="text-2xl font-black text-white">FORWARDS</h2>
            <span className="text-gray-500 text-sm">(El Pack de Hierro)</span>
          </div>
          
          <div className="space-y-8">
            {leccionesState.filter(l => l.tipo === 'forward').map((leccion, index) => (
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
        </div>

        {/* Separador */}
        <div className="flex items-center gap-4 my-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-ruda-gold to-transparent"></div>
          <span className="text-ruda-gold text-2xl">🏉</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-ruda-gold to-transparent"></div>
        </div>

        {/* Sección Backs */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-xl">⚡</div>
            <h2 className="text-2xl font-black text-white">BACKS</h2>
            <span className="text-gray-500 text-sm">(La Línea de Velocidad)</span>
          </div>
          
          <div className="space-y-8">
            {leccionesState.filter(l => l.tipo === 'back').map((leccion, index) => (
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
            {progreso === 100 ? '🎉 ¡Completaste todas las posiciones! Sos un experto.' : 'Aprendé cada posición para dominar el campo.'}
          </p>
        </div>
      </div>
    </div>
  )
}