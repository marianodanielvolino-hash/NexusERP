import React from "react";

export interface ColumnDef<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    rows: T[];
    columns: ColumnDef<T>[];
    onRowClick?: (row: T) => void;
    emptyStateLabel?: string;
    loading?: boolean;
}

export function DataTable<T>({ rows, columns, onRowClick, emptyStateLabel = "No hay datos para mostrar", loading = false }: DataTableProps<T>) {
    return (
        <div style={{
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflowX: 'auto'
        }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'var(--bg)', color: 'var(--texto2)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} style={{ padding: '1rem', borderBottom: '1px solid var(--borde)' }}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length} style={{ padding: '2rem', textAlign: 'center', color: 'var(--texto2)' }}>
                                Cargando...
                            </td>
                        </tr>
                    ) : rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} style={{ padding: '2rem', textAlign: 'center', color: 'var(--texto2)' }}>
                                {emptyStateLabel}
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                onClick={() => onRowClick && onRowClick(row)}
                                style={{
                                    borderBottom: '1px solid var(--borde)',
                                    cursor: onRowClick ? 'pointer' : 'default',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={e => { if (onRowClick) e.currentTarget.style.backgroundColor = 'var(--bg)'; }}
                                onMouseLeave={e => { if (onRowClick) e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} style={{ padding: '1rem', color: 'var(--texto)', fontSize: '0.9rem' }}>
                                        {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey]) : null}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
