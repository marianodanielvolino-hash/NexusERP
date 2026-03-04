"use client";

import { useState } from "react";

export default function DashboardEjecutivo() {
  const [activeArea, setActiveArea] = useState('ejecutivo');

  // Estado para el asistente IA (Claude)
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: '¡Hola! Soy Nexus AI. Analicé el tablero de este período. ¿Qué tendencia o indicador te gustaría explorar?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Datos simulados (en entorno real viajan desde el componente Padre obtenidos de DB)
  const dashboardData = {
    periodo: "Febrero 2025",
    indiceGlobal: 82,
    areasCriticas: ["Calidad de Servicio"],
    alertas: ["SAIDI alcanzó 12.4 hs superando la meta.", "Morosidad incrementó un 3%."]
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setChatInput("");
    setIsTyping(true);

    try {
      const resp = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage, dashboardData })
      });
      const data = await resp.json();

      setChatMessages((prev) => [...prev, {
        role: 'assistant',
        text: data.success ? data.answer : "Hubo un error de conexión con la IA."
      }]);
    } catch {
      setChatMessages((prev) => [...prev, { role: 'assistant', text: "Error procesando la solicitud." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fade-in">
      {/* TABS (simuladas aquí, podrían ser sub-rutas o estado) */}
      <div className="nav-tabs">
        <div className={`nav-tab ${activeArea === 'ejecutivo' ? 'activa' : ''}`} onClick={() => setActiveArea('ejecutivo')}>Vista Ejecutiva</div>
        <div className={`nav-tab ${activeArea === 'comercial' ? 'activa' : ''}`} onClick={() => setActiveArea('comercial')}>Comercial</div>
        <div className={`nav-tab ${activeArea === 'calidad' ? 'activa' : ''}`} onClick={() => setActiveArea('calidad')}>Calidad de Servicio</div>
        <div className="nav-tab">Operaciones</div>
        <div className="nav-tab">Obras</div>
      </div>

      {/* ESTADO GENERAL */}
      <div className="section-header">
        <span className="section-title">Estado General</span>
        <div className="section-line"></div>
      </div>

      <div className="estado-general">
        <div>
          <div className="estado-label">Índice de Gestión Global</div>
          <div className="estado-valor">82<span style={{ fontSize: '1.4rem', color: 'var(--texto3)' }}>%</span></div>
          <div className="estado-desc">Promedio ponderado de todas las áreas · Feb 2025</div>
        </div>
        <div className="estado-right">
          <div className="estado-stat">
            <div className="estado-stat-val verde">4</div>
            <div className="estado-stat-label">Áreas en Meta</div>
          </div>
          <div className="estado-stat">
            <div className="estado-stat-val amarillo">2</div>
            <div className="estado-stat-label">Áreas en Alerta</div>
          </div>
          <div className="estado-stat">
            <div className="estado-stat-val rojo">1</div>
            <div className="estado-stat-label">Área Crítica</div>
          </div>
        </div>
      </div>

      {/* ALERTAS */}
      <div className="section-header" style={{ marginTop: '1.5rem' }}>
        <span className="section-title">Alertas del Período</span>
        <div className="section-line"></div>
      </div>

      <div className="alerta-strip">
        <div className="alerta-icon">⚠</div>
        <div className="alerta-texto"><strong>Calidad de Servicio — SAIDI</strong>: Duración promedio de interrupciones alcanzó 12.4 hs/usuario, superando la meta regulatoria.</div>
        <div className="alerta-fecha">Feb 2025</div>
      </div>

      <div className="alerta-strip" style={{ borderLeftColor: 'var(--amarillo)', background: 'rgba(243,156,18,0.06)', borderColor: 'rgba(243,156,18,0.2)' }}>
        <div className="alerta-icon">◆</div>
        <div className="alerta-texto"><strong>Comercial — Morosidad</strong>: Cartera morosa en 18%, por encima del umbral de 15%.</div>
        <div className="alerta-fecha">Feb 2025</div>
      </div>

      {/* GRID DE ÁREAS */}
      <div className="section-header" style={{ marginTop: '1.5rem' }}>
        <span className="section-title">Estado por Área</span>
        <div className="section-line"></div>
      </div>

      <div className="areas-grid">
        <div className="area-card">
          <div className="area-semaforo" style={{ background: 'var(--amarillo)' }}></div>
          <div className="area-nombre">Comercial</div>
          <div className="area-score amarillo">84<span>%</span></div>
          <div className="area-tendencia">▼ -2pp vs ene</div>
        </div>
        <div className="area-card activa">
          <div className="area-semaforo" style={{ background: 'var(--rojo)' }}></div>
          <div className="area-nombre">Calidad Servicio</div>
          <div className="area-score rojo">71<span>%</span></div>
          <div className="area-tendencia">▼ -4pp vs ene</div>
        </div>
        <div className="area-card">
          <div className="area-semaforo" style={{ background: 'var(--verde)' }}></div>
          <div className="area-nombre">Operaciones</div>
          <div className="area-score verde">91<span>%</span></div>
          <div className="area-tendencia">▲ +1pp vs ene</div>
        </div>
        <div className="area-card">
          <div className="area-semaforo" style={{ background: 'var(--verde)' }}></div>
          <div className="area-nombre">Admin & Finanzas</div>
          <div className="area-score verde">88<span>%</span></div>
          <div className="area-tendencia">▲ +3pp vs ene</div>
        </div>
      </div>

      {/* KPIs CLAVE */}
      <div className="section-header" style={{ marginTop: '1.5rem' }}>
        <span className="section-title">Indicadores Clave</span>
        <div className="section-line"></div>
      </div>

      <div className="indicadores-grid">
        <div className="kpi-card glass-panel">
          <div className="kpi-area-tag">Comercial</div>
          <div className="kpi-nombre">Índice de Cobrabilidad</div>
          <div className="kpi-row">
            <div>
              <span className="kpi-valor amarillo">84</span>
              <span className="kpi-unidad">%</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="kpi-meta">Meta: <span>92%</span></div>
            </div>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: '84%', background: 'var(--amarillo)' }}></div></div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-area-tag">Calidad de Servicio</div>
          <div className="kpi-nombre">SAIDI — Interrupciones</div>
          <div className="kpi-row">
            <div>
              <span className="kpi-valor rojo">12.4</span>
              <span className="kpi-unidad">hs/usu.</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="kpi-meta">Meta: <span>&lt;10 hs</span></div>
            </div>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: '75%', background: 'var(--rojo)' }}></div></div>
        </div>
      </div>

      {/* =========================================
          BOTÓN Y PANEL DE CHAT INTELIGENCIA ARTIFICIAL (CLAUDE)
          ========================================= */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', width: '60px', height: '60px',
          borderRadius: '50%', background: 'linear-gradient(135deg, var(--lila), var(--azul-c))',
          boxShadow: '0 8px 24px rgba(124,92,191,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', border: 'none', zIndex: 1000, transition: 'transform 0.2s',
          transform: chatOpen ? 'scale(0.9)' : 'scale(1)'
        }}
      >
        <span style={{ fontSize: '1.8rem' }}>✨</span>
      </button>

      {chatOpen && (
        <div className="glass-panel" style={{
          position: 'fixed', bottom: '6rem', right: '2rem', width: '380px', height: '500px',
          borderRadius: '16px', display: 'flex', flexDirection: 'column', zIndex: 1000,
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)', overflow: 'hidden', border: '1px solid var(--borde2)'
        }}>
          {/* Header del Chat */}
          <div style={{ padding: '1.2rem', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--borde)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--lila)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🤖</div>
            <div>
              <h4 style={{ fontFamily: 'Syne', fontSize: '0.9rem', color: 'white', margin: 0 }}>Nexus AI Assistant</h4>
              <p style={{ fontSize: '0.65rem', color: 'var(--verde)', margin: 0, letterSpacing: '1px' }}>ONLINE — CLAUDE 3.5</p>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--texto3)', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
          </div>

          {/* Area de Mensajes */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%', padding: '0.8rem 1rem', borderRadius: '12px',
                background: msg.role === 'user' ? 'var(--azul-m)' : 'var(--bg2)',
                color: msg.role === 'user' ? 'white' : 'var(--texto)',
                border: msg.role === 'assistant' ? '1px solid var(--borde)' : 'none',
                fontSize: '0.85rem', lineHeight: 1.5
              }}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', padding: '0.8rem 1rem', borderRadius: '12px', background: 'var(--bg2)', border: '1px solid var(--borde)', fontSize: '0.8rem', color: 'var(--texto3)' }}>
                Nexus está analizando...
              </div>
            )}
          </div>

          {/* Input Chat */}
          <form onSubmit={handleAskAI} style={{ padding: '1rem', borderTop: '1px solid var(--borde)', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Preguntale a la inteligencia artificial..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isTyping}
              style={{ flex: 1, padding: '0.7rem 1rem', background: 'var(--bg)', border: '1px solid var(--borde)', borderRadius: '20px', color: 'white', fontSize: '0.85rem', outline: 'none' }}
            />
            <button
              type="submit"
              disabled={isTyping}
              style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--lila)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isTyping ? 'not-allowed' : 'pointer' }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
