"use client";

import React, { useState } from "react";
import { FilterBar } from "@/components/ui/FilterBar";
import { ReportArtifactRow } from "@/components/ui/ReportArtifactRow";

// Mock Data
const MOCK_REPORTS = [
    { id: "rep-1", name: "Reporte Mensual EPRE", type: "Regulatorio", format: "PDF", generatedAt: "2026-03-01", author: "Sistema" },
    { id: "rep-2", name: "Auditoría de SLAs", type: "Interno", format: "Excel", generatedAt: "2026-02-28", author: "Ejecutivo" },
    { id: "rep-3", name: "Cierre de Período Q1", type: "Gerencial", format: "PDF", generatedAt: "2026-02-15", author: "Gerente" },
];

export default function ReportesPage() {
    const [filters, setFilters] = useState<Record<string, string>>({ type: "", dateRange: "" });

    // Mock download handler
    const handleDownload = (id: string) => {
        console.log("Descargando reporte", id);
        alert(`Iniciando descarga del reporte ${id}...`);
    };

    return (
        <div className="fade-in" style={{ padding: "1.5rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--texto)", margin: 0 }}>Centro de Reportes</h2>
                    <p style={{ color: "var(--texto2)", fontSize: "0.9rem", margin: "4px 0 0" }}>Generación y descarga de reportes ejecutivos y regulatorios.</p>
                </div>
                <button className="btn btn-primary">
                    Crear Nuevo Reporte
                </button>
            </div>

            <FilterBar
                filters={[
                    { key: "type", label: "Tipo de Reporte", options: [{ label: "Regulatorio", value: "reg" }, { label: "Gerencial", value: "ger" }] },
                    { key: "dateRange", label: "Período", options: [{ label: "Último mes", value: "1m" }, { label: "Último trimestre", value: "3m" }] }
                ]}
                values={filters}
                onChange={setFilters}
            />

            <div style={{ marginTop: "1.5rem" }}>
                {MOCK_REPORTS.map(report => (
                    <ReportArtifactRow
                        key={report.id}
                        report={report}
                        onDownload={handleDownload}
                    />
                ))}
            </div>
        </div>
    );
}
