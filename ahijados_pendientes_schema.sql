-- Crear tabla para ahijados pendientes (que aún no se registraron)
CREATE TABLE IF NOT EXISTS ahijados_pendientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  madrina_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  nombre_completo TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  perfil_id UUID REFERENCES perfiles(id) ON DELETE SET NULL -- Se llena cuando el ahijado se registra
);

-- Índice para búsquedas
CREATE INDEX IF NOT EXISTS idx_ahijados_pendientes_madrina 
ON ahijados_pendientes(madrina_id);

CREATE INDEX IF NOT EXISTS idx_ahijados_pendientes_email 
ON ahijados_pendientes(email);

-- Políticas RLS
ALTER TABLE ahijados_pendientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pending ahijados" 
ON ahijados_pendientes FOR SELECT 
USING (madrina_id = auth.uid());

CREATE POLICY "Users can insert their own pending ahijados" 
ON ahijados_pendientes FOR INSERT 
WITH CHECK (madrina_id = auth.uid());

CREATE POLICY "Users can update their own pending ahijados" 
ON ahijados_pendientes FOR UPDATE 
USING (madrina_id = auth.uid());

CREATE POLICY "Users can delete their own pending ahijados" 
ON ahijados_pendientes FOR DELETE 
USING (madrina_id = auth.uid());

-- Trigger para sincronizar cuando un ahijado se registra
CREATE OR REPLACE FUNCTION sincronizar_ahijado_pendiente()
RETURNS TRIGGER AS $$
BEGIN
  -- Buscar si hay un ahijado pendiente con este email
  UPDATE ahijados_pendientes
  SET perfil_id = NEW.id
  WHERE email = NEW.email 
    AND perfil_id IS NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger (comentado para evitar errores si ya existe)
-- DROP TRIGGER IF EXISTS on_perfil_created_sincronizar_ahijado ON perfiles;
-- CREATE TRIGGER on_perfil_created_sincronizar_ahijado
--   AFTER INSERT ON perfiles
--   FOR EACH ROW EXECUTE FUNCTION sincronizar_ahijado_pendiente();
