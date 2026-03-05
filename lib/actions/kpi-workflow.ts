'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Enviar KPI a validación (Operador/Referente) -> estado a 'Submitted'
 */
export async function submitKpiData(entryId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    // Actualizar estado de KPI
    const { data, error } = await supabase
        .from('kpi_data')
        .update({ estado_flujo: 'Submitted' })
        .eq('entry_id', entryId)
        .in('estado_flujo', ['Draft'])
        .select()
        .single()

    if (error) throw new Error(`Error enviando KPI: ${error.message}`)

    // Crear Audit Log
    await supabase.from('audit_logs').insert({
        user_id: user.id,
        tenant_id: data.tenant_id,
        entidad: 'kpi_data',
        entidad_id: entryId,
        accion: 'submit',
        detalles: { previo: 'Draft', nuevo: 'Submitted' }
    })

    revalidatePath('/dashboard')
    revalidatePath('/carga')
    return data
}

/**
 * Aprobar KPI (Gerente/Ejecutivo) -> estado a 'Validated'
 */
export async function approveKpiData(entryId: string, comentario?: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    const { data, error } = await supabase
        .from('kpi_data')
        .update({ estado_flujo: 'Validated' })
        .eq('entry_id', entryId)
        .eq('estado_flujo', 'Submitted') // Solo se aprueban los submitted
        .select()
        .single()

    if (error) throw new Error(`Error aprobando KPI: ${error.message}`)

    await supabase.from('audit_logs').insert({
        user_id: user.id,
        tenant_id: data.tenant_id,
        entidad: 'kpi_data',
        entidad_id: entryId,
        accion: 'approve',
        comentario: comentario || null,
        detalles: { previo: 'Submitted', nuevo: 'Validated' }
    })

    revalidatePath('/dashboard')
    return data
}

/**
 * Rechazar KPI (Gerente/Ejecutivo) -> se devuelve a 'Draft'
 */
export async function rejectKpiData(entryId: string, comentario: string) {
    if (!comentario || comentario.trim().length === 0) {
        throw new Error('El comentario es obligatorio para rechazar un KPI')
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    const { data, error } = await supabase
        .from('kpi_data')
        .update({ estado_flujo: 'Draft' })
        .eq('entry_id', entryId)
        .eq('estado_flujo', 'Submitted')
        .select()
        .single()

    if (error) throw new Error(`Error rechazando KPI: ${error.message}`)

    await supabase.from('audit_logs').insert({
        user_id: user.id,
        tenant_id: data.tenant_id,
        entidad: 'kpi_data',
        entidad_id: entryId,
        accion: 'reject',
        comentario: comentario,
        detalles: { previo: 'Submitted', nuevo: 'Draft' }
    })

    revalidatePath('/dashboard')
    return data
}

/**
 * Reabrir KPI Validado (Gerente/Ejecutivo ante pedido del Referente) -> 'Draft'
 */
export async function reopenKpiData(entryId: string, comentario: string) {
    if (!comentario || comentario.trim().length === 0) {
        throw new Error('El comentario es obligatorio para reabrir un KPI')
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    const { data, error } = await supabase
        .from('kpi_data')
        .update({ estado_flujo: 'Draft' })
        .eq('entry_id', entryId)
        .eq('estado_flujo', 'Validated')
        .select()
        .single()

    if (error) throw new Error(`Error reabriendo KPI: ${error.message}`)

    await supabase.from('audit_logs').insert({
        user_id: user.id,
        tenant_id: data.tenant_id,
        entidad: 'kpi_data',
        entidad_id: entryId,
        accion: 'reopen',
        comentario: comentario,
        detalles: { previo: 'Validated', nuevo: 'Draft' }
    })

    revalidatePath('/dashboard')
    return data
}
