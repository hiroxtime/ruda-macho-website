# -*- coding: utf-8 -*-
"""
Importar asistencias del Excel a JSON
Ejecutar con: python scripts/importar_asistencias.py
"""

import pandas as pd
import json
import os
import sys
from datetime import datetime

# Forzar UTF-8
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Mapeo de estados
ESTADO_PREVIO_MAP = {
    'Voy': 'voy',
    'No Voy': 'no_voy',
    'No voy': 'no_voy',
    'Voy tarde': 'voy_tarde',
    'Por definir': 'por_definir',
    'Exceptuado': 'exceptuado',
}

ESTADO_POST_MAP = {
    'Asistio': 'asistio',
    'Llego tarde': 'llego_tarde',
    'No asistio': 'no_asistio',
    'Por verificar': 'por_verificar',
}

def parsear_excel():
    """Lee el Excel y extrae los datos de asistencia"""
    
    # Leer el Excel
    df = pd.read_excel('assets/Asistencia estado manual/Asistencia Ruda 26.xlsx', header=None)
    
    # Fila 11 tiene las fechas (Mar 03, Jue 05, etc.)
    # Filas 12+ tienen los jugadores
    
    # Extraer fechas de la fila 11
    fechas_raw = df.iloc[11].tolist()
    
    # Parsear fechas (formato: "Mar 03", "Jue 05", etc.)
    # Marzo 2026
    fechas = []
    col_idx = 1  # Empezar desde columna 1 (saltar JUGADORES)
    
    while col_idx < len(fechas_raw) - 1:
        fecha_label = fechas_raw[col_idx]
        if pd.isna(fecha_label) or fecha_label == '':
            col_idx += 2
            continue
            
        # Extraer dia del label (ej: "Mar 03" -> 3)
        try:
            dia = int(str(fecha_label).split()[1])
            fecha = datetime(2026, 3, dia)
            fechas.append({
                'columna_previo': col_idx,
                'columna_post': col_idx + 1,
                'fecha': fecha.strftime('%Y-%m-%d'),
                'label': str(fecha_label)
            })
        except:
            pass
        
        col_idx += 2  # Saltar a la siguiente fecha
    
    print(f"Fechas encontradas: {len(fechas)}")
    for f in fechas:
        print(f"  {f['label']} -> {f['fecha']}")
    
    # Extraer jugadores y sus asistencias
    jugadores = []
    for idx in range(12, len(df)):
        row = df.iloc[idx]
        nombre = row[0]
        if pd.isna(nombre) or str(nombre).strip() == '':
            continue
        
        jugador = {
            'nombre': str(nombre).strip(),
            'asistencias': []
        }
        
        # Cada fecha tiene 2 columnas: estado_previo y estado_post
        for f in fechas:
            estado_previo_raw = row[f['columna_previo']] if f['columna_previo'] < len(row) else None
            estado_post_raw = row[f['columna_post']] if f['columna_post'] < len(row) else None
            
            if pd.isna(estado_previo_raw):
                estado_previo_raw = 'Por definir'
            if pd.isna(estado_post_raw):
                estado_post_raw = 'Por verificar'
            
            estado_previo = ESTADO_PREVIO_MAP.get(str(estado_previo_raw).strip(), 'por_definir')
            estado_post = ESTADO_POST_MAP.get(str(estado_post_raw).strip(), 'por_verificar')
            
            jugador['asistencias'].append({
                'fecha': f['fecha'],
                'estado_previo': estado_previo,
                'estado_post': estado_post,
            })
        
        jugadores.append(jugador)
    
    print(f"\nJugadores encontrados: {len(jugadores)}")
    return jugadores, fechas

def main():
    print("Rugby Ruda Macho - Importar Asistencias")
    print("=" * 50)
    
    try:
        jugadores, fechas = parsear_excel()
    except Exception as e:
        print(f"Error: {e}")
        print("\nAsegurate de estar en el directorio del proyecto:")
        print("  cd ruda-rugby-website")
        print("  python scripts/importar_asistencias.py")
        return
    
    print(f"\nResumen:")
    print(f"  - {len(jugadores)} jugadores")
    print(f"  - {len(fechas)} fechas de entrenamiento")
    print(f"  - {len(jugadores) * len(fechas)} registros de asistencia")
    
    # Guardar JSON para importar desde la app
    output = {
        'exportado': datetime.now().isoformat(),
        'total_jugadores': len(jugadores),
        'total_fechas': len(fechas),
        'fechas': fechas,
        'jugadores': jugadores
    }
    
    output_path = 'assets/Asistencia estado manual/asistencias_import.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"\nDatos exportados a: {output_path}")
    print("\nPara importar a Supabase:")
    print("1. Crear jugadores en la tabla 'perfiles' si no existen")
    print("2. Mapear nombres a IDs de perfiles")
    print("3. Insertar en tabla 'asistencias'")

if __name__ == '__main__':
    main()