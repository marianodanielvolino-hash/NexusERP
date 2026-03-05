import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * IRON RULE #6: Idempotencia en API Push
 * Un Job / ID de transacción único (transaction_id) evitará que mutemos dos veces.
 */
export async function POST(req: NextRequest) {
    // Para integración Backend-to-Backend usamos Service Role.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'fake-key'
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    try {
        const json = await req.json()
        const { tenant_id, transaction_id, data } = json

        if (!tenant_id || !transaction_id || !data) {
            return NextResponse.json({ error: 'Faltan parámetros: tenant_id, transaction_id o data' }, { status: 400 })
        }

        // 1. Validar Idempotencia. ¿Este job existió ya con éxito?
        const { data: existingLog } = await supabase
            .from('integration_logs')
            .select('estado')
            .eq('job_id', transaction_id)
            .eq('tenant_id', tenant_id)
            .single()

        if (existingLog && existingLog.estado === 'success') {
            // Retornar 200 sin insertar, para que el external caller lo de por completado idempotentemente.
            return NextResponse.json({ message: 'Idempotency key successfully processed previously. Skipped.', status: 'skipped' }, { status: 200 })
        }

        // 2. Insertar Pending Integration Log SI no existe
        if (!existingLog) {
            // Fuerza la llave primaria a ser el transaction_id asegurando 1 solo registro (asumiendo que la tabla lo permite y la PK cambia o se sobreescribe)
            // Como el UUID auto-generate rige por default, aquí forzaremos UUID proporcionado desde afuera para `transaction_id`.
            await supabase.from('integration_logs').insert({
                job_id: transaction_id,
                tenant_id,
                tipo: 'push',
                estado: 'pending'
            })
        }

        // 3. Procesar Batch Data de Ingesta y Forzar como Draft
        for (const item of data) {
            const { kpi_id, period_id, area_id, valor } = item

            const { error: upsertError } = await supabase.from('kpi_data').upsert({
                tenant_id,
                kpi_id,
                period_id,
                area_id,
                valor,
                estado_flujo: 'Draft',
                observacion: 'Api Push Ingestion'
            }, { onConflict: 'kpi_id, period_id' }) // Usando el constraint Único de la DB.

            if (upsertError) throw new Error(upsertError.message)
        }

        // 4. Marcar completo idempotente
        await supabase.from('integration_logs').update({
            estado: 'success',
            detalles: { filas_procesadas: data.length }
        }).eq('job_id', transaction_id)

        return NextResponse.json({ message: 'Ingesta Batch completada', rows: data.length }, { status: 200 })

    } catch (err: any) {
        // Audit failure
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
