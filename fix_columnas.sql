-- ===========================================
-- FIX COLUMNAS: Asegurar que columnas opcionales acepten NULL
-- ===========================================

-- Ver columnas y sus restricciones
SELECT column_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'perfiles'
ORDER BY ordinal_position;

-- Asegurar que columnas opcionales acepten NULL
ALTER TABLE public.perfiles ALTER COLUMN telefono DROP NOT NULL;
ALTER TABLE public.perfiles ALTER COLUMN fecha_nacimiento DROP NOT NULL;
ALTER TABLE public.perfiles ALTER COLUMN numero_camiseta DROP NOT NULL;
ALTER TABLE public.perfiles ALTER COLUMN avatar_url DROP NOT NULL;
ALTER TABLE public.perfiles ALTER COLUMN es_madrina DROP NOT NULL;
ALTER TABLE public.perfiles ALTER COLUMN qr_token DROP NOT NULL;
ALTER TABLE public.perfiles ALTER COLUMN rol DROP NOT NULL;

-- Establecer defaults para columnas obligatorias
ALTER TABLE public.perfiles ALTER COLUMN nombre_completo SET DEFAULT 'Nuevo Jugador';
ALTER TABLE public.perfiles ALTER COLUMN tipo_jugador SET DEFAULT 'activo';
ALTER TABLE public.perfiles ALTER COLUMN posicion_preferida SET DEFAULT 'A definir';
ALTER TABLE public.perfiles ALTER COLUMN fecha_inicio_ruda SET DEFAULT CURRENT_DATE;
ALTER TABLE public.perfiles ALTER COLUMN perfil_completo SET DEFAULT false;

SELECT '✅ Columnas actualizadas' as status;