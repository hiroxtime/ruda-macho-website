-- ===========================================
-- FIX CRÍTICO: Habilitar RLS en todas las tablas
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- 1. Ver qué tablas NO tienen RLS habilitado
SELECT 
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity = true THEN '✅ RLS habilitado'
    ELSE '❌ RLS DESHABILITADO'
  END as estado
FROM pg_tables pt
LEFT JOIN pg_class pc ON pc.relname = pt.tablename
WHERE schemaname = 'public'
ORDER BY rowsecurity ASC, tablename;

-- 2. Ver tablas con políticas RLS existentes
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ===========================================
-- PASO 2: Habilitar RLS en todas las tablas públicas
-- ===========================================

-- Tabla: perfiles (ya tiene RLS, pero verificamos)
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

-- Tabla: asistencias
ALTER TABLE public.asistencias ENABLE ROW LEVEL SECURITY;

-- Tabla: registros_rapidos (si existe)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'registros_rapidos' AND schemaname = 'public') THEN
    EXECUTE 'ALTER TABLE public.registros_rapidos ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- Tabla: ahijados_pendientes (si existe)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'ahijados_pendientes' AND schemaname = 'public') THEN
    EXECUTE 'ALTER TABLE public.ahijados_pendientes ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- ===========================================
-- PASO 3: Crear políticas RLS para ASISTENCIAS
-- ===========================================

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "usuarios_ven_propias_asistencias" ON public.asistencias;
DROP POLICY IF EXISTS "admins_ven_todas_asistencias" ON public.asistencias;
DROP POLICY IF EXISTS "usuarios_insertan_asistencias" ON public.asistencias;
DROP POLICY IF EXISTS "usuarios_actualizan_asistencias" ON public.asistencias;

-- Política SELECT: usuarios ven sus propias asistencias
CREATE POLICY "usuarios_select_asistencias" ON public.asistencias
  FOR SELECT
  USING (auth.uid() = jugador_id);

-- Política SELECT: admins ven todas las asistencias
CREATE POLICY "admins_select_asistencias" ON public.asistencias
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND p.rol IN ('admin', 'moderador')
    )
  );

-- Política INSERT: usuarios pueden crear sus asistencias
CREATE POLICY "usuarios_insert_asistencias" ON public.asistencias
  FOR INSERT
  WITH CHECK (auth.uid() = jugador_id);

-- Política UPDATE: usuarios pueden actualizar sus asistencias
CREATE POLICY "usuarios_update_asistencias" ON public.asistencias
  FOR UPDATE
  USING (auth.uid() = jugador_id)
  WITH CHECK (auth.uid() = jugador_id);

-- Política UPDATE: admins pueden actualizar cualquier asistencia
CREATE POLICY "admins_update_asistencias" ON public.asistencias
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND p.rol IN ('admin', 'moderador')
    )
  );

-- ===========================================
-- PASO 4: Verificar estado final
-- ===========================================

SELECT 
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity = true THEN '✅ RLS habilitado'
    ELSE '❌ RLS DESHABILITADO'
  END as estado
FROM pg_tables pt
LEFT JOIN pg_class pc ON pc.relname = pt.tablename
WHERE schemaname = 'public'
ORDER BY rowsecurity ASC, tablename;

SELECT '¡RLS habilitado en todas las tablas!' as mensaje;