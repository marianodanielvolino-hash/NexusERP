'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Obtener Resumen del Tablero Operativo
 * Dado que RLS ya respeta el área_id si el Rol es Operativo, o todo el tenant si es Ejecutivo,
 * simplemente consultamos y el DB Driver filtra mágicamente.
 */
export async function getDashboardSummary(periodId: string) {
    const supabase = await createClient()

    // La policy RLS `KPI Data: Select` filtrará según `tenant_id` y `area_id` que le corresponda.
    const { data, error } = await supabase
        .from('kpi_data')
        .select(`
      entry_id,
      valor,
      estado_flujo,
      observacion,
      kpi_definitions (
        kpi_id,
        nombre,
        meta,
        umbral_alerta
      ),
      areas (nombre)
    `)
        .eq('period_id', periodId)

    if (error) throw new Error(`Error recuperando el tablero: ${error.message}`)

    // Procesamos para retornar un reporte estructurado
    const kpisTotales = data.length
    const validados = data.filter(d => d.estado_flujo === 'Validated').length
    const enProgreso = data.filter(d => d.estado_flujo === 'Draft' || d.estado_flujo === 'Submitted').length

    return {
        kpisTotales,
        validados,
        enProgreso,
        detalles: data
    }
}

/**
 * Generar Reporte EPRE / ENRE JSON Data 
 * Accesible solo por el Rol Ejecutivo (la Action debe validar que user sea Ejecutivo)
 */
export async function generateRegulatoryReport(periodId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    // Obtener rol del usuario actual
    const { data: roleData, error: roleError } = await supabase
        .rpc('get_current_role')
        .single()

    if (roleError || roleData !== 'Ejecutivo') {
        throw new Error('Solo un perfil Ejecutivo puede generar el reporte regulatorio EPRE/ENRE')
    }

    // Si pasa RLS y RBAC Role-check, traemos todo el tenant_id en ese periodo
    const { data, error } = await supabase
        .from('kpi_data')
        .select(`
      valor,
      kpi_definitions (nombre, fuente, metodo_calculo)
    `)
        .eq('period_id', periodId)
        .eq('estado_flujo', 'Validated') // REPORT RULE: Solo datos validados se informan

    if (error) throw new Error(`Error generando reporte EPRE: ${error.message}`)

    // Generamos evento Audit para generación de PDF/Report
    await supabase.from('audit_logs').insert({
        user_id: user.id,
        tenant_id: (await supabase.rpc('get_current_tenant')).data,
        entidad: 'reporte',
        entidad_id: periodId,
        accion: 'export',
        detalles: { format: 'EPRE_ENRE_JSON' }
    })

    // En producción real armaríamos el CSV / PDF para export, pero aquí retornamos data
    return { reporte: data, generacion: new Date() }
}
