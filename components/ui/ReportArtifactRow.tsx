import React from "react";

interface Report {
    id: string;
    name: string;
    type: string;
    format: string;
    generatedAt: string;
    author: string;
}

interface ReportArtifactRowProps {
    report: Report;
    onDownload: (id: string) => void;
}

export function ReportArtifactRow({ report, onDownload }: ReportArtifactRowProps) {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem",
            background: "var(--card)",
            border: "1px solid var(--borde)",
            borderRadius: "8px",
            marginBottom: "0.75rem",
            transition: "all 0.2s ease",
            cursor: "pointer"
        }}
            className="hover:shadow"
        >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 2 }}>
                <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    background: report.format === "PDF" ? "rgba(220, 53, 69, 0.1)" : "rgba(40, 167, 69, 0.1)",
                    color: report.format === "PDF" ? "var(--rojo)" : "var(--verde)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "0.8rem"
                }}>
                    {report.format}
                </div>
                <div>
                    <div style={{ fontWeight: 600, color: "var(--texto)", fontSize: "1rem", marginBottom: "4px" }}>
                        {report.name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--texto2)", display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{
                            padding: "2px 6px",
                            background: "var(--azul-light)",
                            color: "var(--azul-primary)",
                            borderRadius: "4px",
                            fontWeight: 600
                        }}>{report.type}</span>
                        <span>•</span>
                        <span>Generado: {report.generatedAt} por {report.author}</span>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button
                    onClick={(e) => { e.stopPropagation(); onDownload(report.id); }}
                    className="btn btn-primary"
                    style={{ padding: "6px 16px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}
                >
                    <span style={{ fontSize: "1rem" }}>↓</span> Descargar
                </button>
            </div>
        </div>
    );
}
