-- Nueva estructura de asistencias con estados del Excel
-- Ejecutar en Supabase SQL Editor

-- Eliminar tabla anterior si existe
DROP TABLE IF EXISTS asistencias CASCADE;

-- Crear tabla con nuevos campos
CREATE TABLE asistencias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  jugador_id UUID REFERENCES perfiles(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  tipo VARCHAR(50) DEFAULT 'entrenamiento',
  
  -- Estado previo (lo que marca el jugador antes del entrenamiento)
  estado_previo VARCHAR(20) DEFAULT 'por_definir', -- 'voy', 'no_voy', 'voy_tarde', 'por_definir', 'exceptuado'
  
  -- Estado post (lo que marca la comisión después del entrenamiento)
  estado_post VARCHAR(20) DEFAULT 'por_verificar', -- 'asistio', 'llego_tarde', 'no_asistio', 'por_verificar'
  
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(jugador_id, fecha, tipo)
);

-- Índices para mejor performance
CREATE INDEX idx_asistencias_fecha ON asistencias(fecha);
CREATE INDEX idx_asistencias_jugador ON asistencias(jugador_id);

-- Habilitar RLS
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Jugadores pueden ver sus propias asistencias"
  ON asistencias FOR SELECT
  USING (auth.uid() = jugador_id);

CREATE POLICY "Admins pueden ver todas las asistencias"
  ON asistencias FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'moderador', 'tesorero')
  ));

CREATE POLICY "Jugadores pueden insertar su propia asistencia"
  ON asistencias FOR INSERT
  WITH CHECK (auth.uid() = jugador_id);

CREATE POLICY "Admins pueden modificar asistencias"
  ON asistencias FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'moderador', 'tesorero')
  ));

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_asistencias_updated_at
    BEFORE UPDATE ON asistencias
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();