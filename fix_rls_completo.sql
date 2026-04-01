-- ===========================================
-- FIX COMPLETO: Políticas RLS para perfiles
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- 1. Desactivar RLS temporalmente para poder hacer cambios
ALTER TABLE public.perfiles DISABLE ROW LEVEL SECURITY;

-- 2. Eliminar TODAS las políticas existentes
DROP POLICY IF EXISTS "Usuarios pueden crear su propio perfil" ON public.perfiles;
DROP POLICY IF EXISTS "Usuarios pueden leer su propio perfil" ON public.perfiles;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.perfiles;
DROP POLICY IF EXISTS "Admins pueden leer todos los perfiles" ON public.perfiles;
DROP POLICY IF EXISTS "Admins pueden actualizar cualquier perfil" ON public.perfiles;
DROP POLICY IF EXISTS "Enable all for users" ON public.perfiles;
DROP POLICY IF EXISTS "Enable all for admins" ON public.perfiles;
DROP POLICY IF EXISTS "perfiles_select_policy" ON public.perfiles;
DROP POLICY IF EXISTS "perfiles_insert_policy" ON public.perfiles;
DROP POLICY IF EXISTS "perfiles_update_policy" ON public.perfiles;

-- 3. Reactivar RLS
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas correctas desde cero

-- Política para INSERT: usuarios pueden crear su propio perfil
CREATE POLICY "usuarios_insert_propio" ON public.perfiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Política para SELECT: usuarios pueden leer su propio perfil
CREATE POLICY "usuarios_select_propio" ON public.perfiles
  FOR SELECT
  USING (auth.uid() = id);

-- Política para UPDATE: usuarios pueden actualizar su propio perfil
CREATE POLICY "usuarios_update_propio" ON public.perfiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política para que admins lean TODOS los perfiles
CREATE POLICY "admins_select_all" ON public.perfiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND p.rol IN ('admin', 'moderador')
    )
  );

-- Política para que admins actualicen CUALQUIER perfil
CREATE POLICY "admins_update_all" ON public.perfiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.perfiles p
      WHERE p.id = auth.uid() AND p.rol IN ('admin', 'moderador')
    )
  );

-- 5. Verificar/Recrear el trigger de creación automática
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
  -- Si falla, que continúe sin interrumpir
  RAISE WARNING 'Error creating profile: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear el trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Verificar que el rol admin existe
UPDATE public.perfiles 
SET rol = 'admin' 
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email = 'antonycarrerah@gmail.com'
);

-- 7. Mensaje de confirmación
SELECT 'Políticas RLS recreadas correctamente' as status;