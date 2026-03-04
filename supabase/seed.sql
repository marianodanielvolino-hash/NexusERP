-- ==========================================
-- NEXUS SCG: Seed de Datos Base
-- Ejecutar en SQL Editor de Supabase
-- ==========================================

-- 1. Insertar Tenant de prueba (ENERSA)
INSERT INTO public.tenants (tenant_id, nombre, dominio, variables_css, plan)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- UUID Fijo para prueba
  'ENERSA - Energía de Entre Ríos',
  'enersa.com.ar',
  '{"primary": "#0066CC", "secondary": "#F5A623"}',
  'enterprise'
) ON CONFLICT (tenant_id) DO NOTHING;

-- 2. Insertar Áreas base
INSERT INTO public.areas (area_id, tenant_id, nombre, responsable)
VALUES 
  ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Comercial', 'Laura Cantero'),
  ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Calidad de Servicio', 'Martín Ferreyra')
ON CONFLICT (area_id) DO NOTHING;

-- 3. Crear Usuarios en Supabase Auth (Demostración Teórica)
-- NOTA IMPORTANTE: Los usuarios de Auth reales se deben crear desde la API o el Panel de Supabase 
-- (Sección Authentication -> Add User) porque las contraseñas deben cifrarse con bcrypt.

-- Instrucciones para el usuario:
-- 1. Ve a tu proyecto Supabase > Authentication > Users > "Add user"
-- 2. Crea los siguientes usuarios:
--    - admin@enersa.com.ar (Password: Admin123!)
--    - ejecutivo@enersa.com.ar (Password: Ejec123!)
--    - gerente.comercial@enersa.com.ar (Password: GCom123!)
-- 3. Una vez creados, deberías actualizar su `raw_app_meta_data` mediante SQL o API para inyectar su Rol y Tenant:
-- 
-- UPDATE auth.users 
-- SET raw_app_meta_data = jsonb_build_object(
--    'tenant_id', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
--    'rol', 'ejecutivo'
-- ) 
-- WHERE email = 'admin@enersa.com.ar';

-- 4. Definir Indicadores Base
INSERT INTO public.kpi_definitions (kpi_id, tenant_id, area_id, nombre, metodo_calculo, meta, meta_tipo, umbral_alerta)
VALUES 
  ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Índice de Cobrabilidad', 'Porcentaje de cobro sobre emisión', 92.00, 'Mayor es mejor', 85.00),
  ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'SAIDI - Interrupciones', 'Duración promedio horas/usuario', 10.00, 'Menor es mejor', 12.00)
ON CONFLICT (kpi_id) DO NOTHING;
