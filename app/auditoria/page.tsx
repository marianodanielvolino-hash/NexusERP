"use client";

import React, { useState } from "react";
import { AuditLogFilters } from "@/components/ui/AuditLogFilters";

// Mock Data
const MOCK_LOGS = [
    { id: "log-1", date: "2026-03-04 15:30:21", user: "jperez (Ejecutivo)", action: "UPDATE_TARGET", entityType: "KPI", entityId: "kpi-4", ip: "192.168.1.45", tenantId: "tenant-A" },
    { id: "log-2", date: "2026-03-04 14:15:02", user: "agomez (Gerente)", action: "APPROVE_DATA", entityType: "KPI_DATA", entityId: "data-2", ip: "192.168.1.12", tenantId: "tenant-A" },
    { id: "log-3", date: "2026-03-04 12:00:00", user: "SYSTEM", action: "BATCH_IMPORT", entityType: "INTEGRATION", entityId: "job-89", ip: "127.0.0.1", tenantId: "tenant-A" },
    { id: "log-4", date: "2026-03-03 09:45:11", user: "ltorres (Operador)", action: "SUBMIT_DATA", entityType: "KPI_DATA", entityId: "data-1", ip: "192.168.1.88", tenantId: "tenant-A" },
];

export default function AuditoriaPage() {
    const [filters, setFilters] = useState({ user: "", action: "", dateRange: "", tenant: "" });

    const handleFilter = (newFilters: any) => {
        setFilters(newFilters);
        console.log("Aplicando filtros:", newFilters);
        // ... filter logic
    };

    return (
        <div className="fade-in" style={{ padding: "1.5rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--texto)", margin: 0 }}>Registro de Auditoría (Audit Log)</h2>
                    <p style={{ color: "var(--texto2)", fontSize: "0.9rem", margin: "4px 0 0" }}>Trazabilidad transaccional inmutable "Append-Only".</p>
                </div>
                <button className="btn" style={{ border: "1px solid var(--borde)", background: "var(--card)" }}>
                    Exportar Completo (ZIP)
                </button>
            </div>

            <AuditLogFilters onFilter={handleFilter} />

            <div className="widget-card fade-in" style={{ padding: "0", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--borde)", background: "var(--bg)" }}>
                                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--texto2)" }}>Fecha / Hora</th>
                                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--texto2)" }}>Usuario</th>
                                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--texto2)" }}>Acción</th>
                                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--texto2)" }}>Entidad</th>
                                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--texto2)" }}>IP / Tenant</th>
                                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--texto2)" }}>Detalle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_LOGS.map(log => (
                                <tr key={log.id} style={{ borderBottom: "1px solid var(--borde)", transition: "background 0.2s" }} className="hover-row">
                                    <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "0.85rem", color: "var(--texto2)" }}>{log.date}</td>
                                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{log.user}</td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <span style={{
                                            padding: "4px 8px",
                                            background: log.action.includes("APPROVE") ? "rgba(76, 175, 80, 0.1)" :
                                                log.action.includes("UPDATE") || log.action.includes("SUBMIT") ? "rgba(59, 94, 248, 0.1)" : "var(--bg)",
                                            color: log.action.includes("APPROVE") ? "var(--verde)" :
                                                log.action.includes("UPDATE") || log.action.includes("SUBMIT") ? "var(--azul-primary)" : "var(--texto)",
                                            borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700
                                        }}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--texto2)" }}>
                                        {log.entityType} <br /> <span style={{ fontSize: "0.75rem", color: "var(--texto3)" }}>ID: {log.entityId}</span>
                                    </td>
                                    <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--texto3)" }}>
                                        {log.ip} <br /> {log.tenantId}
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <button className="btn" style={{ padding: "4px 8px", background: "transparent", border: "1px solid var(--borde)", fontSize: "0.75rem" }}>
                                            JSON
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
