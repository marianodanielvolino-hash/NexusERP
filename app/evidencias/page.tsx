"use client";

import React, { useState, useEffect } from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { FilterBar } from "@/components/ui/FilterBar";
import { getEvidences } from "@/lib/actions/evidence";

export default function EvidenciasPage() {
    const [evidences, setEvidences] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<Record<string, string>>({ kpi: "", uploader: "" });

    useEffect(() => {
        getEvidences().then(data => {
            setEvidences(data);
            setLoading(false);
        });
    }, []);

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

            {loading ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--texto2)" }}>Cargando evidencias...</div>
            ) : (
                <DataTable
                    rows={evidences}
                    columns={columns}
                />
            )}
        </div>
    );
}
