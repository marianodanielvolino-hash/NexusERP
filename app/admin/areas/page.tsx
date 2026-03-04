"use client";

import { useState } from "react";

export default function AreasABM() {
    const [areas, setAreas] = useState([
        { id: 1, nombre: 'Comercial', responsable: 'Laura Cantero', indicadores: 4, ultimaCarga: '04/02/2025', estado: 'activa' },
        { id: 2, nombre: 'Calidad de Servicio', responsable: 'Martín Ferreyra', indicadores: 4, ultimaCarga: '03/02/2025', estado: 'activa' },
        { id: 3, nombre: 'Operaciones', responsable: 'Carlos Ibáñez', indicadores: 5, ultimaCarga: '05/02/2025', estado: 'activa' },
        { id: 4, nombre: 'Obras', responsable: 'Patricia Romero', indicadores: 4, ultimaCarga: '01/02/2025', estado: 'activa' }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nuevaArea, setNuevaArea] = useState({ nombre: '', responsable: '' });

    const handleCrear = () => {
        if (nuevaArea.nombre && nuevaArea.responsable) {
            setAreas([...areas, {
                id: areas.length + 1,
                ...nuevaArea,
                indicadores: 0,
                ultimaCarga: '—',
                estado: 'activa'
            }]);
            setIsModalOpen(false);
            setNuevaArea({ nombre: '', responsable: '' });
        }
    };

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-6" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontFamily: 'Syne, sans-serif', color: 'white', fontSize: '1.2rem', marginBottom: '0.2rem' }}>ABM de Áreas</h2>
                    <p style={{ color: 'var(--texto3)', fontSize: '0.85rem' }}>Gestión de áreas operativas del Tenant actual (ENERSA)</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Nueva Área</button>
            </div>

            {/* STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '10px', borderTop: '2px solid var(--azul-c)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--texto3)', textTransform: 'uppercase' }}>Total Áreas</div>
                    <div style={{ fontSize: '2rem', fontFamily: 'Syne, sans-serif', color: 'var(--azul-c)' }}>{areas.length}</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '10px', borderTop: '2px solid var(--verde)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--texto3)', textTransform: 'uppercase' }}>Activas</div>
                    <div style={{ fontSize: '2rem', fontFamily: 'Syne, sans-serif', color: 'var(--verde)' }}>{areas.filter(a => a.estado === 'activa').length}</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '10px', borderTop: '2px solid var(--naranja)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--texto3)', textTransform: 'uppercase' }}>Cargas Pendientes</div>
                    <div style={{ fontSize: '2rem', fontFamily: 'Syne, sans-serif', color: 'var(--naranja)' }}>3</div>
                </div>
            </div>

            {/* TABLA DE ÁREAS */}
            <div className="glass-panel form-section" style={{ border: '1px solid var(--borde)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid var(--borde)', background: 'rgba(0,0,0,0.2)' }}>
                    <input type="text" placeholder="Buscar área..." style={{ padding: '0.4rem 0.8rem', background: 'var(--bg2)', border: '1px solid var(--borde)', borderRadius: '6px', color: 'white', fontSize: '0.8rem', outline: 'none', width: '250px' }} />
                </div>
                <table className="indicadores-table w-full">
                    <thead>
                        <tr>
                            <th style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--texto2)', padding: '0.8rem' }}>Área Operativa</th>
                            <th style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--texto2)', padding: '0.8rem' }}>Responsable Nivel 2</th>
                            <th style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--texto2)', padding: '0.8rem' }}>Indicadores</th>
                            <th style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--texto2)', padding: '0.8rem' }}>Última Carga</th>
                            <th style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--texto2)', padding: '0.8rem' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {areas.map(area => (
                            <tr key={area.id} style={{ borderBottom: '1px solid var(--borde)' }}>
                                <td style={{ padding: '1rem', color: 'white', fontWeight: 500 }}>{area.nombre}</td>
                                <td style={{ padding: '1rem', color: 'var(--texto2)' }}>{area.responsable}</td>
                                <td style={{ padding: '1rem', color: 'var(--texto2)' }}>{area.indicadores}</td>
                                <td style={{ padding: '1rem', color: 'var(--texto2)' }}>{area.ultimaCarga}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button className="btn btn-ghost" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL CREAR ÁREA (Simulado) */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div className="glass-panel" style={{ width: '400px', padding: '2rem', borderRadius: '12px', background: 'var(--card)' }}>
                        <h3 style={{ color: 'white', fontFamily: 'Syne', marginBottom: '1rem' }}>Nueva Área</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--texto3)', marginBottom: '0.3rem' }}>Nombre del Área</label>
                            <input type="text" value={nuevaArea.nombre} onChange={e => setNuevaArea({ ...nuevaArea, nombre: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--borde)', background: 'var(--bg)', color: 'white' }} />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--texto3)', marginBottom: '0.3rem' }}>Responsable (Nivel 2)</label>
                            <input type="text" value={nuevaArea.responsable} onChange={e => setNuevaArea({ ...nuevaArea, responsable: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--borde)', background: 'var(--bg)', color: 'white' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={handleCrear}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
