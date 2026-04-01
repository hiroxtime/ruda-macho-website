-- Ejecutar en Supabase SQL Editor
-- Esto permite registrar asistencias de jugadores sin cuenta

-- 1. Agregar columna para nombre de jugador sin cuenta
ALTER TABLE asistencias 
ADD COLUMN IF NOT EXISTS nombre_jugador VARCHAR(255);

-- 2. Hacer jugador_id nullable (ya debería serlo, pero por si acaso)
ALTER TABLE asistencias 
ALTER COLUMN jugador_id DROP NOT NULL;

-- 3. Agregar constraint: debe haber要么 jugador_id o nombre_jugador
ALTER TABLE asistencias
ADD CONSTRAINT check_jugador_o_nombre 
CHECK (jugador_id IS NOT NULL OR nombre_jugador IS NOT NULL);

-- 4. Crear índice para búsquedas por nombre
CREATE INDEX IF NOT EXISTS idx_asistencias_nombre ON asistencias(nombre_jugador);

-- 5. Actualizar la política RLS para permitir ver todas las asistencias
DROP POLICY IF EXISTS "Jugadores pueden ver sus propias asistencias" ON asistencias;

CREATE POLICY "Todos pueden ver asistencias"
  ON asistencias FOR SELECT
  USING (true);

-- 6. Permitir insertar sin jugador_id (usando nombre_jugador)
DROP POLICY IF EXISTS "Jugadores pueden insertar su propia asistencia" ON asistencias;

CREATE POLICY "Cualquiera puede insertar asistencia"
  ON asistencias FOR INSERT
  WITH CHECK (true);

-- Verificar estructura
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'asistencias' 
ORDER BY ordinal_position;