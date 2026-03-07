"use client";

import React, { useState, useEffect } from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";
import { Status } from "@/lib/types";
import { getKpiDefinitions } from "@/lib/actions/data";

export default function IndicadoresPage() {
    const [kpis, setKpis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getKpiDefinitions().then(data => {
            setKpis(data);
            setLoading(false);
        });
    }, []);
    const columns: ColumnDef<any>[] = [
        { header: "Estructura KPI", cell: (row) => <div><div style={{ fontWeight: 600 }}>{row.name}</div><div style={{ fontSize: "0.75rem", color: "var(--texto2)" }}>ID: {row.id}</div></div> },
        { header: "Área Ejecutiva", accessorKey: "area" },
        { header: "Frecuencia", accessorKey: "frequency" },
        { header: "Meta Actual", cell: (row) => <span style={{ fontWeight: 600 }}>{row.target}</span> },
        { header: "Valor Medido", accessorKey: "value" },
        { header: "Salud", cell: (row) => <StatusPill status={row.status} /> },
        { header: "Analizar", cell: () => <button className="btn" style={{ padding: "4px 8px", background: "transparent", border: "1px solid var(--borde)", fontSize: "0.8rem" }}>Drill-down</button> }
    ];

    return (
        <div className="fade-in" style={{ padding: "1.5rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--texto)", margin: 0 }}>Listado de Indicadores (KPIs)</h2>
                    <p style={{ color: "var(--texto2)", fontSize: "0.9rem", margin: "4px 0 0" }}>Directorio y matriz central de rendimiento.</p>
                </div>
                <button className="btn" style={{ background: "var(--card)", border: "1px solid var(--borde)" }}>
                    Exportar Matriz
                </button>
            </div>
            <div className="widget-card fade-in" style={{ padding: "1rem" }}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--texto2)" }}>Cargando directorio...</div>
                ) : (
                    <DataTable rows={kpis} columns={columns} />
                )}
            </div>
        </div>
    );
}
