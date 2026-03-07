'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 0. Fetch Aggregated Hub Stats
export async function getHubStats() {
    try {
        const supabase = await createClient();
        const { count: clients } = await supabase.from('tenants').select('*', { count: 'exact', head: true });
        const { count: projects } = await supabase.from('areas').select('*', { count: 'exact', head: true });
        const { count: kpis } = await supabase.from('kpi_definitions').select('*', { count: 'exact', head: true });
        return {
            totalClients: clients || 0,
            totalProjects: projects || 0,
            totalKPIs: kpis || 0,
            avgHealth: 85 // Mocked avg health
        };
    } catch {
        return { totalClients: 0, totalProjects: 0, totalKPIs: 0, avgHealth: 0 };
    }
}

// 1. Fetch Tenants (Clients)
export async function getNexusClients() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.from('tenants').select('*').order('created_at', { ascending: true });
        if (error) throw error;

        return data.map((t: any) => ({
            id: t.tenant_id,
            name: t.nombre,
            fullName: t.nombre,
            sector: "Industria", // Mocked for now, not in DB
            country: "Global",
            logo: t.nombre.substring(0, 1).toUpperCase(),
            color: t.variables_css?.primary || "#10b981",
            accent: t.variables_css?.secondary || "#34d399",
            status: "active",
            plan: t.plan,
            since: new Date(t.created_at).getFullYear().toString(),
            users: 1,
        }));
    } catch (err) {
        console.error("Error fetching nexus clients:", err);
        return [];
    }
}

// 2. Fetch Areas (Mapped as Projects in UI)
export async function getNexusProjects(tenantId: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.from('areas').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: true });
        if (error) throw error;

        return data.map((a: any) => ({
            id: a.area_id,
            name: a.nombre,
            description: "Tablero operativo de " + a.nombre,
            areas: ["General"], // UI uses this to map KPI groups
            kpis: 0,
            periods: 0,
            status: a.estado === 'activa' ? 'active' : 'setup',
            lastUpdate: new Date(a.created_at).toISOString().split('T')[0],
            health: 80,
            icon: "📊"
        }));
    } catch (err) {
        console.error("Error fetching nexus projects:", err);
        return [];
    }
}

// 3. Fetch KPIs for a specific Project (Area)
export async function getNexusKPIs(projectId: string) {
    try {
        const supabase = await createClient();
        // Fetch kpi_definitions for this area
        const { data: defs, error: defsError } = await supabase.from('kpi_definitions').select('*').eq('area_id', projectId);
        if (defsError) throw defsError;

        // Fetch latest data for these KPIs (simulated latest data)
        const { data: values, error: valuesError } = await supabase.from('kpi_data').select('*').eq('area_id', projectId);
        if (valuesError) throw valuesError;

        const indicators = defs.map((d: any) => {
            // Find related data
            const valData = values.find((v: any) => v.kpi_id === d.kpi_id);
            const val = valData ? Number(valData.valor) : 0;
            const target = Number(d.meta);

            // Determine status
            let status = 'ok';
            if (d.meta_tipo === 'Mayor es mejor') {
                if (val < target * 0.8) status = 'critical';
                else if (val < target) status = 'alert';
            } else {
                if (val > target * 1.2) status = 'critical';
                else if (val > target) status = 'alert';
            }

            return {
                id: d.kpi_id,
                name: d.nombre,
                value: val,
                target: target,
                unit: "%", // default unit
                status: status,
                polarity: d.meta_tipo === 'Mayor es mejor' ? 'higher' : 'lower'
            };
        });

        // Compute simulated health score out of 100
        const totalOk = indicators.filter(i => i.status === 'ok').length;
        const totalAlert = indicators.filter(i => i.status === 'alert').length;
        const healthScore = indicators.length > 0 ? Math.round(((totalOk * 100) + (totalAlert * 50)) / indicators.length) : 100;

        return {
            areas: {
                "General": {
                    score: healthScore,
                    trend: 1, // Simulated trend
                    indicators: indicators
                }
            },
            timeline: [
                { period: "Sep", global: Math.max(0, healthScore - 5) },
                { period: "Oct", global: Math.max(0, healthScore - 2) },
                { period: "Nov", global: healthScore }
            ]
        };
    } catch (err) {
        console.error("Error fetching nexus KPIs:", err);
        return null; // Return null if fails or empty
    }
}

// 4. Create new Tenant (Client)
export async function createNexusClient(nombre: string, sector: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.from('tenants').insert({
            nombre: nombre,
            dominio: nombre.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com',
            variables_css: { primary: "#6366f1", secondary: "#818cf8" },
            plan: 'pro'
        }).select().single();

        if (error) throw error;
        revalidatePath('/'); // or equivalent to refresh data route
        return data;
    } catch (err) {
        console.error("Error createNexusClient:", err);
        return null;
    }
}

// 5. Create new Project (Area)
export async function createNexusProject(tenantId: string, nombre: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.from('areas').insert({
            tenant_id: tenantId,
            nombre: nombre,
            estado: 'activa'
        }).select().single();

        if (error) throw error;
        revalidatePath('/');
        return data;
    } catch (err) {
        console.error("Error createNexusProject:", err);
        return null;
    }
}
