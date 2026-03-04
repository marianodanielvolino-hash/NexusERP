"use client";

import { useState } from "react";

export default function DashboardEjecutivo() {
  const [activeArea, setActiveArea] = useState('comercial');

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
        <div className="area-card activa">
          <div className="area-semaforo" style={{ background: 'var(--amarillo)' }}></div>
          <div className="area-nombre">Comercial</div>
          <div className="area-score amarillo">84<span>%</span></div>
          <div className="area-tendencia">▼ -2pp vs ene</div>
        </div>
        <div className="area-card">
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

        <div className="kpi-card glass-panel">
          <div className="kpi-area-tag">Obras</div>
          <div className="kpi-nombre">Avance Físico PROY.</div>
          <div className="kpi-row">
            <div>
              <span className="kpi-valor verde">98</span>
              <span className="kpi-unidad">%</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="kpi-meta">Meta: <span>95%</span></div>
            </div>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: '98%', background: 'var(--verde)' }}></div></div>
        </div>
      </div>
    </div>
  );
}
