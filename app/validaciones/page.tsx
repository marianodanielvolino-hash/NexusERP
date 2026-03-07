"use client";

import React, { useState, useEffect } from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { FilterBar } from "@/components/ui/FilterBar";
import { StatusPill } from "@/components/ui/StatusPill";
import { KpiDetailDrawer } from "@/components/ui/KpiDetailDrawer";
import { Status } from "@/lib/types";
import { getKpisForValidacion } from "@/lib/actions/data";

export default function ValidacionesPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<Record<string, string>>({ areaId: "", status: "" });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);

    useEffect(() => {
        getKpisForValidacion("2026-03").then(data => {
            setTasks(data);
            setLoading(false);
        });
    }, []);

    const columns: ColumnDef<any>[] = [
        {
            header: "KPI y Área",
            cell: (row) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{row.kpiName}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--texto2)" }}>{row.areaName}</div>
                </div>
            )
        },
        {
            header: "Métrica (Actual vs Meta)",
            cell: (row) => (
                <div>
                    <span style={{ fontWeight: 600, color: "var(--texto)", marginRight: "8px" }}>{row.value}</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--texto3)" }}>vs {row.target}</span>
                </div>
            )
        },
        { header: "Semáforo", cell: (row) => <StatusPill status={row.status} /> },
        {
            header: "Enviado Por",
            cell: (row) => (
                <div>
                    <div style={{ fontSize: "0.85rem", color: "var(--texto)" }}>{row.submittedBy}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--texto3)" }}>{row.dateSubmitted}</div>
                </div>
            )
        },
        {
            header: "Acción",
            cell: (row) => (
                <button
                    className="btn btn-primary"
                    style={{ padding: "4px 12px" }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(row);
                        setDrawerOpen(true);
                    }}
                >
                    Revisar
                </button>
            )
        }
    ];

    return (
        <div className="fade-in" style={{ padding: "1.5rem 0" }}>
            <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--texto)", margin: 0 }}>Bandeja de Validación</h2>
                <p style={{ color: "var(--texto2)", fontSize: "0.9rem", margin: "4px 0 0" }}>
                    Revisión de metas y aprobaciones pendientes para tu nivel.
                </p>
            </div>

            <FilterBar
                filters={[
                    { key: "areaId", label: "Área/Centro", options: [{ label: "CIS-01", value: "CIS-01" }, { label: "CIS-05", value: "CIS-05" }] },
                    { key: "status", label: "Estado Semáforo", options: [{ label: "En Meta", value: "ok" }, { label: "Alerta", value: "alert" }, { label: "Crítico", value: "critical" }] }
                ]}
                values={filters}
                onChange={setFilters}
            />

            {loading ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--texto2)" }}>Cargando validaciones pendientes...</div>
            ) : (
                <DataTable
                    rows={tasks}
                    columns={columns}
                    onRowClick={(row) => {
                        setSelectedTask(row);
                        setDrawerOpen(true);
                    }}
                />
            )}

            {selectedTask && (
                <KpiDetailDrawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    context={{ periodId: "2026-03", kpiId: selectedTask.kpiId }}
                    // Passing user role "GER" (Gerente) so the drawer can show "Approve / Reject" buttons inside its Workflow tab
                    userRoles={["GER"]}
                />
            )}
        </div>
    );
}
