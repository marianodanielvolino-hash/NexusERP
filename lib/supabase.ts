import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'tu-anon-key-aqui';

// Inicialización del cliente Supabase
// Aquí se implementará la política de Row-Level Security (RLS) automáticamente
// para cada tenant si gestionamos la autenticación de usuarios.
export const supabase = createClient(supabaseUrl, supabaseKey);
