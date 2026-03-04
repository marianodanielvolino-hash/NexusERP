# Nexus SCG - Sistema de Control de Gestión

**Plataforma SaaS · White Label · Multi-Tenant**

## Descripción
Nexus SCG es una plataforma SaaS de Control de Gestión diseñada para transformar la información operativa dispersa en tableros de monitoreo unificados, facilitando la toma de decisiones basada en evidencia. Desarrollada inicialmente para ENERSA como cliente fundacional, su arquitectura multi-tenant permite su comercialización como producto de marca blanca para múltiples organizaciones con aislamiento total de datos.

## Características Principales
- **Arquitectura Multi-Tenant Segura**: Motor relacional PostgreSQL con Row-Level Security (RLS) que garantiza aislamiento total por cliente.
- **Control de Accesos Basado en Roles (RBAC)**: Flujos de acceso para perfiles Ejecutivo (solo lectura/tableros), Gestión (validación) y Carga (operativo técnico).
- **Interfaz Premium (UI/UX)**: Diseño basado en *Glassmorphism* y dualidad de modo nativo (Dark/Light mode) que se adapta a las preferencias del sistema.
- **Motor de Carga Universal**: Fomularios de carga dinámicos que se generan desde la base de datos según las definiciones de KPIs. Validación en tiempo real con semaforización.
- **Analítica y Asistente de IA**: Tableros de resumen global y por área, micro-animaciones en métricas y un motor de inteligencia artificial integrado para interactuar con los datos.

## Tecnologías Implementadas
- **Frontend**: Next.js (App Router), React, Vanilla CSS con custom properties.
- **Backend / Base de datos**: Diseño preparado para PostgreSQL y Supabase (con RLS para el aislamiento).
- **Almacenamiento**: Manejo de evidencias vía Storage buckets (por integrar).

## Despliegue Local
El entorno local inicializa la interfaz de usuario para comenzar la iteración sobre la base multi-tenant.

```bash
# Instalar dependencias
npm install

# Iniciar el servidor local
npm run dev
```

El servidor estará disponible en [http://localhost:3000](http://localhost:3000).
