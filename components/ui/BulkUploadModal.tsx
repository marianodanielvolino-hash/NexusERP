import React, { useState } from "react";

interface BulkUploadModalProps {
    open: boolean;
    onClose: () => void;
    onConfirmImport: () => void;
}

export function BulkUploadModal({ open, onClose, onConfirmImport }: BulkUploadModalProps) {
    const [file, setFile] = useState<File | null>(null);

    if (!open) return null;

    return (
        <>
            <div
                style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100
                }}
                onClick={onClose}
            />
            <div style={{
                position: "fixed", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "var(--bg2)",
                padding: "2rem",
                borderRadius: "12px",
                zIndex: 101,
                width: "500px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
            }}>
                <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem", fontWeight: 600 }}>Carga Masiva de Indicadores</h2>
                <p style={{ fontSize: "0.85rem", color: "var(--texto2)", marginBottom: "1.5rem" }}>
                    Descarga el template de Excel, completa tus valores para el área seleccionada y súbelo aquí.
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                    <button className="btn" style={{ background: "var(--azul-light)", color: "var(--azul-primary)" }}>
                        ⬇️ Descargar Template
                    </button>
                </div>

                <div
                    style={{
                        border: "2px dashed var(--borde2)",
                        borderRadius: "8px",
                        padding: "2rem",
                        textAlign: "center",
                        cursor: "pointer",
                        marginBottom: "1.5rem",
                        backgroundColor: file ? "var(--azul-light)" : "transparent"
                    }}
                    onClick={() => {
                        // Mock file selection
                        setFile(new File([""], "kpis_comercial_marzo_26.xlsx"));
                    }}
                >
                    {file ? (
                        <span style={{ fontWeight: 600, color: "var(--azul-primary)" }}>{file.name} seleccionado</span>
                    ) : (
                        <span style={{ color: "var(--texto2)" }}>Arrastra tu archivo XLS o haz clic para subir</span>
                    )}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    <button className="btn" style={{ background: "transparent", border: "1px solid var(--borde)", color: "var(--texto)" }} onClick={onClose}>Cancelar</button>
                    <button
                        className="btn btn-primary"
                        disabled={!file}
                        onClick={() => {
                            onConfirmImport();
                            onClose();
                        }}
                    >
                        Confirmar Importación
                    </button>
                </div>
            </div>
        </>
    );
}
