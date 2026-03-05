"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { FilterBar } from "@/components/ui/FilterBar";

// Mock Data
const MOCK_EVIDENCES = [
    { id: "ev-1", kpi: "Índice de Cobrabilidad", filename: "facturas_feb.pdf", uploadedBy: "Operador A", date: "2026-03-02", size: "2.4 MB" },
    { id: "ev-2", kpi: "Nivel de Morosidad", filename: "reporte_mora.xlsx", uploadedBy: "Referente", date: "2026-03-01", size: "1.1 MB" },
    { id: "ev-3", kpi: "Tiempo de Resolución", filename: "tickets_export.csv", uploadedBy: "Operador B", date: "2026-02-28", size: "5.8 MB" },
];

export default function EvidenciasPage() {
    const [filters, setFilters] = useState<Record<string, string>>({ kpi: "", uploader: "" });

    const columns: ColumnDef<any>[] = [
        { header: "Archivo", cell: (row) => <div style={{ fontWeight: 600, color: "var(--azul-primary)" }}>📎 {row.filename}</div> },
        { header: "KPI Vinculado", accessorKey: "kpi" },
        { header: "Subido Por", accessorKey: "uploadedBy" },
        { header: "Fecha", accessorKey: "date" },
        { header: "Tamaño", accessorKey: "size" },
        {
            header: "Acciones",
            cell: () => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btn" style={{ padding: "4px 8px", background: "var(--bg)", border: "1px solid var(--borde)" }}>Ver</button>
                    <button className="btn" style={{ padding: "4px 8px", background: "var(--bg)", border: "1px solid var(--borde)" }}>↓</button>
                </div>
            )
        }
    ];

    return (
        <div className="fade-in" style={{ padding: "1.5rem 0" }}>
            <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--texto)", margin: 0 }}>Biblioteca de Evidencias</h2>
                <p style={{ color: "var(--texto2)", fontSize: "0.9rem", margin: "4px 0 0" }}>Repositorio centralizado de todos los documentos adjuntos a las mediciones.</p>
            </div>

            <FilterBar
                filters={[
                    { key: "kpi", label: "KPI", options: [{ label: "Cobrabilidad", value: "cob" }, { label: "Morosidad", value: "mor" }] },
                    { key: "uploader", label: "Usuario", options: [{ label: "Operadores", value: "op" }, { label: "Referentes", value: "ref" }] }
                ]}
                values={filters}
                onChange={setFilters}
            />

            <DataTable
                rows={MOCK_EVIDENCES}
                columns={columns}
            />
        </div>
    );
}
