export type UUID = string;

// Enum Roles y Estados
export type Role = "OP" | "REF" | "GER" | "EJ" | "AUD" | "CONS" | "INTADM";
export type PeriodStatus = "open" | "closed";
export type Status = "ok" | "alert" | "critical";
export type KpiDataState = "draft" | "pending_manager" | "pending_executive" | "validated" | "rejected";
export type ReportType = "exec_pdf" | "kpi_export" | "monthly_report" | "regulatory_epre_enre" | "evidence_zip";
export type ArtifactStatus = "queued" | "running" | "ready" | "error";
export type EvidenceStatus = "pending" | "ready" | "revoked" | "replaced";
export type IntegrationRunType = "push" | "pull" | "bulk";
export type IntegrationStatus = "success" | "partial" | "failed";

// Tenant & Session Context
export interface TenantContext {
    tenantId: UUID;
    tenantName: string;
    domain?: string;
    themeTokens: {
        primary: string;
        secondary: string;
        success: string;
        warning: string;
        danger: string;
        radius: "sm" | "md" | "lg";
        modeDefault: "dark" | "light" | "auto";
    };
}

export interface UserSession {
    userId: UUID;
    name: string;
    email: string;
    roles: Role[];
    areaScope?: UUID[]; // vacío o undefined = sin restricción (EJ/AUD)
    tenantId: UUID;
    mfa: boolean;
    lastLoginAt?: string; // ISO
}

// Entidades Core
export interface Tenant {
    tenantId: UUID;
    name: string;
    domain?: string;
    isActive: boolean;
    branding: {
        logoUrl?: string;
        tokens: TenantContext["themeTokens"];
    };
    createdAt: string;
    updatedAt: string;
}

export interface Area {
    areaId: UUID;
    tenantId: UUID;
    name: string;
    code?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    userId: UUID;
    tenantId: UUID;
    name: string;
    email: string;
    roles: Role[];
    areaScope?: UUID[];
    isActive: boolean;
    lastAccessAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Period {
    periodId: UUID;
    tenantId: UUID;
    label: string;
    year: number;
    month?: number;
    startDate: string;
    endDate: string;
    status: PeriodStatus;

    progress: {
        totalKpis: number;
        loadedKpis: number;
        validatedKpis: number;
        criticalKpis: number;
        percentLoaded: number;
        percentValidated: number;
    };

    closedAt?: string;
    closedBy?: UUID;
    createdAt: string;
    updatedAt: string;
}

// KPI definitions y Metas
export interface KpiDefinition {
    kpiId: UUID;
    tenantId: UUID;
    areaId: UUID;

    code?: string;
    name: string;
    description?: string;

    unit: "number" | "percent" | "currency" | "text" | "hours" | "minutes" | "ratio";
    decimals?: number;

    periodicity: "monthly" | "quarterly" | "annual";
    direction: "higher_is_better" | "lower_is_better";

    dataOwner?: { userId: UUID; name: string };
    dataSource: { kind: "manual" | "push_api" | "pull_connector"; ref?: string };

    semaphoreRule: {
        kind: "thresholds" | "function";
        thresholds?: {
            okMaxDelta?: number;
            alertMaxDelta?: number;
            criticalBeyondDelta?: number;
        };
        functionRuleRef?: string;
    };

    helpText?: string;
    isActive: boolean;

    version?: number;
    validFrom?: string;
    validTo?: string;

    createdAt: string;
    updatedAt: string;
}

export interface KpiTarget {
    targetId: UUID;
    tenantId: UUID;
    kpiId: UUID;
    periodId: UUID;
    targetType: "fixed" | "step" | "benchmark" | "seasonal";
    targetValue: number | string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface KpiData {
    kpiDataId: UUID;
    tenantId: UUID;
    kpiId: UUID;
    areaId: UUID;
    periodId: UUID;

    value: number | string;
    valueRaw?: string;
    status: Status;
    delta?: number;

    state: KpiDataState;
    submittedAt?: string;
    submittedBy?: UUID;

    validatedAt?: string;
    validatedBy?: UUID;

    rejectedAt?: string;
    rejectedBy?: UUID;
    rejectedReason?: string;

    lastUpdatedAt: string;
    lastUpdatedBy: UUID;

    evidenceCount: number;
}

// Formularios
export interface FormSchema {
    kpiId: UUID;
    fields: Array<{
        key: string;
        label: string;
        type: "number" | "percent" | "currency" | "text" | "date" | "select";
        required?: boolean;
        decimals?: number;
        min?: number;
        max?: number;
        options?: { value: string; label: string }[];
        helpText?: string;
    }>;
}

// Evidencias
export interface Evidence {
    evidenceId: UUID;
    tenantId: UUID;
    periodId: UUID;
    kpiId: UUID;
    kpiDataId?: UUID;
    areaId: UUID;

    filename: string;
    mimeType: string;
    sizeBytes: number;

    status: EvidenceStatus;
    checksumSha256?: string;
    storagePath: string;
    uploadedAt?: string;
    uploadedBy: UUID;

    createdAt: string;
    updatedAt: string;
}

// Workflow
export interface WorkflowTask {
    taskId: UUID;
    tenantId: UUID;
    periodId: UUID;
    kpiDataId: UUID;
    kpiId: UUID;
    areaId: UUID;

    stage: "manager" | "executive";
    status: "pending" | "approved" | "rejected" | "returned";

    assignedToRole: Role;
    assignedToUserId?: UUID;

    createdAt: string;
    updatedAt: string;
}

export interface WorkflowEvent {
    at: string;
    actorUserId: UUID;
    actorName: string;
    action: "submit" | "approve" | "reject" | "return" | "reassign";
    comment?: string;
    fromState?: KpiDataState;
    toState?: KpiDataState;
}

// Reportes
export interface ReportArtifact {
    reportId: UUID;
    tenantId: UUID;
    periodId: UUID;

    type: ReportType;
    status: ArtifactStatus;

    createdAt: string;
    createdBy: UUID;

    startedAt?: string;
    finishedAt?: string;
    errorMessage?: string;

    fileMeta?: {
        filename: string;
        mimeType: string;
        sizeBytes: number;
    };
}

// Dashboards
export interface ExecutiveDashboard {
    periodId: UUID;
    global: { ok: number; alert: number; critical: number };
    byArea: Array<{ areaId: UUID; areaName: string; ok: number; alert: number; critical: number }>;
    topCritical: Array<{ kpiId: UUID; kpiName: string; areaName: string; value: any; target: any; delta?: number; status: Status }>;
}
