-- ==========================================
-- NEXUS SCG: Multi-Tenant Schema & RBAC Definition
-- ==========================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TENANTS (Empresas Clientes)
CREATE TABLE public.tenants (
  tenant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  dominio VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  variables_css JSONB DEFAULT '{}',
  plan VARCHAR(50) DEFAULT 'pro',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AREAS (Unidades Operativas por Tenant)
CREATE TABLE public.areas (
  area_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  estado VARCHAR(50) DEFAULT 'activa',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tenant_id, nombre)
);

-- 3. USER ROLES (RBAC Matricial)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- references auth.users(id) - omitido constraint forzado por simplicidad externa
  tenant_id UUID NOT NULL REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('Operador', 'Referente', 'Gerente', 'Ejecutivo', 'Auditor', 'Multi-Cliente', 'Integration Admin')),
  area_id UUID REFERENCES public.areas(area_id) ON DELETE CASCADE, -- Null para Ejecutivos/Auditores globales
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tenant_id)
);

-- 4. PERIODS (Períodos de Carga)
CREATE TABLE public.periods (
  period_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  fecha_apertura DATE NOT NULL,
  fecha_cierre DATE NOT NULL,
  estado VARCHAR(50) DEFAULT 'abierto' CHECK (estado IN ('abierto', 'cerrado')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. KPI_DEFINITIONS (Catálogo)
CREATE TABLE public.kpi_definitions (
  kpi_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
  area_id UUID NOT NULL REFERENCES public.areas(area_id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  frecuencia VARCHAR(50) DEFAULT 'Mensual',
  meta DECIMAL(12,4),
  meta_tipo VARCHAR(50),
  estado VARCHAR(50) DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. KPI_DATA (Carga Operativa)
CREATE TABLE public.kpi_data (
  entry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
  kpi_id UUID NOT NULL REFERENCES public.kpi_definitions(kpi_id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES public.periods(period_id) ON DELETE CASCADE,
  area_id UUID NOT NULL REFERENCES public.areas(area_id) ON DELETE CASCADE,
  valor DECIMAL(12,4) NOT NULL,
  estado_flujo VARCHAR(50) DEFAULT 'Draft' CHECK (estado_flujo IN ('Draft', 'Submitted', 'Validated')),
  user_id UUID, 
  observacion TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (kpi_id, period_id)
);

-- 7. EVIDENCE_STORE (Archivos)
CREATE TABLE public.evidence_store (
  file_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES public.kpi_data(entry_id) ON DELETE CASCADE,
  url_storage TEXT NOT NULL,
  estado VARCHAR(50) DEFAULT 'activa' CHECK (estado IN ('activa', 'revocada')),
  uploaded_by UUID,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AUDIT_LOG (Append-Only para Iron Rule #4)
CREATE TABLE public.audit_logs (
  log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  entidad VARCHAR(100) NOT NULL, -- Ej: 'kpi_data', 'evidence_store'
  entidad_id UUID NOT NULL,
  accion VARCHAR(100) NOT NULL, -- Ej: 'submit', 'approve', 'reject', 'upload'
  detalles JSONB DEFAULT '{}',
  comentario TEXT, -- Requerido para rechazos
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INTEGRATION_LOG (Iron Rule #6)
CREATE TABLE public.integration_logs (
  job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
  tipo VARCHAR(50) CHECK (tipo IN ('push', 'pull')),
  estado VARCHAR(50) CHECK (estado IN ('success', 'error', 'pending')),
  detalles JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW-LEVEL SECURITY (RLS) IN SUPABASE
-- ==========================================

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;

-- Funciones Auxiliares para Políticas
CREATE OR REPLACE FUNCTION public.get_current_tenant()
RETURNS UUID AS $$
  SELECT tenant_id FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS VARCHAR AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() AND tenant_id = public.get_current_tenant() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_current_area()
RETURNS UUID AS $$
  SELECT area_id FROM public.user_roles WHERE user_id = auth.uid() AND tenant_id = public.get_current_tenant() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 1. Tenants (Solo Ejecutivo / Multi-Cliente ven tenants permitidos)
CREATE POLICY "Tenants: Select" ON public.tenants FOR SELECT 
  USING (tenant_id = public.get_current_tenant());

-- 2. Areas (Aislamiento Tenant)
CREATE POLICY "Areas: Select" ON public.areas FOR SELECT 
  USING (tenant_id = public.get_current_tenant());

-- 3. Periods (Lectura general para el tenant)
CREATE POLICY "Periods: Select" ON public.periods FOR SELECT 
  USING (tenant_id = public.get_current_tenant());

-- 4. KPI Definitions
CREATE POLICY "KPI Defs: Select" ON public.kpi_definitions FOR SELECT 
  USING (tenant_id = public.get_current_tenant() AND 
  (public.get_current_role() IN ('Ejecutivo', 'Auditor') OR area_id = public.get_current_area() OR public.get_current_area() IS NULL));

-- 5. KPI Data (Iron Rule #2 y #3)
CREATE POLICY "KPI Data: Select" ON public.kpi_data FOR SELECT 
  USING (tenant_id = public.get_current_tenant() AND 
  (public.get_current_role() IN ('Ejecutivo', 'Auditor') OR area_id = public.get_current_area() OR public.get_current_area() IS NULL));

CREATE POLICY "KPI Data: Insert/Update (Draft/Submit)" ON public.kpi_data FOR ALL 
  USING (
    tenant_id = public.get_current_tenant() AND 
    area_id = public.get_current_area() AND 
    EXISTS (SELECT 1 FROM public.periods WHERE period_id = kpi_data.period_id AND estado = 'abierto') AND
    estado_flujo IN ('Draft', 'Submitted')
  );

-- 6. Evidence Store (Iron Rule #5)
CREATE POLICY "Evidence Store: Select" ON public.evidence_store FOR SELECT 
  USING (tenant_id = public.get_current_tenant() AND 
  EXISTS (SELECT 1 FROM public.kpi_data WHERE entry_id = evidence_store.entry_id AND (public.get_current_role() IN ('Ejecutivo', 'Auditor') OR area_id = public.get_current_area() OR public.get_current_area() IS NULL)));

CREATE POLICY "Evidence Store: Insert (Soft-Delete only)" ON public.evidence_store FOR INSERT 
  WITH CHECK (tenant_id = public.get_current_tenant());

CREATE POLICY "Evidence Store: Soft Delete Update" ON public.evidence_store FOR UPDATE 
  USING (tenant_id = public.get_current_tenant());

-- (No Delete Policy = Append/Revoke only)

-- 7. Audit Logs (Iron Rule #4 Append Only)
CREATE POLICY "Audit Logs: Select" ON public.audit_logs FOR SELECT 
  USING (tenant_id = public.get_current_tenant() AND public.get_current_role() IN ('Ejecutivo', 'Auditor'));

CREATE POLICY "Audit Logs: Insert" ON public.audit_logs FOR INSERT 
  WITH CHECK (tenant_id = public.get_current_tenant());

-- (No Update or Delete on Audit Logs)

-- 8. Integration Logs
CREATE POLICY "Integration Logs: Select" ON public.integration_logs FOR SELECT 
  USING (tenant_id = public.get_current_tenant() AND public.get_current_role() IN ('Ejecutivo', 'Auditor', 'Integration Admin'));

CREATE POLICY "Integration Logs: Insert" ON public.integration_logs FOR INSERT 
  WITH CHECK (tenant_id = public.get_current_tenant() AND public.get_current_role() = 'Integration Admin');
