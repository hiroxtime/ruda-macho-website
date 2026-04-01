-- SQL para ejecutar en Supabase SQL Editor
-- Actualizar tabla de asistencias con nuevos estados

-- 1. Agregar columnas nuevas si no existen
ALTER TABLE asistencias 
ADD COLUMN IF NOT EXISTS estado_previo VARCHAR(20) DEFAULT 'por_definir';

ALTER TABLE asistencias 
ADD COLUMN IF NOT EXISTS estado_post VARCHAR(20) DEFAULT 'por_verificar';

-- 2. Migrar datos existentes (estado_llegada -> estado_post)
UPDATE asistencias 
SET estado_post = CASE 
  WHEN estado_llegada = 'a tiempo' THEN 'asistio'
  WHEN estado_llegada = 'tarde' THEN 'llego_tarde'
  ELSE 'por_verificar'
END
WHERE estado_post IS NULL OR estado_post = 'por_verificar';

-- 3. Actualizar la tabla para usar los nuevos campos
-- Los jugadores marcan estado_previo (Voy/No voy/Voy tarde/Por definir/Exceptuado)
-- La comisión marca estado_post (Asistió/Llegó tarde/No asistió/Por verificar)

-- 4. Verificar estructura
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'asistencias' 
ORDER BY ordinal_position;