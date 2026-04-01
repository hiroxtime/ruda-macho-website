-- Agregar campo becado y fecha de vencimiento
ALTER TABLE public.perfiles ADD COLUMN IF NOT EXISTS es_becado BOOLEAN DEFAULT false;
ALTER TABLE public.perfiles ADD COLUMN IF NOT EXISTS fecha_vencimiento_beca DATE;

-- Verificar
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'perfiles' AND column_name IN ('es_becado', 'fecha_vencimiento_beca');