-- ==========================================
-- NEXUS SCG: Multi-Tenant Schema Definition
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TENANTS (Empresas Clientes)
CREATE TABLE public.tenants (
  tenant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  dominio VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  variables_css JSONB DEFAULT '{}', -- Para la capa White Label
  plan VARCHAR(50) DEFAULT 'pro',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AREAS (Unidades Operativas por Tenant)
CREATE TABLE public.areas (
  area_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  responsable VARCHAR(255),
  estado VARCHAR(50) DEFAULT 'activa',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Para asegurar que no haya áreas repetidas bajo el mismo tenant
  UNIQUE (tenant_id, nombre)
);

-- 3. PERIODS (Períodos de Carga del Tablero)
CREATE TABLE public.periods (
  period_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL, -- ej. "Febrero 2025"
  fecha_apertura DATE NOT NULL,
  fecha_cierre DATE NOT NULL,
  estado VARCHAR(50) DEFAULT 'abierto', -- abierto / cerrado
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. KPI_DEFINITIONS (Catálogo de Indicadores)
CREATE TABLE public.kpi_definitions (
  kpi_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
  area_id UUID NOT NULL REFERENCES public.areas(area_id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  fuente VARCHAR(255),
  responsable VARCHAR(255),
  metodo_calculo TEXT,
  meta DECIMAL(12,4),
  meta_tipo VARCHAR(50), -- "Mayor es mejor" / "Menor es mejor"
  umbral_alerta DECIMAL(12,4),
  frecuencia VARCHAR(50) DEFAULT 'Mensual',
  estado VARCHAR(50) DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. KPI_DATA (Repositorio Histórico de Valores)
CREATE TABLE public.kpi_data (
  entry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
  kpi_id UUID NOT NULL REFERENCES public.kpi_definitions(kpi_id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES public.periods(period_id) ON DELETE CASCADE,
  area_id UUID NOT NULL REFERENCES public.areas(area_id) ON DELETE CASCADE,
  
  valor DECIMAL(12,4) NOT NULL,
  user_id UUID, -- FK a tabla users de Auth (Supabase Auth)
  estado_semaforo VARCHAR(50), -- ok / alerta / critico
  observacion TEXT,
  validado_por UUID, -- FK (Nivel 2)
  
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- Evita sobre-escrituras directas múltiples en el mismo periodo
  UNIQUE (kpi_id, period_id)
);

-- 6. EVIDENCE_STORE (Archivos Adjuntos)
CREATE TABLE public.evidence_store (
  file_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES public.kpi_data(entry_id) ON DELETE CASCADE,
  
  url_storage TEXT NOT NULL,
  tipo VARCHAR(50), -- PDF, Excel, CSV
  hash_integridad TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==========================================
-- ROW-LEVEL SECURITY (RLS) IN SUPABASE
-- ==========================================
-- El tenant_id debe coincidir en todas las tablas con el tenant_id del JWT generado tras el login.
-- (Supongamos que el JWT del usuario guarda su tenant en auth.jwt()->>'tenant_id')

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_store ENABLE ROW LEVEL SECURITY;

-- Ejemplo simple de política general: Un usuario solo ve, inserta o actualiza filas de SU inquilino.
-- (Se necesita una función extra para obtener el tenant_id actual real que no detallo para no romper).

CREATE POLICY "Aislamiento Tenant (Usuarios ven su propia Empresa)"
  ON public.kpi_data
  FOR ALL
  USING (tenant_id::text = current_setting('request.jwt.claim.tenant_id', true));

CREATE POLICY "Aislamiento Tenant KPIs"
  ON public.kpi_definitions
  FOR ALL
  USING (tenant_id::text = current_setting('request.jwt.claim.tenant_id', true));

CREATE POLICY "Aislamiento Tenant Areas"
  ON public.areas
  FOR ALL
  USING (tenant_id::text = current_setting('request.jwt.claim.tenant_id', true));
