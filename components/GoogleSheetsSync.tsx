'use client'

import { useState } from 'react'

interface SyncStatus {
  connected: boolean
  lastSync?: string
  error?: string
}

export default function GoogleSheetsSync() {
  const [syncing, setSyncing] = useState(false)
  const [status, setStatus] = useState<SyncStatus>({ connected: false })
  const [message, setMessage] = useState<string | null>(null)

  const handleDownloadCSV = async () => {
    try {
      const fecha = new Date().toISOString().split('T')[0]
      
      // Obtener datos de Supabase
      const { data } = await fetch(`/api/sheets?action=download&fecha=${fecha}`).then(r => r.json())
      
      // Crear CSV
      const headers = ['Fecha', 'Nombre', 'Apellido', 'Estado_Previo', 'Estado_Post', 'Notas']
      const csvRows = [headers.join(',')]
      
      if (data && data.length > 0) {
        data.forEach((row: any) => {
          csvRows.push([
            row.fecha || fecha,
            row.nombre || '',
            row.apellido || '',
            row.estado_previo || '',
            row.estado_post || '',
            row.notas || ''
          ].join(','))
        })
      }
      
      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `asistencia_${fecha}.csv`
      link.click()
      
      URL.revokeObjectURL(url)
      setMessage('✅ CSV descargado correctamente')
    } catch (error) {
      setMessage('❌ Error al descargar CSV')
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    setMessage(null)

    try {
      const fecha = new Date().toISOString().split('T')[0]
      const response = await fetch(`/api/sheets?action=sync&fecha=${fecha}`)
      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ Sincronización completada: ${data.registros || 0} registros`)
        setStatus({ connected: true, lastSync: new Date().toISOString() })
      } else {
        // Mostrar instrucciones si no hay webhook
        if (data.instructions) {
          setMessage('⚠️ Webhook no configurado - Ver instrucciones abajo')
          setStatus({ connected: false, error: data.error })
        } else {
          throw new Error(data.error || 'Error en sincronización')
        }
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setSyncing(false)
    }
  }

  const openSpreadsheet = () => {
    window.open('https://docs.google.com/spreadsheets/d/1Qb2OlOj9SOhIDjz_3nY9xr05g6XDVUFvu-blVFLRpHw', '_blank')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V7h10v2z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Google Sheets Sync</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {status.connected ? '✅ Conectado' : '⚠️ Configurar webhook'}
            </p>
          </div>
        </div>
        <button
          onClick={openSpreadsheet}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Abrir Planilla
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.startsWith('✅') 
            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
            : message.startsWith('⚠️')
            ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
            : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {message}
        </div>
      )}

      <button
        onClick={handleSync}
        disabled={syncing}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
          syncing
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {syncing ? '🔄 Sincronizando...' : '📤 Sincronizar con Google Sheets'}
      </button>

      {!status.connected && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">📋 Opción alternativa: Descargar CSV</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Si no tenés acceso de owner a la hoja, podés descargar los datos como CSV e importarlos manualmente.
          </p>
          <button
            onClick={handleDownloadCSV}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            📥 Descargar Asistencia CSV
          </button>
        </div>
      )}

      {!status.connected && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">📋 Configuración con Apps Script (GRATIS)</h4>
          <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-3 list-decimal list-inside">
            <li>
              <strong>Abrir la planilla:</strong>{' '}
              <a 
                href="https://docs.google.com/spreadsheets/d/1Qb2OlOj9SOhIDjz_3nY9xr05g6XDVUFvu-blVFLRpHw" 
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                Click aquí
              </a>
            </li>
            <li>
              <strong>Ir a:</strong> Extensiones → Apps Script
            </li>
            <li>
              <strong>Copiar código:</strong> Del archivo{' '}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">scripts/google-apps-script.js</code>
            </li>
            <li>
              <strong>Pegar y guardar:</strong> Pegar todo el código y guardar
            </li>
            <li>
              <strong>Deploy:</strong> Deploy → New Deployment → Web App
              <ul className="mt-1 ml-4 text-xs space-y-1">
                <li>• Type: Web App</li>
                <li>• Execute as: Me</li>
                <li>• Who has access: Anyone</li>
              </ul>
            </li>
            <li>
              <strong>Copiar URL</strong> del Web App (ejemplo:{' '}
              <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">
                https://script.google.com/macros/s/XXX/exec
              </code>
              )
            </li>
            <li>
              <strong>Agregar en Netlify:</strong>
              <div className="mt-1 p-2 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">
                SHEETS_WEBHOOK_URL = [URL del paso anterior]
              </div>
            </li>
            <li>
              <strong>Ejecutar una vez:</strong> En Apps Script, correr la función <code>setupSheet</code>
            </li>
          </ol>
        </div>
      )}

      {status.lastSync && (
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
          Última sincronización: {new Date(status.lastSync).toLocaleString('es-AR')}
        </p>
      )}
    </div>
  )
}