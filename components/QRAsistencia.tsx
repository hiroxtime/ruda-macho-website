'use client'

import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'

interface QRAsistenciaProps {
  qrToken: string
  nombre: string
}

export default function QRAsistencia({ qrToken, nombre }: QRAsistenciaProps) {
  const [expandido, setExpandido] = useState(false)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
      <h3 className="text-ruda-black font-black text-xl mb-4">Tu Pase de Asistencia</h3>
      
      <div 
        className={`flex justify-center transition-all duration-300 ${expandido ? 'scale-110' : 'scale-100'}`}
        onClick={() => setExpandido(!expandido)}
      >
        <div className="p-4 bg-white border-4 border-ruda-green rounded-xl cursor-pointer">
          <QRCodeSVG 
            value={qrToken} 
            size={expandido ? 200 : 150}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>
      
      <p className="mt-4 text-gray-600 text-sm">
        Mostrá este código al administrador al llegar al entrenamiento.
      </p>
      
      <div className="mt-4 py-2 px-4 bg-ruda-green/10 rounded-full inline-block">
        <span className="text-ruda-green font-bold text-xs uppercase tracking-widest">
          {nombre}
        </span>
      </div>
    </div>
  )
}
