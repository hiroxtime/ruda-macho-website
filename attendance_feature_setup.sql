-- Actualización para Sistema de Asistencia con QR - Ruda Macho
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar rol y token de QR a perfiles
ALTER TABLE public.perfiles 
ADD COLUMN IF NOT EXISTS rol VARCHAR(20) DEFAULT 'jugador' CHECK (rol IN ('jugador', 'moderador', 'tesorero', 'admin')),
ADD COLUMN IF NOT EXISTS qr_token UUID DEFAULT gen_random_uuid();

-- 2. Crear tabla de asistencias
CREATE TABLE IF NOT EXISTS public.asistencias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  jugador_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  hora_entrada TIME WITH TIME ZONE DEFAULT NOW(),
  tipo VARCHAR(50) DEFAULT 'entrenamiento', -- entrenamiento, partido, evento
  estado_llegada VARCHAR(20) DEFAULT 'a tiempo' CHECK (estado_llegada IN ('a tiempo', 'tarde', 'ausente', 'justificado')),
  registrado_por UUID REFERENCES public.perfiles(id),
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Evitar duplicados por jugador en el mismo día y tipo de evento
  UNIQUE(jugador_id, fecha, tipo)
);

-- 3. Habilitar RLS
ALTER TABLE public.asistencias ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de RLS para asistencias
CREATE POLICY "Jugadores pueden ver su propia asistencia" 
ON public.asistencias FOR SELECT 
TO authenticated 
USING (auth.uid() = jugador_id);

CREATE POLICY "Admins pueden ver todas las asistencias" 
ON public.asistencias FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.perfiles 
    WHERE id = auth.uid() AND rol IN ('admin', 'moderador')
  )
);

CREATE POLICY "Admins pueden registrar asistencias" 
ON public.asistencias FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.perfiles 
    WHERE id = auth.uid() AND rol IN ('admin', 'moderador')
  )
);

CREATE POLICY "Admins pueden actualizar asistencias" 
ON public.asistencias FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.perfiles 
    WHERE id = auth.uid() AND rol IN ('admin', 'moderador')
  )
);

-- 5. Crear tabla para registros rápidos (invitados/nuevos)
-- Esto permite registrar a alguien que no tiene cuenta aún
CREATE TABLE IF NOT EXISTS public.registros_rapidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  telefono VARCHAR(20),
  registrado_por UUID REFERENCES public.perfiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.registros_rapidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins pueden manejar registros rápidos" 
ON public.registros_rapidos FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.perfiles 
    WHERE id = auth.uid() AND rol IN ('admin', 'moderador')
  )
);

-- 6. Hacerse admin a uno mismo (Correr esto manualmente con tu ID)
-- UPDATE public.perfiles SET rol = 'admin' WHERE id = 'tu-uuid-aqui';
