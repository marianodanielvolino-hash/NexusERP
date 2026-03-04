"use client";

import { usePathname } from 'next/navigation';

export function Topbar() {
    const pathname = usePathname();

    // Format title dynamically based on route (just as an example, could be a store or context)
    const getTitle = () => {
        if (pathname === '/') return "Dashboard Ejecutivo";
        if (pathname.includes('/carga')) return "Motor de Carga";
        if (pathname.includes('/admin/areas')) return "ABM de Áreas";
        if (pathname.includes('/admin/indicadores')) return "ABM de Indicadores";
        return "Nexus SCG";
    };

    return (
        <div className="topbar">
            <div className="tb-title">
                {getTitle()}
            </div>
            <div className="tb-actions">
                <button className="btn btn-ghost">Exportar</button>
                <button className="btn btn-primary">+ Nuevo</button>
            </div>
        </div>
    );
}
