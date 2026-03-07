"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role } from '@/lib/types';
import {
  Home,
  Calendar,
  Edit3,
  CheckCircle2,
  BarChart2,
  LayoutDashboard,
  FileText,
  Paperclip,
  Cpu,
  Settings,
  Search,
  HelpCircle
} from 'lucide-react';

// TODO: Replace with real user context
const mockUserRoles: Role[] = ["EJ"];

interface NavItem {
  label: string;
  href: string;
  icon: any; // Using any for simplicity in the mapping
  requiredRoles?: Role[];
}

const navItems: { section: string, items: NavItem[] }[] = [
  {
    section: "Operación",
    items: [
      { label: "Inicio", href: "/", icon: Home },
      { label: "Períodos", href: "/periodos", icon: Calendar },
      { label: "Carga", href: "/carga", icon: Edit3 },
      { label: "Validaciones", href: "/validaciones", icon: CheckCircle2 },
    ]
  },
  {
    section: "Análisis",
    items: [
      { label: "Indicadores", href: "/indicadores", icon: BarChart2 },
      { label: "Tableros", href: "/tableros", icon: LayoutDashboard },
      { label: "Reportes", href: "/reportes", icon: FileText },
      { label: "Evidencias", href: "/evidencias", icon: Paperclip },
    ]
  },
  {
    section: "Gestión",
    items: [
      { label: "Integraciones", href: "/integraciones", icon: Cpu, requiredRoles: ["EJ", "INTADM"] },
      { label: "Administración", href: "/admin", icon: Settings, requiredRoles: ["EJ"] },
      { label: "Auditoría", href: "/auditoria", icon: Search, requiredRoles: ["EJ", "AUD"] },
      { label: "Ayuda", href: "/ayuda", icon: HelpCircle },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/' ? 'act' : '';
    return pathname.startsWith(path) ? 'act' : '';
  };

  const checkAccess = (requiredRoles?: Role[]) => {
    if (!requiredRoles) return true;
    return requiredRoles.some(r => mockUserRoles.includes(r));
  };

  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <div className="sb-logo-row">
          <div className="sb-mark">NX</div>
          <div className="sb-name">NEXUS SCG</div>
        </div>
        <span className="sb-tag">Sistema de Control y Gestión Version 1.0</span>
      </div>

      <div className="sb-admin-badge">
        <div className="sb-admin-avatar">EJ</div>
        <div style={{ overflow: 'hidden' }}>
          <div className="sb-admin-name" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Ejecutivo</div>
          <div className="sb-admin-role">Admin global</div>
        </div>
      </div>

      <nav className="sb-nav">
        {navItems.map((group, idx) => {
          const visibleItems = group.items.filter(item => checkAccess(item.requiredRoles));
          if (visibleItems.length === 0) return null;

          return (
            <div key={idx}>
              <div className="sb-section">{group.section}</div>
              {visibleItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className={`sb-item ${isActive(item.href)}`}>
                    <span className="sb-icon"><Icon size={18} /></span> {item.label}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="sb-footer">
        Nexus SCG v1.0<br />
        Sesión activa: Ejecutivo
      </div>
    </aside>
  );
}
