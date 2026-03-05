import React from "react";
import { Status } from "@/lib/types";
import { StatusPill } from "./StatusPill";
import { MiniTrend } from "./MiniTrend";

interface KpiCardProps {
    kpi: { id: string; name: string; areaId?: string; unit?: string };
    value?: number | string;
    target?: number | string;
    delta?: number | string;
    status: Status;
    trend?: { points: number[]; periodLabels: string[] };
    onOpen?: () => void;
    className?: string;
    width?: string | number;
}

export function KpiCard({ kpi, value, target, delta, status, trend, onOpen, className, width = '100%' }: KpiCardProps) {
    const getDeltaColor = () => {
        if (!delta) return "var(--texto2)";
        const dObj = Number(delta);
        if (dObj > 0 && status === "ok") return "var(--verde)";
        if (dObj < 0 && status === "critical") return "var(--rojo)";
        return "var(--texto2)";
    };

    return (
        <div
            className={`kpi-card ${className || ''}`}
            style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.25rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                border: '1px solid var(--borde)',
                cursor: onOpen ? 'pointer' : 'default',
                transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                minWidth: '220px',
                width: typeof width === 'number' ? `${width}px` : width
            }}
            onClick={onOpen}
            onMouseEnter={e => { if (onOpen) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)'; } }}
            onMouseLeave={e => { if (onOpen) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; } }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--texto)', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', paddingRight: '1rem' }}>
                        {kpi.name}
                    </h3>
                    {kpi.unit && <span style={{ fontSize: '0.75rem', color: 'var(--texto3)' }}>{kpi.unit}</span>}
                </div>
                <StatusPill status={status} size="sm" />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--texto)', lineHeight: 1 }}>
                    {value !== undefined ? value : '--'}
                </span>
                {delta !== undefined && (
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: getDeltaColor(), marginBottom: '3px' }}>
                        {Number(delta) > 0 ? '↑' : '↓'} {Math.abs(Number(delta))}
                    </span>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--borde)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--texto3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Meta</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--texto)' }}>{target !== undefined ? target : '--'}</span>
                </div>
                {trend && (
                    <div style={{ width: '80px', height: '30px' }}>
                        <MiniTrend points={trend.points} compact color={status === 'critical' ? 'var(--rojo)' : status === 'alert' ? 'var(--amarillo)' : 'var(--azul-primary)'} />
                    </div>
                )}
            </div>
        </div>
    );
}
