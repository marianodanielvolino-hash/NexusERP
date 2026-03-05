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
                            { id: 1, name: "Juan Pérez", email: "jperez@test.com", role: "Ejecutivo", tenant: "Tenant A", status: "Activo" },
                            { id: 2, name: "Ana Gómez", email: "agomez@test.com", role: "Gerente", tenant: "Tenant B", status: "Activo" },
                        ]}
                        columns={[
                            { header: "Nombre", accessorKey: "name" },
                            { header: "Email", accessorKey: "email" },
                            { header: "Rol", cell: (row) => <span style={{ fontWeight: 600 }}>{row.role}</span> },
                            { header: "Tenant", accessorKey: "tenant" },
                            { header: "Estado", cell: (row) => <span style={{ color: row.status === "Activo" ? "var(--verde)" : "var(--rojo)" }}>{row.status}</span> },
                            { header: "Acciones", cell: () => <button className="btn" style={{ background: "var(--bg)", border: "1px solid var(--borde)", padding: "4px 8px" }}>Editar</button> }
                        ]}
                    />
                </div>
            )}

            {activeTab === "tenants" && (
                <div className="widget-card fade-in">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                        <h3 style={{ margin: 0 }}>Gestión de Tenants</h3>
                        <button className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>+ Añadir Tenant</button>
                    </div>
                    <DataTable
                        rows={[
                            { id: "T1", name: "Empresa Alpha S.A.", domain: "alpha.com", plan: "Enterprise", status: "Activo" },
                            { id: "T2", name: "Beta Corp", domain: "betacorp.io", plan: "Pro", status: "Suspendido" },
                        ]}
                        columns={[
                            { header: "ID", accessorKey: "id" },
                            { header: "Nombre", accessorKey: "name" },
                            { header: "Dominio", accessorKey: "domain" },
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
                            { id: "ts-1", kpi: "Ventas Mensuales", year: 2026, type: "Mensual", status: "Aprobado" },
                            { id: "ts-2", kpi: "Costo de Adquisición", year: 2026, type: "Trimestral", status: "Borrador" },
                        ]}
                        columns={[
                            { header: "KPI Vinculado", accessorKey: "kpi" },
                            { header: "Año", accessorKey: "year" },
                            { header: "Periodicidad", accessorKey: "type" },
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
