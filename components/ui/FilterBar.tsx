import React from "react";

export interface FilterDef {
    key: string;
    label: string;
    options: { label: string; value: string }[];
}

interface FilterBarProps {
    filters: FilterDef[];
    values: Record<string, string>;
    onChange: (values: Record<string, string>) => void;
    children?: React.ReactNode;
}

export function FilterBar({ filters, values, onChange, children }: FilterBarProps) {
    const handleSelect = (key: string, value: string) => {
        onChange({ ...values, [key]: value });
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg3)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--borde)',
            marginBottom: '1rem',
            gap: '1rem',
            flexWrap: 'wrap'
        }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {filters.map(filter => (
                    <div key={filter.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--texto2)', fontWeight: 600 }}>{filter.label}</span>
                        <select
                            style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: '1px solid var(--borde)',
                                fontSize: '0.85rem',
                                outline: 'none',
                                color: 'var(--texto)',
                                cursor: 'pointer'
                            }}
                            value={values[filter.key] || ""}
                            onChange={(e) => handleSelect(filter.key, e.target.value)}
                        >
                            <option value="">Todos</option>
                            {filter.options.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}
