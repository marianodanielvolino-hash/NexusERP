"use client";

import { useState } from "react";

export default function MotorDeCarga() {
    const [indicadores, setIndicadores] = useState([
        { id: 1, nombre: "Índice de Cobrabilidad", meta: "≥ 92%", valor: "", unidad: "%", estado: "pendiente" },
        { id: 2, nombre: "Nivel de Morosidad", meta: "< 15%", valor: "", unidad: "%", estado: "pendiente" },
        { id: 3, nombre: "Tiempo resolución reclamos", meta: "≤ 48 hs", valor: "", unidad: "hs", estado: "pendiente" }
    ]);

    const handleCarga = (index: number, value: string) => {
        const updated = [...indicadores];
        updated[index].valor = value;
        // Semáforo dinámico simulado a modo de MVP
        if (value) {
            const num = parseFloat(value);
            if (index === 0) { // Cobrabilidad
                updated[index].estado = num >= 92 ? "valido" : num >= 85 ? "alerta" : "critico";
            } else if (index === 1) { // Morosidad
                updated[index].estado = num <= 15 ? "valido" : num <= 20 ? "alerta" : "critico";
            } else { // Tiempo resolución
                updated[index].estado = num <= 48 ? "valido" : num <= 72 ? "alerta" : "critico";
            }
        } else {
            updated[index].estado = "pendiente";
        }
        setIndicadores(updated);
    };

    const cargasHechas = indicadores.filter(i => i.valor !== "").length;

    return (
        <div className="fade-in">
            {/* HEADER DE ESTADOS */}
            <div className="estado-carga-grid">
                <div className="estado-card glass-panel flex-col">
                    <div className="estado-card-label">Período Activo</div>
                    <div className="estado-card-val" style={{ color: 'var(--naranja)' }}>Febrero 2025</div>
                    <div className="estado-card-sub">Cierra el 05/03/2025</div>
                </div>
                <div className="estado-card glass-panel flex-col">
                    <div className="estado-card-label">Área</div>
                    <div className="estado-card-val" style={{ color: 'var(--azul-c)', fontSize: '1.4rem' }}>Comercial</div>
                    <div className="estado-card-sub">Gerencia de Comercialización</div>
                </div>
                <div className="estado-card glass-panel flex-col">
                    <div className="estado-card-label">Progreso de Carga</div>
                    <div className="estado-card-val" style={{ color: 'var(--verde)' }}>{cargasHechas} / {indicadores.length}</div>
                    <div className="estado-card-sub">Indicadores completados</div>
                </div>
                <div className="estado-card glass-panel flex-col">
                    <div className="estado-card-label">Estado</div>
                    <div><span className={`pill pill-${cargasHechas === indicadores.length ? 'verde' : 'naranja'}`}>{cargasHechas === indicadores.length ? 'LISTO PARA ENVIAR' : 'EN PROGRESO'}</span></div>
                    <div className="estado-card-sub">Esperando finalización</div>
                </div>
            </div>

            {/* MOTOR DE CARGA UNIVERSAL */}
            <div className="form-section glass-panel" style={{ border: '1px solid var(--borde)' }}>
                <div className="form-section-header">
                    <div>
                        <div className="form-section-title">Grilla Universal de Carga</div>
                        <div className="form-section-desc">Ingrese el valor numérico, el semáforo se actualizará automáticamente basado en la regla de cálculo.</div>
                    </div>
                </div>

                <div className="form-body">
                    <table className="indicadores-table w-full">
                        <thead>
                            <tr>
                                <th>Indicador</th>
                                <th>Meta</th>
                                <th>Valor Período</th>
                                <th>Semáforo</th>
                                <th>Observación / Evidencia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {indicadores.map((ind, i) => (
                                <tr key={ind.id}>
                                    <td>
                                        <div className="ind-nombre" style={{ color: 'var(--texto)' }}>{ind.nombre}</div>
                                        <div className="fuente-tag" style={{ color: 'var(--texto2)' }}>Fuente: CRM / Facturación</div>
                                    </td>
                                    <td>
                                        <div className="ind-meta-val" style={{ color: 'var(--naranja)' }}>{ind.meta}</div>
                                    </td>
                                    <td>
                                        <div className="input-wrap">
                                            <input
                                                type="number"
                                                className={`input-num ${ind.estado}`}
                                                value={ind.valor}
                                                onChange={(e) => handleCarga(i, e.target.value)}
                                                placeholder="0.00"
                                                style={{ color: 'black', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                            />
                                            <span className="input-unidad" style={{ color: 'var(--texto2)', marginLeft: '8px' }}>{ind.unidad}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="ind-status">
                                            <div className="semaforo-live" style={{
                                                background: ind.estado === 'valido' ? 'var(--verde)' :
                                                    ind.estado === 'alerta' ? 'var(--amarillo)' :
                                                        ind.estado === 'critico' ? 'var(--rojo)' : 'transparent',
                                                border: ind.estado === 'pendiente' ? '1px solid var(--texto3)' : 'none',
                                                width: '12px', height: '12px', borderRadius: '50%',
                                                boxShadow: ind.estado !== 'pendiente' ? `0 0 8px var(--${ind.estado === 'valido' ? 'verde' : ind.estado === 'alerta' ? 'amarillo' : 'rojo'})` : 'none'
                                            }}></div>
                                            <span style={{ color: 'var(--texto2)', fontSize: '0.8rem', marginLeft: '6px', textTransform: 'capitalize' }}>
                                                {ind.estado === 'valido' ? 'En meta' : ind.estado === 'pendiente' ? 'Sin cargar' : ind.estado}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <textarea
                                            className="input-nota"
                                            placeholder={ind.estado === 'critico' ? "Requerido por desvío crítico..." : "Nota opcional..."}
                                            style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: ind.estado === 'critico' ? '1px solid var(--rojo)' : '1px solid var(--borde)', fontSize: '0.8rem', color: 'black' }}
                                        ></textarea>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-end mt-4" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="btn btn-primary" disabled={cargasHechas !== indicadores.length}>
                    Confirmar y Enviar al Nivel 2 (Gestión)
                </button>
            </div>
        </div>
    );
}
