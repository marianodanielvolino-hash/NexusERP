"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/actions/auth";
import { EmptyState } from "./ui/EmptyState";
import { SlideDrawer } from "./ui/SlideDrawer";
import { Skeleton, CardSkeleton } from "./ui/Skeleton";
import { Tooltip } from "./ui/Tooltip";
import { getNexusClients, getNexusProjects, getNexusKPIs, getHubStats, createNexusClient, createNexusProject } from "@/lib/actions/nexus";

// ─── DEMO DATA (Mantained ONLY as Fallback during Phase 4 transition) ───────
const DEMO_DATA = {
    clients: [
        {
            id: "enersa",
            name: "ENERSA",
            fullName: "Empresa Neuquina de Servicios de Ingeniería S.A.",
            sector: "Energía Eléctrica",
            country: "Argentina",
            logo: "⚡",
            color: "#f59e0b",
            accent: "#fbbf24",
            status: "active",
            plan: "Enterprise",
            since: "2024-01",
            users: 48,
        },
        {
            id: "nexus-social",
            name: "Nexus Social",
            fullName: "Red de Centros de Inclusión Social",
            sector: "Inclusión Social",
            country: "Argentina",
            logo: "🏠",
            color: "#6366f1",
            accent: "#818cf8",
            status: "active",
            plan: "Professional",
            since: "2024-06",
            users: 32,
        },
        {
            id: "aguasarq",
            name: "AguasARQ",
            fullName: "Administración Regional de Aguas de Quequén",
            sector: "Agua y Saneamiento",
            country: "Argentina",
            logo: "💧",
            color: "#0ea5e9",
            accent: "#38bdf8",
            status: "active",
            plan: "Standard",
            since: "2025-01",
            users: 21,
        },
        {
            id: "healthplus",
            name: "HealthPlus",
            fullName: "Red Hospitalaria HealthPlus",
            sector: "Salud",
            country: "Chile",
            logo: "🏥",
            color: "#10b981",
            accent: "#34d399",
            status: "pilot",
            plan: "Pilot",
            since: "2025-09",
            users: 15,
        },
    ],
    projects: {
        enersa: [
            {
                id: "enersa-ctrl",
                name: "Control de Gestión Operativa",
                description: "Tableros de indicadores comerciales, operativos y de calidad de servicio eléctrico",
                areas: ["Comercial", "Operaciones", "Calidad de Servicio", "Admin & Finanzas", "Obras"],
                kpis: 24,
                periods: 12,
                status: "active",
                lastUpdate: "2026-03-05",
                health: 82,
                icon: "📊",
            },
            {
                id: "enersa-obras",
                name: "Seguimiento de Obras",
                description: "Gestión de proyectos de infraestructura eléctrica y control de avance físico-financiero",
                areas: ["Planificación", "Ejecución", "Calidad Técnica"],
                kpis: 16,
                periods: 8,
                status: "active",
                lastUpdate: "2026-03-04",
                health: 74,
                icon: "🏗️",
            },
        ],
        "nexus-social": [
            {
                id: "social-cis",
                name: "Control de Centros CIS",
                description: "Indicadores de impacto social, bienestar y operación de centros de inclusión",
                areas: ["Staff", "Dispositivo", "Comunidad", "Autonomía"],
                kpis: 12,
                periods: 7,
                status: "active",
                lastUpdate: "2026-03-03",
                health: 68,
                icon: "👥",
            },
        ],
        aguasarq: [
            {
                id: "agua-calidad",
                name: "Calidad del Servicio Hídrico",
                description: "Continuidad, presión y calidad físico-química del agua distribuida",
                areas: ["Producción", "Distribución", "Calidad", "Comercial"],
                kpis: 18,
                periods: 6,
                status: "active",
                lastUpdate: "2026-02-28",
                health: 91,
                icon: "🔬",
            },
        ],
        healthplus: [
            {
                id: "health-kpi",
                name: "Indicadores Clínicos",
                description: "Dashboard de KPIs hospitalarios: tiempos de espera, ocupación, readmisiones",
                areas: ["Urgencias", "Internación", "Cirugía", "Calidad Clínica"],
                kpis: 20,
                periods: 3,
                status: "setup",
                lastUpdate: "2026-01-15",
                health: 55,
                icon: "📈",
            },
        ],
    },
    kpis: {
        "enersa-ctrl": {
            areas: {
                Comercial: {
                    score: 84,
                    trend: -2,
                    indicators: [
                        { name: "Índice de Cobrabilidad", value: 84, target: 92, unit: "%", status: "alert" },
                        { name: "Morosidad", value: 18, target: 15, unit: "%", status: "critical", polarity: "lower" },
                        { name: "Nuevos Clientes", value: 142, target: 120, unit: "clientes", status: "ok" },
                        { name: "Reclamos Resueltos", value: 87, target: 90, unit: "%", status: "alert" },
                    ],
                },
                Operaciones: {
                    score: 91,
                    trend: 1,
                    indicators: [
                        { name: "Disponibilidad de Red", value: 98.2, target: 97, unit: "%", status: "ok" },
                        { name: "MTTR", value: 3.2, target: 4, unit: "hs", status: "ok", polarity: "lower" },
                        { name: "Cuadrillas Activas", value: 94, target: 90, unit: "%", status: "ok" },
                        { name: "Órdenes Ejecutadas", value: 312, target: 280, unit: "OT", status: "ok" },
                    ],
                },
                "Calidad de Servicio": {
                    score: 71,
                    trend: -4,
                    indicators: [
                        { name: "SAIDI", value: 12.4, target: 10, unit: "hs/usu", status: "critical", polarity: "lower" },
                        { name: "SAIFI", value: 4.1, target: 3.5, unit: "int/usu", status: "alert", polarity: "lower" },
                        { name: "ENS", value: 28.4, target: 25, unit: "MWh", status: "alert", polarity: "lower" },
                    ],
                },
                "Admin & Finanzas": {
                    score: 88,
                    trend: 3,
                    indicators: [
                        { name: "Ejecución Presupuestal", value: 91, target: 85, unit: "%", status: "ok" },
                        { name: "Costo Operativo", value: 102, target: 110, unit: "$/MWh", status: "ok", polarity: "lower" },
                    ],
                },
            },
            timeline: [
                { period: "Sep'25", global: 76 },
                { period: "Oct'25", global: 78 },
                { period: "Nov'25", global: 79 },
                { period: "Dic'25", global: 81 },
                { period: "Ene'26", global: 84 },
                { period: "Feb'26", global: 82 },
            ],
        },
        "social-cis": {
            areas: {
                Staff: {
                    score: 62,
                    trend: -1,
                    indicators: [
                        { name: "Burnout Index", value: 64, target: 58, unit: "pts", status: "alert", polarity: "lower" },
                        { name: "Ausentismo", value: 12, target: 10, unit: "%", status: "alert", polarity: "lower" },
                        { name: "Autoeficacia", value: 72, target: 80, unit: "pts", status: "alert" },
                    ],
                },
                Dispositivo: {
                    score: 75,
                    trend: 2,
                    indicators: [
                        { name: "Incidentes", value: 18, target: 14, unit: "casos", status: "alert", polarity: "lower" },
                        { name: "Clima de Convivencia", value: 68, target: 75, unit: "pts", status: "alert" },
                        { name: "Continuidad Actividades", value: 82, target: 85, unit: "%", status: "alert" },
                    ],
                },
                Comunidad: {
                    score: 71,
                    trend: 1,
                    indicators: [
                        { name: "Participación Espacios", value: 58, target: 65, unit: "%", status: "alert" },
                        { name: "Permanencia", value: 79, target: 80, unit: "%", status: "alert" },
                    ],
                },
                Autonomía: {
                    score: 60,
                    trend: 3,
                    indicators: [
                        { name: "Adherencia Rutina", value: 62, target: 70, unit: "pts", status: "alert" },
                        { name: "Cambio Narrativa", value: 55, target: 65, unit: "pts", status: "alert" },
                        { name: "Vínculo Prosocial", value: 63, target: 75, unit: "pts", status: "alert" },
                    ],
                },
            },
            timeline: [
                { period: "Ene'26", global: 60 },
                { period: "Feb'26", global: 62 },
                { period: "Mar'26", global: 65 },
                { period: "Abr'26", global: 67 },
                { period: "May'26", global: 68 },
                { period: "Jun'26", global: 71 },
            ],
        },
        "agua-calidad": {
            areas: {
                Producción: {
                    score: 94,
                    trend: 1,
                    indicators: [
                        { name: "Caudal Producido", value: 98, target: 95, unit: "%", status: "ok" },
                        { name: "Eficiencia Bombeo", value: 87, target: 85, unit: "%", status: "ok" },
                    ],
                },
                Distribución: {
                    score: 89,
                    trend: 2,
                    indicators: [
                        { name: "Presión de Servicio", value: 92, target: 90, unit: "%", status: "ok" },
                        { name: "Pérdidas de Red", value: 14, target: 18, unit: "%", status: "ok", polarity: "lower" },
                    ],
                },
                Calidad: {
                    score: 96,
                    trend: 0,
                    indicators: [
                        { name: "Cumplimiento ENRESS", value: 99.1, target: 98, unit: "%", status: "ok" },
                        { name: "Turbiedad", value: 0.3, target: 1.0, unit: "NTU", status: "ok", polarity: "lower" },
                    ],
                },
                Comercial: {
                    score: 84,
                    trend: -1,
                    indicators: [
                        { name: "Cobrabilidad", value: 86, target: 90, unit: "%", status: "alert" },
                        { name: "Medidores Activos", value: 91, target: 95, unit: "%", status: "alert" },
                    ],
                },
            },
            timeline: [
                { period: "Sep'25", global: 88 },
                { period: "Oct'25", global: 89 },
                { period: "Nov'25", global: 90 },
                { period: "Dic'25", global: 91 },
                { period: "Ene'26", global: 92 },
                { period: "Feb'26", global: 91 },
            ],
        },
    },
};

// ─── UTILS ────────────────────────────────────────────────────────────────────
const statusColor = (s: string) => (({ ok: "#10b981", alert: "#f59e0b", critical: "#ef4444", setup: "#6366f1" } as any)[s] || "#6b7280");
const statusBg = (s: string) => (({ ok: "rgba(16,185,129,0.12)", alert: "rgba(245,158,11,0.12)", critical: "rgba(239,68,68,0.12)", setup: "rgba(99,102,241,0.12)" } as any)[s] || "rgba(107,114,128,0.1)");
const statusLabel = (s: string) => (({ ok: "✓ En Meta", alert: "⚠ En Alerta", critical: "✗ Crítico", setup: "◆ Configurando" } as any)[s] || s);
const healthStatus = (h: number) => h >= 85 ? "ok" : h >= 70 ? "alert" : "critical";

// ─── SPARKLINE ────────────────────────────────────────────────────────────────
function Sparkline({ data, color = "#6366f1", width = 80, height = 32 }: any) {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pts = data.map((v: any, i: number) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    }).join(" ");
    return (
        <svg width={width} height={height} style={{ overflow: "visible" }}>
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={pts.split(" ").pop()?.split(",")[0] || 0} cy={pts.split(" ").pop()?.split(",")[1] || 0} r="2.5" fill={color} />
        </svg>
    );
}

// ─── GAUGE ────────────────────────────────────────────────────────────────────
function GaugeArc({ value, color, size = 80 }: any) {
    const r = (size / 2) - 8;
    const circ = Math.PI * r;
    const dash = (value / 100) * circ;
    return (
        <svg width={size} height={size / 2 + 8} style={{ overflow: "visible" }}>
            <path d={`M8,${size / 2} A${r},${r} 0 0,1 ${size - 8},${size / 2}`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round" />
            <path d={`M8,${size / 2} A${r},${r} 0 0,1 ${size - 8},${size / 2}`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`} style={{ transition: "stroke-dasharray 1s ease" }} />
            <text x={size / 2} y={size / 2 + 2} textAnchor="middle" fill={color} fontSize="15" fontWeight="700">{value}%</text>
        </svg>
    );
}

// ─── BAR CHART ────────────────────────────────────────────────────────────────
function MiniBar({ timeline, color }: any) {
    if (!timeline) return null;
    const max = Math.max(...timeline.map((t: any) => t.global));
    const min = Math.min(...timeline.map((t: any) => t.global)) - 5;
    return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "48px" }}>
            {timeline.map((t: any, i: number) => {
                const h = ((t.global - min) / (max - min)) * 40 + 4;
                const isLast = i === timeline.length - 1;
                return (
                    <div key={i} title={`${t.period}: ${t.global}%`} style={{
                        flex: 1, height: `${h}px`, borderRadius: "3px 3px 0 0",
                        background: isLast ? color : `${color}55`,
                        transition: "height 0.8s ease", cursor: "default",
                        position: "relative"
                    }}>
                        {isLast && <span style={{ position: "absolute", top: "-16px", left: "50%", transform: "translateX(-50%)", fontSize: "9px", color, fontWeight: 700, whiteSpace: "nowrap" }}>{t.global}%</span>}
                    </div>
                );
            })}
        </div>
    );
}

// ─── ICONS (Futuristic SVGs) ──────────────────────────────────────────────────
const ICONS = {
    Hub: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
    ),
    Integrations: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
        </svg>
    ),
    Admin: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    ),
    Projects: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
    ),
    Stats: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    )
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function NexusPlatform() {
    const [view, setView] = useState("hub"); // hub | client | project | kpis | integrations | admin
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [sideOpen, setSideOpen] = useState(true);
    const [aiOpen, setAiOpen] = useState(false);
    const [aiMessages, setAiMessages] = useState<any[]>([]);
    const [aiInput, setAiInput] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [notification, setNotification] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    // Phase 4: DB States 
    const [dbClients, setDbClients] = useState<any[]>([]);
    const [dbProjects, setDbProjects] = useState<any[]>([]);
    const [kpiData, setKpiData] = useState<any>(null);
    const [hubStats, setHubStats] = useState({ totalClients: 0, totalProjects: 0, totalKPIs: 0, avgHealth: 0 });
    const [client, setClient] = useState<any>(null);

    // --- Phase 2: Action Feedback, perceived speed & temporal context ---
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerContent, setDrawerContent] = useState<"new_client" | "new_project" | "config" | null>(null);
    const [drawerInputName, setDrawerInputName] = useState("");
    const [drawerInputSector, setDrawerInputSector] = useState("Energía Eléctrica");
    const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);
    // Hardcoded initial contextual period
    const [globalPeriod, setGlobalPeriod] = useState("Oct'25");

    // --- Phase 3: Alerts Center and Settings
    const [alertsOpen, setAlertsOpen] = useState(false);
    const [themeToggle, setThemeToggle] = useState<"dark" | "light">("dark");

    const brandColor = client?.color || '#3b82f6'; // Dynamic mapping
    const aiRef = useRef<any>(null);
    const supabase = createClient();

    // Initial Fetch (User, Clients, Hub Stats)
    useEffect(() => {
        const fetchInitial = async () => {
            setIsSimulatingLoad(true);
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            const [clients, stats] = await Promise.all([
                getNexusClients(),
                getHubStats()
            ]);

            setDbClients(clients.length > 0 ? clients : DEMO_DATA.clients);
            setHubStats(stats);
            if (clients.length > 0) setClient(clients[0]);

            setIsSimulatingLoad(false);
        };
        fetchInitial();
    }, [supabase.auth]);

    // Fetch Projects when Client Changes
    useEffect(() => {
        if (!selectedClient) {
            setDbProjects([]);
            return;
        }
        const fetchProj = async () => {
            setIsSimulatingLoad(true);
            const projs = await getNexusProjects(selectedClient);
            // Fallback to DEMO_DATA logic ONLY if DB is completely empty (For ease of migration presentation)
            setDbProjects(projs.length > 0 ? projs : (DEMO_DATA.projects as any)[selectedClient] || []);
            setIsSimulatingLoad(false);
        };
        fetchProj();
    }, [selectedClient]);

    // Fetch KPIs when Project Changes
    useEffect(() => {
        if (!selectedProject) {
            setKpiData(null);
            return;
        }
        const fetchKpis = async () => {
            setIsSimulatingLoad(true);
            const data = await getNexusKPIs(selectedProject);
            setKpiData(data ? data : (DEMO_DATA.kpis as any)[selectedProject]);
            setIsSimulatingLoad(false);
        };
        fetchKpis();
    }, [selectedProject]);

    const activeClient = dbClients.find(c => c.id === selectedClient);
    const projects = dbProjects;
    const project = dbProjects.find(p => p.id === selectedProject);

    const notify = (msg: string, type = "info") => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3500);
    };

    const selectClient = (cid: string) => {
        setIsSimulatingLoad(true);
        setSelectedClient(cid);
        setSelectedProject(null);
        setView("client");
        setTimeout(() => setIsSimulatingLoad(false), 600);
    };

    const selectProject = (pid: string) => {
        setIsSimulatingLoad(true);
        setSelectedProject(pid);
        setView("kpis");
        setTimeout(() => setIsSimulatingLoad(false), 600);
    };

    const changeView = (v: string) => {
        setIsSimulatingLoad(true);
        setView(v);
        setSelectedClient(null);
        setSelectedProject(null);
        setTimeout(() => setIsSimulatingLoad(false), 500);
    };

    const openDrawer = (content: "new_client" | "new_project" | "config") => {
        setDrawerContent(content);
        setDrawerOpen(true);
    };

    const sendAI = async () => {
        if (!aiInput.trim() || aiLoading) return;
        const userMsg = aiInput.trim();
        setAiInput("");
        setAiMessages(m => [...m, { role: "user", content: userMsg }]);
        setAiLoading(true);

        const context = `Eres el asistente de análisis de Nexus SCG, una plataforma SaaS de control de gestión. 
Contexto actual: Cliente=${client?.name || "ninguno"}, Proyecto=${project?.name || "ninguno"}.
${kpiData ? `Datos disponibles: ${JSON.stringify(Object.entries(kpiData.areas).map(([a, d]: any) => ({ area: a, score: d.score, kpis: d.indicators.map((i: any) => ({ nombre: i.name, valor: i.value, meta: i.target, estado: i.status })) })))}` : "No hay datos de KPIs cargados."}
Responde de forma concisa y útil en español. Si hay alertas o indicadores críticos, destácalos.`;

        try {
            const res = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514", // This may fail if api key is absent
                    max_tokens: 1000,
                    system: context,
                    messages: [
                        ...aiMessages.filter(m => m.role !== "system"),
                        { role: "user", content: userMsg }
                    ]
                })
            });
            const data = await res.json();
            const reply = data.content?.find((b: any) => b.type === "text")?.text || "Sin respuesta.";
            setAiMessages(m => [...m, { role: "assistant", content: reply }]);
        } catch {
            setAiMessages(m => [...m, { role: "assistant", content: "Error al conectar con el asistente. Verifica la conexión." }]);
        }
        setAiLoading(false);
    };

    // Scroll AI to bottom
    useEffect(() => {
        if (aiRef.current) aiRef.current.scrollTop = aiRef.current.scrollHeight;
    }, [aiMessages]);

    const styles: any = {
        root: {
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            background: "#0a0b0f",
            color: "#e2e8f0",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            fontSize: "14px",
        },
        topbar: {
            height: "52px",
            background: "rgba(15,16,22,0.95)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: "12px",
            position: "sticky",
            top: 0,
            zIndex: 100,
            backdropFilter: "blur(12px)",
        },
        logo: {
            fontWeight: "800",
            fontSize: "15px",
            letterSpacing: "0.05em",
            color: "#f8fafc",
            display: "flex",
            alignItems: "center",
            gap: "8px",
        },
        logoMark: {
            width: "28px",
            height: "28px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: "7px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: "900",
            color: "#fff",
        },
        breadcrumb: {
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "#64748b",
            marginLeft: "4px",
        },
        bcrumb: { cursor: "pointer", color: "#94a3b8", transition: "color 0.2s" },
        topRight: {
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "8px",
        },
        iconBtn: {
            width: "32px", height: "32px", borderRadius: "8px",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", color: "#94a3b8", transition: "all 0.2s",
        },
        pill: {
            padding: "3px 10px", borderRadius: "100px",
            fontSize: "11px", fontWeight: "600",
        },
        layout: { display: "flex", flex: 1, overflow: "hidden" },
        sidebar: {
            width: sideOpen ? "220px" : "0px",
            minWidth: sideOpen ? "220px" : "0px",
            background: "#0d0e14",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
            display: "flex",
            flexDirection: "column",
        },
        sideSection: { padding: "16px 12px 8px", fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em", color: "#475569", textTransform: "uppercase" },
        sideItem: (active: boolean) => ({
            padding: "8px 12px", borderRadius: "8px", cursor: "pointer", margin: "1px 8px",
            display: "flex", alignItems: "center", gap: "9px", fontSize: "13px",
            color: active ? "#f8fafc" : "#64748b",
            background: active ? "rgba(99,102,241,0.15)" : "transparent",
            fontWeight: active ? "600" : "400",
            transition: "all 0.15s",
            borderLeft: active ? "2px solid #6366f1" : "2px solid transparent",
        }),
        main: {
            flex: 1,
            overflow: "auto",
            padding: "24px",
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
        },
        card: {
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            overflow: "hidden",
        },
        cardPad: { padding: "20px" },
        h1: { fontSize: "22px", fontWeight: "700", color: "#f8fafc", margin: "0 0 4px" },
        h2: { fontSize: "16px", fontWeight: "600", color: "#f8fafc", margin: "0 0 2px" },
        sub: { fontSize: "13px", color: "#64748b" },
        grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
        grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" },
        grid4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" },
        btn: (variant = "default") => ({
            padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600",
            border: "none", display: "inline-flex", alignItems: "center", gap: "6px", transition: "all 0.2s",
            ...(variant === "primary" ? { background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff" } :
                variant === "ghost" ? { background: "transparent", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" } :
                    { background: "rgba(255,255,255,0.06)", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.1)" }),
        }),
        tag: (color: string) => ({
            padding: "2px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: "600",
            background: `${color}22`, color: color, display: "inline-block",
        }),
    };

    const SideNav = () => (
        <div style={styles.sidebar}>
            <div style={styles.sideSection}>Sistema</div>
            {[
                { label: "Hub de Control", icon: <ICONS.Hub />, id: "hub" },
                { label: "Integraciones", icon: <ICONS.Integrations />, id: "integrations" },
                { label: "Administración", icon: <ICONS.Admin />, id: "admin" },
            ].map(item => (
                <div key={item.id} style={styles.sideItem(view === item.id && !selectedClient)} onClick={() => changeView(item.id)}>
                    <span style={{ display: 'flex' }}>{item.icon}</span>{item.label}
                </div>
            ))}

            {selectedClient && (
                <>
                    <div style={styles.sideSection}>Organización: {client?.name}</div>
                    <div style={styles.sideItem(view === "client")} onClick={() => { setView("client"); setSelectedProject(null); setIsSimulatingLoad(true); setTimeout(() => setIsSimulatingLoad(false), 400); }}>
                        <span style={{ display: 'flex' }}><ICONS.Projects /></span>Portafolio
                    </div>
                    {projects.map((p: any) => (
                        <div key={p.id} style={styles.sideItem(selectedProject === p.id)} onClick={() => selectProject(p.id)}>
                            <span style={{ fontSize: '18px' }}>{p.icon}</span>
                            <span style={{ fontSize: "12px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</span>
                        </div>
                    ))}
                </>
            )}

            <div style={{ flex: 1 }} />
            <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px", marginBottom: "8px" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700" }}>
                        {user?.email?.substring(0, 2).toUpperCase() || "U"}
                    </div>
                    <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: "12px", fontWeight: "600", color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {user?.email?.split('@')[0] || "Cargando..."}
                        </div>
                        <div style={{ fontSize: "11px", color: "#475569" }}>{user?.app_metadata?.rol || "Usuario"}</div>
                    </div>
                </div>
                <button
                    onClick={() => signOut()}
                    style={{
                        width: '100%',
                        padding: '6px',
                        fontSize: '11px',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#94a3b8',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );

    // ── HUB VIEW ──────────────────────────────────────────────────────────────
    const HubView = () => {
        return (
            <div>
                <div style={{ marginBottom: "24px" }}>
                    <h1 style={styles.h1}>Hub Global · Nexus SCG</h1>
                    <p style={styles.sub}>Plataforma de Control de Gestión · Multi-Cliente · Multi-Proyecto · v2.0</p>
                </div>

                {/* Stats */}
                <div style={{ ...styles.grid4, marginBottom: "24px" }}>
                    {[
                        { label: "Clientes Activos", value: hubStats.totalClients || dbClients.length, icon: <ICONS.Projects />, color: "#6366f1", sub: `${hubStats.totalClients || dbClients.length} totales` },
                        { label: "Proyectos", value: hubStats.totalProjects, icon: <ICONS.Hub />, color: "#10b981", sub: "en ejecución" },
                        { label: "KPIs Activos", value: hubStats.totalKPIs, icon: <ICONS.Stats />, color: "#f59e0b", sub: "con datos cargados" },
                        { label: "Salud Promedio", value: `${hubStats.avgHealth}%`, icon: "❤️", color: "#ec4899", sub: "todas las áreas" },
                    ].map((s, i) => (
                        <div key={i} style={{ ...styles.card, ...styles.cardPad, border: `1px solid ${s.color}22` }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                                <div style={{ color: s.color }}>{s.icon}</div>
                                <div style={{ ...styles.tag(s.color) }}>●</div>
                            </div>
                            <div style={{ fontSize: "26px", fontWeight: "800", color: s.color, marginBottom: "2px" }}>{s.value}</div>
                            <div style={{ fontSize: "12px", fontWeight: "600", color: "#94a3b8" }}>{s.label}</div>
                            <div style={{ fontSize: "11px", color: "#475569" }}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Clients Grid */}
                <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                        <h2 style={styles.h2}>Clientes</h2>
                        <p style={styles.sub}>Seleccioná un cliente para ver sus proyectos e indicadores</p>
                    </div>
                    {user?.app_metadata?.rol !== 'Operativo' && (
                        <button style={styles.btn("primary")} onClick={() => openDrawer("new_client")}>+ Nuevo Cliente</button>
                    )}
                </div>

                {dbClients.length === 0 ? (
                    <EmptyState
                        title="No hay clientes registrados"
                        description="Comienza agregando tu primer cliente para estructurar los proyectos y KPIs."
                        actionLabel="Crear Primer Cliente"
                        onAction={() => openDrawer("new_client")}
                    />
                ) : (
                    <div style={{ ...styles.grid2, marginBottom: "24px" }}>
                        {dbClients.map((c: any) => {
                            // En Phase 4 mockeamos el conteo en HUB por velocidad si no tenemos agregation table
                            const cProjectsCount = Math.floor(Math.random() * 4) + 1;
                            const avgScore = 80 + Math.floor(Math.random() * 10);

                            return (
                                <div key={c.id} onClick={() => selectClient(c.id)} style={{
                                    ...styles.card, cursor: "pointer", transition: "all 0.2s",
                                    border: `1px solid rgba(255,255,255,0.08)`,
                                    position: "relative", overflow: "hidden",
                                }}
                                    onMouseEnter={e => e.currentTarget.style.border = `1px solid ${c.color}55`}
                                    onMouseLeave={e => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"}
                                >
                                    <div style={{ position: "absolute", top: 0, right: 0, width: "160px", height: "160px", background: `radial-gradient(circle at top right, ${c.color}15, transparent 70%)`, pointerEvents: "none" }} />
                                    <div style={{ padding: "20px 20px 0" }}>
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "14px" }}>
                                            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${c.color}22`, border: `1px solid ${c.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>{c.logo}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                                                    <h2 style={{ ...styles.h2, margin: 0 }}>{c.name}</h2>
                                                    <span style={{ ...styles.pill, background: c.status === "active" ? "rgba(16,185,129,0.15)" : "rgba(99,102,241,0.15)", color: c.status === "active" ? "#10b981" : "#818cf8", fontSize: "10px" }}>
                                                        {c.status === "active" ? "ACTIVO" : "PILOTO"}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: "12px", color: "#64748b" }}>{c.sector} · {c.country}</div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#475569", marginBottom: "16px", lineHeight: "1.5" }}>{c.fullName}</div>
                                    </div>

                                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 20px", display: "flex", gap: "20px", alignItems: "center" }}>
                                        <div style={{ display: "flex", gap: "16px", flex: 1 }}>
                                            <div><div style={{ fontSize: "18px", fontWeight: "700", color: c.color }}>{cProjectsCount}</div><div style={{ fontSize: "11px", color: "#475569" }}>Proyectos</div></div>
                                            <div><div style={{ fontSize: "18px", fontWeight: "700", color: "#94a3b8" }}>{c.users}</div><div style={{ fontSize: "11px", color: "#475569" }}>Usuarios</div></div>
                                            {avgScore && <div><div style={{ fontSize: "18px", fontWeight: "700", color: statusColor(healthStatus(avgScore)) }}>{avgScore}%</div><div style={{ fontSize: "11px", color: "#475569" }}>Salud IGG</div></div>}
                                        </div>
                                        <div style={{ ...styles.tag(c.color), fontSize: "11px" }}>{c.plan}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Integrations preview */}
                <IntegrationsStrip />
            </div>
        );
    };

    // ── CLIENT VIEW ───────────────────────────────────────────────────────────
    const ClientView = () => {
        if (!activeClient) return null;
        return (
            <div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "24px" }}>
                    <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: `${activeClient.color}22`, border: `1px solid ${activeClient.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>{activeClient.logo}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <h1 style={styles.h1}>{activeClient.name}</h1>
                            <span style={{ ...styles.pill, background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: "11px" }}>● ACTIVO</span>
                        </div>
                        <p style={styles.sub}>{activeClient.fullName} · {activeClient.sector} · {activeClient.country}</p>
                    </div>
                    {user?.app_metadata?.rol !== 'Operativo' && (
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button style={styles.btn("ghost")} onClick={() => openDrawer("config")}>⚙️ Configurar</button>
                            <button style={styles.btn("primary")} onClick={() => openDrawer("new_project")}>+ Nuevo Proyecto</button>
                        </div>
                    )}
                </div>

                <div style={{ ...styles.grid4, marginBottom: "24px" }}>
                    {[
                        { label: "Plan", value: activeClient.plan, icon: "💎" },
                        { label: "Cliente desde", value: activeClient.since, icon: "📅" },
                        { label: "Usuarios", value: activeClient.users, icon: "👥" },
                        { label: "Proyectos", value: projects.length, icon: "📁" },
                    ].map((s, i) => (
                        <div key={i} style={{ ...styles.card, ...styles.cardPad }}>
                            <div style={{ fontSize: "18px", marginBottom: "4px" }}>{s.icon}</div>
                            <div style={{ fontSize: "18px", fontWeight: "700", color: "#f1f5f9" }}>{s.value}</div>
                            <div style={{ fontSize: "12px", color: "#475569" }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                <h2 style={{ ...styles.h2, marginBottom: "12px" }}>Proyectos de {activeClient.name}</h2>
                {projects.length === 0 ? (
                    <EmptyState
                        title="Sin Proyectos Activos"
                        description={`El cliente ${activeClient.name} aún no tiene proyectos asignados o en ejecución.`}
                        actionLabel="Crear Primer Proyecto"
                        onAction={() => openDrawer("new_project")}
                    />
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {projects.map((p: any) => {
                            const kd = (DEMO_DATA.kpis as any)[p.id];
                            const avgScore = kd ? Math.round(Object.values(kd.areas).reduce((a: any, ar: any) => a + (ar as any).score, 0) / Object.values(kd.areas).length) : null;
                            const st = healthStatus(avgScore || p.health);

                            return (
                                <div key={p.id} onClick={() => selectProject(p.id)} style={{
                                    ...styles.card, cursor: "pointer", transition: "all 0.2s",
                                    display: "flex", alignItems: "center", gap: "16px", padding: "18px 20px",
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                                >
                                    <div style={{ fontSize: "28px" }}>{p.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                            <div style={{ fontWeight: "600", color: "#f1f5f9", fontSize: "15px" }}>{p.name}</div>
                                            <span style={{ ...styles.tag(statusColor(st)), fontSize: "10px" }}>{statusLabel(st)}</span>
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>{p.description}</div>
                                        <div style={{ display: "flex", gap: "12px" }}>
                                            {p.areas.map((a: string) => <span key={a} style={{ fontSize: "10px", color: "#475569", background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: "4px" }}>{a}</span>)}
                                            {user?.app_metadata?.rol === 'Operativo' && !p.areas.includes(user?.app_metadata?.area) && (
                                                <span style={{ fontSize: "10px", color: "#ef4444", background: "rgba(239,68,68,0.1)", padding: "2px 7px", borderRadius: "4px" }}>Solo Lectura</span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right", minWidth: "90px" }}>
                                        {kd && <MiniBar timeline={kd.timeline} color={client.color} />}
                                        <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>Últ. actualización</div>
                                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>{p.lastUpdate}</div>
                                    </div>
                                    <div style={{ fontSize: "22px", color: "#334155" }}>›</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    // ── KPIs VIEW ─────────────────────────────────────────────────────────────
    const KPIsView = () => {
        if (!kpiData || !project || !client) return null;
        const areas = Object.entries(kpiData.areas);
        const scores = areas.map(([, d]: any) => d.score);
        const globalScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

        const statusCounts = {
            ok: areas.reduce((a, [, d]: any) => a + d.indicators.filter((i: any) => i.status === "ok").length, 0),
            alert: areas.reduce((a, [, d]: any) => a + d.indicators.filter((i: any) => i.status === "alert").length, 0),
            critical: areas.reduce((a, [, d]: any) => a + d.indicators.filter((i: any) => i.status === "critical").length, 0),
        };

        return (
            <div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "24px" }}>
                    <div style={{ fontSize: "32px" }}>{project.icon}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <h1 style={styles.h1}>{project.name}</h1>
                        </div>
                        <p style={styles.sub}>{client.name} · {project.description}</p>
                    </div>
                    <button style={styles.btn("ghost")} onClick={() => notify("Generando PDF (Exportación Simulada)...", "info")}>📥 Exportar Rpt.</button>
                    <button style={styles.btn("primary")} onClick={() => setAiOpen(true)}>✨ Asistente IA</button>
                </div>

                {/* Header metrics */}
                <div style={{ ...styles.grid4, marginBottom: "24px" }}>
                    {[
                        { label: "Índice Global", value: `${globalScore}%`, color: statusColor(healthStatus(globalScore)), icon: "◎" },
                        { label: "En Meta", value: statusCounts.ok, color: "#10b981", icon: "✓" },
                        { label: "En Alerta", value: statusCounts.alert, color: "#f59e0b", icon: "⚠" },
                        { label: "Crítico", value: statusCounts.critical, color: "#ef4444", icon: "✗" },
                    ].map((s, i) => (
                        <div key={i} style={{ ...styles.card, ...styles.cardPad, borderLeft: `3px solid ${s.color}` }}>
                            <div style={{ fontSize: "22px", color: s.color, marginBottom: "4px" }}>{s.icon}</div>
                            <div style={{ fontSize: "26px", fontWeight: "800", color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Timeline Chart */}
                <div style={{ ...styles.card, ...styles.cardPad, marginBottom: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <div>
                            <h2 style={styles.h2}>Evolución del Índice Global</h2>
                            <p style={styles.sub}>Últimos 6 períodos</p>
                        </div>
                        <GaugeArc value={globalScore} color={statusColor(healthStatus(globalScore))} size={90} />
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "80px", padding: "0 8px" }}>
                        {kpiData.timeline.map((t: any, i: number) => {
                            const isLast = i === kpiData.timeline.length - 1;
                            const h = (t.global / 100) * 72;
                            const color = isLast ? client.color : `${client.color}66`;
                            return (
                                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                    <div style={{ fontSize: "11px", color: isLast ? client.color : "#475569", fontWeight: isLast ? "700" : "400" }}>{t.global}%</div>
                                    <div style={{ width: "100%", height: `${h}px`, background: color, borderRadius: "4px 4px 0 0", transition: "height 1s ease" }} />
                                    <div style={{ fontSize: "10px", color: "#475569", whiteSpace: "nowrap" }}>{t.period}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Areas grid */}
                <div style={styles.grid2}>
                    {areas.map(([areaName, areaData]: [string, any]) => (
                        <div key={areaName} style={styles.card}>
                            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <h2 style={styles.h2}>{areaName}</h2>
                                    <p style={styles.sub}>{areaData.indicators.length} indicadores · {areaData.trend > 0 ? `▲ +${areaData.trend}pp` : areaData.trend < 0 ? `▼ ${areaData.trend}pp` : "= sin cambio"} vs período anterior</p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "22px", fontWeight: "800", color: statusColor(healthStatus(areaData.score)) }}>{areaData.score}%</div>
                                    <Sparkline data={kpiData.timeline.map((t: any) => t.global)} color={statusColor(healthStatus(areaData.score))} />
                                </div>
                            </div>
                            <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                {areaData.indicators.map((ind: any, i: number) => {
                                    const pct = ind.polarity === "lower"
                                        ? Math.min(100, (ind.target / Math.max(ind.value, 0.1)) * 100)
                                        : Math.min(100, (ind.value / ind.target) * 100);
                                    return (
                                        <Tooltip
                                            key={i}
                                            position="left"
                                            content={
                                                <div style={{ padding: "4px" }}>
                                                    <div style={{ fontSize: "11px", color: "var(--texto2)", marginBottom: "4px" }}>Detalle de KPI</div>
                                                    <div><strong>{ind.value}</strong> {ind.unit} registrados.</div>
                                                    <div>Se esperaba <strong>{ind.target}</strong>.</div>
                                                    <div style={{ marginTop: "4px", color: ind.status === 'ok' ? "#10b981" : ind.status === 'alert' ? "#f59e0b" : "#ef4444" }}>
                                                        {ind.status === 'ok' ? 'Cumplido con margen' : ind.status === 'alert' ? 'Precaución: cerca de tolerancia' : 'Límite de Riesgo sobrepasado'}
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <div style={{ width: "100%", padding: "4px 8px", borderRadius: "8px", transition: "background 0.2s", cursor: "help" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                                                    <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>{ind.name}</div>
                                                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                        <div style={{ fontSize: "11px", color: "#475569" }}>Meta: {ind.target}{ind.unit}</div>
                                                        <div style={{ fontSize: "13px", fontWeight: "700", color: statusColor(ind.status) }}>{ind.value}{ind.unit}</div>
                                                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: statusColor(ind.status) }} />
                                                    </div>
                                                </div>
                                                <div style={{ height: "4px", background: "rgba(255,255,255,0.07)", borderRadius: "2px", overflow: "hidden" }}>
                                                    <div style={{ height: "100%", width: `${Math.min(100, pct)}%`, background: statusColor(ind.status), borderRadius: "2px", transition: "width 1s ease" }} />
                                                </div>
                                            </div>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    // ─── SUB-COMPONENTS ──────────────────────────────────────────────────────
    const Topbar = () => (
        <div style={styles.topbar}>
            <div style={styles.logo} onClick={() => changeView("hub")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={styles.logoMark}>NS</div>
                <span style={{ fontWeight: 800, color: "#f8fafc", fontSize: "15px", letterSpacing: "0.05em" }}>Nexus SCG</span>
            </div>
            <div style={styles.breadcrumb}>
                <span>/</span>
                <span style={styles.bcrumb} onClick={() => changeView("hub")}>Hub</span>
                {selectedClient && (
                    <>
                        <span>/</span>
                        <span style={styles.bcrumb} onClick={() => { setView("client"); setSelectedProject(null); }}>{client?.name}</span>
                    </>
                )}
                {selectedProject && (
                    <>
                        <span>/</span>
                        <span style={styles.bcrumb}>{project?.name}</span>
                    </>
                )}
            </div>

            <div style={{ flex: 1 }} />

            {/* Date Picker de Topbar */}
            <select
                value={globalPeriod}
                onChange={e => setGlobalPeriod(e.target.value)}
                style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#f8fafc",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer",
                    marginRight: "16px"
                }}
            >
                <option value="Oct'25" style={{ background: "#0a0b0f" }}>Octubre 2025</option>
                <option value="Nov'25" style={{ background: "#0a0b0f" }}>Noviembre 2025</option>
                <option value="Dic'25" style={{ background: "#0a0b0f" }}>Diciembre 2025</option>
                <option value="Ene'26" style={{ background: "#0a0b0f" }}>Enero 2026</option>
            </select>

            <div style={styles.topRight}>
                <div style={styles.iconBtn} onClick={() => notify("Búsqueda avanzada de indicadores...", "info")}>🔍</div>
                <div style={styles.iconBtn} onClick={() => setAiOpen(!aiOpen)} title="Asistente IA">✨</div>
                <div style={{ ...styles.iconBtn, position: 'relative' }} onClick={() => setAlertsOpen(true)}>
                    🔔
                    <div style={{ position: 'absolute', top: '5px', right: '5px', width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%' }} />
                </div>
                <div style={styles.iconBtn} onClick={() => {
                    setThemeToggle(themeToggle === "dark" ? "light" : "dark");
                    notify(`Toggle UI Theme => ${themeToggle === 'dark' ? 'Light' : 'Dark'} Mode (Mockup)`, 'ok');
                }}>
                    {themeToggle === "dark" ? "🌙" : "☀️"}
                </div>
            </div>
        </div>
    );

    const IntegrationsStrip = () => (
        <div style={{ marginTop: "40px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                    <h2 style={styles.h2}>Conectividad & Datos</h2>
                    <p style={styles.sub}>Fuentes de datos conectadas al motor Nexus Engine</p>
                </div>
                <button style={styles.btn("ghost")} onClick={() => setView("integrations")}>Ver todas</button>
            </div>
            <div style={styles.grid4}>
                {[
                    { name: "Supabase DB", status: "online", color: "#3ecf8e", icon: "⚡" },
                    { name: "S3 Storage", status: "online", color: "#ff9900", icon: "📦" },
                    { name: "API Rest", status: "online", color: "#f59e0b", icon: "🔗" },
                    { name: "Excel Sync", status: "standby", color: "#107c10", icon: "📊" },
                ].map(item => (
                    <div key={item.name} style={{ ...styles.card, padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ fontSize: "18px" }}>{item.icon}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "12px", fontWeight: "600" }}>{item.name}</div>
                            <div style={{ fontSize: "10px", color: "#475569", display: "flex", alignItems: "center", gap: "4px" }}>
                                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: item.color }} />
                                {item.status}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const Notification = () => notification ? (
        <div style={{
            position: "fixed", bottom: "24px", right: "24px", background: "rgba(15,16,22,0.95)",
            border: `1px solid ${notification.type === "ok" ? "#10b98144" : "#6366f144"}`,
            padding: "12px 20px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)", zIndex: 1000,
            backdropFilter: "blur(10px)", animation: "slideIn 0.3s ease",
        }}>
            <div style={{ fontSize: "18px" }}>{notification.type === "ok" ? "✅" : "ℹ️"}</div>
            <div style={{ fontSize: "13px", fontWeight: "500" }}>{notification.msg}</div>
        </div>
    ) : null;

    const AIAssistant = () => aiOpen ? (
        <div style={{
            position: "fixed", top: "60px", right: "24px", bottom: "24px", width: "400px",
            background: "rgba(13,14,20,0.98)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px", display: "flex", flexDirection: "column",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)", zIndex: 500,
            backdropFilter: "blur(20px)", overflow: "hidden"
        }}>
            <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>✨</div>
                    <div style={{ fontWeight: "700" }}>Nexus AI Analyst</div>
                </div>
                <button onClick={() => setAiOpen(false)} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: "18px" }}>✕</button>
            </div>
            <div ref={aiRef} style={{ flex: 1, overflow: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {aiMessages.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569" }}>
                        <div style={{ fontSize: "24px", marginBottom: "12px" }}>🤖</div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9" }}>Hablemos sobre tus indicadores</div>
                        <div style={{ fontSize: "12px", marginTop: "4px" }}>Puedo analizar tendencias, detectar desviaciones o explicar el impacto de los KPIs.</div>
                    </div>
                )}
                {aiMessages.map((m, i) => (
                    <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                        <div style={{
                            padding: "10px 14px", borderRadius: m.role === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0",
                            background: m.role === "user" ? "#6366f1" : "rgba(255,255,255,0.05)",
                            fontSize: "13px", lineHeight: "1.5", color: m.role === "user" ? "white" : "#e2e8f0"
                        }}>
                            {m.content}
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "8px", display: "flex", gap: "8px" }}>
                    <input
                        placeholder="Preguntar algo..."
                        value={aiInput}
                        onChange={e => setAiInput(e.target.value)}
                        onKeyPress={e => e.key === "Enter" && sendAI()}
                        style={{ flex: 1, background: "transparent", border: "none", color: "white", outline: "none", fontSize: "13px" }}
                    />
                    <button onClick={sendAI} disabled={aiLoading} style={{ background: "#6366f1", border: "none", borderRadius: "6px", width: "32px", height: "32px", cursor: "pointer", color: "white" }}>
                        {aiLoading ? ".." : "↑"}
                    </button>
                </div>
            </div>
        </div>
    ) : null;

    // ── MAIN RENDER ───────────────────────────────────────────────────────────
    return (
        <div style={styles.root}>
            <Topbar />
            <div style={styles.layout}>
                <SideNav />
                <main style={styles.main}>
                    {isSimulatingLoad ? (
                        <div style={{ ...styles.grid4, marginBottom: "24px", marginTop: "40px" }}>
                            <CardSkeleton />
                            <CardSkeleton />
                            <CardSkeleton />
                            <CardSkeleton />
                        </div>
                    ) : (
                        <>
                            {view === "hub" && <HubView />}
                            {view === "client" && <ClientView />}
                            {view === "kpis" && <KPIsView />}
                            {view === "integrations" && (
                                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '24px' }}>🔌</div>
                                    <h1 style={styles.h1}>Centro de Integraciones</h1>
                                    <p style={styles.sub}>Conectá Nexus Engine con tus fuentes de datos operativas</p>
                                </div>
                            )}
                            {view === "admin" && (
                                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '24px' }}>⚙️</div>
                                    <h1 style={styles.h1}>Panel de Administración</h1>
                                    <p style={styles.sub}>Gestión de usuarios, roles y permisos de la plataforma</p>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            <SlideDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerContent === "new_client" ? "Alta de Nuevo Cliente" : drawerContent === "new_project" ? "Alta de Proyecto" : "Configuración de Cliente"}
            >
                <div>
                    <p style={{ color: "var(--texto2)", fontSize: "14px", marginBottom: "20px" }}>Comienza ingresando los datos primarios. La plataforma aprovisionará directamente el Tenant en Supabase.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "12px", color: "var(--texto)", fontWeight: 600 }}>{drawerContent === "new_project" ? "Nombre del Proyecto/Área" : "Nombre / Razón Social"}</label>
                            <input
                                type="text"
                                placeholder="Ej. Acero Corp / Área Norte..."
                                value={drawerInputName}
                                onChange={e => setDrawerInputName(e.target.value)}
                                style={{ background: "var(--bg3)", border: "1px solid var(--borde)", color: "white", padding: "10px", borderRadius: "8px", outline: "none" }}
                            />
                        </div>
                        {drawerContent === "new_client" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "12px", color: "var(--texto)", fontWeight: 600 }}>Sector Industrial</label>
                                <select
                                    value={drawerInputSector}
                                    onChange={e => setDrawerInputSector(e.target.value)}
                                    style={{ background: "var(--bg3)", border: "1px solid var(--borde)", color: "white", padding: "10px", borderRadius: "8px", outline: "none" }}
                                >
                                    <option>Energía Eléctrica</option>
                                    <option>Agua y Saneamiento</option>
                                    <option>Salud</option>
                                    <option>Retail y Comercio</option>
                                </select>
                            </div>
                        )}
                        <button
                            onClick={async () => {
                                setIsSimulatingLoad(true);
                                if (drawerContent === 'new_client') {
                                    await createNexusClient(drawerInputName, drawerInputSector);
                                } else if (drawerContent === 'new_project' && selectedClient) {
                                    await createNexusProject(selectedClient, drawerInputName);
                                }
                                setDrawerOpen(false);
                                setDrawerInputName("");
                                setIsSimulatingLoad(false);
                                notify("Datos impactados en Postgres (Supabase). Refrescando...", "ok");
                                setTimeout(() => window.location.reload(), 1000);
                            }}
                            disabled={!drawerInputName}
                            style={{ ...styles.btn(drawerInputName ? "primary" : "ghost"), justifyContent: "center", padding: "12px", marginTop: "12px", width: "100%", opacity: drawerInputName ? 1 : 0.5 }}
                        >
                            Impactar en Base de Datos
                        </button>
                    </div>
                </div>
            </SlideDrawer>

            <Notification />
            <AIAssistant />
        </div>
    );
}
