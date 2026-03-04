"use client";

import { useState } from "react";

export default function IndicadoresABM() {
    const [indicadores, setIndicadores] = useState([
        { id: 1, nombre: 'Índice de Cobrabilidad', area: 'Comercial', tipo: 'Mayor es mejor', meta: '≥ 92%', unidad: '%', frecuencia: 'Mensual', estado: 'alerta' },
        { id: 2, nombre: 'Nivel de Morosidad', area: 'Comercial', tipo: 'Menor es mejor', meta: '< 15%', unidad: '%', frecuencia: 'Mensual', estado: 'critico' },
        { id: 3, nombre: 'SAIDI — Duración Interrupciones', area: 'Calidad de Servicio', tipo: 'Menor es mejor', meta: '< 10 hs', unidad: 'hs', frecuencia: 'Mensual', estado: 'critico' },
        { id: 4, nombre: 'Avance Físico de Proyectos', area: 'Obras', tipo: 'Mayor es mejor', meta: '≥ 95%', unidad: '%', frecuencia: 'Mensual', estado: 'valido' },
        { id: 5, nombre: 'Disponibilidad de Red', area: 'Operaciones', tipo: 'Mayor es mejor', meta: '≥ 99%', unidad: '%', frecuencia: 'Mensual', estado: 'valido' }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nuevoInd, setNuevoInd] = useState({ nombre: '', area: '', tipo: 'Mayor es mejor', meta: '', unidad: '', frecuencia: 'Mensual' });

    const handleCrear = () => {
        if (nuevoInd.nombre && nuevoInd.area) {
            setIndicadores([...indicadores, {
                id: indicadores.length + 1,
                ...nuevoInd,
                estado: 'pendiente'
            }]);
            setIsModalOpen(false);
            setNuevoInd({ nombre: '', area: '', tipo: 'Mayor es mejor', meta: '', unidad: '', frecuencia: 'Mensual' });
        }
    };

    const areasList = ['Comercial', 'Calidad de Servicio', 'Operaciones', 'Obras', 'Admin & Finanzas', 'Compras', 'Legales'];

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontFamily: 'Syne, sans-serif', color: 'white', fontSize: '1.2rem', marginBottom: '0.2rem' }}>ABM de Indicadores</h2>
                    <p style={{ color: 'var(--texto3)', fontSize: '0.85rem' }}>Catálogo central de KPIs para el Motor de Carga (Kpi_Definitions)</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Nuevo KPI</button>
            </div>

            {/* STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '10px', borderTop: '2px solid var(--azul-c)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--texto3)', textTransform: 'uppercase' }}>Total Indicadores</div>
                    <div style={{ fontSize: '2rem', fontFamily: 'Syne, sans-serif', color: 'var(--azul-c)' }}>{indicadores.length}</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '10px', borderTop: '2px solid var(--verde)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--texto3)', textTransform: 'uppercase' }}>Activos</div>
                    <div style={{ fontSize: '2rem', fontFamily: 'Syne, sans-serif', color: 'var(--verde)' }}>{indicadores.length}</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '10px', borderTop: '2px solid var(--rojo)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--texto3)', textTransform: 'uppercase' }}>En Estado Crítico</div>
                    <div style={{ fontSize: '2rem', fontFamily: 'Syne, sans-serif', color: 'var(--rojo)' }}>{indicadores.filter(i => i.estado === 'critico').length}</div>
                </div>
            </div>

            {/* FILTROS Y BÚSQUEDA */}
            <div className="glass-panel form-section" style={{ border: '1px solid var(--borde)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid var(--borde)', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '1rem' }}>
                    <input type="text" placeholder="Buscar KPI..." style={{ flex: 1, padding: '0.4rem 0.8rem', background: 'var(--bg2)', border: '1px solid var(--borde)', borderRadius: '6px', color: 'white', fontSize: '0.8rem', outline: 'none' }} />
                    <select style={{ padding: '0.4rem 0.8rem', background: 'var(--bg2)', border: '1px solid var(--borde)', borderRadius: '6px', color: 'white', fontSize: '0.8rem', outline: 'none', width: '200px' }}>
                        <option value="">Todas las Áreas</option>
                        {areasList.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>

                {/* TABLA DE INDICADORES */}
                <table className="indicadores-table w-full">
                    <thead>
                        <tr>
                            <th style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--texto2)', padding: '0.8rem' }}>Indicador</th>
                            <th style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--texto2)', padding: '0.8rem' }}>Área Asignada</th>
                            <th style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--texto2)', padding: '0.8rem' }}>Regla y Meta</th>
                            <th style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--texto2)', padding: '0.8rem' }}>Frecuencia</th>
                            <th style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--texto2)', padding: '0.8rem' }}>Estado Actual</th>
                            <th style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--texto2)', padding: '0.8rem' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {indicadores.map(ind => (
                            <tr key={ind.id} style={{ borderBottom: '1px solid var(--borde)' }}>
                                <td style={{ padding: '1rem', color: 'white', fontWeight: 500 }}>{ind.nombre}</td>
                                <td style={{ padding: '1rem', color: 'var(--texto2)' }}><span className="sb-tag" style={{ marginTop: 0 }}>{ind.area}</span></td>
                                <td style={{ padding: '1rem', color: 'var(--texto2)' }}>
                                    <div style={{ fontSize: '0.7rem' }}>{ind.tipo}</div>
                                    <div style={{ color: 'var(--naranja)', fontWeight: 600 }}>{ind.meta}</div>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--texto2)' }}>{ind.frecuencia}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%',
                                        background: ind.estado === 'valido' ? 'var(--verde)' :
                                            ind.estado === 'alerta' ? 'var(--amarillo)' :
                                                ind.estado === 'critico' ? 'var(--rojo)' : 'gray'
                                    }}></span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button className="btn btn-ghost" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL CREAR INDICADOR (Simulado) */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div className="glass-panel" style={{ width: '500px', padding: '2rem', borderRadius: '12px', background: 'var(--card)' }}>
                        <h3 style={{ color: 'white', fontFamily: 'Syne', marginBottom: '1.5rem' }}>Nuevo Indicador (KPI)</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--texto3)', marginBottom: '0.3rem' }}>Nombre del Indicador</label>
                                <input type="text" value={nuevoInd.nombre} onChange={e => setNuevoInd({ ...nuevoInd, nombre: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--borde)', background: 'var(--bg)', color: 'white' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--texto3)', marginBottom: '0.3rem' }}>Área</label>
                                <select value={nuevoInd.area} onChange={e => setNuevoInd({ ...nuevoInd, area: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--borde)', background: 'var(--bg)', color: 'white' }}>
                                    <option value="">Seleccione un área...</option>
                                    {areasList.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--texto3)', marginBottom: '0.3rem' }}>Regla de Cálculo (Tipo)</label>
                                <select value={nuevoInd.tipo} onChange={e => setNuevoInd({ ...nuevoInd, tipo: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--borde)', background: 'var(--bg)', color: 'white' }}>
                                    <option value="Mayor es mejor">Mayor es mejor</option>
                                    <option value="Menor es mejor">Menor es mejor</option>
                                    <option value="Exacto">Tolerancia exacta</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--texto3)', marginBottom: '0.3rem' }}>Meta y Unidad</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input type="text" placeholder="Ej: 95" value={nuevoInd.meta} onChange={e => setNuevoInd({ ...nuevoInd, meta: e.target.value })} style={{ width: '60%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--borde)', background: 'var(--bg)', color: 'white' }} />
                                    <input type="text" placeholder="Ej: %" value={nuevoInd.unidad} onChange={e => setNuevoInd({ ...nuevoInd, unidad: e.target.value })} style={{ width: '40%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--borde)', background: 'var(--bg)', color: 'white' }} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--texto3)', marginBottom: '0.3rem' }}>Frecuencia</label>
                                <select value={nuevoInd.frecuencia} onChange={e => setNuevoInd({ ...nuevoInd, frecuencia: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--borde)', background: 'var(--bg)', color: 'white' }}>
                                    <option value="Diaria">Diaria</option>
                                    <option value="Semanal">Semanal</option>
                                    <option value="Mensual">Mensual</option>
                                    <option value="Trimestral">Trimestral</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
                            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleCrear}>Guardar KPI</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
