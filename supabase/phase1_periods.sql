-- ==========================================
-- Fase 1: Tabla de Períodos y Datos Dinámicos
-- ==========================================

-- 1. Crear tabla de períodos
CREATE TABLE IF NOT EXISTS public.periods (
    period_id TEXT PRIMARY KEY, -- Formato P-YYYY-MM
    tenant_id UUID REFERENCES public.tenants(tenant_id),
    nombre TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado TEXT CHECK (estado IN ('Abierto', 'Cerrado', 'Auditado')) DEFAULT 'Abierto',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar RLS
ALTER TABLE public.periods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Periods: Select based on tenant" ON public.periods
    FOR SELECT USING (tenant_id = (SELECT get_current_tenant()));

-- 3. Insertar datos iniciales para el tenant de prueba
INSERT INTO public.periods (period_id, tenant_id, nombre, fecha_inicio, fecha_fin, estado)
VALUES 
    ('P-2026-03', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Marzo 2026', '2026-03-01', '2026-03-31', 'Abierto'),
    ('P-2026-02', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Febrero 2026', '2026-02-01', '2026-02-28', 'Cerrado'),
    ('P-2026-01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Enero 2026', '2026-01-01', '2026-01-31', 'Cerrado')
ON CONFLICT (period_id) DO NOTHING;

-- 4. Actualizar kpi_data para referenciar period_id (si no lo hace ya correctamente)
-- Nota: La tabla kpi_data ya tiene period_id según el esquema analizado anteriormente en lib/actions/data.ts
