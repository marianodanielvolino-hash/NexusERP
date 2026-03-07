"use client";

import React, { useState, useEffect } from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusPill } from "@/components/ui/StatusPill";
import { KpiDetailDrawer } from "@/components/ui/KpiDetailDrawer";
import { BulkUploadModal } from "@/components/ui/BulkUploadModal";
import { KpiData, Status } from "@/lib/types";

import { getKpisForCarga } from "@/lib/actions/data";

export default function CargaChecklistPage() {
    const [kpis, setKpis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getKpisForCarga("2026-03").then(data => {
            setKpis(data);
            setLoading(false);
        });
    }, []);
    const [filters, setFilters] = useState<Record<string, string>>({ areaId: "", state: "" });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedKpiId, setSelectedKpiId] = useState<string | null>(null);

    const columns: ColumnDef<any>[] = [
        {
            header: "KPI",
            cell: (row) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{row.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--texto3)" }}>ID: {row.kpiId}</div>
                </div>
            )
        },
        { header: "Meta", accessorKey: "target" },
        { header: "Valor Actual", cell: (row) => row.value ? <span style={{ fontWeight: 600 }}>{row.value}</span> : <span style={{ color: "var(--texto3)" }}>Sin Cargar</span> },
        { header: "Semáforo", cell: (row) => row.value ? <StatusPill status={row.status} /> : <span style={{ color: "var(--texto3)" }}>N/A</span> },
        { header: "Estado", cell: (row) => <span style={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: 600, color: "var(--texto2)", background: "var(--bg)", padding: "4px 8px", borderRadius: "4px" }}>{row.state.replace("_", " ")}</span> },
        { header: "Actualizado", accessorKey: "lastUpdatedAt" },
        {
            header: "Acción",
            cell: (row) => (
                <button
                    className="btn"
                    style={{ background: "transparent", border: "1px solid var(--azul-primary)", color: "var(--azul-primary)", padding: "4px 12px" }}
                >
                    {row.state === "pending_manager" ? "Ver" : "Cargar / Editar"}
                </button>
            )
        }
    ];

    return (
        <div className="fade-in" style={{ padding: "1.5rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--texto)", margin: 0 }}>Carga Operativa</h2>
                    <p style={{ color: "var(--texto2)", fontSize: "0.9rem", margin: "4px 0 0" }}>Checklist de responsables para el período seleccionado.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                    Subida Masiva
                </button>
            </div>

            <FilterBar
                filters={[
                    { key: "areaId", label: "Área", options: [{ label: "Comercial", value: "a1" }, { label: "Técnica", value: "a2" }] },
                    { key: "state", label: "Estado", options: [{ label: "Borrador (Draft)", value: "draft" }, { label: "Enviado", value: "pending" }] }
                ]}
                values={filters}
                onChange={setFilters}
            />

            {loading ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--texto2)" }}>Cargando indicadores...</div>
            ) : (
                <DataTable
                    rows={kpis}
                    columns={columns}
                    onRowClick={(row) => {
                        setSelectedKpiId(row.kpiId);
                        setDrawerOpen(true);
                    }}
                />
            )}

            {/* KPI Detail Drawer */}
            <KpiDetailDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                context={{ periodId: "2026-03", kpiId: selectedKpiId || "" }}
                userRoles={["OP", "REF"]} // Simulate Operador/Referente
            />

            {/* Bulk Upload Modal */}
            <BulkUploadModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirmImport={() => {
                    console.log("Imported items");
                    // Revalidate table or Optimistic push
                }}
            />
        </div>
    );
}
