import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
})

/**
 * Iron Rule #8: IA solo sobre datos existentes. RAG Restringido.
 */
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { query, periodId } = await req.json()

        if (!query || !periodId) {
            return NextResponse.json({ error: 'Faltan parámetros: query y periodId' }, { status: 400 })
        }

        // 1. Ejecutar Retrieval (RAG): Buscar los KPIs limitados por el RLS del usuario
        const { data: contextKpis, error: dbError } = await supabase
            .from('kpi_data')
            .select('valor, observacion, estado_flujo, kpi_definitions(nombre, meta)')
            .eq('period_id', periodId)

        if (dbError) throw new Error('Error recuperando contexto de la BD')

        const contextDataStr = JSON.stringify(contextKpis)

        // 2. Definir Guardrails estrictos en el System Prompt
        const systemPrompt = `
      Eres el Asistente Analítico de NexusERP.
      TU REGLA PRINCIPAL ES: SOLO PUEDES RESPONDER BASADO EN EL CONTEXTO DE DATOS (KPIs) PROVISTO A CONTINUACIÓN.
      NO DEBES inventar ni alucinar valores, nombres de áreas o KPIs que no existan en el contexto.
      Si el usuario pregunta algo que no está en el contexto, debes responder: "No tengo información en mis registros actuales para responder a esa pregunta."
      
      CONTEXTO DE DATOS RECUPERADO (RAG):
      ${contextDataStr}
    `

        // 3. Consultar la API de LLM (Claude)
        const completion = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1000,
            temperature: 0.1, // Baja temperatura para minimizar alucinaciones
            system: systemPrompt,
            messages: [
                { role: 'user', content: query }
            ]
        })

        const responseText = completion.content[0].type === 'text' ? completion.content[0].text : '';

        return NextResponse.json({ response: responseText }, { status: 200 })

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
