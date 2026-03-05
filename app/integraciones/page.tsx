"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { StatusPill } from "@/components/ui/StatusPill";

// Mock Data
const MOCK_INTEGRATIONS = [
    { id: "int-1", name: "Sistema Salesforce", type: "CRM", status: "ok", lastSync: "Hace 5 min", itemsSynced: "1,240" },
    { id: "int-2", name: "ERP Financiero SAP", type: "Finanzas", status: "critical", lastSync: "Hace 2 horas", itemsSynced: "0" },
    { id: "int-3", name: "Google Analytics", type: "Marketing", status: "ok", lastSync: "Hace 10 min", itemsSynced: "45" },
];

const MOCK_INTEGRATION_LOGS = [
    { id: "log-1", date: "2026-03-05 09:30", connector: "Salesforce Sync", status: "Éxito", details: "245 registros procesados." },
    { id: "log-2", date: "2026-03-05 09:15", connector: "API Push /v1/kpi/12", status: "Error", details: "Invalid payload format." },
    { id: "log-3", date: "2026-03-05 09:00", connector: "SAP Financials", status: "Alerta", details: "Timeout after 3000ms. Retrying..." },
];

export default function IntegracionesPage() {
    const [activeTab, setActiveTab] = useState("connectors");

    const columnsConnectors: ColumnDef<any>[] = [
        { header: "Sistema / Origen", cell: (row) => <div style={{ fontWeight: 600 }}>🔌 {row.name}</div> },
        { header: "Tipo", cell: (row) => <span style={{ padding: "4px 8px", background: "var(--bg)", borderRadius: "4px", fontSize: "0.8rem" }}>{row.type}</span> },
        { header: "Estado", cell: (row) => <StatusPill status={row.status} /> },
        { header: "Última Sincronización", accessorKey: "lastSync" },
        { header: "Items Procesados", accessorKey: "itemsSynced" },
        {
            header: "Acción",
            cell: () => (
                <button
                    className="btn"
                    style={{ background: "transparent", border: "1px solid var(--borde)", padding: "4px 12px" }}
                >
                    Configurar
                </button>
            )
        }
    ];

    const columnsLogs: ColumnDef<any>[] = [
        { header: "Fecha / Hora", accessorKey: "date" },
        { header: "Conector / API", cell: (row) => <span style={{ fontWeight: 600 }}>{row.connector}</span> },
        {
            header: "Estado", cell: (row) => (
                <span style={{
                    color: row.status === "Éxito" ? "var(--verde)" : row.status === "Error" ? "var(--rojo)" : "var(--naranja)",
                    fontWeight: 600
                }}>
                    {row.status}
                </span>
            )
        },
        { header: "Detalle", accessorKey: "details", cell: (row) => <span style={{ color: "var(--texto2)", fontSize: "0.85rem" }}>{row.details}</span> },
        {
            header: "Acción",
            cell: () => (
                <button className="btn" style={{ background: "transparent", border: "1px solid var(--borde)", padding: "4px 8px", fontSize: "0.8rem" }}>
                    Inspect JSON
                </button>
            )
        }
    ];

    return (
        <div className="fade-in" style={{ padding: "1.5rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--texto)", margin: 0 }}>Hub de Integraciones</h2>
                    <p style={{ color: "var(--texto2)", fontSize: "0.9rem", margin: "4px 0 0" }}>Gestión de API Push/Pull y conectores con sistemas externos.</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="btn" style={{ border: "1px solid var(--borde)", background: "var(--card)" }}>Generar Token API</button>
                    <button className="btn btn-primary">
                        Nuevo Conector
                    </button>
                </div>
            </div>

            <div className="dash-row-1" style={{ marginBottom: "1.5rem" }}>
                <div className="widget-card" style={{ flex: 1, borderLeft: "4px solid var(--verde)" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--texto2)", fontWeight: 600, textTransform: "uppercase" }}>Salud de las APIs</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 700, margin: "0.5rem 0" }}>99.9%</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--verde)" }}>↑ Óptimo</div>
                </div>
                <div className="widget-card" style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--texto2)", fontWeight: 600, textTransform: "uppercase" }}>Webhooks Recibidos (24h)</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 700, margin: "0.5rem 0" }}>4,052</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--texto3)" }}>12 eventos descartados</div>
                </div>
                <div className="widget-card" style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--texto2)", fontWeight: 600, textTransform: "uppercase" }}>Conectores Activos</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 700, margin: "0.5rem 0" }}>3</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--azul-primary)" }}>Ver detalle</div>
                </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--borde)", marginBottom: "1.5rem" }}>
                {[
                    { id: "connectors", label: "Conectores Nativos" },
                    { id: "apipush", label: "API Push & Webhooks" },
                    { id: "logs", label: "Integration Logs" }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            background: "transparent",
                            border: "none",
                            padding: "0.8rem 1rem",
                            cursor: "pointer",
                            fontWeight: activeTab === tab.id ? 600 : 500,
                            color: activeTab === tab.id ? "var(--azul-primary)" : "var(--texto2)",
                            borderBottom: activeTab === tab.id ? "2px solid var(--azul-primary)" : "2px solid transparent",
                            fontSize: "0.9rem"
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "connectors" && (
                <div className="widget-card fade-in" style={{ padding: "0", overflow: "hidden" }}>
                    <div style={{ padding: "1rem" }}>
                        <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem" }}>Sistemas Vinculados</h3>
                        <DataTable
                            rows={MOCK_INTEGRATIONS}
                            columns={columnsConnectors}
                        />
                    </div>
                </div>
            )}

            {activeTab === "apipush" && (
                <div className="fade-in" style={{ display: "flex", gap: "1rem" }}>
                    <div className="widget-card" style={{ flex: 2 }}>
                        <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem" }}>Webhooks Configurables</h3>
                        <p style={{ color: "var(--texto2)", fontSize: "0.9rem", marginBottom: "1rem" }}>Envíe datos de KPIs directamente a endpoints externos cuando ocurra un evento.</p>
                        <DataTable
                            rows={[
                                { id: "wh-1", event: "Target Aprobado", method: "POST", endpoint: "https://api.mycompany.com/webhooks/targets" },
                                { id: "wh-2", event: "Alerta de Desvío", method: "POST", endpoint: "https://zapier.com/hooks/catch/..." }
                            ]}
                            columns={[
                                { header: "Evento Trigger", accessorKey: "event" },
                                { header: "Método", cell: (row) => <span style={{ fontWeight: 600, color: "var(--azul-primary)" }}>{row.method}</span> },
                                { header: "Endpoint", accessorKey: "endpoint" },
                                { header: "Estado", cell: () => <span style={{ color: "var(--verde)" }}>Activo</span> },
                                { header: "Acción", cell: () => <button className="btn" style={{ padding: "4px 8px" }}>Editar</button> }
                            ]}
                        />
                    </div>
                    <div className="widget-card" style={{ flex: 1 }}>
                        <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem" }}>Keys Generadas</h3>
                        <p style={{ color: "var(--texto2)", fontSize: "0.85rem", marginBottom: "1rem" }}>Tokens para consumir nuestra Content API.</p>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            <li style={{ padding: "10px", background: "var(--bg)", border: "1px solid var(--borde)", borderRadius: "6px", marginBottom: "8px" }}>
                                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>PowerBI Token</div>
                                <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--texto3)", marginTop: "4px" }}>sk_live_...e84a</div>
                            </li>
                            <li style={{ padding: "10px", background: "var(--bg)", border: "1px solid var(--borde)", borderRadius: "6px" }}>
                                <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Data Lake Ingestion</div>
                                <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--texto3)", marginTop: "4px" }}>sk_live_...f91b</div>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {activeTab === "logs" && (
                <div className="widget-card fade-in" style={{ padding: "0", overflow: "hidden" }}>
                    <div style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Registro de Transacciones (Logs)</h3>
                            <button className="btn" style={{ border: "1px solid var(--borde)", background: "var(--bg)", padding: "4px 12px", fontSize: "0.8rem" }}>
                                Limpiar Logs Antiguos
                            </button>
                        </div>
                        <DataTable
                            rows={MOCK_INTEGRATION_LOGS}
                            columns={columnsLogs}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
