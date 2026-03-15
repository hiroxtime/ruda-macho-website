'use client'

import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useRef, useState } from 'react'

interface QRScannerProps {
  onScan: (decodedText: string) => void
  onError?: (error: string) => void
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    // Inicializar scanner
    scannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    )

    scannerRef.current.render(
      (decodedText) => {
        onScan(decodedText)
        // Detener scanner después de escanear
        scannerRef.current?.clear()
        setIsScanning(false)
      },
      (errorMessage) => {
        // Ignorar errores de "QR code not found" (es normal mientras busca)
        if (!errorMessage.includes('NotFoundException')) {
          onError?.(errorMessage)
        }
      }
    )
    setIsScanning(true)

    return () => {
      scannerRef.current?.clear().catch(() => {})
    }
  }, [onScan, onError])

  return (
    <div className="w-full">
      <div id="qr-reader" className="rounded-xl overflow-hidden" />
      {!isScanning && (
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">Escaneando...</p>
        </div>
      )}
    </div>
  )
}
