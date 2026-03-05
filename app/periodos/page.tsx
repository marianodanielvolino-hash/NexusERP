"use client";

import React from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";

const MOCK_PERIODOS = [
    { id: "P-2026-03", name: "Marzo 2026", status: "Abierto", progress: "45%" },
    { id: "P-2026-02", name: "Febrero 2026", status: "Cerrado", progress: "100%" },
    { id: "P-2026-01", name: "Enero 2026", status: "Cerrado", progress: "100%" },
];

export default function PeriodosPage() {
    const columns: ColumnDef<any>[] = [
        { header: "ID Período", accessorKey: "id" },
        { header: "Nombre", accessorKey: "name", cell: (row) => <span style={{ fontWeight: 600 }}>{row.name}</span> },
        {
            header: "Estado", cell: (row) => (
                <span style={{
                    padding: "4px 8px",
                    background: row.status === "Abierto" ? "var(--azul-light)" : "var(--bg)",
                    color: row.status === "Abierto" ? "var(--azul-primary)" : "var(--texto2)",
                    borderRadius: "4px", fontSize: "0.8rem", fontWeight: 600
                }}>
                    {row.status}
                </span>
            )
        },
        { header: "Progreso de Carga", accessorKey: "progress" },
        { header: "Acciones", cell: () => <button className="btn" style={{ padding: "4px 8px", background: "transparent", border: "1px solid var(--borde)", fontSize: "0.8rem" }}>Ver Detalles</button> }
    ];

    return (
        <div className="fade-in" style={{ padding: "1.5rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--texto)", margin: 0 }}>Períodos de Evaluación</h2>
                    <p style={{ color: "var(--texto2)", fontSize: "0.9rem", margin: "4px 0 0" }}>Gestión de ciclos de medición y carga de metas.</p>
                </div>
                <button className="btn btn-primary">
                    Crear Nuevo Período
                </button>
            </div>
            <div className="widget-card fade-in" style={{ padding: "1rem" }}>
                <DataTable rows={MOCK_PERIODOS} columns={columns} />
            </div>
        </div>
    );
}
