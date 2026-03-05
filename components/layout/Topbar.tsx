"use client";

import { usePathname } from 'next/navigation';

export function Topbar() {
    const pathname = usePathname();

    // Mapear rutas a nombres legibles
    const pageTitle = () => {
        if (pathname === '/') return 'Inicio';
        const firstSegment = pathname.split('/')[1];
        return firstSegment ? firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1) : 'Tablero';
    };

    return (
        <div style={{
            background: 'var(--bg2)',
            padding: '0 2rem',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--borde)',
            position: 'sticky',
            top: 0,
            zIndex: 40
        }}>
            {/* 1. Global Search y Título (Contextual) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--texto)', margin: 0 }}>
                    {pageTitle()}
                </h1>

                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '10px', top: '7px', color: 'var(--texto3)' }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar KPI, área o usuario..."
                        style={{
                            padding: '8px 10px 8px 35px',
                            borderRadius: '6px',
                            border: '1px solid var(--borde)',
                            width: '240px',
                            outline: 'none',
                            background: 'var(--bg)',
                            fontSize: '0.85rem'
                        }}
                    />
                </div>
            </div>

            {/* 2. Tenant y Period Switchers + Trazabilidad */}
            <div style={{ display: 'flex', gap: '2rem', height: '100%', alignItems: 'center' }}>

                {/* Period Switcher (Siempre visible) */}
                <select style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--borde)',
                    outline: 'none',
                    fontWeight: 600,
                    background: 'var(--azul-light)',
                    color: 'var(--azul-primary)',
                    cursor: 'pointer'
                }}>
                    <option value="2026-03">Marzo 2026 (Open)</option>
                    <option value="2026-02">Febrero 2026 (Closed)</option>
                    <option value="2026-01">Enero 2026 (Closed)</option>
                </select>

                {/* Notificaciones y Perfil */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    color: 'var(--texto2)',
                    fontSize: '1.2rem'
                }}>
                    <div style={{ cursor: 'pointer', position: 'relative' }}>
                        🔔
                        <span style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '-4px',
                            background: 'var(--rojo)',
                            color: 'white',
                            fontSize: '10px',
                            borderRadius: '50%',
                            padding: '2px 5px',
                            fontWeight: 'bold'
                        }}>2</span>
                    </div>

                    <div style={{ cursor: 'pointer' }}>⚙️</div>

                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--azul-primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        marginLeft: '0.5rem',
                        cursor: 'pointer'
                    }}>EJ</div>
                </div>
            </div>
        </div>
    );
}
