-- ===========================================
-- FIX: Permitir que usuarios creen su propio perfil
-- Ejecutar en Supabase SQL Editor
-- ===========================================

-- Política para que usuarios puedan insertar su propio perfil
CREATE POLICY "Usuarios pueden crear su propio perfil"
ON public.perfiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Política para que usuarios puedan leer su propio perfil
CREATE POLICY "Usuarios pueden leer su propio perfil"
ON public.perfiles
FOR SELECT
USING (auth.uid() = id);

-- Política para que usuarios puedan actualizar su propio perfil
CREATE POLICY "Usuarios pueden actualizar su propio perfil"
ON public.perfiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política para que admins puedan leer todos los perfiles
CREATE POLICY "Admins pueden leer todos los perfiles"
ON public.perfiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.perfiles p
    WHERE p.id = auth.uid() AND p.rol IN ('admin', 'moderador')
  )
);

-- Política para que admins puedan actualizar cualquier perfil
CREATE POLICY "Admins pueden actualizar cualquier perfil"
ON public.perfiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.perfiles p
    WHERE p.id = auth.uid() AND p.rol IN ('admin', 'moderador')
  )
);

-- Verificar que el trigger de creación automática existe
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre_completo, tipo_jugador, posicion_preferida, fecha_inicio_ruda, perfil_completo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', 'Nuevo Jugador'),
    COALESCE((NEW.raw_user_meta_data->>'tipo_jugador')::text, 'activo')::text,
    COALESCE(NEW.raw_user_meta_data->>'posicion_preferida', 'A definir'),
    COALESCE(NEW.raw_user_meta_data->>'fecha_inicio_ruda', CURRENT_DATE::text),
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el trigger si no existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();