# Generar SQL completo de asistencias
import json

with open('assets/Asistencia estado manual/asistencias_import.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

sql_output = []

# Header
sql_output.append("-- =====================================================")
sql_output.append("-- IMPORTAR ASISTENCIAS HISTÓRICAS DEL EXCEL")
sql_output.append("-- Generado automáticamente desde asistencias_import.json")
sql_output.append("-- =====================================================")
sql_output.append("")

# Función helper
sql_output.append("-- Función para obtener ID de jugador por nombre")
sql_output.append("CREATE OR REPLACE FUNCTION get_jugador_id(nombre_buscar TEXT)")
sql_output.append("RETURNS UUID AS $$")
sql_output.append("DECLARE")
sql_output.append("  resultado UUID;")
sql_output.append("BEGIN")
sql_output.append("  SELECT id INTO resultado FROM perfiles")
sql_output.append("  WHERE LOWER(nombre_completo) = LOWER(nombre_buscar)")
sql_output.append("  LIMIT 1;")
sql_output.append("  RETURN resultado;")
sql_output.append("END;")
sql_output.append("$$ LANGUAGE plpgsql;")
sql_output.append("")

# Insertar jugadores nuevos
sql_output.append("-- Insertar jugadores que no existen")
sql_output.append("INSERT INTO perfiles (id, nombre_completo, tipo_jugador, posicion_preferida, fecha_inicio_ruda, perfil_completo, rol)")
sql_output.append("SELECT gen_random_uuid(), nombre, 'activo', 'Por definir', '2026-03-01', false, 'jugador'")
sql_output.append("FROM (VALUES")

nombres = [j['nombre'] for j in data['jugadores']]
for i, nombre in enumerate(nombres):
    comma = "," if i < len(nombres) - 1 else ""
    sql_output.append(f"  ('{nombre}'){comma}")

sql_output.append(") AS t(nombre)")
sql_output.append("WHERE NOT EXISTS (")
sql_output.append("  SELECT 1 FROM perfiles WHERE LOWER(nombre_completo) = LOWER(t.nombre)")
sql_output.append(");")
sql_output.append("")

# Insertar asistencias para cada jugador
sql_output.append("-- Insertar asistencias históricas")
sql_output.append("INSERT INTO asistencias (jugador_id, fecha, tipo, estado_previo, estado_post)")
sql_output.append("SELECT get_jugador_id(nombre), fecha::date, 'entrenamiento', estado_previo, estado_post")
sql_output.append("FROM (VALUES")

values = []
for jugador in data['jugadores']:
    for a in jugador['asistencias']:
        values.append(f"  ('{jugador['nombre']}', '{a['fecha']}', '{a['estado_previo']}', '{a['estado_post']}')")

for i, v in enumerate(values):
    comma = "," if i < len(values) - 1 else ""
    sql_output.append(f"{v}{comma}")

sql_output.append(") AS t(nombre, fecha, estado_previo, estado_post)")
sql_output.append("WHERE get_jugador_id(nombre) IS NOT NULL")
sql_output.append("ON CONFLICT (jugador_id, fecha, tipo) DO UPDATE SET")
sql_output.append("  estado_previo = EXCLUDED.estado_previo,")
sql_output.append("  estado_post = EXCLUDED.estado_post;")
sql_output.append("")
sql_output.append("-- Verificar importación")
sql_output.append("SELECT")
sql_output.append("  p.nombre_completo,")
sql_output.append("  COUNT(*) as total_asistencias,")
sql_output.append("  SUM(CASE WHEN a.estado_post = 'asistio' THEN 1 ELSE 0 END) as asistencias")
sql_output.append("FROM perfiles p")
sql_output.append("JOIN asistencias a ON a.jugador_id = p.id")
sql_output.append("GROUP BY p.nombre_completo")
sql_output.append("ORDER BY asistencias DESC;")

# Guardar
with open('supabase/migrations/importar_asistencias_completo.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_output))

print(f"SQL generado con {len(values)} registros de asistencia")
print("Archivo: supabase/migrations/importar_asistencias_completo.sql")