-- ==========================================
-- Fase 2: Configuración de Storage para Evidencias
-- ==========================================

-- 1. Crear el bucket de evidencias si no existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidence_files', 'evidence_files', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas RLS para el bucket de evidencias
-- Permitir lectura a usuarios autenticados del mismo tenant (simplificado por ahora a AUTHENTICATED)
CREATE POLICY "Evidencias: Ver archivos propios" ON storage.objects
    FOR SELECT TO authenticated USING (bucket_id = 'evidence_files');

-- Permitir carga de archivos a usuarios autenticados
CREATE POLICY "Evidencias: Cargar archivos" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'evidence_files');

-- Permitir borrado a usuarios autenticados (opcional, refinable)
CREATE POLICY "Evidencias: Borrar archivos" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'evidence_files');

-- 3. Tabla para metadatos de evidencias (si no existe)
-- Vincula un archivo en Storage con un entry_id en kpi_data
CREATE TABLE IF NOT EXISTS public.kpi_evidence (
    evidence_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID REFERENCES public.kpi_data(entry_id) ON DELETE CASCADE,
    file_path TEXT NOT NULL, -- Ruta en el bucket
    file_name TEXT NOT NULL,
    file_type TEXT,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para kpi_evidence
ALTER TABLE public.kpi_evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Evidencias Meta: Select based on tenant" ON public.kpi_evidence
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.kpi_data d 
            WHERE d.entry_id = kpi_evidence.entry_id 
            AND d.tenant_id = (SELECT get_current_tenant())
        )
    );
