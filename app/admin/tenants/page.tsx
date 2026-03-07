"use client";

import React, { useState, useEffect } from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";

export default function TenantAdminPage() {
    const [tenants, setTenants] = useState<any[]>([
        { id: '1', name: 'Nexus Demo', plan: 'Enterprise', status: 'Activo', users: 12 },
        { id: '2', name: 'Global Corp', plan: 'Business', status: 'Activo', users: 5 },
        { id: '3', name: 'SME Solutions', plan: 'Basic', status: 'Suspendido', users: 1 }
    ]);

    const columns: ColumnDef<any>[] = [
        { header: "Organización", accessorKey: "name" },
        { header: "Plan", accessorKey: "plan" },
        { header: "Usuarios", accessorKey: "users" },
        {
            header: "Estado",
            cell: (row) => (
                <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: row.status === 'Activo' ? 'var(--verde-bg)' : 'var(--rojo-bg)',
                    color: row.status === 'Activo' ? 'var(--verde)' : 'var(--rojo)',
                    fontSize: '12px'
                }}>
                    {row.status}
                </span>
            )
        },
        {
            header: "Acciones",
            cell: (row) => (
                <button className="btn" style={{ fontSize: '12px', padding: '2px 8px' }}>Gestionar</button>
            )
        }
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Administración de Tenants (White Label)</h1>
            <DataTable rows={tenants} columns={columns} />
        </div>
    );
}
