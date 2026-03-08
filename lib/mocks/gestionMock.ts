// ─── SPRINT 1: "EL MÉTODO" MOCK DATA ───────────────────────────────────────────
// Datos Reactivos (No conectados a DB aún) para Proyectos y Compromisos

export interface ProyectoMetodo {
    id: string;
    nombre: string;
    clienteId: string;
    fechaInicio: string;
    fechaFin: string;
    avanceReal: number; // 0 a 100
    avancePlanificado: number; // 0 a 100
    responsable: string;
}

export interface CompromisoMetodo {
    id: string;
    descripcion: string;
    proyectoId: string;
    clienteId: string;
    asignadoA: string;
    fechaCreacion: string;
    fechaVencimiento: string; // ISO String (ej. "2026-03-05")
    estado: "pendiente" | "completado";
    origen: string; // Ej: "Reunión Semanal de Avance"
}

// Simulamos una fecha actual (Mockeada a fines de la prueba)
export const CURRENT_DATE_MOCK = "2026-03-07";

export const METODO_MOCK_DATA = {
    proyectos: [
        {
            id: "p-01",
            nombre: "Despliegue Redes Fibra Óptica - Norte",
            clienteId: "enersa", // Mapea a un cliente del repo principal
            fechaInicio: "2025-10-01",
            fechaFin: "2026-06-30",
            avanceReal: 42,
            avancePlanificado: 40,
            responsable: "Ing. R. Méndez"
        },
        {
            id: "p-02",
            nombre: "Actualización Infraestructura Core",
            clienteId: "enersa",
            fechaInicio: "2026-01-15",
            fechaFin: "2026-04-15",
            avanceReal: 15,
            avancePlanificado: 25, // Desvío moderado (Amarillo)
            responsable: "A. López"
        },
        {
            id: "p-03",
            nombre: "Certificación ISO 9001 - Centros",
            clienteId: "nexus-social",
            fechaInicio: "2025-08-01",
            fechaFin: "2026-02-28", // Vencido
            avanceReal: 78,
            avancePlanificado: 100, // Desvío grave (Rojo)
            responsable: "Lic. M. Soria"
        },
        {
            id: "p-04",
            nombre: "Expansión Planta Tratamiento Sur",
            clienteId: "aguasarq",
            fechaInicio: "2025-11-01",
            fechaFin: "2026-11-01",
            avanceReal: 32,
            avancePlanificado: 33, // Ok (Verde)
            responsable: "Ing. V. Costa"
        }
    ] as ProyectoMetodo[],

    compromisos: [
        {
            id: "c-101",
            descripcion: "Enviar informe técnico de viabilidad al municipio",
            proyectoId: "p-01",
            clienteId: "enersa",
            asignadoA: "R. Méndez",
            fechaCreacion: "2026-03-03",
            fechaVencimiento: "2026-03-09", // Futuro (Ok)
            estado: "pendiente",
            origen: "Comité Ejecutivo Mensual"
        },
        {
            id: "c-102",
            descripcion: "Aprobar presupuesto adicional para cableado estructurado",
            proyectoId: "p-02",
            clienteId: "enersa",
            asignadoA: "Directorio",
            fechaCreacion: "2026-02-28",
            fechaVencimiento: "2026-03-04", // Pasado (Rojo / Vencido)
            estado: "pendiente",
            origen: "Reunión Extraordinaria"
        },
        {
            id: "c-103",
            descripcion: "Corregir manuales de procedimiento auditados",
            proyectoId: "p-03",
            clienteId: "nexus-social",
            asignadoA: "M. Soria",
            fechaCreacion: "2026-02-15",
            fechaVencimiento: "2026-03-06", // Pasado Ayer (Rojo / Vencido)
            estado: "pendiente",
            origen: "Auditoría Externa Fase 1"
        },
        {
            id: "c-104",
            descripcion: "Presentar alternativas constructivas a proveedores",
            proyectoId: "p-04",
            clienteId: "aguasarq",
            asignadoA: "V. Costa",
            fechaCreacion: "2026-03-06",
            fechaVencimiento: "2026-03-12", // Futuro (Ok)
            estado: "pendiente",
            origen: "Mesa Técnica Semanal"
        }
    ] as CompromisoMetodo[],
};

// Funcionalidades Utilitarias de Semáforo (El Método) para la UI

export function calcularEstadoProyecto(real: number, planificado: number): "verde" | "amarillo" | "rojo" {
    const desvio = planificado - real;
    if (desvio <= 5) return "verde";
    if (desvio > 5 && desvio <= 15) return "amarillo";
    return "rojo"; // > 15
}

export function estaVencido(fechaVencimientoStr: string): boolean {
    // Retorna true si CURRENT_DATE_MOCK es mayor a fechaVencimientoStr
    return CURRENT_DATE_MOCK > fechaVencimientoStr;
}

export function getColorSemaforo(estado: 'verde' | 'amarillo' | 'rojo'): string {
    const tones = {
        verde: "#10b981",
        amarillo: "#f59e0b",
        rojo: "#ef4444"
    };
    return tones[estado] || "#6b7280";
}

export function getBadgeColor(estado: 'verde' | 'amarillo' | 'rojo'): string {
    const badges = {
        verde: "rgba(16,185,129,0.15)",
        amarillo: "rgba(245,158,11,0.15)",
        rojo: "rgba(239,68,68,0.15)"
    };
    return badges[estado];
}
