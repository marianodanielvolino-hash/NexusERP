"use client";

import { usePathname } from 'next/navigation';
import { Search, Bell, Settings } from 'lucide-react';

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
            background: 'var(--glass-bg)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
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
                <h1 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--texto)', margin: 0, letterSpacing: '-0.02em' }}>
                    {pageTitle()}
                </h1>

                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--texto3)' }}>
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar KPI, área o usuario..."
                        style={{
                            padding: '8px 10px 8px 36px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--borde)',
                            width: '260px',
                            outline: 'none',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'var(--texto)',
                            fontSize: '0.85rem',
                            transition: 'border-color var(--transition-fast)'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--borde2)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--borde)'}
                    />
                </div>
            </div>

            {/* 2. Tenant y Period Switchers + Trazabilidad */}
            <div style={{ display: 'flex', gap: '2rem', height: '100%', alignItems: 'center' }}>

                {/* Period Switcher (Siempre visible) */}
                <select style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(50, 145, 255, 0.3)',
                    outline: 'none',
                    fontWeight: 600,
                    background: 'var(--azul-bg)',
                    color: 'var(--azul-primary)',
                    cursor: 'pointer',
                    fontSize: 'var(--font-sm)'
                }}>
                    <option value="2026-03">Marzo 2026 (Open)</option>
                    <option value="2026-02">Febrero 2026 (Closed)</option>
                    <option value="2026-01">Enero 2026 (Closed)</option>
                </select>

                {/* Notificaciones y Perfil */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    color: 'var(--texto2)',
                }}>
                    <div style={{ cursor: 'pointer', position: 'relative', display: 'flex' }}>
                        <Bell size={20} />
                        <span style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            background: 'var(--rojo)',
                            color: 'white',
                            fontSize: '10px',
                            borderRadius: 'var(--radius-full)',
                            padding: '2px 5px',
                            fontWeight: 'bold',
                            boxShadow: '0 0 0 2px var(--bg)'
                        }}>2</span>
                    </div>

                    <div style={{ cursor: 'pointer', display: 'flex' }}>
                        <Settings size={20} />
                    </div>

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
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-glow)'
                    }}>VA</div>
                </div>
            </div>
        </div>
    );
}
