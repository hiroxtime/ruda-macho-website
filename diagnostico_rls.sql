-- ===========================================
-- DIAGNÓSTICO: Verificar políticas RLS existentes
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- Ver políticas actuales en perfiles
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
WHERE tablename = 'perfiles';

-- Ver si RLS está activado
SELECT 
  relname as table_name,
  relrowsecurity as rls_enabled,
  relforcerowsecurity as rls_forced
FROM pg_class 
WHERE relname = 'perfiles';

-- Ver estructura de la tabla perfiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'perfiles'
ORDER BY ordinal_position;

-- Verificar si el trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name LIKE '%user%';