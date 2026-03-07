-- ============================================================
-- NEXUS SCG · Supabase SQL · Schema + RLS + Demo Data
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── EXTENSIONES ────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── LIMPIAR SI YA EXISTE (orden inverso por FK) ────────────
DROP TABLE IF EXISTS public.kpi_data      CASCADE;
DROP TABLE IF EXISTS public.kpi_targets   CASCADE;
DROP TABLE IF EXISTS public.kpis          CASCADE;
DROP TABLE IF EXISTS public.projects      CASCADE;
DROP TABLE IF EXISTS public.clients       CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- ============================================================
-- 1. CLIENTES (tenants)
-- ============================================================
CREATE TABLE public.clients (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,          -- 'enersa', 'nexus-social'
  name        TEXT NOT NULL,
  full_name   TEXT,
  sector      TEXT,
  country     TEXT DEFAULT 'Argentina',
  logo        TEXT,
  color       TEXT DEFAULT '#6366f1',
  accent      TEXT DEFAULT '#818cf8',
  plan        TEXT DEFAULT 'Standard',       -- 'Standard' | 'Professional' | 'Enterprise' | 'Pilot'
  status      TEXT DEFAULT 'active',         -- 'active' | 'pilot' | 'inactive'
  since       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. PERFILES DE USUARIO (extiende auth.users de Supabase)
-- ============================================================
CREATE TABLE public.user_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  role        TEXT DEFAULT 'viewer',         -- 'super_admin' | 'admin' | 'manager' | 'loader' | 'viewer' | 'auditor'
  client_id   UUID REFERENCES public.clients(id),   -- NULL = super_admin (accede a todo)
  avatar_url  TEXT,
  active      BOOLEAN DEFAULT TRUE,
  last_login  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. PROYECTOS (por cliente)
-- ============================================================
CREATE TABLE public.projects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  slug        TEXT NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT DEFAULT '📊',
  status      TEXT DEFAULT 'active',         -- 'active' | 'setup' | 'archived'
  areas       TEXT[],                        -- ['Comercial','Operaciones',...]
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, slug)
);

-- ============================================================
-- 4. KPIs (definición, por proyecto)
-- ============================================================
CREATE TABLE public.kpis (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id          UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  code                TEXT NOT NULL,          -- 'SAIDI', 'COBRABILIDAD'
  name                TEXT NOT NULL,
  area                TEXT NOT NULL,
  unit                TEXT DEFAULT '%',
  polarity            TEXT DEFAULT 'higher',  -- 'higher' | 'lower'
  description         TEXT,
  calculation_method  TEXT,
  frequency           TEXT DEFAULT 'monthly',
  display_order       INTEGER DEFAULT 0,
  active              BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. TARGETS (meta por KPI × período)
-- ============================================================
CREATE TABLE public.kpi_targets (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kpi_id      UUID NOT NULL REFERENCES public.kpis(id) ON DELETE CASCADE,
  period      TEXT NOT NULL,                  -- '2026-02'
  target      NUMERIC(12,4) NOT NULL,
  baseline    NUMERIC(12,4),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(kpi_id, period)
);

-- ============================================================
-- 6. DATOS CARGADOS (valores reales por KPI × período)
-- ============================================================
CREATE TABLE public.kpi_data (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kpi_id        UUID NOT NULL REFERENCES public.kpis(id) ON DELETE CASCADE,
  period        TEXT NOT NULL,                -- '2026-02'
  value         NUMERIC(12,4) NOT NULL,
  source        TEXT DEFAULT 'manual',        -- 'manual' | 'import' | 'api'
  notes         TEXT,
  loaded_by     UUID REFERENCES auth.users(id),
  validated     BOOLEAN DEFAULT FALSE,
  validated_by  UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(kpi_id, period)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.clients       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpis          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_targets   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi_data      ENABLE ROW LEVEL SECURITY;

-- Helper: obtiene el client_id del usuario autenticado
CREATE OR REPLACE FUNCTION public.my_client_id()
RETURNS UUID LANGUAGE SQL SECURITY DEFINER STABLE AS $$
  SELECT client_id FROM public.user_profiles WHERE id = auth.uid();
$$;

-- Helper: chequea si el usuario es super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN LANGUAGE SQL SECURITY DEFINER STABLE AS $$
  SELECT role = 'super_admin' FROM public.user_profiles WHERE id = auth.uid();
$$;

-- ── clients ─────────────────────────────────────────────────
CREATE POLICY "clients: super_admin ve todo"
  ON public.clients FOR SELECT
  USING (public.is_super_admin());

CREATE POLICY "clients: usuario ve su cliente"
  ON public.clients FOR SELECT
  USING (id = public.my_client_id());

-- ── user_profiles ────────────────────────────────────────────
CREATE POLICY "profiles: super_admin ve todo"
  ON public.user_profiles FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "profiles: usuario ve su propio perfil"
  ON public.user_profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles: usuario ve compañeros del mismo cliente"
  ON public.user_profiles FOR SELECT
  USING (client_id = public.my_client_id());

-- ── projects ─────────────────────────────────────────────────
CREATE POLICY "projects: super_admin ve todo"
  ON public.projects FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "projects: usuario ve proyectos de su cliente"
  ON public.projects FOR SELECT
  USING (client_id = public.my_client_id());

-- ── kpis ─────────────────────────────────────────────────────
CREATE POLICY "kpis: super_admin ve todo"
  ON public.kpis FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "kpis: usuario ve kpis de su cliente"
  ON public.kpis FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE client_id = public.my_client_id()
    )
  );

-- ── kpi_targets ───────────────────────────────────────────────
CREATE POLICY "targets: super_admin ve todo"
  ON public.kpi_targets FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "targets: usuario ve targets de su cliente"
  ON public.kpi_targets FOR SELECT
  USING (
    kpi_id IN (
      SELECT k.id FROM public.kpis k
      JOIN public.projects p ON k.project_id = p.id
      WHERE p.client_id = public.my_client_id()
    )
  );

-- ── kpi_data ──────────────────────────────────────────────────
CREATE POLICY "data: super_admin ve todo"
  ON public.kpi_data FOR ALL
  USING (public.is_super_admin());

CREATE POLICY "data: usuario ve datos de su cliente"
  ON public.kpi_data FOR SELECT
  USING (
    kpi_id IN (
      SELECT k.id FROM public.kpis k
      JOIN public.projects p ON k.project_id = p.id
      WHERE p.client_id = public.my_client_id()
    )
  );

CREATE POLICY "data: loader puede insertar en su cliente"
  ON public.kpi_data FOR INSERT
  WITH CHECK (
    kpi_id IN (
      SELECT k.id FROM public.kpis k
      JOIN public.projects p ON k.project_id = p.id
      WHERE p.client_id = public.my_client_id()
    )
  );

-- ============================================================
-- TRIGGER: sincronizar email al crear usuario en auth
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- DEMO DATA
-- ============================================================

-- ── Clientes ─────────────────────────────────────────────────
INSERT INTO public.clients (slug, name, full_name, sector, country, logo, color, accent, plan, status, since) VALUES
  ('enersa',       'ENERSA',        'Empresa Neuquina de Servicios de Ingeniería S.A.',  'Energía Eléctrica', 'Argentina', '⚡', '#f59e0b', '#fbbf24', 'Enterprise',    'active', '2024-01'),
  ('nexus-social', 'Nexus Social',  'Red de Centros de Inclusión Social',                'Inclusión Social',  'Argentina', '🏠', '#6366f1', '#818cf8', 'Professional',  'active', '2024-06'),
  ('aguasarq',     'AguasARQ',      'Administración Regional de Aguas de Quequén',       'Agua y Saneamiento','Argentina', '💧', '#0ea5e9', '#38bdf8', 'Standard',      'active', '2025-01'),
  ('healthplus',   'HealthPlus',    'Red Hospitalaria HealthPlus',                       'Salud',             'Chile',     '🏥', '#10b981', '#34d399', 'Pilot',         'pilot',  '2025-09');

-- ── Proyectos ─────────────────────────────────────────────────
INSERT INTO public.projects (client_id, slug, name, description, icon, status, areas)
SELECT id, 'ctrl-gestion', 'Control de Gestión Operativa',
  'Tableros de indicadores comerciales, operativos y de calidad de servicio eléctrico',
  '📊', 'active', ARRAY['Comercial','Operaciones','Calidad de Servicio','Admin & Finanzas']
FROM public.clients WHERE slug = 'enersa';

INSERT INTO public.projects (client_id, slug, name, description, icon, status, areas)
SELECT id, 'obras', 'Seguimiento de Obras',
  'Gestión de proyectos de infraestructura eléctrica y control de avance físico-financiero',
  '🏗️', 'active', ARRAY['Planificación','Ejecución','Calidad Técnica']
FROM public.clients WHERE slug = 'enersa';

INSERT INTO public.projects (client_id, slug, name, description, icon, status, areas)
SELECT id, 'cis', 'Control de Centros CIS',
  'Indicadores de impacto social, bienestar y operación de centros de inclusión',
  '👥', 'active', ARRAY['Staff','Dispositivo','Comunidad','Autonomía']
FROM public.clients WHERE slug = 'nexus-social';

INSERT INTO public.projects (client_id, slug, name, description, icon, status, areas)
SELECT id, 'calidad-hidrica', 'Calidad del Servicio Hídrico',
  'Continuidad, presión y calidad físico-química del agua distribuida',
  '🔬', 'active', ARRAY['Producción','Distribución','Calidad','Comercial']
FROM public.clients WHERE slug = 'aguasarq';

INSERT INTO public.projects (client_id, slug, name, description, icon, status, areas)
SELECT id, 'kpi-clinico', 'Indicadores Clínicos',
  'Dashboard de KPIs hospitalarios: tiempos de espera, ocupación, readmisiones',
  '📈', 'setup', ARRAY['Urgencias','Internación','Cirugía','Calidad Clínica']
FROM public.clients WHERE slug = 'healthplus';

-- ── KPIs: ENERSA ctrl-gestion ─────────────────────────────────
INSERT INTO public.kpis (project_id, code, name, area, unit, polarity, description, display_order)
SELECT p.id, k.code, k.name, k.area, k.unit, k.polarity, k.desc, k.ord
FROM public.projects p
JOIN public.clients c ON p.client_id = c.id
CROSS JOIN (VALUES
  ('COBRABILIDAD', 'Índice de Cobrabilidad',      'Comercial',          '%',      'higher', 'Porcentaje de facturación cobrada',                           1),
  ('MOROSIDAD',    'Morosidad',                   'Comercial',          '%',      'lower',  'Cartera morosa sobre total facturado',                        2),
  ('NUEVOS_CLI',   'Nuevos Clientes',              'Comercial',          'clientes','higher','Altas de servicio en el período',                            3),
  ('RECLAMOS',     'Reclamos Resueltos',           'Comercial',          '%',      'higher', 'Reclamos cerrados sobre total recibidos',                     4),
  ('DISP_RED',     'Disponibilidad de Red',        'Operaciones',        '%',      'higher', 'Horas disponibles sobre horas totales',                       5),
  ('MTTR',         'MTTR',                         'Operaciones',        'hs',     'lower',  'Tiempo medio de reparación',                                  6),
  ('CUADRILLAS',   'Cuadrillas Activas',           'Operaciones',        '%',      'higher', 'Cuadrillas operativas sobre dotación total',                  7),
  ('OT_EJECUCION', 'Órdenes Ejecutadas',           'Operaciones',        'OT',     'higher', 'Órdenes de trabajo completadas en el período',                8),
  ('SAIDI',        'SAIDI',                        'Calidad de Servicio','hs/usu', 'lower',  'Duración media de interrupciones por usuario',                9),
  ('SAIFI',        'SAIFI',                        'Calidad de Servicio','int/usu','lower',  'Frecuencia media de interrupciones por usuario',              10),
  ('ENS',          'ENS',                          'Calidad de Servicio','MWh',    'lower',  'Energía no suministrada',                                     11),
  ('EJEC_PPTO',    'Ejecución Presupuestal',       'Admin & Finanzas',   '%',      'higher', 'Presupuesto ejecutado sobre aprobado',                        12),
  ('COSTO_OP',     'Costo Operativo',              'Admin & Finanzas',   '$/MWh',  'lower',  'Costo por MWh distribuido',                                   13)
) AS k(code, name, area, unit, polarity, desc, ord)
WHERE c.slug = 'enersa' AND p.slug = 'ctrl-gestion';

-- ── KPIs: Nexus Social CIS ────────────────────────────────────
INSERT INTO public.kpis (project_id, code, name, area, unit, polarity, description, display_order)
SELECT p.id, k.code, k.name, k.area, k.unit, k.polarity, k.desc, k.ord
FROM public.projects p
JOIN public.clients c ON p.client_id = c.id
CROSS JOIN (VALUES
  ('BURNOUT',      'Burnout Index',               'Staff',      'pts', 'lower',  'Índice de desgaste del staff',                    1),
  ('AUSENTISMO',   'Ausentismo',                  'Staff',      '%',   'lower',  'Ausencias sobre días programados',                2),
  ('AUTOEFICACIA', 'Autoeficacia del Staff',      'Staff',      'pts', 'higher', 'Percepción de capacidad para intervenir',         3),
  ('INCIDENTES',   'Incidentes Registrados',      'Dispositivo','casos','lower', 'Conflictos y episodios en el período',            4),
  ('CLIMA',        'Clima de Convivencia',        'Dispositivo','pts', 'higher', 'Percepción de convivencia y seguridad',           5),
  ('CONTINUIDAD',  'Continuidad de Actividades',  'Dispositivo','%',   'higher', 'Actividades realizadas vs planificadas',          6),
  ('PARTICIPACION','Participación Espacios',      'Comunidad',  '%',   'higher', 'Asistencia a espacios del ser',                   7),
  ('PERMANENCIA',  'Permanencia en Dispositivo',  'Comunidad',  '%',   'higher', 'Residentes que permanecen en el período',         8),
  ('RUTINA',       'Adherencia a Rutina',         'Autonomía',  'pts', 'higher', 'Capacidad de sostener rutinas y autocuidado',     9),
  ('NARRATIVA',    'Cambio en Narrativa',         'Autonomía',  'pts', 'higher', 'Evolución del lenguaje de víctima a protagonista',10),
  ('PROSOCIAL',    'Índice Prosocial',            'Autonomía',  'pts', 'higher', 'Conductas de cooperación y convivencia',         11)
) AS k(code, name, area, unit, polarity, desc, ord)
WHERE c.slug = 'nexus-social' AND p.slug = 'cis';

-- ── KPIs: AguasARQ ────────────────────────────────────────────
INSERT INTO public.kpis (project_id, code, name, area, unit, polarity, description, display_order)
SELECT p.id, k.code, k.name, k.area, k.unit, k.polarity, k.desc, k.ord
FROM public.projects p
JOIN public.clients c ON p.client_id = c.id
CROSS JOIN (VALUES
  ('CAUDAL',       'Caudal Producido',            'Producción',   '%',   'higher', 'Caudal real sobre caudal nominal de planta',      1),
  ('EFIC_BOMBEO',  'Eficiencia de Bombeo',        'Producción',   '%',   'higher', 'Eficiencia energética del sistema de bombeo',     2),
  ('PRESION',      'Presión de Servicio',         'Distribución', '%',   'higher', 'Usuarios con presión dentro de norma',            3),
  ('PERDIDAS',     'Pérdidas de Red',             'Distribución', '%',   'lower',  'Agua no contabilizada sobre producción total',    4),
  ('ENRESS',       'Cumplimiento ENRESS',         'Calidad',      '%',   'higher', 'Parámetros físico-químicos dentro de norma',      5),
  ('TURBIEDAD',    'Turbiedad',                   'Calidad',      'NTU', 'lower',  'Unidades nefelométricas de turbiedad',            6),
  ('COBR_AGUA',    'Cobrabilidad',                'Comercial',    '%',   'higher', 'Facturación cobrada sobre emitida',               7),
  ('MEDIDORES',    'Medidores Activos',           'Comercial',    '%',   'higher', 'Medidores funcionando sobre parque total',        8)
) AS k(code, name, area, unit, polarity, desc, ord)
WHERE c.slug = 'aguasarq' AND p.slug = 'calidad-hidrica';

-- ── Targets (metas demo) ──────────────────────────────────────
-- ENERSA - períodos 2025-09 a 2026-02
INSERT INTO public.kpi_targets (kpi_id, period, target, baseline)
SELECT k.id,
       t.period,
       CASE k.code
         WHEN 'COBRABILIDAD' THEN 92  WHEN 'MOROSIDAD'    THEN 15
         WHEN 'NUEVOS_CLI'   THEN 120 WHEN 'RECLAMOS'     THEN 90
         WHEN 'DISP_RED'     THEN 97  WHEN 'MTTR'         THEN 4
         WHEN 'CUADRILLAS'   THEN 90  WHEN 'OT_EJECUCION' THEN 280
         WHEN 'SAIDI'        THEN 10  WHEN 'SAIFI'        THEN 3.5
         WHEN 'ENS'          THEN 25  WHEN 'EJEC_PPTO'    THEN 85
         WHEN 'COSTO_OP'     THEN 110 ELSE 80
       END,
       CASE k.code
         WHEN 'COBRABILIDAD' THEN 80  WHEN 'MOROSIDAD'    THEN 22
         WHEN 'NUEVOS_CLI'   THEN 90  WHEN 'RECLAMOS'     THEN 75
         WHEN 'DISP_RED'     THEN 94  WHEN 'MTTR'         THEN 6
         WHEN 'CUADRILLAS'   THEN 82  WHEN 'OT_EJECUCION' THEN 210
         WHEN 'SAIDI'        THEN 15  WHEN 'SAIFI'        THEN 5.5
         WHEN 'ENS'          THEN 40  WHEN 'EJEC_PPTO'    THEN 70
         WHEN 'COSTO_OP'     THEN 130 ELSE 60
       END
FROM public.kpis k
JOIN public.projects p ON k.project_id = p.id
JOIN public.clients c ON p.client_id = c.id
CROSS JOIN (VALUES ('2025-09'),('2025-10'),('2025-11'),('2025-12'),('2026-01'),('2026-02')) AS t(period)
WHERE c.slug = 'enersa' AND p.slug = 'ctrl-gestion';

-- ── Datos históricos demo: ENERSA ─────────────────────────────
INSERT INTO public.kpi_data (kpi_id, period, value, source, validated)
SELECT k.id, t.period, t.val, 'demo', TRUE
FROM public.kpis k
JOIN public.projects p ON k.project_id = p.id
JOIN public.clients c ON p.client_id = c.id
CROSS JOIN (
  SELECT period, code, val FROM (VALUES
    ('2025-09','COBRABILIDAD',81), ('2025-10','COBRABILIDAD',82), ('2025-11','COBRABILIDAD',83),
    ('2025-12','COBRABILIDAD',85), ('2026-01','COBRABILIDAD',86), ('2026-02','COBRABILIDAD',84),
    ('2025-09','MOROSIDAD',21),    ('2025-10','MOROSIDAD',20),    ('2025-11','MOROSIDAD',20),
    ('2025-12','MOROSIDAD',19),    ('2026-01','MOROSIDAD',18),    ('2026-02','MOROSIDAD',18),
    ('2025-09','NUEVOS_CLI',98),   ('2025-10','NUEVOS_CLI',110),  ('2025-11','NUEVOS_CLI',115),
    ('2025-12','NUEVOS_CLI',125),  ('2026-01','NUEVOS_CLI',138),  ('2026-02','NUEVOS_CLI',142),
    ('2025-09','RECLAMOS',80),     ('2025-10','RECLAMOS',82),     ('2025-11','RECLAMOS',84),
    ('2025-12','RECLAMOS',85),     ('2026-01','RECLAMOS',88),     ('2026-02','RECLAMOS',87),
    ('2025-09','DISP_RED',96.1),   ('2025-10','DISP_RED',96.8),   ('2025-11','DISP_RED',97.5),
    ('2025-12','DISP_RED',97.9),   ('2026-01','DISP_RED',98.1),   ('2026-02','DISP_RED',98.2),
    ('2025-09','MTTR',5.2),        ('2025-10','MTTR',4.9),        ('2025-11','MTTR',4.5),
    ('2025-12','MTTR',4.1),        ('2026-01','MTTR',3.8),        ('2026-02','MTTR',3.2),
    ('2025-09','CUADRILLAS',84),   ('2025-10','CUADRILLAS',86),   ('2025-11','CUADRILLAS',88),
    ('2025-12','CUADRILLAS',90),   ('2026-01','CUADRILLAS',93),   ('2026-02','CUADRILLAS',94),
    ('2025-09','OT_EJECUCION',230),('2025-10','OT_EJECUCION',255),('2025-11','OT_EJECUCION',270),
    ('2025-12','OT_EJECUCION',285),('2026-01','OT_EJECUCION',300),('2026-02','OT_EJECUCION',312),
    ('2025-09','SAIDI',14.8),      ('2025-10','SAIDI',14.1),      ('2025-11','SAIDI',13.5),
    ('2025-12','SAIDI',13.0),      ('2026-01','SAIDI',12.8),      ('2026-02','SAIDI',12.4),
    ('2025-09','SAIFI',5.2),       ('2025-10','SAIFI',4.9),       ('2025-11','SAIFI',4.6),
    ('2025-12','SAIFI',4.4),       ('2026-01','SAIFI',4.2),       ('2026-02','SAIFI',4.1),
    ('2025-09','ENS',38),          ('2025-10','ENS',35),          ('2025-11','ENS',33),
    ('2025-12','ENS',31),          ('2026-01','ENS',29),          ('2026-02','ENS',28.4),
    ('2025-09','EJEC_PPTO',78),    ('2025-10','EJEC_PPTO',81),    ('2025-11','EJEC_PPTO',84),
    ('2025-12','EJEC_PPTO',88),    ('2026-01','EJEC_PPTO',90),    ('2026-02','EJEC_PPTO',91),
    ('2025-09','COSTO_OP',125),    ('2025-10','COSTO_OP',121),    ('2025-11','COSTO_OP',118),
    ('2025-12','COSTO_OP',115),    ('2026-01','COSTO_OP',108),    ('2026-02','COSTO_OP',102)
  ) AS v(period, code, val)
) AS t ON k.code = t.code
WHERE c.slug = 'enersa' AND p.slug = 'ctrl-gestion';

-- ── Datos históricos demo: Nexus Social ──────────────────────
INSERT INTO public.kpi_data (kpi_id, period, value, source, validated)
SELECT k.id, t.period, t.val, 'demo', TRUE
FROM public.kpis k
JOIN public.projects p ON k.project_id = p.id
JOIN public.clients c ON p.client_id = c.id
CROSS JOIN (
  SELECT period, code, val FROM (VALUES
    ('2026-01','BURNOUT',68),     ('2026-02','BURNOUT',66),     ('2026-03','BURNOUT',64),
    ('2026-01','AUSENTISMO',14),  ('2026-02','AUSENTISMO',13),  ('2026-03','AUSENTISMO',12),
    ('2026-01','AUTOEFICACIA',68),('2026-02','AUTOEFICACIA',70),('2026-03','AUTOEFICACIA',72),
    ('2026-01','INCIDENTES',22),  ('2026-02','INCIDENTES',20),  ('2026-03','INCIDENTES',18),
    ('2026-01','CLIMA',62),       ('2026-02','CLIMA',65),       ('2026-03','CLIMA',68),
    ('2026-01','CONTINUIDAD',76), ('2026-02','CONTINUIDAD',79), ('2026-03','CONTINUIDAD',82),
    ('2026-01','PARTICIPACION',52),('2026-02','PARTICIPACION',55),('2026-03','PARTICIPACION',58),
    ('2026-01','PERMANENCIA',75), ('2026-02','PERMANENCIA',77), ('2026-03','PERMANENCIA',79),
    ('2026-01','RUTINA',58),      ('2026-02','RUTINA',60),      ('2026-03','RUTINA',62),
    ('2026-01','NARRATIVA',52),   ('2026-02','NARRATIVA',53),   ('2026-03','NARRATIVA',55),
    ('2026-01','PROSOCIAL',60),   ('2026-02','PROSOCIAL',61),   ('2026-03','PROSOCIAL',63)
  ) AS v(period, code, val)
) AS t ON k.code = t.code
WHERE c.slug = 'nexus-social' AND p.slug = 'cis';

-- ── Datos históricos demo: AguasARQ ──────────────────────────
INSERT INTO public.kpi_data (kpi_id, period, value, source, validated)
SELECT k.id, t.period, t.val, 'demo', TRUE
FROM public.kpis k
JOIN public.projects p ON k.project_id = p.id
JOIN public.clients c ON p.client_id = c.id
CROSS JOIN (
  SELECT period, code, val FROM (VALUES
    ('2025-09','CAUDAL',94),      ('2025-10','CAUDAL',96),      ('2025-11','CAUDAL',97),
    ('2025-12','CAUDAL',97),      ('2026-01','CAUDAL',98),      ('2026-02','CAUDAL',98),
    ('2025-09','EFIC_BOMBEO',82), ('2025-10','EFIC_BOMBEO',84), ('2025-11','EFIC_BOMBEO',85),
    ('2025-12','EFIC_BOMBEO',86), ('2026-01','EFIC_BOMBEO',87), ('2026-02','EFIC_BOMBEO',87),
    ('2025-09','PRESION',88),     ('2025-10','PRESION',89),     ('2025-11','PRESION',90),
    ('2025-12','PRESION',91),     ('2026-01','PRESION',92),     ('2026-02','PRESION',92),
    ('2025-09','PERDIDAS',18),    ('2025-10','PERDIDAS',17),    ('2025-11','PERDIDAS',16),
    ('2025-12','PERDIDAS',15),    ('2026-01','PERDIDAS',14),    ('2026-02','PERDIDAS',14),
    ('2025-09','ENRESS',98.1),    ('2025-10','ENRESS',98.5),    ('2025-11','ENRESS',98.8),
    ('2025-12','ENRESS',99.0),    ('2026-01','ENRESS',99.1),    ('2026-02','ENRESS',99.1),
    ('2025-09','TURBIEDAD',0.6),  ('2025-10','TURBIEDAD',0.5),  ('2025-11','TURBIEDAD',0.4),
    ('2025-12','TURBIEDAD',0.35), ('2026-01','TURBIEDAD',0.32), ('2026-02','TURBIEDAD',0.30),
    ('2025-09','COBR_AGUA',82),   ('2025-10','COBR_AGUA',83),   ('2025-11','COBR_AGUA',84),
    ('2025-12','COBR_AGUA',85),   ('2026-01','COBR_AGUA',86),   ('2026-02','COBR_AGUA',86),
    ('2025-09','MEDIDORES',87),   ('2025-10','MEDIDORES',88),   ('2025-11','MEDIDORES',89),
    ('2025-12','MEDIDORES',90),   ('2026-01','MEDIDORES',91),   ('2026-02','MEDIDORES',91)
  ) AS v(period, code, val)
) AS t ON k.code = t.code
WHERE c.slug = 'aguasarq' AND p.slug = 'calidad-hidrica';

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
SELECT 'clients'     AS tabla, COUNT(*) FROM public.clients      UNION ALL
SELECT 'projects',             COUNT(*) FROM public.projects     UNION ALL
SELECT 'kpis',                 COUNT(*) FROM public.kpis         UNION ALL
SELECT 'targets',              COUNT(*) FROM public.kpi_targets  UNION ALL
SELECT 'data_points',          COUNT(*) FROM public.kpi_data;
