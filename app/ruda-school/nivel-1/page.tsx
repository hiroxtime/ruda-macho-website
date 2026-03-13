'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function FundamentosPage() {
  const [seccionActiva, setSeccionActiva] = useState<string>('historia')
  const [progreso, setProgreso] = useState(0)
  const [completadas, setCompletadas] = useState<string[]>([])

  const toggleSeccion = (id: string) => {
    setSeccionActiva(seccionActiva === id ? '' : id)
  }

  const completarSeccion = (id: string, xp: number) => {
    if (!completadas.includes(id)) {
      setCompletadas([...completadas, id])
      setProgreso(prev => Math.min(prev + xp, 100))
    }
  }

  const secciones = [
    {
      id: 'historia',
      titulo: '📜 Historia y Espíritu del Rugby',
      xp: 15,
      contenido: (
        <div className="space-y-4 text-gray-300">
          <div className="bg-amber-900/30 border border-amber-600/30 rounded-xl p-4 text-center">
            <div className="text-5xl mb-2">🏃‍♂️🏉</div>
            <p className="text-amber-400 font-bold">William Webb Ellis</p>
            <p className="text-amber-600 text-sm">1823 - Rugby School, Inglaterra</p>
          </div>
          
          <p>
            Cuenta la leyenda que en <strong className="text-white">1823</strong>, durante un partido de fútbol en 
            <strong className="text-white"> Rugby, Inglaterra</strong>, un joven llamado{' '}
            <strong className="text-white">William Webb Ellis</strong> levantó la pelota y corrió hacia la línea de meta.
          </p>

          <div className="bg-ruda-gold/10 border-l-4 border-ruda-gold p-4 rounded-r-lg">
            <p className="text-ruda-gold italic">
              "Con un desprecio despreocupado por las reglas del fútbol, tomó primero la pelota en sus brazos 
              y corrió con ella..."
            </p>
            <p className="text-gray-500 text-sm mt-2">— Placa conmemorativa, Rugby School</p>
          </div>

          <h3 className="text-xl font-bold text-ruda-gold mt-6">¿Mito o Realidad?</h3>
          <p>
            Aunque la historia es probablemente un <strong className="text-white">mito de origen</strong>, 
            representa el espíritu del rugby:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong className="text-white">Innovación:</strong> Romper reglas para crear algo nuevo</li>
            <li><strong className="text-white">Valentía:</strong> Arriesgarse a ser diferente</li>
            <li><strong className="text-white">Pasión:</strong> Jugar con el corazón</li>
          </ul>

          <h3 className="text-xl font-bold text-ruda-gold mt-6">Línea de Tiempo</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-800 p-2 rounded"><strong className="text-ruda-gold">1845</strong> Primer reglamento</div>
            <div className="bg-gray-800 p-2 rounded"><strong className="text-ruda-gold">1871</strong> Fundación RFU</div>
            <div className="bg-gray-800 p-2 rounded"><strong className="text-ruda-gold">1900</strong> Rugby en Olímpicos</div>
            <div className="bg-gray-800 p-2 rounded"><strong className="text-ruda-gold">1987</strong> 1ª Copa del Mundo</div>
            <div className="bg-gray-800 p-2 rounded"><strong className="text-ruda-gold">1995</strong> Era profesional</div>
            <div className="bg-gray-800 p-2 rounded"><strong className="text-ruda-gold">2023</strong> 200 años del mito</div>
          </div>

          <h3 className="text-xl font-bold text-ruda-gold mt-6">Rugby en Argentina</h3>
          <p>
            Llegó en el <strong className="text-white">siglo XIX</strong> con inmigrantes británicos. 
            La <strong className="text-white">UAR se fundó en 1899</strong>, siendo una de las uniones más antiguas del mundo. 
            Hoy los Pumas están entre los mejores equipos del planeta.
          </p>

          <h3 className="text-xl font-bold text-ruda-gold mt-6">El Espíritu del Rugby</h3>
          <div className="grid gap-3">
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <strong className="text-white">🤝 Respeto mutuo</strong>
              <p className="text-sm mt-1">Saludamos al rival antes y compartimos después. El árbitro es "señor".</p>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <strong className="text-white">⚖️ Integridad</strong>
              <p className="text-sm mt-1">No simulamos faltas. No discutimos. Jugamos limpio.</p>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <strong className="text-white">💪 Disciplina</strong>
              <p className="text-sm mt-1">Control emocional. Cumplimiento de normas. Compromiso.</p>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <strong className="text-white">🔥 Pasión</strong>
              <p className="text-sm mt-1">100% en cada entrenamiento. Defender los colores.</p>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <strong className="text-white">❤️ Solidaridad</strong>
              <p className="text-sm mt-1">El compañero primero. "Un equipo, una familia".</p>
            </div>
          </div>

          <div className="bg-ruda-gold/20 border border-ruda-gold/30 p-4 rounded-lg mt-4">
            <p className="text-ruda-gold">
              <strong>🏆 El Trofeo Webb Ellis</strong> es la Copa del Mundo de Rugby, 
              entregada cada 4 años al campeón mundial.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'valores',
      titulo: '💎 Los 5 Valores del Rugby',
      xp: 15,
      contenido: (
        <div className="space-y-4 text-gray-300">
          <p>En <strong className="text-white">2009</strong>, World Rugby formalizó los valores que definen nuestro deporte.</p>

          <div className="space-y-4">
            <div className="bg-gray-800/50 p-4 rounded-xl border-l-4 border-blue-500">
              <h4 className="text-lg font-bold text-white">1. Integridad ⚖️</h4>
              <p className="text-sm mt-1">Honestidad y rectitud. No hacemos trampas, no simulamos. Aceptamos las decisiones.</p>
              <p className="text-blue-400 text-xs mt-2 italic">"Ganamos limpio o perdemos con honor"</p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-xl border-l-4 border-red-500">
              <h4 className="text-lg font-bold text-white">2. Pasión 🔥</h4>
              <p className="text-sm mt-1">Emoción intensa. Entrenamos como jugamos. Celebramos los tries.</p>
              <p className="text-red-400 text-xs mt-2 italic">"Nuestra lucha es jugando"</p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-xl border-l-4 border-green-500">
              <h4 className="text-lg font-bold text-white">3. Solidaridad 🤝</h4>
              <p className="text-sm mt-1">Unión y apoyo. El primero ayuda al último. Cargamos las bolsas juntos.</p>
              <p className="text-green-400 text-xs mt-2 italic">"El vestuario es sagrado"</p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-xl border-l-4 border-yellow-500">
              <h4 className="text-lg font-bold text-white">4. Disciplina 📋</h4>
              <p className="text-sm mt-1">Autocontrol. Llegamos a tiempo. Solo el capitán habla con el árbitro.</p>
              <p className="text-yellow-400 text-xs mt-2 italic">"Puente entre metas y logros"</p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-xl border-l-4 border-purple-500">
              <h4 className="text-lg font-bold text-white">5. Respeto 🙏</h4>
              <p className="text-sm mt-1">Al rival, al árbitro, al juego. Antes y después, todos somos amigos.</p>
              <p className="text-purple-400 text-xs mt-2 italic">"Sin respeto, no hay rugby"</p>
            </div>
          </div>

          <h4 className="text-lg font-bold text-ruda-gold mt-6">Aplicación Práctica</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ruda-gold/30">
                  <th className="text-left p-2 text-ruda-gold">Situación</th>
                  <th className="text-left p-2 text-ruda-gold">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr><td className="p-2">Rival cae al suelo</td><td className="p-2 text-green-400">Solidaridad — Lo ayudamos</td></tr>
                <tr><td className="p-2">Árbitro cobra en contra</td><td className="p-2 text-purple-400">Respeto — Aceptamos</td></tr>
                <tr><td className="p-2">Compañero erra</td><td className="p-2 text-blue-400">Integridad — Lo apoyamos</td></tr>
                <tr><td className="p-2">Podemos hacer falta</td><td className="p-2 text-blue-400">Integridad — No la hacemos</td></tr>
                <tr><td className="p-2">Entreno cansador</td><td className="p-2 text-red-400">Pasión — 100% igual</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'puntuacion',
      titulo: '🏆 Sistema de Puntuación',
      xp: 15,
      contenido: (
        <div className="space-y-4 text-gray-300">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-900/30 border border-green-600/30 p-3 rounded-lg text-center">
              <div className="text-3xl mb-1">🏉</div>
              <div className="text-2xl font-bold text-white">5 pts</div>
              <div className="text-xs text-green-400">Try</div>
            </div>
            <div className="bg-blue-900/30 border border-blue-600/30 p-3 rounded-lg text-center">
              <div className="text-3xl mb-1">🦶</div>
              <div className="text-2xl font-bold text-white">2 pts</div>
              <div className="text-xs text-blue-400">Conversión</div>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-600/30 p-3 rounded-lg text-center">
              <div className="text-3xl mb-1">🚩</div>
              <div className="text-2xl font-bold text-white">3 pts</div>
              <div className="text-xs text-yellow-400">Penal</div>
            </div>
            <div className="bg-purple-900/30 border border-purple-600/30 p-3 rounded-lg text-center">
              <div className="text-3xl mb-1">⚡</div>
              <div className="text-2xl font-bold text-white">3 pts</div>
              <div className="text-xs text-purple-400">Drop</div>
            </div>
          </div>

          <h4 className="text-lg font-bold text-ruda-gold">El Try (5 puntos)</h4>
          <p>Apoyar la pelota con <strong className="text-white">presión firme</strong> en la zona de try rival. Se puede marcar con una mano.</p>

          <h4 className="text-lg font-bold text-ruda-gold">Conversión (2 puntos)</h4>
          <p>Patada después del try. Se coloca en línea con donde se marcó. Pasa entre los palos.</p>

          <h4 className="text-lg font-bold text-ruda-gold">Penal (3 puntos)</h4>
          <p>Opciones al cobrar:</p>
          <ul className="list-disc ml-6 space-y-1 text-sm">
            <li>Patear al arco (3 pts)</li>
            <li>Patear al lateral (line-out)</li>
            <li>Tap y correr (seguir jugando)</li>
            <li>Scrum (formación)</li>
          </ul>

          <h4 className="text-lg font-bold text-ruda-gold">Drop Goal (3 puntos)</h4>
          <p>Patada de sobrepique durante el juego. Se suelta y patea antes de que toque el suelo.</p>

          <div className="bg-ruda-gold/20 border border-ruda-gold/30 p-4 rounded-lg">
            <h4 className="font-bold text-ruda-gold mb-2">💡 Regla de Oro</h4>
            <p className="text-white">
              "Siempre buscar el <strong>try</strong> primero. Un try + conversión = 7 puntos, 
              más que dos penales (6 puntos)."
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'reglas',
      titulo: '📋 Reglas Fundamentales',
      xp: 20,
      contenido: (
        <div className="space-y-4 text-gray-300">
          <div className="bg-red-900/30 border border-red-600/30 p-4 rounded-lg">
            <h4 className="font-bold text-red-400 text-lg">❌ Pase Adelante Prohibido</h4>
            <p className="mt-1">La pelota solo se pasa con las manos hacia <strong className="text-white">atrás o al costado</strong>.</p>
            <p className="text-sm text-red-400 mt-2">Si se pasa adelante: <strong>knock-on</strong> → scrum para el rival</p>
          </div>

          <div className="bg-blue-900/30 border border-blue-600/30 p-4 rounded-lg">
            <h4 className="font-bold text-blue-400 text-lg">🏃 Tackle (Placaje)</h4>
            <p className="mt-1">Solo al portador de la pelota, <strong className="text-white">por debajo de los hombros</strong>.</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div className="text-green-400">✅ Piernas<br/>✅ Cintura<br/>✅ Pecho</div>
              <div className="text-red-400">❌ Cuello<br/>❌ Cabeza<br/>❌ &gt; Hombros</div>
            </div>
            <p className="text-xs mt-2">Tackle alto = penal + tarjeta (amarilla/roja)</p>
          </div>

          <div className="bg-green-900/30 border border-green-600/30 p-4 rounded-lg">
            <h4 className="font-bold text-green-400 text-lg">🔄 Ruck (Raque)</h4>
            <p className="mt-1">Formación sobre el balón tras un tackle. Jugadores de pie, <strong className="text-white">no se toca con las manos</strong>.</p>
            <p className="text-sm text-green-400 mt-2">Offside: estar adelante del último pie</p>
          </div>

          <div className="bg-purple-900/30 border border-purple-600/30 p-4 rounded-lg">
            <h4 className="font-bold text-purple-400 text-lg">🏗️ Maul (Maul)</h4>
            <p className="mt-1">Portador sostenido por compañeros y rivales, <strong className="text-white">sin caer</strong>. Mínimo 3 jugadores.</p>
          </div>

          <div className="bg-yellow-900/30 border border-yellow-600/30 p-4 rounded-lg">
            <h4 className="font-bold text-yellow-400 text-lg">🏗️ Scrum (Melé)</h4>
            <p className="mt-1">8 jugadores de cada equipo. Se forma tras knock-on o forward pass.</p>
            <p className="text-xs mt-2 text-yellow-400">1ª línea: 2 pilares + hooker | 2ª: 2 locks | 3ª: 2 flankers + N°8</p>
          </div>

          <div className="bg-cyan-900/30 border border-cyan-600/30 p-4 rounded-lg">
            <h4 className="font-bold text-cyan-400 text-lg">🎯 Line-out (Touch)</h4>
            <p className="mt-1">Reinicia cuando la pelota sale por los costados. Dos jugadores saltan, uno lanza.</p>
          </div>

          <h4 className="text-lg font-bold text-ruda-gold mt-4">Infracciones Comunes</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ruda-gold/30">
                  <th className="text-left p-2 text-ruda-gold">Falta</th>
                  <th className="text-left p-2 text-ruda-gold">Sanción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr><td className="p-2">Offside</td><td className="p-2 text-yellow-400">Penal</td></tr>
                <tr><td className="p-2">Knock-on</td><td className="p-2 text-blue-400">Scrum rival</td></tr>
                <tr><td className="p-2">Tackle alto</td><td className="p-2 text-red-400">Penal + tarjeta</td></tr>
                <tr><td className="p-2">No soltar</td><td className="p-2 text-yellow-400">Penal</td></tr>
                <tr><td className="p-2">Entrada lateral</td><td className="p-2 text-yellow-400">Penal</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'castigos',
      titulo: '⚖️ Castigos y Sanciones',
      xp: 15,
      contenido: (
        <div className="space-y-4 text-gray-300">
          <div className="bg-yellow-900/30 border border-yellow-600/30 p-4 rounded-lg">
            <h4 className="font-bold text-yellow-400 text-lg">🎯 Penal</h4>
            <p className="mt-1">Otorgado tras falta grave. Opciones:</p>
            <ul className="list-disc ml-6 space-y-1 text-sm mt-2">
              <li>Patear al arco (3 pts)</li>
              <li>Patear al lateral (line-out)</li>
              <li>Tap y correr</li>
              <li>Scrum</li>
              <li>Ventaja (seguir jugando)</li>
            </ul>
          </div>

          <div className="bg-orange-900/30 border border-orange-600/30 p-4 rounded-lg">
            <h4 className="font-bold text-orange-400 text-lg">🟨 Tarjeta Amarilla</h4>
            <p className="mt-1">Sanción de <strong className="text-white">10 minutos</strong>. El equipo juega con 14.</p>
            <p className="text-sm mt-2">Por: tackle peligroso, offside deliberado, faltas repetidas.</p>
          </div>

          <div className="bg-red-900/30 border border-red-600/30 p-4 rounded-lg">
            <h4 className="font-bold text-red-400 text-lg">🟥 Tarjeta Roja</h4>
            <p className="mt-1"><strong className="text-white">Expulsión definitiva</strong>. El equipo juega con 14 todo el partido.</p>
            <p className="text-sm mt-2">Por: tackle directo a la cabeza, agresión, insultos graves.</p>
          </div>

          <div className="bg-blue-900/30 border border-blue-600/30 p-4 rounded-lg">
            <h4 className="font-bold text-blue-400 text-lg">⚠️ Ventaja</h4>
            <p className="mt-1">El árbitro permite seguir si hay oportunidad clara. Si no se aprovecha, vuelve al penal.</p>
          </div>

          <h4 className="text-lg font-bold text-ruda-gold mt-4">Progresión de Sanciones</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-gray-500">1</span>
              <span>Aviso verbal del árbitro</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-yellow-500">2</span>
              <span>Repetición → Penal</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-orange-500">3</span>
              <span>Falta grave → Tarjeta amarilla</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-red-500">4</span>
              <span>Falta extrema → Tarjeta roja</span>
            </div>
          </div>

          <div className="bg-ruda-gold/20 border border-ruda-gold/30 p-4 rounded-lg mt-4">
            <p className="text-ruda-gold text-sm">
              <strong>Regla de oro:</strong> Solo el capitán puede hablar con el árbitro. 
              Todos los demás: "Sí, señor" y a jugar.
            </p>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-ruda-black">
      {/* Header */}
      <header className="bg-ruda-black/95 backdrop-blur-md border-b border-ruda-gold/20 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/ruda-school" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <span className="text-xl">←</span>
              <span className="hidden sm:inline">Volver a Ruda School</span>
            </Link>
            <div className="text-center">
              <p className="text-ruda-gold text-sm font-bold">NIVEL 1</p>
              <h1 className="text-white font-black text-lg">FUNDAMENTOS</h1>
            </div>
            <div className="w-20">
              <div className="bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-ruda-green to-ruda-gold h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progreso}%` }}
                />
              </div>
              <p className="text-right text-xs text-gray-500 mt-1">{progreso}%</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ruda-green/20 via-transparent to-ruda-gold/10" />
        <div className="max-w-4xl mx-auto px-4 py-12 relative">
          <div className="text-center">
            <div className="text-6xl mb-4">🏉</div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              FUNDAMENTOS DEL RUGBY
            </h1>
            <p className="text-ruda-gold text-lg mb-6">
              Todo lo que necesitás saber para entender el juego
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="inline-flex items-center gap-2 bg-ruda-green/20 text-ruda-gold px-4 py-2 rounded-full text-sm font-bold">
                <span>📚</span>
                <span>{secciones.length} lecciones</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-ruda-gold/20 text-ruda-gold px-4 py-2 rounded-full text-sm font-bold">
                <span>⚡</span>
                <span>80 XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="space-y-4">
          {secciones.map((seccion, index) => (
            <div 
              key={seccion.id}
              className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => toggleSeccion(seccion.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-white">{index + 1}.</span>
                  <div className="text-left">
                    <h2 className="text-xl font-black text-white">{seccion.titulo}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-ruda-gold font-bold text-sm">+{seccion.xp} XP</span>
                  <span className={`text-2xl transition-transform ${seccionActiva === seccion.id ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </button>

              {seccionActiva === seccion.id && (
                <div className="px-6 pb-6">
                  <div className="bg-ruda-black/50 rounded-xl p-6 border border-white/5">
                    {seccion.contenido}
                  </div>
                  
                  <button
                    onClick={() => completarSeccion(seccion.id, seccion.xp)}
                    disabled={completadas.includes(seccion.id)}
                    className={`w-full mt-4 py-3 rounded-xl font-bold transition-all ${
                      completadas.includes(seccion.id)
                        ? 'bg-green-600 text-white cursor-default'
                        : 'bg-ruda-green text-white hover:bg-ruda-dark-green'
                    }`}
                  >
                    {completadas.includes(seccion.id) 
                      ? '✓ Completado' 
                      : `✓ Marcar como completado (+${seccion.xp} XP)`
                    }
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="mt-8 bg-gradient-to-r from-ruda-green/20 to-ruda-gold/20 rounded-2xl p-6 border border-ruda-gold/30">
          <h3 className="text-xl font-black text-white mb-4">🎓 Resumen del Nivel</h3>
          <div className="grid md:grid-cols-2 gap-2 text-gray-300 mb-6 text-sm">
            <div>✅ Historia y origen del rugby</div>
            <div>✅ Los 5 valores del rugby</div>
            <div>✅ Sistema de puntuación</div>
            <div>✅ Reglas fundamentales</div>
            <div>✅ Sanciones y castigos</div>
          </div>
          
          <div className="flex justify-between items-center">
            <Link 
              href="/ruda-school"
              className="px-6 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors"
            >
              ← Volver
            </Link>
            
            <div className="text-center">
              <p className="text-ruda-gold font-bold">{completadas.length}/{secciones.length}</p>
              <p className="text-gray-400 text-xs">{progreso}%</p>
            </div>
            
            <button
              disabled={progreso < 100}
              className="px-6 py-3 bg-ruda-gold text-ruda-black rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {progreso >= 100 ? '🎉 Completado!' : 'Bloqueado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
