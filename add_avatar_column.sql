-- Agregar columna avatar_url a la tabla perfiles
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
