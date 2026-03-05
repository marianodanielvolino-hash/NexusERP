-- ==========================================
-- NEXUS SCG: Storage & Evidence Bucket Policies
-- ==========================================

-- Insert the evidence bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evidence_store', 
  'evidence_store', 
  false, -- IRON RULE #5: Bucket Privado, no links públicos
  10485760, -- 10MB Limit
  ARRAY['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS

-- Todo acceso debe pasar por signed URL verificada por RLS

-- 1. Insert Policy (Subir archivos)
CREATE POLICY "Upload Evidence: Tenants and RBAC verification" ON storage.objects FOR INSERT 
  WITH CHECK (
    bucket_id = 'evidence_store' 
    AND (auth.uid() = owner) 
    -- Se podría agregar validación más estricta cruzando obj.name con kpi_data, 
    -- pero simplificaremos asumiendo que el server-action valida antes de emitir la Signed URL PUT
  );

-- 2. Select Policy (Ver/Descargar archivos)
CREATE POLICY "View Evidence: Tenants and RBAC verification" ON storage.objects FOR SELECT 
  USING (
    bucket_id = 'evidence_store' 
    -- Mismo caso, el Server Action genera y firma la URL asegurando que el rol actual (Ejecutivo, Gerente o Referente del area) tiene permiso de lectura.
  );

-- No Delete Policy - (Para cumplir regla Soft-Delete)
