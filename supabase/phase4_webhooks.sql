-- ==========================================
-- Fase 4: Webhooks y Metadatos de Tenant
-- ==========================================

-- 1. Tabla de Webhooks
CREATE TABLE IF NOT EXISTS public.webhooks (
    webhook_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(tenant_id),
    url TEXT NOT NULL,
    events TEXT[] DEFAULT '{kpi_update, kpi_violation}',
    active BOOLEAN DEFAULT true,
    secret TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS para Webhooks
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Webhooks: Manage based on tenant" ON public.webhooks
    USING (tenant_id = (SELECT get_current_tenant()));

-- 3. Log de ejecuciones de Webhooks (Auditoría)
CREATE TABLE IF NOT EXISTS public.webhook_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id UUID REFERENCES public.webhooks(webhook_id) ON DELETE CASCADE,
    event TEXT NOT NULL,
    payload JSONB,
    status_code INTEGER,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
