-- Schema SQL para Ruda Macho Rugby Club
-- Ejecutar en Supabase SQL Editor

-- Tabla de perfiles de jugadores (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.perfiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  tipo_jugador VARCHAR(20) NOT NULL CHECK (tipo_jugador IN ('activo', 'asociado')),
  posicion_preferida VARCHAR(50),
  fecha_inicio_ruda DATE NOT NULL,
  estado_cuota BOOLEAN DEFAULT false,
  privacidad_cuota BOOLEAN DEFAULT false, -- El "ojito" para ocultar estado
  nombre_completo VARCHAR(100),
  telefono VARCHAR(20),
  fecha_nacimiento DATE,
  numero_camiseta INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de estadísticas de jugadores
CREATE TABLE IF NOT EXISTS public.estadisticas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  jugador_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE,
  partidos_jugados INTEGER DEFAULT 0,
  tries INTEGER DEFAULT 0,
  conversiones INTEGER DEFAULT 0,
  penalizaciones INTEGER DEFAULT 0,
  tarjetas_amarillas INTEGER DEFAULT 0,
  tarjetas_rojas INTEGER DEFAULT 0,
  temporada VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pagos/cuotas
CREATE TABLE IF NOT EXISTS public.pagos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  jugador_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE,
  mes VARCHAR(20) NOT NULL,
  anio INTEGER NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'pagado', 'parcial')),
  metodo_pago VARCHAR(20),
  fecha_pago DATE,
  notas TEXT,
  registrado_por UUID REFERENCES public.perfiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de posiciones de rugby
CREATE TABLE IF NOT EXISTS public.posiciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  numero INTEGER NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('delantero', 'back')),
  descripcion TEXT
);

-- Insertar posiciones estándar de rugby
INSERT INTO public.posiciones (nombre, numero, tipo, descripcion) VALUES
('Pilar', 1, 'delantero', 'Primera línea - scrum y melé'),
('Hooker', 2, 'delantero', 'Talonador - lanzamiento de line-out'),
('Pilar', 3, 'delantero', 'Primera línea - scrum y melé'),
('Segunda Línea', 4, 'delantero', 'Line-out y mauls'),
('Segunda Línea', 5, 'delantero', 'Line-out y mauls'),
('Ala', 6, 'delantero', 'Tercera línea - trabajo en rucks'),
('Número 8', 8, 'delantero', 'Base de la melé'),
('Ala', 7, 'delantero', 'Tercera línea - trabajo en rucks'),
('Medio Scrum', 9, 'back', 'Distribución desde la base'),
('Apertura', 10, 'back', 'Director de juego'),
('Centro', 12, 'back', 'Defensa y ataque interior'),
('Centro', 13, 'back', 'Defensa y ataque interior'),
('Wing', 11, 'back', 'Extremo - velocidad'),
('Wing', 14, 'back', 'Extremo - velocidad'),
('Full Back', 15, 'back', 'Última línea de defensa');

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para perfiles
CREATE TRIGGER update_perfiles_updated_at
BEFORE UPDATE ON public.perfiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Políticas de Row Level Security (RLS)
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estadisticas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver perfiles públicos
CREATE POLICY "Perfiles visibles para todos los usuarios autenticados" 
ON public.perfiles FOR SELECT 
TO authenticated 
USING (true);

-- Política: Los usuarios solo pueden editar su propio perfil
CREATE POLICY "Usuarios pueden editar su propio perfil" 
ON public.perfiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Política: Los usuarios pueden insertar su propio perfil
CREATE POLICY "Usuarios pueden crear su propio perfil" 
ON public.perfiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Política: Los tesoreros pueden ver todas las cuotas (implementar luego con roles)
CREATE POLICY "Estadísticas visibles para todos" 
ON public.estadisticas FOR SELECT 
TO authenticated 
USING (true);

-- Vista para mostrar jugadores activos (ocultando info privada si aplica)
CREATE OR REPLACE VIEW public.jugadores_activos AS
SELECT 
  p.id,
  p.nombre_completo,
  p.posicion_preferida,
  p.fecha_inicio_ruda,
  CASE 
    WHEN p.privacidad_cuota THEN NULL 
    ELSE p.estado_cuota 
  END as estado_cuota_visible,
  p.numero_camiseta
FROM public.perfiles p
WHERE p.tipo_jugador = 'activo';

-- Comentarios para documentación
COMMENT ON TABLE public.perfiles IS 'Perfiles extendidos de jugadores del club';
COMMENT ON TABLE public.estadisticas IS 'Estadísticas de partidos por temporada';
COMMENT ON TABLE public.pagos IS 'Registro de pagos de cuotas mensuales';
COMMENT ON TABLE public.posiciones IS 'Posiciones estándar de rugby XV';
