// app/api/assistant/route.ts
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key', // This expects ANTHROPIC_API_KEY in .env.local
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();

        // Auth Check: Validar sesión JWT
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        // Comentar validación estricta para el entorno de maquetación/Demo
        /*
        if (authError || !user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Extraer tenant_id del JWT o metadata
        const tenantId = user.app_metadata?.tenant_id;
        */

        const body = await req.json();
        const { prompt, dashboardData } = body;

        // En un entorno de Producción REAL, aquí haríamos fetch a la BD SQL para asegurar  
        // que dashboardData provenga directamente del Backend usando el tenant_id autenticado.
        // Ej: const { data: kpis } = await supabase.from('kpi_data').select('*').eq('tenant_id', tenantId);

        // Prompt Base (Configuración Sistema RAG para Nexus SCG)
        const systemPrompt = `
      Eres el Asistente de Inteligencia Artificial para el "Sistema de Control de Gestión" (Nexus SCG).
      Tu rol es procesar los datos estructurados del tablero y responder consultas del usuario en lenguaje natural.
      
      Reglas Estrictas:
      1. Solo tienes acceso y debes evaluar los datos provistos en el contexto de "dashboardData". No expongas under-the-hood SQL, IDs o datos de otros tenants.
      2. Brinda una síntesis ejecutiva. Ve directo al punto.
      3. Destaca tendencias: KPIs con semáforos 'critico' o 'alerta'.
      4. Si el usuario te pide un resumen para presentarlo al directorio, estructúralo adecuadamente (Puntos clave, Áreas críticas y Recomendación táctica).

      Contexto Actual del Tablero (Datos Reales):
      ${JSON.stringify(dashboardData, null, 2)}
    `;

        // Consulta a Claude 3.5 Sonnet
        const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1000,
            temperature: 0.2,
            system: systemPrompt,
            messages: [
                { role: 'user', content: prompt }
            ]
        });

        const botResponse = response.content[0].type === 'text' ? response.content[0].text : "No response generated";

        return NextResponse.json({
            success: true,
            answer: botResponse
        });

    } catch (error: any) {
        console.error('AI Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal AI Motor Error' },
            { status: 500 }
        );
    }
}
