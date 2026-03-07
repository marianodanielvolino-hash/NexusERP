"use client";

import React, { useState, useEffect } from "react";
import { FilterBar } from "@/components/ui/FilterBar";
import { ReportArtifactRow } from "@/components/ui/ReportArtifactRow";
import { getReportsList } from "@/lib/actions/dashboard";

export default function ReportesPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<Record<string, string>>({ type: "", dateRange: "" });

    useEffect(() => {
        getReportsList().then(data => {
            setReports(data);
            setLoading(false);
        });
    }, []);

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
                {loading ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--texto2)" }}>Cargando reportes...</div>
                ) : (
                    reports.map(report => (
                        <ReportArtifactRow
                            key={report.id}
                            report={report}
                            onDownload={handleDownload}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
