'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function TestImages() {
  const [imagesLoaded, setImagesLoaded] = useState({
    logo: false,
    school: false
  })

  return (
    <div className="min-h-screen bg-ruda-black p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Test de Imágenes</h1>
      
      <div className="space-y-8">
        {/* Logo Ruda Macho */}
        <div className="bg-white/10 p-6 rounded-lg">
          <h2 className="text-xl text-ruda-gold mb-4">Logo Ruda Macho</h2>
          <img 
            src="/assets/Logo%20Ruda%20Macho.png" 
            alt="Logo Ruda"
            className="w-32 h-32 object-contain"
            onLoad={() => setImagesLoaded(prev => ({ ...prev, logo: true }))}
            onError={(e) => console.error('Error loading logo:', e)}
          />
          {imagesLoaded.logo && <span className="text-green-500">✓ Cargado</span>}
        </div>

        {/* Logo Ruda School */}
        <div className="bg-white/10 p-6 rounded-lg">
          <h2 className="text-xl text-ruda-gold mb-4">Logo Ruda School</h2>
          <img 
            src="/assets/Logo%20Ruda%20School.png" 
            alt="Logo School"
            className="w-32 h-32 object-contain"
            onLoad={() => setImagesLoaded(prev => ({ ...prev, school: true }))}
            onError={(e) => console.error('Error loading school:', e)}
          />
          {imagesLoaded.school && <span className="text-green-500">✓ Cargado</span>}
        </div>

        {/* Video */}
        <div className="bg-white/10 p-6 rounded-lg">
          <h2 className="text-xl text-ruda-gold mb-4">Video de Carga</h2>
          <video 
            src="/assets/Animaci%C3%B3n_de_Carga_Minimalista_y_Fluida.mp4"
            className="w-64"
            controls
          />
        </div>
      </div>
    </div>
  )
}
