-- Schema updates for Ruda Macho Rugby website
-- Run these SQL commands in your Supabase SQL Editor

-- 1. Add new columns to perfiles table
ALTER TABLE perfiles 
ADD COLUMN IF NOT EXISTS es_madrina BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS perfil_completo BOOLEAN DEFAULT FALSE;

-- 2. Create madrinas_ahijados table for sponsorship relationships
CREATE TABLE IF NOT EXISTS madrinas_ahijados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  madrina_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  ahijado_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE CASCADE,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(madrina_id, ahijado_id)
);

-- 3. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_madrinas_ahijados_madrina 
ON madrinas_ahijados(madrina_id);

CREATE INDEX IF NOT EXISTS idx_madrinas_ahijados_ahijado 
ON madrinas_ahijados(ahijado_id);

-- 4. Update existing profiles to have perfil_completo = true 
-- (for existing users who already have complete profiles)
UPDATE perfiles 
SET perfil_completo = TRUE 
WHERE telefono IS NOT NULL 
  AND telefono != '' 
  AND fecha_nacimiento IS NOT NULL;

-- 5. Enable Row Level Security on madrinas_ahijados
ALTER TABLE madrinas_ahijados ENABLE ROW LEVEL SECURITY;

-- 6. Create policies for madrinas_ahijados
-- Allow users to see their own madrina relationships
CREATE POLICY "Users can view their own madrina relationships" 
ON madrinas_ahijados FOR SELECT 
USING (madrina_id = auth.uid() OR ahijado_id = auth.uid());

-- Allow users to manage their own madrina relationships
CREATE POLICY "Users can insert their own madrina relationships" 
ON madrinas_ahijados FOR INSERT 
WITH CHECK (madrina_id = auth.uid());

CREATE POLICY "Users can delete their own madrina relationships" 
ON madrinas_ahijados FOR DELETE 
USING (madrina_id = auth.uid());

-- 7. Update trigger to handle Google OAuth sign-ins
-- This ensures profiles are created for Google users too
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (
    id, 
    nombre_completo, 
    tipo_jugador,
    posicion_preferida,
    fecha_inicio_ruda,
    telefono,
    fecha_nacimiento,
    numero_camiseta,
    perfil_completo
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'tipo_jugador', 'activo'),
    NEW.raw_user_meta_data->>'posicion_preferida',
    COALESCE(NEW.raw_user_meta_data->>'fecha_inicio_ruda', NOW()::text::date::text),
    NEW.raw_user_meta_data->>'telefono',
    NEW.raw_user_meta_data->>'fecha_nacimiento',
    NULLIF(NEW.raw_user_meta_data->>'numero_camiseta', '')::int,
    -- Mark as incomplete if coming from Google OAuth (needs phone and birth date)
    CASE 
      WHEN NEW.provider = 'google' THEN FALSE
      WHEN NEW.raw_user_meta_data->>'telefono' IS NOT NULL 
           AND NEW.raw_user_meta_data->>'fecha_nacimiento' IS NOT NULL THEN TRUE
      ELSE FALSE
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Make sure the trigger is set up correctly
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
