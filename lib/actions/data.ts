'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Interfaz para la tabla de Carga
export async function getKpisForCarga(periodId?: string) {
    try {
        const supabase = await createClient();

        let query = supabase
            .from('kpi_data')
            .select(`
                entry_id,
                kpi_id,
                estado_flujo,
                valor,
                observacion,
                kpi_definitions (
                    nombre,
                    meta,
                    umbral_alerta
                ),
                updated_at
            `);

        if (periodId) {
            query = query.eq('period_id', periodId);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching KPIs for carga:", error);
            return [];
        }

        // Transformar para la tabla UI
        return data.map((d: any) => ({
            kpiId: d.kpi_id,
            name: d.kpi_definitions?.nombre || "N/A",
            target: d.kpi_definitions?.meta || "N/A",
            value: d.valor !== null ? String(d.valor) : "",
            status: "ok", // simplificado
            state: d.estado_flujo ? d.estado_flujo.toLowerCase() : "draft",
            lastUpdatedAt: d.updated_at ? new Date(d.updated_at).toLocaleDateString() : "-",
            entryId: d.entry_id
        }));
    } catch (err) {
        console.error("Exception in getKpisForCarga:", err);
        return [];
    }
}

// Acción para actualizar o cargar el valor de un KPI (Operador)
export async function saveKpiValue(entryId: string, valor: number, observacion: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No autorizado');

    const { data, error } = await supabase
        .from('kpi_data')
        .update({
            valor: valor,
            observacion: observacion,
            updated_at: new Date().toISOString()
        })
        .eq('entry_id', entryId)
        .in('estado_flujo', ['Draft', 'Rejected']) // Solo puede guardar en borrador o si fue rechazado
        .select()
        .single();

    if (error) throw new Error(`Error guardando valor: ${error.message}`);

    // Audit Log
    await supabase.from('audit_logs').insert({
        user_id: user.id,
        tenant_id: data.tenant_id,
        entidad: 'kpi_data',
        entidad_id: entryId,
        accion: 'update_value',
        detalles: { nuevo_valor: valor, observacion }
    });

    revalidatePath('/carga');
    revalidatePath('/dashboard');
    return data;
}

export async function getKpisForValidacion(periodId?: string) {
    try {
        const supabase = await createClient();

        let query = supabase
            .from('kpi_data')
            .select(`
                entry_id,
                kpi_id,
                estado_flujo,
                valor,
                updated_at,
                kpi_definitions (
                    nombre,
                    meta
                ),
                areas (
                    nombre
                ),
                users (
                    name
                )
            `)
            .eq('estado_flujo', 'Submitted');

        if (periodId) {
            query = query.eq('period_id', periodId);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching validaciones:", error);
            return [];
        }

        return data.map((d: any) => ({
            taskId: d.entry_id,
            kpiId: d.kpi_id,
            kpiName: d.kpi_definitions?.nombre || "N/A",
            areaName: d.areas?.nombre || "Area Desconocida",
            value: d.valor !== null ? String(d.valor) : "",
            target: d.kpi_definitions?.meta || "N/A",
            status: "alert", // Simplified
            dateSubmitted: d.updated_at ? new Date(d.updated_at).toLocaleDateString() : "-",
            submittedBy: d.users?.name || "Operador"
        }));
    } catch (err) {
        console.error("Exception validaciones:", err);
        return [];
    }
}

export async function getKpiDefinitions() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('kpi_definitions')
            .select(`
                kpi_id,
                nombre,
                owner_area_id,
                frecuencia,
                meta,
                areas (
                    nombre
                )
            `);

        if (error) {
            console.error("Error fetching kpi definitions:", error);
            return [];
        }

        return data.map((d: any) => ({
            id: d.kpi_id,
            name: d.nombre,
            area: d.areas?.nombre || d.owner_area_id || "N/A",
            frequency: d.frecuencia || "Mensual",
            target: d.meta || "N/A",
            value: "-", // No aplica en definición pura, a menos que sea dashboard
            status: "ok"
        }));
    } catch (err) {
        console.error("Exception kpis:", err);
        return [];
    }
}

export async function getPeriodos() {
    return [
        { id: "P-2026-03", name: "Marzo 2026", status: "Abierto", progress: "45%" },
        { id: "P-2026-02", name: "Febrero 2026", status: "Cerrado", progress: "100%" },
        { id: "P-2026-01", name: "Enero 2026", status: "Cerrado", progress: "100%" },
    ];
}
