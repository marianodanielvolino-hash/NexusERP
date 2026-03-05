"use client";

import React from "react";

export default function AyudaPage() {
    return (
        <div className="fade-in" style={{ padding: "1.5rem 0", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--texto)", margin: "0 0 1rem 0" }}>Centro de Ayuda</h2>
                <p style={{ color: "var(--texto2)", fontSize: "1.1rem" }}>Encuentra respuestas rápidas y guías operativas de NEXUS SCG.</p>
                <div style={{ marginTop: "2rem" }}>
                    <input type="text" placeholder="Buscar manuales, FAQs..." style={{
                        width: "100%", maxWidth: "500px", padding: "1rem", borderRadius: "12px",
                        border: "1px solid var(--borde)", fontSize: "1rem", background: "var(--card)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                    }} />
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div className="widget-card fade-in hover-row" style={{ cursor: "pointer", transition: "transform 0.2s" }}>
                    <h3 style={{ fontSize: "1.2rem", color: "var(--azul-primary)", margin: "0 0 0.5rem 0" }}>📚 Guías Rápidas</h3>
                    <p style={{ color: "var(--texto2)", fontSize: "0.9rem", margin: 0 }}>Aprende a navegar y utilizar los módulos de Carga y Validación.</p>
                </div>
                <div className="widget-card fade-in hover-row" style={{ cursor: "pointer", transition: "transform 0.2s" }}>
                    <h3 style={{ fontSize: "1.2rem", color: "var(--azul-primary)", margin: "0 0 0.5rem 0" }}>❓ Preguntas Frecuentes</h3>
                    <p style={{ color: "var(--texto2)", fontSize: "0.9rem", margin: 0 }}>Soluciones a restricciones comunes, bloqueos y auditorías.</p>
                </div>
                <div className="widget-card fade-in hover-row" style={{ cursor: "pointer", transition: "transform 0.2s" }}>
                    <h3 style={{ fontSize: "1.2rem", color: "var(--azul-primary)", margin: "0 0 0.5rem 0" }}>🤖 Asistente IA</h3>
                    <p style={{ color: "var(--texto2)", fontSize: "0.9rem", margin: 0 }}>Cómo interactuar con el AI y obtener reportes predictivos.</p>
                </div>
                <div className="widget-card fade-in hover-row" style={{ cursor: "pointer", transition: "transform 0.2s" }}>
                    <h3 style={{ fontSize: "1.2rem", color: "var(--azul-primary)", margin: "0 0 0.5rem 0" }}>💬 Soporte Técnico</h3>
                    <p style={{ color: "var(--texto2)", fontSize: "0.9rem", margin: 0 }}>Contáctanos si experimentas comportamientos inesperados.</p>
                </div>
            </div>
        </div>
    );
}
