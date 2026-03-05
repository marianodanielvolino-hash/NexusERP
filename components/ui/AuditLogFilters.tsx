import React, { useState } from "react";

interface AuditLogFiltersProps {
    onFilter: (filters: { user: string; action: string; dateRange: string; tenant: string }) => void;
}

export function AuditLogFilters({ onFilter }: AuditLogFiltersProps) {
    const [user, setUser] = useState("");
    const [action, setAction] = useState("");
    const [dateRange, setDateRange] = useState("");
    const [tenant, setTenant] = useState("");

    const handleApply = () => {
        onFilter({ user, action, dateRange, tenant });
    };

    return (
        <div style={{
            display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-end",
            background: "var(--card)", padding: "1.2rem", borderRadius: "8px", border: "1px solid var(--borde)", marginBottom: "1.5rem"
        }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "200px", flex: 1 }}>
                <label style={{ fontSize: "0.85rem", color: "var(--texto2)", fontWeight: 600 }}>Usuario / Actor</label>
                <input
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="Buscar por usuario o email..."
                    style={{
                        padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid var(--borde)", width: "100%", background: "var(--bg)", color: "var(--texto)"
                    }}
                />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "150px", flex: 1 }}>
                <label style={{ fontSize: "0.85rem", color: "var(--texto2)", fontWeight: 600 }}>Acción</label>
                <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    style={{
                        padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid var(--borde)", width: "100%", background: "var(--bg)", color: "var(--texto)"
                    }}
                >
                    <option value="">Todas</option>
                    <option value="UPDATE">UPDATE</option>
                    <option value="APPROVE">APPROVE</option>
                    <option value="SUBMIT">SUBMIT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="LOGIN">LOGIN</option>
                </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "150px", flex: 1 }}>
                <label style={{ fontSize: "0.85rem", color: "var(--texto2)", fontWeight: 600 }}>Fecha</label>
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    style={{
                        padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid var(--borde)", width: "100%", background: "var(--bg)", color: "var(--texto)"
                    }}
                >
                    <option value="">Cualquier fecha</option>
                    <option value="24h">Últimas 24h</option>
                    <option value="7d">Últimos 7 días</option>
                    <option value="30d">Últimos 30 días</option>
                </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: "150px", flex: 1 }}>
                <label style={{ fontSize: "0.85rem", color: "var(--texto2)", fontWeight: 600 }}>ID del Tenant</label>
                <input
                    type="text"
                    value={tenant}
                    onChange={(e) => setTenant(e.target.value)}
                    placeholder="Filtrar por tenant..."
                    style={{
                        padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid var(--borde)", width: "100%", background: "var(--bg)", color: "var(--texto)"
                    }}
                />
            </div>

            <div style={{ minWidth: "100px" }}>
                <button
                    onClick={handleApply}
                    className="btn btn-primary"
                    style={{ padding: "0.6rem 1.2rem", width: "100%" }}
                >
                    Aplicar
                </button>
            </div>
        </div>
    );
}
