-- Fix permisos admin y RLS para registros_rapidos
-- Ejecutar en Supabase SQL Editor

-- 1. Asegurarse que el rol está en el SELECT de perfiles
-- (ya debería estar, pero verificar que RLS no lo bloquea)

-- 2. Permitir que todos los autenticados lean su propio perfil incluyendo el rol
-- La política existente ya lo permite, pero asegurémonos:

DROP POLICY IF EXISTS "Perfiles visibles para todos los usuarios autenticados" ON public.perfiles;

CREATE POLICY "Perfiles visibles para todos los usuarios autenticados" 
ON public.perfiles FOR SELECT 
TO authenticated 
USING (true);

-- 3. Fix para registros_rapidos - agregar política de INSERT para todos (para registro rápido sin auth)
DROP POLICY IF EXISTS "Admins pueden manejar registros rápidos" ON public.registros_rapidos;

CREATE POLICY "Admins pueden ver registros rápidos" 
ON public.registros_rapidos FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.perfiles 
    WHERE id = auth.uid() AND rol IN ('admin', 'moderador')
  )
);

-- Permitir insertar registros rápidos a cualquier persona autenticada (jugadores escaneando QR)
CREATE POLICY "Cualquier autenticado puede crear registro rápido" 
ON public.registros_rapidos FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Permitir insertar registros rápidos incluso sin autenticación (anon)
CREATE POLICY "Anon puede crear registro rápido" 
ON public.registros_rapidos FOR INSERT 
TO anon 
WITH CHECK (true);

-- 4. Fix para asistencias - permitir que los jugadores registren su propia asistencia vía QR
DROP POLICY IF EXISTS "Admins pueden registrar asistencias" ON public.asistencias;

CREATE POLICY "Jugadores pueden registrar su propia asistencia" 
ON public.asistencias FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = jugador_id);

CREATE POLICY "Admins pueden registrar cualquier asistencia" 
ON public.asistencias FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.perfiles 
    WHERE id = auth.uid() AND rol IN ('admin', 'moderador')
  )
);
