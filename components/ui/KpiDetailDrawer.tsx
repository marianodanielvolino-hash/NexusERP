"use client";

import React, { useState } from "react";
import { Role } from "@/lib/types";
import { saveKpiValue } from "@/lib/actions/data";

interface KpiDetailDrawerProps {
    open: boolean;
    context: { tenantId?: string; periodId?: string; kpiId?: string; entryId?: string };
    userRoles: Role[];
    onClose: () => void;
}

export function KpiDetailDrawer({ open, context, userRoles, onClose }: KpiDetailDrawerProps) {
    const [activeTab, setActiveTab] = useState("entry"); // Default to entry for Phase 4 focus
    const [kpiValue, setKpiValue] = useState("");
    const [kpiObs, setKpiObs] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    if (!open) return null;

    const tabs = [
        { id: "summary", label: "Resumen" },
        { id: "entry", label: "Carga" },
        { id: "evidence", label: "Evidencias" },
        { id: "workflow", label: "Workflow" },
        { id: "history", label: "Historial" },
    ];

    if (userRoles.includes("EJ") || userRoles.includes("AUD")) {
        tabs.push({ id: "audit", label: "Auditoría" });
    }

    return (
        <>
            <div
                style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 99,
                    opacity: open ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    pointerEvents: open ? "auto" : "none"
                }}
                onClick={onClose}
            />
            <div
                style={{
                    position: "fixed",
                    top: 0, right: 0, bottom: 0,
                    width: "600px",
                    maxWidth: "100%",
                    backgroundColor: "var(--bg2)",
                    zIndex: 100,
                    transform: open ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: "-4px 0 15px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--borde)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600 }}>Detalle de Indicador</h2>
                        <div style={{ fontSize: "0.85rem", color: "var(--texto2)", marginTop: "0.25rem" }}>
                            KPI ID: {context.kpiId || "N/A"}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            fontSize: "1.5rem",
                            cursor: "pointer",
                            color: "var(--texto2)"
                        }}
                    >
                        ×
                    </button>
                </div>

                <div style={{ display: "flex", borderBottom: "1px solid var(--borde)", padding: "0 1.5rem", gap: "1.5rem", overflowX: "auto" }}>
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            style={{
                                background: "transparent",
                                border: "none",
                                padding: "1rem 0",
                                fontSize: "0.9rem",
                                fontWeight: activeTab === t.id ? 600 : 500,
                                color: activeTab === t.id ? "var(--azul-primary)" : "var(--texto2)",
                                borderBottom: activeTab === t.id ? "3px solid var(--azul-primary)" : "3px solid transparent",
                                cursor: "pointer",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", background: "var(--bg)" }}>
                    {activeTab === "summary" && <div style={{ color: "var(--texto2)", fontSize: "0.9rem" }}>Componente: Renders KpiSummaryTab (Mock)</div>}
                    {activeTab === "entry" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{ background: "var(--bg3)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--borde)" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--texto2)", display: "block", marginBottom: "0.5rem" }}>Valor del Período</label>
                                <input
                                    type="number"
                                    value={kpiValue}
                                    onChange={e => setKpiValue(e.target.value)}
                                    placeholder="Ingrese valor numérico..."
                                    style={{ width: "100%", padding: "0.8rem", background: "var(--bg)", border: "1px solid var(--borde)", color: "var(--texto)", borderRadius: "6px", outline: "none" }}
                                />
                            </div>
                            <div style={{ background: "var(--bg3)", padding: "1rem", borderRadius: "8px", border: "1px solid var(--borde)" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--texto2)", display: "block", marginBottom: "0.5rem" }}>Desviaciones u Observaciones (Opcional)</label>
                                <textarea
                                    value={kpiObs}
                                    onChange={e => setKpiObs(e.target.value)}
                                    placeholder="Justifique el valor si hubo caídas..."
                                    rows={4}
                                    style={{ width: "100%", padding: "0.8rem", background: "var(--bg)", border: "1px solid var(--borde)", color: "var(--texto)", borderRadius: "6px", outline: "none", resize: "none" }}
                                />
                            </div>
                        </div>
                    )}
                    {activeTab === "evidence" && <div>Componente: Renders KpiEvidenceTab (Dropzone + Signed URL logic)</div>}
                    {activeTab === "workflow" && <div>Componente: Renders KpiWorkflowTab (Timeline & Action Buttons)</div>}
                    {activeTab === "history" && <div>Componente: Renders KpiHistoryTab (Data Series & Export)</div>}
                    {activeTab === "audit" && <div>Componente: Renders KpiAuditTab (Strict Event List)</div>}
                </div>

                <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--borde)", display: "flex", justifyContent: "flex-end", gap: "1rem", background: "var(--bg2)" }}>
                    <button className="btn" style={{ background: "transparent", border: "1px solid var(--borde)", color: "var(--texto)" }} onClick={onClose}>Cerrar</button>
                    {activeTab === "entry" && (
                        <button
                            className="btn btn-primary"
                            disabled={!kpiValue || isSaving}
                            onClick={async () => {
                                setIsSaving(true);
                                try {
                                    if (context.entryId) {
                                        await saveKpiValue(context.entryId, Number(kpiValue), kpiObs);
                                        setKpiValue("");
                                        setKpiObs("");
                                        onClose();
                                        window.location.reload(); // Refresh table
                                    } else {
                                        alert("Error: Faltan datos del contexto de la fila (Entry ID).");
                                    }
                                } catch (e: any) {
                                    alert(e.message || "Error al guardar");
                                }
                                setIsSaving(false);
                            }}
                        >
                            {isSaving ? "Guardando..." : "Guardar Valor"}
                        </button>
                    )}
                    {activeTab === "workflow" && <button className="btn" style={{ background: "var(--verde)", color: "white" }}>Aprobar / Avanzar</button>}
                </div>
            </div>
        </>
    );
}
