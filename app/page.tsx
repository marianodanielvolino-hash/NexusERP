export default function Home() {
  return (
    <div>
      <h1 className="tb-title" style={{ marginBottom: '1.5rem', color: 'white' }}>
        Dashboard Ejecutivo
      </h1>

      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '12px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', color: 'var(--naranja)', marginBottom: '1rem' }}>
          Bienvenido a Nexus SCG
        </h2>
        <p style={{ color: 'var(--texto2)', lineHeight: '1.6' }}>
          El layout base de Next.js (Sidebar, Topbar y CSS Variables) con estética de Glassmorphism se ha configurado correctamente.
          <br /><br />
          Desde aquí continuaremos iterando los tableros del Nivel Ejecutivo, el motor de carga y el ABM de administrador multi-tenant, aplicando el aislamiento de PostgreSQL.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '2rem' }}>
        {['Comercial', 'Calidad de Servicio', 'Operaciones', 'Obras'].map(area => (
          <div key={area} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '12px', borderLeft: '3px solid var(--azul-c)' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--texto2)', textTransform: 'uppercase', letterSpacing: '1px' }}>{area}</h3>
            <p style={{ fontSize: '2rem', fontFamily: 'Syne, sans-serif', color: 'white', marginTop: '0.5rem' }}>85<span style={{ fontSize: '1rem', color: 'var(--texto3)' }}>%</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
