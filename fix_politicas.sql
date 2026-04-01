-- ===========================================
-- FIX DEFINITIVO: Políticas RLS para perfiles
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- 1. Eliminar TODAS las políticas existentes
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'perfiles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.perfiles', pol.policyname);
  END LOOP;
END $$;

-- 2. Asegurar que RLS está activado
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas limpias

-- INSERT: usuarios pueden crear su propio perfil (auth.uid() = id del nuevo perfil)
CREATE POLICY "usuarios_insert" ON public.perfiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- SELECT: usuarios pueden leer su propio perfil
CREATE POLICY "usuarios_select" ON public.perfiles
  FOR SELECT
  USING (auth.uid() = id);

-- UPDATE: usuarios pueden actualizar su propio perfil
CREATE POLICY "usuarios_update" ON public.perfiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin: puede leer todos los perfiles
CREATE POLICY "admins_select" ON public.perfiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND p.rol IN ('admin', 'moderador')
    )
  );

-- Admin: puede actualizar cualquier perfil
CREATE POLICY "admins_update" ON public.perfiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND p.rol IN ('admin', 'moderador')
    )
  );

-- 4. Verificar/Recrear el trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre_completo, tipo_jugador, posicion_preferida, fecha_inicio_ruda, perfil_completo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', 'Nuevo Jugador'),
    COALESCE(NEW.raw_user_meta_data->>'tipo_jugador', 'activo'),
    COALESCE(NEW.raw_user_meta_data->>'posicion_preferida', 'A definir'),
    COALESCE(NEW.raw_user_meta_data->>'fecha_inicio_ruda', CURRENT_DATE::text),
    false
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error creating profile: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Verificar
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'perfiles';
SELECT '✅ Listo' as status;