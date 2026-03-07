"use client";

import React, { useState, useEffect } from "react";
import { KpiCard } from "@/components/ui/KpiCard";
import { KpiDetailDrawer } from "@/components/ui/KpiDetailDrawer";
import { Status } from "@/lib/types";
import { FilterBar } from "@/components/ui/FilterBar";
import { getDashboardSummary } from "@/lib/actions/dashboard";

export default function TablerosPage() {
    const [activeTab, setActiveTab] = useState<"executive" | "area">("executive");
    const [selectedArea, setSelectedArea] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedKpiId, setSelectedKpiId] = useState<string | null>(null);

    const [globalStats, setGlobalStats] = useState({ ok: 0, alert: 0, critical: 0 });
    const [topCriticals, setTopCriticals] = useState<any[]>([]);
    const [areaStats, setAreaStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardSummary("2026-03").then(res => {
            if (res) {
                setGlobalStats(res.globalStats);
                setTopCriticals(res.topCriticals);
                setAreaStats(res.areaStats);
            }
            setLoading(false);
        });
    }, []);

    const openDrawer = (kpiId: string) => {
        setSelectedKpiId(kpiId);
        setDrawerOpen(true);
    };

    return (
        <div className="fade-in" style={{ padding: "1.5rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--texto)", margin: 0 }}>Tableros de Control</h2>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                        <button
                            onClick={() => setActiveTab("executive")}
                            style={{
                                background: "transparent", border: "none", fontSize: "0.95rem", fontWeight: activeTab === "executive" ? 600 : 500,
                                color: activeTab === "executive" ? "var(--azul-primary)" : "var(--texto2)",
                                borderBottom: activeTab === "executive" ? "3px solid var(--azul-primary)" : "3px solid transparent",
                                cursor: "pointer", paddingBottom: "0.5rem"
                            }}
                        >
                            Vista Ejecutiva Global
                        </button>
                        <button
                            onClick={() => setActiveTab("area")}
                            style={{
                                background: "transparent", border: "none", fontSize: "0.95rem", fontWeight: activeTab === "area" ? 600 : 500,
                                color: activeTab === "area" ? "var(--azul-primary)" : "var(--texto2)",
                                borderBottom: activeTab === "area" ? "3px solid var(--azul-primary)" : "3px solid transparent",
                                cursor: "pointer", paddingBottom: "0.5rem"
                            }}
                        >
                            Análisis por Área
                        </button>
                    </div>
                </div>
                <button className="btn" style={{ background: "var(--bg)", border: "1px solid var(--borde)" }}>
                    📄 Exportar PDF
                </button>
            </div>

            {activeTab === "area" && (
                <FilterBar
                    filters={[{
                        key: "areaId", label: "Filtrar Área", options: [
                            { label: "Inclusión Social", value: "1" },
                            { label: "Desarrollo Humano", value: "2" },
                            { label: "Salud", value: "3" },
                            { label: "Educación Formación", value: "4" },
                            { label: "Gestión Innovación", value: "5" }
                        ]
                    }]}
                    values={{ areaId: selectedArea }}
                    onChange={(v) => setSelectedArea(v.areaId)}
                />
            )}

            {activeTab === "executive" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

                    {/* SEMÁFORO GLOBAL OVERVIEW */}
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "2rem", color: "var(--texto2)" }}>Generando tableros...</div>
                    ) : (
                        <>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                                <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--borde)", textAlign: "center" }}>
                                    <h3 style={{ fontSize: "0.9rem", color: "var(--texto2)", margin: "0 0 0.5rem" }}>KPIs en Meta</h3>
                                    <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--verde)" }}>{globalStats.ok}</div>
                                </div>
                                <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--borde)", textAlign: "center" }}>
                                    <h3 style={{ fontSize: "0.9rem", color: "var(--texto2)", margin: "0 0 0.5rem" }}>Alertas Tempranas</h3>
                                    <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--amarillo)" }}>{globalStats.alert}</div>
                                </div>
                                <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--borde)", textAlign: "center" }}>
                                    <h3 style={{ fontSize: "0.9rem", color: "var(--texto2)", margin: "0 0 0.5rem" }}>Desvíos Críticos</h3>
                                    <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--rojo)" }}>{globalStats.critical}</div>
                                </div>
                            </div>

                            {/* TOP CRITICALS */}
                            <div>
                                <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--texto)" }}>Desvíos Críticos (Top)</h3>
                                <div style={{ display: "flex", gap: "1.5rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
                                    {topCriticals.length === 0 ? <p style={{ color: "var(--texto2)" }}>No hay críticos</p> : null}
                                    {topCriticals.map((kpi, idx) => (
                                        <KpiCard
                                            key={kpi.kpiId}
                                            kpi={{ id: kpi.kpiId, name: kpi.name, areaId: kpi.areaName }}
                                            target={kpi.target}
                                            value={kpi.value}
                                            delta={kpi.delta}
                                            status={kpi.status}
                                            trend={kpi.trend}
                                            onOpen={() => openDrawer(kpi.kpiId)}
                                            width={300}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* RESUMEN DE AREAS */}
                            <div>
                                <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--texto)" }}>Resumen por Áreas</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                                    {areaStats.map((area, idx) => (
                                        <div key={area.id || idx} style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--borde)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div>
                                                <div style={{ fontSize: "1rem", fontWeight: 600 }}>{area.name}</div>
                                                <div style={{ fontSize: "0.8rem", color: "var(--texto2)", marginTop: "0.25rem" }}>{area.ok} Bien • {area.alert} Alerta • {area.critical} Críticos</div>
                                            </div>
                                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: area.score >= 90 ? "var(--verde)" : "var(--amarillo)" }}>
                                                {area.score}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>)}
                </div>
            ) : (
                /* AREA DRILLDOWN DASHBOARD */
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {!selectedArea ? (
                        <div style={{ padding: "3rem", textAlign: "center", color: "var(--texto2)", border: "1px dashed var(--borde2)", borderRadius: "12px" }}>
                            Selecciona un área en el filtro de arriba para visualizar sus indicadores en detalle.
                        </div>
                    ) : (
                        <div>
                            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--texto)" }}>Heatmap y Tendencias</h3>
                            <p style={{ color: "var(--texto2)", fontSize: "0.9rem" }}>Drilldown AreaDashboard - Area ID: {selectedArea}</p>
                            {/* This space would iterate over all KPIs of the area in KpiCards */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: "1.5rem" }}>
                                <KpiCard
                                    kpi={{ id: "INCIDENTS_CNT", name: "Incidentes y conflictos registrados" }}
                                    target="< 14" value="22" delta={-8} status="critical"
                                    onOpen={() => openDrawer("INCIDENTS_CNT")}
                                    width={280}
                                />
                                <KpiCard
                                    kpi={{ id: "SAFETY_CLIMATE", name: "Clima de convivencia y seguridad" }}
                                    target="> 75" value="82" delta={+7} status="ok"
                                    onOpen={() => openDrawer("SAFETY_CLIMATE")}
                                    width={280}
                                />
                                <KpiCard
                                    kpi={{ id: "PARTICIP_RATE", name: "Participación en espacios" }}
                                    target="> 65%" value="60%" delta={-5} status="alert"
                                    onOpen={() => openDrawer("PARTICIP_RATE")}
                                    width={280}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {selectedKpiId && (
                <KpiDetailDrawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    context={{ periodId: "2026-03", kpiId: selectedKpiId }}
                    userRoles={["EJ"]}
                />
            )}
        </div>
    );
}
