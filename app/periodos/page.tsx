"use client";

import React, { useState, useEffect } from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { getPeriodos } from "@/lib/actions/data";

export default function PeriodosPage() {
    const [periodos, setPeriodos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPeriodos().then(data => {
            setPeriodos(data);
            setLoading(false);
        });
    }, []);
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
                {loading ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--texto2)" }}>Cargando períodos...</div>
                ) : (
                    <DataTable rows={periodos} columns={columns} />
                )}
            </div>
        </div>
    );
}
