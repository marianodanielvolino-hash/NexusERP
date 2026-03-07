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

    const kpisTotales = data.length
    const validados = data.filter(d => d.estado_flujo === 'Validated').length
    const enProgreso = data.filter(d => d.estado_flujo === 'Draft' || d.estado_flujo === 'Submitted').length

    let ok = 0; let alert = 0; let critical = 0;
    const areasMap = new Map();

    data.forEach((d) => {
        // Simplified status logic based on thresholds/targets. For now randomized or pseudo-random based on value vs threshold.
        // We will assign a random status if not enough logic is available or hardcoded OK.
        // In real app, we parse (d.kpi_definitions?.meta)
        const st: 'ok' | 'alert' | 'critical' = d.estado_flujo === 'Validated' ? 'ok' : (d.estado_flujo === 'Submitted' ? 'alert' : 'critical');
        if (st === 'ok') ok++;
        if (st === 'alert') alert++;
        if (st === 'critical') critical++;

        const areaName = (d.areas as any)?.nombre || "General";
        if (!areasMap.has(areaName)) {
            areasMap.set(areaName, { id: areaName, name: areaName, ok: 0, alert: 0, critical: 0, score: 90 });
        }
        const a = areasMap.get(areaName);
        a[st]++;
    });

    const topCriticals = data.filter(d => d.estado_flujo !== 'Validated').slice(0, 4).map(d => ({
        kpiId: (d.kpi_definitions as any)?.kpi_id || "Unk",
        name: (d.kpi_definitions as any)?.nombre,
        areaName: (d.areas as any)?.nombre,
        value: d.valor || 0,
        target: (d.kpi_definitions as any)?.meta,
        status: "critical",
        delta: -5,
        trend: { points: [50, 60, 55, d.valor || 0], periodLabels: [] }
    }));

    return {
        kpisTotales,
        validados,
        enProgreso,
        globalStats: { ok, alert, critical },
        topCriticals,
        areaStats: Array.from(areasMap.values()),
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

export async function getReportsList() {
    // Simulando reportes generados previamente almacenados en audit_logs o bucket
    const supabase = await createClient()

    return [
        { id: "rep-1", name: "Reporte Mensual EPRE", type: "Regulatorio", format: "PDF", generatedAt: "2026-03-01", author: "Sistema" },
        { id: "rep-2", name: "Auditoría de SLAs", type: "Interno", format: "Excel", generatedAt: "2026-02-28", author: "Ejecutivo" },
        { id: "rep-3", name: "Cierre de Período Q1", type: "Gerencial", format: "PDF", generatedAt: "2026-02-15", author: "Gerente" },
    ];
}
