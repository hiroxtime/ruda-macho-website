import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ID de la planilla de Google Sheets
const SPREADSHEET_ID = '1Qb2OlOj9SOhIDjz_3nY9xr05g6XDVUFvu-blVFLRpHw'

// URL del Web App de Google Apps Script (configurar una vez desplegado)
const SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL || ''

interface AsistenciaRow {
  fecha: string
  nombre: string
  apellido: string
  estado_previo: string
  estado_post: string
  notas: string
}

// GET - Leer datos desde Google Sheets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'sync'
    const fecha = searchParams.get('fecha') || new Date().toISOString().split('T')[0]

    // Si no hay webhook configurado, mostrar instrucciones
    if (!SHEETS_WEBHOOK_URL) {
      return NextResponse.json({
        error: 'Webhook de Google Sheets no configurado',
        instructions: {
          step1: 'Abrir la planilla de Google Sheets',
          step2: 'Ir a Extensiones > Apps Script',
          step3: 'Copiar el código del archivo scripts/google-apps-script.js',
          step4: 'Guardar y hacer Deploy > New Deployment > Web App',
          step5: 'Copiar la URL del Web App',
          step6: 'Agregar en Netlify como variable de entorno:',
          env_var: 'SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXX/exec',
        },
        spreadsheet_url: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`,
        script_file: 'scripts/google-apps-script.js',
      }, { status: 503 })
    }

    if (action === 'read') {
      // Leer desde Google Sheets
      const response = await fetch(`${SHEETS_WEBHOOK_URL}?action=read`)
      const data = await response.json()
      
      return NextResponse.json({
        success: true,
        data: data.data || [],
      })
    }

    if (action === 'download') {
      // Descargar datos de Supabase como JSON (el componente lo convierte a CSV)
      const { data: asistenciaSupabase, error } = await supabase
        .from('asistencias')
        .select(`
          fecha,
          estado_previo,
          estado_post,
          notas,
          jugador:perfiles!asistencias_jugador_id_fkey(nombre, apellido)
        `)
        .eq('fecha', fecha)

      if (error) throw error

      const rows = (asistenciaSupabase || []).map((a: any) => ({
        fecha: a.fecha,
        nombre: a.jugador?.nombre || '',
        apellido: a.jugador?.apellido || '',
        estado_previo: a.estado_previo || '',
        estado_post: a.estado_post || '',
        notas: a.notas || '',
      }))

      return NextResponse.json({ success: true, data: rows })
    }

    if (action === 'sync') {
      // Leer datos de Supabase
      const { data: asistenciaSupabase, error } = await supabase
        .from('asistencias')
        .select(`
          fecha,
          estado_previo,
          estado_post,
          notas,
          jugador:perfiles!asistencias_jugador_id_fkey(nombre, apellido)
        `)
        .eq('fecha', fecha)

      if (error) throw error

      // Formatear para Google Sheets
      const rows = (asistenciaSupabase || []).map((a: any) => ({
        fecha: a.fecha,
        nombre: a.jugador?.nombre || '',
        apellido: a.jugador?.apellido || '',
        estado_previo: a.estado_previo || '',
        estado_post: a.estado_post || '',
        notas: a.notas || '',
      }))

      // Enviar a Google Sheets
      const response = await fetch(SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sync',
          rows,
        }),
      })

      const result = await response.json()

      return NextResponse.json({
        success: true,
        message: 'Sincronización completada',
        fecha,
        registros: rows.length,
        sheets_response: result,
      })
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })

  } catch (error) {
    console.error('Error en sincronización:', error)
    return NextResponse.json({
      error: 'Error en la sincronización',
      details: error instanceof Error ? error.message : 'Error desconocido',
    }, { status: 500 })
  }
}

// POST - Actualizar desde la web hacia Google Sheets
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fecha, jugador_id, estado_previo, estado_post, notas } = body

    // Actualizar en Supabase
    const { error } = await supabase
      .from('asistencias')
      .upsert({
        fecha,
        jugador_id,
        estado_previo,
        estado_post,
        notas,
        updated_at: new Date().toISOString(),
      })

    if (error) throw error

    // Si hay webhook, sincronizar
    if (SHEETS_WEBHOOK_URL) {
      // Obtener todos los registros actualizados
      const { data: asistenciaActualizada } = await supabase
        .from('asistencias')
        .select(`
          fecha,
          estado_previo,
          estado_post,
          notas,
          jugador:perfiles!asistencias_jugador_id_fkey(nombre, apellido)
        `)
        .eq('fecha', fecha)

      const rows = (asistenciaActualizada || []).map((a: any) => ({
        fecha: a.fecha,
        nombre: a.jugador?.nombre || '',
        apellido: a.jugador?.apellido || '',
        estado_previo: a.estado_previo || '',
        estado_post: a.estado_post || '',
        notas: a.notas || '',
      }))

      // Actualizar Google Sheets
      await fetch(SHEETS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', rows }),
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Asistencia actualizada',
      synced: !!SHEETS_WEBHOOK_URL,
    })

  } catch (error) {
    console.error('Error al actualizar:', error)
    return NextResponse.json({
      error: 'Error al actualizar asistencia',
    }, { status: 500 })
  }
}