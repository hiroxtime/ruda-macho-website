'use client'

import Link from 'next/link'
import { useState } from 'react'

// Categorías de contenido en vivo
const categorias = [
  { id: 'club', nombre: 'Nuestro Canal', icono: '🎬' },
  { id: 'envivo', nombre: 'En Vivo', icono: '🔴' },
  { id: 'podcasts', nombre: 'Podcasts', icono: '🎙️' },
  { id: 'radio', nombre: 'Radio', icono: '📻' },
]

// Videos del canal de YouTube del club
const videosClub = [
  {
    id: 'yt1',
    titulo: 'Ruda Macho Rugby Club - Presentación',
    categoria: 'club',
    fecha: '2026-03-20',
    imagen: 'https://img.youtube.com/vi/Z3T5uNNXGe8/maxresdefault.jpg',
    descripcion: 'Video institucional del club',
    fuente: 'youtube',
    videoId: 'Z3T5uNNXGe8',
  },
  {
    id: 'yt2',
    titulo: 'Entrenamiento Ruda Macho',
    categoria: 'club',
    fecha: '2026-03-18',
    imagen: 'https://img.youtube.com/vi/KfsluqIQZrw/maxresdefault.jpg',
    descripcion: 'Entrenamiento del equipo',
    fuente: 'youtube',
    videoId: 'KfsluqIQZrw',
  },
  {
    id: 'yt3',
    titulo: 'Ruda Macho - Destacados',
    categoria: 'club',
    fecha: '2026-03-15',
    imagen: 'https://img.youtube.com/vi/x8FRUQBVEAg/maxresdefault.jpg',
    descripcion: 'Mejores jugadas del equipo',
    fuente: 'youtube',
    videoId: 'x8FRUQBVEAg',
  },
  {
    id: 'yt4',
    titulo: 'Partido Ruda Macho - Highlights',
    categoria: 'club',
    fecha: '2026-03-10',
    imagen: 'https://img.youtube.com/vi/e4dY6XycibU/maxresdefault.jpg',
    descripcion: 'Resumen del partido',
    fuente: 'youtube',
    videoId: 'e4dY6XycibU',
  },
  {
    id: 'yt5',
    titulo: 'Ruda Macho Rugby - Temporada 2026',
    categoria: 'club',
    fecha: '2026-03-05',
    imagen: 'https://img.youtube.com/vi/cuQUee-wJo0/maxresdefault.jpg',
    descripcion: 'Resumen de la temporada',
    fuente: 'youtube',
    videoId: 'cuQUee-wJo0',
  },
]

// Contenido de streaming en vivo
// TODO: Agregar contenido real cuando esté disponible
const contenido: Array<{
  id: string;
  titulo: string;
  categoria: string;
  estado: string;
  duracion?: string;
  fecha: string;
  imagen: string;
  descripcion: string;
}> = []

export default function StreamingPage() {
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null)
  const [videoSeleccionado, setVideoSeleccionado] = useState<typeof videosClub[0] | null>(null)

  // Filtrar videos del club
  const videosClubFiltrados = categoriaActiva === 'club' || !categoriaActiva 
    ? videosClub 
    : []
  
  // Filtrar otro contenido
  const contenidoFiltrado = categoriaActiva && categoriaActiva !== 'club'
    ? contenido.filter(c => c.categoria === categoriaActiva)
    : categoriaActiva === null 
      ? contenido 
      : []

  return (
    <div className="min-h-screen bg-ruda-black text-white">
      {/* Header */}
      <header className="bg-ruda-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 md:py-3">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <img 
                src="/assets/Ruda Streaming.png" 
                alt="Ruda Streaming" 
                className="h-16 md:h-20 w-auto rounded-lg"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-black text-ruda-gold">RUDA STREAMING</h1>
                <p className="text-xs text-gray-400">Videos del Club • En Vivo</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link 
                href="/ruda-tv" 
                className="text-sm bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                🏉 Partidos Internacionales
              </Link>
              <Link href="/perfil" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                👤
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Reproductor de video */}
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
              {videoSeleccionado.fuente === 'youtube' && videoSeleccionado.videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoSeleccionado.videoId}?autoplay=1`}
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

      {/* Hero Banner */}
      {!videoSeleccionado && (
        <div className="relative h-64 md:h-80 bg-gradient-to-r from-red-900/30 to-ruda-gold/30">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(/assets/carrusel/partido-ensenada.png)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="max-w-xl">
              <span className="text-sm bg-red-500/20 text-red-400 px-3 py-1 rounded-full">
                🎬 CONTENIDO DEL CLUB
              </span>
              <h2 className="text-2xl md:text-4xl font-black mt-4 mb-2">
                Ruda Streaming
              </h2>
              <p className="text-gray-300 mb-4 text-sm md:text-base">
                Videos de nuestro canal, partidos en vivo y podcasts exclusivos.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link 
                  href="/ruda-tv" 
                  className="bg-ruda-gold text-ruda-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-all"
                >
                  Ver Partidos Internacionales →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categorías */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setCategoriaActiva(null)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              !categoriaActiva ? 'bg-ruda-gold text-ruda-black' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            🏠 Todo
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                categoriaActiva === cat.id ? 'bg-ruda-gold text-ruda-black' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {cat.icono} {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Videos del Club (YouTube) */}
      {(!categoriaActiva || categoriaActiva === 'club') && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl">🎬</span>
            <h3 className="text-xl font-bold">Nuestro Canal</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {videosClub.map((item) => (
              <div
                key={item.id}
                onClick={() => setVideoSeleccionado(item)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                  <img 
                    src={item.imagen} 
                    alt={item.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl ml-1">▶</span>
                    </div>
                  </div>

                  <span className="absolute bottom-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
                    YouTube
                  </span>
                </div>

                <div className="mt-2">
                  <h4 className="font-medium text-sm line-clamp-2 group-hover:text-ruda-gold transition-colors">
                    {item.titulo}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{item.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Separador */}
      {!categoriaActiva && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="border-t border-gray-800 my-6" />
        </div>
      )}

      {/* Otro contenido */}
      {(!categoriaActiva || (categoriaActiva !== 'club')) && contenidoFiltrado.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-xl font-bold mb-2">Contenido próximamente</h3>
            <p className="text-gray-400">
              Estamos trabajando para traerte más contenido. Mientras tanto, explorá nuestros videos del club y partidos internacionales.
            </p>
          </div>
        </div>
      )}

      {(!categoriaActiva || (categoriaActiva !== 'club')) && contenidoFiltrado.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h3 className="text-xl font-bold mb-4">
            {categoriaActiva 
              ? categorias.find(c => c.id === categoriaActiva)?.nombre 
              : 'Contenido disponible'}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {contenidoFiltrado.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url(${item.imagen})` }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  
                  {item.estado === 'envivo' && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
                      🔴 EN VIVO
                    </span>
                  )}
                  {item.estado === 'grabado' && (
                    <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded font-bold">
                      ✅ DISPONIBLE
                    </span>
                  )}

                  {item.duracion && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {item.duracion}
                    </span>
                  )}
                </div>

                <div className="mt-2">
                  <h4 className="font-medium text-sm line-clamp-2 group-hover:text-ruda-gold transition-colors">
                    {item.titulo}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{item.descripcion}</p>
                  {item.fecha && (
                    <p className="text-xs text-gray-600 mt-1">{item.fecha}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info adicional */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3">📺 ¿Buscás partidos internacionales?</h3>
          <p className="text-gray-400 mb-4">
            En Ruda TV encontrás partidos de NRL, URC, Premiership Rugby y más ligas del mundo.
          </p>
          <Link 
            href="/ruda-tv" 
            className="inline-block bg-ruda-green px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-all"
          >
            Ir a Ruda TV →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h4 className="font-bold text-ruda-gold mb-2">RUDA STREAMING</h4>
              <p className="text-sm text-gray-500">Videos del club y transmisiones</p>
              <p className="text-xs text-gray-600 mt-2">Ruda Macho Rugby Club © 2026</p>
            </div>
            <div className="flex gap-8">
              <div>
                <h5 className="font-medium mb-2">Contenido</h5>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li><Link href="/streaming" className="hover:text-white">Nuestro Canal</Link></li>
                  <li><Link href="/ruda-tv" className="hover:text-white">Ruda TV</Link></li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Club</h5>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li><Link href="/" className="hover:text-white">Inicio</Link></li>
                  <li><Link href="/ruda-school" className="hover:text-white">Ruda School</Link></li>
                  <li><Link href="/perfil" className="hover:text-white">Mi Perfil</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}