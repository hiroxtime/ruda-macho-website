/**
 * GOOGLE APPS SCRIPT - Instrucciones
 * 
 * Este archivo contiene el código para pegar en Google Apps Script.
 * Pasos:
 * 1. Abrir la planilla: https://docs.google.com/spreadsheets/d/1Qb2OlOj9SOhIDjz_3nY9xr05g6XDVUFvu-blVFLRpHw
 * 2. Ir a Extensiones > Apps Script
 * 3. Pegar el código de abajo
 * 4. Guardar y hacer Deploy > New Deployment > Web App
 * 5. Copiar la URL del Web App y agregarla como variable SHEETS_WEBHOOK_URL en Netlify
 */

// ============================================
// CÓDIGO PARA PEGAR EN GOOGLE APPS SCRIPT
// ============================================

const SPREADSHEET_ID = '1Qb2OlOj9SOhIDjz_3nY9xr05g6XDVUFvu-blVFLRpHw';
const SHEET_NAME = 'Asistencia';

/**
 * Maneja las solicitudes GET
 */
function doGet(e) {
  const action = e.parameter.action || 'read';
  
  try {
    if (action === 'read') {
      return readSheet();
    } else if (action === 'test') {
      return jsonResponse({ success: true, message: 'Conexión exitosa' });
    }
    
    return jsonResponse({ error: 'Acción no válida' });
  } catch (error) {
    return jsonResponse({ error: error.message });
  }
}

/**
 * Maneja las solicitudes POST
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'sync';
    
    if (action === 'sync') {
      return syncFromWeb(data);
    } else if (action === 'append') {
      return appendRow(data);
    }
    
    return jsonResponse({ error: 'Acción no válida' });
  } catch (error) {
    return jsonResponse({ error: error.message });
  }
}

/**
 * Lee todos los datos de la hoja
 */
function readSheet() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  
  if (data.length === 0) {
    return jsonResponse({ success: true, data: [] });
  }
  
  const headers = data[0];
  const rows = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i];
    });
    return obj;
  });
  
  return jsonResponse({ success: true, headers, data: rows });
}

/**
 * Sincroniza datos desde la web
 */
function syncFromWeb(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  
  // Limpiar hoja (excepto encabezados)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  
  // Escribir nuevos datos
  if (data.rows && data.rows.length > 0) {
    const headers = ['Fecha', 'Nombre', 'Apellido', 'Estado_Previo', 'Estado_Post', 'Notas'];
    
    // Verificar si existe encabezado
    const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    if (firstRow[0] !== headers[0]) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    
    // Agregar datos
    const rowsData = data.rows.map(row => [
      row.fecha || '',
      row.nombre || '',
      row.apellido || '',
      row.estado_previo || '',
      row.estado_post || '',
      row.notas || ''
    ]);
    
    sheet.getRange(2, 1, rowsData.length, headers.length).setValues(rowsData);
  }
  
  return jsonResponse({ success: true, message: 'Sincronización completada', rows: data.rows?.length || 0 });
}

/**
 * Agrega una fila nueva
 */
function appendRow(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  
  const newRow = [
    data.fecha || new Date().toISOString().split('T')[0],
    data.nombre || '',
    data.apellido || '',
    data.estado_previo || '',
    data.estado_post || '',
    data.notas || ''
  ];
  
  sheet.appendRow(newRow);
  
  return jsonResponse({ success: true, message: 'Fila agregada' });
}

/**
 * Respuesta JSON helper
 */
function jsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Función para configurar la hoja inicial
 */
function setupSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  // Agregar encabezados
  const headers = ['Fecha', 'Nombre', 'Apellido', 'Estado_Previo', 'Estado_Post', 'Notas'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formato de encabezados
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4CAF50').setFontColor('white');
  
  // Ajustar anchos
  sheet.setColumnWidth(1, 120); // Fecha
  sheet.setColumnWidth(2, 150); // Nombre
  sheet.setColumnWidth(3, 150); // Apellido
  sheet.setColumnWidth(4, 120); // Estado_Previo
  sheet.setColumnWidth(5, 120); // Estado_Post
  sheet.setColumnWidth(6, 200); // Notas
  
  return 'Hoja configurada correctamente';
}

/**
 * Función de prueba
 */
function testConnection() {
  Logger.log(setupSheet());
  Logger.log('Conexión exitosa a Google Sheets');
  return 'OK';
}