'use client'

import Link from 'next/link'
import { useState } from 'react'

// Ligas disponibles
const ligas = [
  { id: 'NRL', nombre: 'NRL', pais: 'Australia', color: 'bg-green-600', icono: '🇦🇺' },
  { id: 'URC', nombre: 'United Rugby Championship', pais: 'Europa', color: 'bg-blue-600', icono: '🇪🇺' },
  { id: 'Premiership', nombre: 'Premiership Rugby', pais: 'Inglaterra', color: 'bg-red-600', icono: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
]

// Partidos internacionales
const partidos = [
  {
    id: '1',
    titulo: 'Canterbury Bulldogs vs Newcastle Knights',
    liga: 'NRL',
    duracion: '1:24:30',
    fecha: '2026-03-28',
    imagen: '/assets/streaming/canterbury-bulldogs-newcastle-knights.jpg',
    descripcion: 'NRL - Full Match Replay',
    fuente: 'dailymotion',
    videoId: 'xa3jfd0',
  },
  {
    id: '2',
    titulo: 'Penrith Panthers vs Parramatta Eels',
    liga: 'NRL',
    duracion: '1:30:00',
    fecha: '2026-03-28',
    imagen: '/assets/streaming/panthers-eels.jpg',
    descripcion: 'NRL - Full Match Replay',
    fuente: 'dailymotion',
    videoId: 'xa3jiju',
  },
  {
    id: '3',
    titulo: 'Leinster vs Scarlets',
    liga: 'URC',
    duracion: '1:22:15',
    fecha: '2026-03-27',
    imagen: '/assets/streaming/leinster-scarlets.jpg',
    descripcion: 'United Rugby Championship',
    fuente: 'dailymotion',
    videoId: 'xa3iqt0',
  },
  {
    id: '4',
    titulo: 'Newcastle Red Bulls vs Exeter Chiefs',
    liga: 'Premiership',
    duracion: '1:18:45',
    fecha: '2026-03-27',
    imagen: '/assets/streaming/newcastle-red-bulls-exeter-chiefs.jpg',
    descripcion: 'Premiership Rugby',
    fuente: 'dailymotion',
    videoId: 'xa3iq7k',
  },
]

// Videos del canal de YouTube del club
const videosClub = [
  {
    id: 'yt1',
    titulo: 'Ruda Macho Rugby Club - Presentación',
    fecha: '2026-03-20',
    imagen: 'https://img.youtube.com/vi/Z3T5uNNXGe8/maxresdefault.jpg',
    descripcion: 'Video institucional del club',
    fuente: 'youtube',
    videoId: 'Z3T5uNNXGe8',
  },
  {
    id: 'yt2',
    titulo: 'Entrenamiento Ruda Macho',
    fecha: '2026-03-18',
    imagen: 'https://img.youtube.com/vi/KfsluqIQZrw/maxresdefault.jpg',
    descripcion: 'Entrenamiento del equipo',
    fuente: 'youtube',
    videoId: 'KfsluqIQZrw',
  },
  {
    id: 'yt3',
    titulo: 'Ruda Macho - Destacados',
    fecha: '2026-03-15',
    imagen: 'https://img.youtube.com/vi/x8FRUQBVEAg/maxresdefault.jpg',
    descripcion: 'Mejores jugadas del equipo',
    fuente: 'youtube',
    videoId: 'x8FRUQBVEAg',
  },
  {
    id: 'yt4',
    titulo: 'Partido Ruda Macho - Highlights',
    fecha: '2026-03-10',
    imagen: 'https://img.youtube.com/vi/e4dY6XycibU/maxresdefault.jpg',
    descripcion: 'Resumen del partido',
    fuente: 'youtube',
    videoId: 'e4dY6XycibU',
  },
  {
    id: 'yt5',
    titulo: 'Ruda Macho Rugby - Temporada 2026',
    fecha: '2026-03-05',
    imagen: 'https://img.youtube.com/vi/cuQUee-wJo0/maxresdefault.jpg',
    descripcion: 'Resumen de la temporada',
    fuente: 'youtube',
    videoId: 'cuQUee-wJo0',
  },
]

export default function RudaTVPage() {
  const [ligaActiva, setLigaActiva] = useState<string | null>(null)
  const [videoSeleccionado, setVideoSeleccionado] = useState<typeof partidos[0] | null>(null)

  const partidosFiltrados = partidos.filter(c => !ligaActiva || c.liga === ligaActiva)

  return (
    <div className="min-h-screen bg-ruda-black text-white">
      {/* Header */}
      <header className="bg-ruda-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 md:py-3">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <img 
                src="/assets/Ruda Streaming.png" 
                alt="Ruda TV" 
                className="h-16 md:h-20 w-auto rounded-lg"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-black text-ruda-gold">RUDA TV</h1>
                <p className="text-xs text-gray-400">Partidos Internacionales</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link 
                href="/streaming" 
                className="text-sm bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                🎬 Nuestro Canal
              </Link>
              <Link href="/perfil" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                👤
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      {!videoSeleccionado && (
        <div className="relative h-64 md:h-80 bg-gradient-to-r from-purple-900/30 to-pink-600/30">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(/assets/streaming/canterbury-bulldogs-newcastle-knights.jpg)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="max-w-xl">
              <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                🏉 PARTIDOS INTERNACIONALES
              </span>
              <h2 className="text-2xl md:text-4xl font-black mt-4 mb-2">
                Lo Mejor del Rugby Mundial
              </h2>
              <p className="text-gray-300 mb-4 text-sm md:text-base">
                NRL, URC, Premiership y más. Reviví los mejores partidos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reproductor */}
      {videoSeleccionado && (
        <div className="max-w-5xl mx-auto mt-4 px-4">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-gray-800">
              <div>
                <h3 className="font-bold text-white truncate">{videoSeleccionado.titulo}</h3>
                <p className="text-xs text-gray-400">{videoSeleccionado.descripcion}</p>
              </div>
              <button
                onClick={() => setVideoSeleccionado(null)}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                ✕
              </button>
            </div>
            
            <div className="aspect-video relative">
              {videoSeleccionado.fuente === 'dailymotion' && videoSeleccionado.videoId ? (
                <iframe
                  src={`https://www.dailymotion.com/embed/video/${videoSeleccionado.videoId}?autoplay=1`}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              ) : videoSeleccionado.fuente === 'youtube' && videoSeleccionado.videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoSeleccionado.videoId}?autoplay=1`}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              ) : videoSeleccionado.fuente === 'mailru' && videoSeleccionado.videoId ? (
                <iframe
                  src={`https://my.mail.ru/video/embed/${videoSeleccionado.videoId}`}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-center p-4">
                    <div className="text-6xl mb-4">⚠️</div>
                    <p className="text-gray-400">{videoSeleccionado.titulo}</p>
                    <p className="text-sm text-gray-500 mt-2">Video no disponible</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filtros por Liga */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🏉</span>
          <div>
            <h2 className="text-xl font-bold">Partidos Internacionales</h2>
            <p className="text-sm text-gray-400">NRL, URC, Premiership y más</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setLigaActiva(null)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              !ligaActiva ? 'bg-ruda-gold text-ruda-black' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            🏉 Todas
          </button>
          {ligas.map((liga) => (
            <button
              key={liga.id}
              onClick={() => setLigaActiva(liga.id)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                ligaActiva === liga.id ? 'bg-ruda-gold text-ruda-black' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {liga.icono} {liga.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de partidos */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {partidosFiltrados.map((item) => (
            <div
              key={item.id}
              onClick={() => setVideoSeleccionado(item)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${item.imagen})` }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 bg-ruda-gold rounded-full flex items-center justify-center">
                    <span className="text-ruda-black text-2xl ml-1">▶</span>
                  </div>
                </div>

                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {item.duracion}
                </span>

                <span className={`absolute top-2 left-2 ${ligas.find(l => l.id === item.liga)?.color} text-white text-xs px-2 py-1 rounded font-bold`}>
                  {item.liga}
                </span>
              </div>

              <div className="mt-2">
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-ruda-gold transition-colors">
                  {item.titulo}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{item.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h4 className="font-bold text-ruda-gold mb-2">RUDA TV</h4>
              <p className="text-sm text-gray-500">Partidos internacionales + Videos del club</p>
            </div>
            <div className="flex gap-8">
              <div>
                <h5 className="font-medium mb-2">Ver</h5>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li><Link href="/ruda-tv" className="hover:text-white">Partidos</Link></li>
                  <li><Link href="/streaming" className="hover:text-white">En Vivo</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Club</h5>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li><Link href="/" className="hover:text-white">Inicio</Link></li>
                  <li><Link href="/ruda-school" className="hover:text-white">Ruda School</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}