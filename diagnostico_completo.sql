-- ===========================================
-- DIAGNÓSTICO COMPLETO
-- Ejecutar TODO en Supabase SQL Editor
-- ===========================================

-- 1. Ver estructura de la tabla perfiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'perfiles'
ORDER BY ordinal_position;

-- 2. Ver TODAS las políticas actuales
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'perfiles';

-- 3. Verificar si RLS está activado
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'perfiles';

-- 4. Verificar si el trigger existe
SELECT tgname, tgrelid::regclass
FROM pg_trigger 
WHERE tgname LIKE '%user%';

-- 5. Verificar función del trigger
SELECT proname, prosrc
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 6. Ver restricciones de la tabla
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.perfiles'::regclass;