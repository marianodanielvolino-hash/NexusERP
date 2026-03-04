import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export const metadata: Metadata = {
  title: "Nexus SCG - Sistema de Control de Gestión",
  description: "Plataforma SaaS Multi-Tenant y White Label para ENERSA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Sidebar />
        <div className="main">
          <Topbar />
          <div className="content">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
