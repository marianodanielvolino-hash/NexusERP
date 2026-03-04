"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/') ? 'act' : '';

  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <div className="sb-logo-row">
          <div className="sb-mark">EN</div>
          <div className="sb-name">ENERSA</div>
        </div>
        <span className="sb-tag">Nexus SCG</span>
      </div>

      <div className="sb-admin-badge">
        <div className="sb-admin-avatar">RG</div>
        <div>
          <div className="sb-admin-name">Roberto García</div>
          <div className="sb-admin-role">Administrador del sistema</div>
        </div>
      </div>

      <nav className="sb-nav">
        <div className="sb-section">Dashboard</div>
        <Link href="/" className={`sb-item ${isActive('/') && pathname === '/' ? 'act' : ''}`}>
          <span className="sb-icon">📈</span> Resumen Ejecutivo
        </Link>
        <Link href="/carga" className={`sb-item ${isActive('/carga')}`}>
          <span className="sb-icon">✏️</span> Carga de Indicadores
        </Link>
        
        <div className="sb-section">Entidades (ABM)</div>
        <Link href="/admin/areas" className={`sb-item ${isActive('/admin/areas')}`}>
          <span className="sb-icon">🏢</span> Áreas
        </Link>
        <Link href="/admin/indicadores" className={`sb-item ${isActive('/admin/indicadores')}`}>
          <span className="sb-icon">📊</span> Indicadores
        </Link>
        <Link href="/admin/usuarios" className={`sb-item ${isActive('/admin/usuarios')}`}>
          <span className="sb-icon">👥</span> Usuarios
        </Link>
        <Link href="/admin/periodos" className={`sb-item ${isActive('/admin/periodos')}`}>
          <span className="sb-icon">📅</span> Períodos
        </Link>
      </nav>

      <div className="sb-footer">
        Nexus SCG v1.0<br/>
        Sesión activa: SuperAdmin
      </div>
    </aside>
  );
}
