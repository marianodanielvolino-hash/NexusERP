"use client";

import React, { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("users");

    return (
        <div className="fade-in" style={{ padding: "1.5rem 0" }}>
            <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--texto)", margin: 0 }}>Backoffice de Administración</h2>
                <p style={{ color: "var(--texto2)", fontSize: "0.9rem", margin: "4px 0 0" }}>Gestión de usuarios, tenants, áreas y configuración global.</p>
            </div>

            <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--borde)", marginBottom: "1.5rem", overflowX: "auto" }}>
                {[
                    { id: "users", label: "Users" },
                    { id: "tenants", label: "Tenants" },
                    { id: "targets", label: "TargetsSpreadsheet" },
                    { id: "benchmarks", label: "Benchmarks" },
                    { id: "rules", label: "Rules" },
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
                            fontSize: "0.9rem",
                            whiteSpace: "nowrap"
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "users" && (
                <div className="widget-card fade-in">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                        <h3 style={{ margin: 0 }}>Directorio de Usuarios</h3>
                        <button className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>+ Añadir User</button>
                    </div>
                    <DataTable
                        rows={[
                            { id: 1, name: "Victoria Admin", email: "victoria@nexus.com", role: "Administrador General", tenant: "Nivel Central", status: "Activo" },
                            { id: 2, name: "Coordinador CIS", email: "coordinador.cis@nexus.com", role: "Coordinador Territorial", tenant: "Inclusión Social", status: "Activo" },
                            { id: 3, name: "Facilitador Bienestar", email: "bienestar@nexus.com", role: "Facilitador Bienestar", tenant: "Desarrollo Humano", status: "Activo" },
                            { id: 4, name: "Analista Impacto", email: "evaluacion@nexus.com", role: "Analista Impacto", tenant: "Gestión Innovación", status: "Activo" },
                            { id: 5, name: "Director Norte", email: "director.norte@nexus.com", role: "Director de Sede", tenant: "CIS-01", status: "Inactivo" },
                        ]}
                        columns={[
                            { header: "Nombre", accessorKey: "name" },
                            { header: "Email", accessorKey: "email" },
                            { header: "Rol", cell: (row) => <span style={{ fontWeight: 600 }}>{row.role}</span> },
                            { header: "Tenant / Área", accessorKey: "tenant" },
                            { header: "Estado", cell: (row) => <span style={{ color: row.status === "Activo" ? "var(--verde)" : "var(--rojo)" }}>{row.status}</span> },
                            { header: "Acciones", cell: () => <button className="btn" style={{ background: "var(--bg)", border: "1px solid var(--borde)", padding: "4px 8px" }}>Editar</button> }
                        ]}
                    />
                </div>
            )}

            {activeTab === "tenants" && (
                <div className="widget-card fade-in">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                        <h3 style={{ margin: 0 }}>Gestión de Tenants (Centros)</h3>
                        <button className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>+ Añadir Centro</button>
                    </div>
                    <DataTable
                        rows={[
                            { id: "CIS-01", name: "Centro Inclusión Norte", domain: "norte.nexus.net", plan: "Enterprise", status: "Activo" },
                            { id: "CIS-02", name: "Centro Desarrollo Sur", domain: "sur.nexus.net", plan: "Enterprise", status: "Activo" },
                            { id: "CIS-03", name: "Centro Bienestar Oeste", domain: "oeste.nexus.net", plan: "Pro", status: "Activo" },
                            { id: "CIS-04", name: "Nuevo Espacio Este", domain: "este.nexus.net", plan: "Básico", status: "Suspendido" },
                        ]}
                        columns={[
                            { header: "ID", accessorKey: "id" },
                            { header: "Nombre del Dispositivo", accessorKey: "name" },
                            { header: "Dominio Intranet", accessorKey: "domain" },
                            { header: "Plan", accessorKey: "plan" },
                            { header: "Estado", cell: (row) => <span style={{ color: row.status === "Activo" ? "var(--verde)" : "var(--rojo)" }}>{row.status}</span> },
                            { header: "Acciones", cell: () => <button className="btn" style={{ background: "var(--bg)", border: "1px solid var(--borde)", padding: "4px 8px" }}>Editar</button> }
                        ]}
                    />
                </div>
            )}

            {activeTab === "targets" && (
                <div className="widget-card fade-in">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                        <h3 style={{ margin: 0 }}>Targets Spreadsheets</h3>
                        <button className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>+ Nuevo Target</button>
                    </div>
                    <DataTable
                        rows={[
                            { id: "TS-2026-H1", kpi: "Índice de Desgaste Staff", year: 2026, type: "Semestral", status: "Aprobado" },
                            { id: "TS-2026-Q1", kpi: "Participación Comunitaria", year: 2026, type: "Trimestral", status: "Aprobado" },
                            { id: "TS-2026-M04", kpi: "Clima de Convivencia", year: 2026, type: "Mensual", status: "Borrador" },
                        ]}
                        columns={[
                            { header: "Planilla Múltiple", accessorKey: "id" },
                            { header: "KPI Vinculado", accessorKey: "kpi" },
                            { header: "Año Base", accessorKey: "year" },
                            { header: "Corte", accessorKey: "type" },
                            { header: "Estado", accessorKey: "status" },
                            { header: "Acciones", cell: () => <button className="btn" style={{ background: "var(--bg)", border: "1px solid var(--borde)", padding: "4px 8px" }}>Editar</button> }
                        ]}
                    />
                </div>
            )}

            {activeTab === "benchmarks" && (
                <div className="widget-card fade-in">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                        <h3 style={{ margin: 0 }}>Benchmarks (Sector/Industria)</h3>
                        <button className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>+ Añadir Benchmark</button>
                    </div>
                    <DataTable
                        rows={[
                            { id: "bm-1", kpi: "Cobrabilidad", industry: "Servicios", value: "95%", source: "Estudio Nacional" },
                            { id: "bm-2", kpi: "Churn Rate", industry: "SaaS", value: "3.5%", source: "Interno" },
                        ]}
                        columns={[
                            { header: "KPI", accessorKey: "kpi" },
                            { header: "Industria", accessorKey: "industry" },
                            { header: "Valor Óptimo", accessorKey: "value" },
                            { header: "Fuente", accessorKey: "source" },
                            { header: "Acciones", cell: () => <button className="btn" style={{ background: "var(--bg)", border: "1px solid var(--borde)", padding: "4px 8px" }}>Editar</button> }
                        ]}
                    />
                </div>
            )}

            {activeTab === "rules" && (
                <div className="widget-card fade-in">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                        <h3 style={{ margin: 0 }}>Motor de Reglas (Validation Rules)</h3>
                        <button className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>+ Nueva Regla</button>
                    </div>
                    <DataTable
                        rows={[
                            { id: "rul-1", name: "Evidencia Obligatoria EPRE", trigger: "OnSubmit", action: "RequireAttachment", active: "Sí" },
                            { id: "rul-2", name: "Alerta Desvío > 15%", trigger: "OnApprove", action: "SendEmail", active: "Sí" },
                        ]}
                        columns={[
                            { header: "Nombre de la Regla", accessorKey: "name" },
                            { header: "Trigger", accessorKey: "trigger" },
                            { header: "Acción", accessorKey: "action" },
                            { header: "Activo", accessorKey: "active" },
                            { header: "Configurar", cell: () => <button className="btn" style={{ background: "var(--bg)", border: "1px solid var(--borde)", padding: "4px 8px" }}>⚙️</button> }
                        ]}
                    />
                </div>
            )}
        </div>
    );
}
