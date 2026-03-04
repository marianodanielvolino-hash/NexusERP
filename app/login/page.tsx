"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        // Conexión real a Supabase Auth
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        } else {
            // Redirigir al inicio donde el middleware/layout procesará la vista correcta
            router.push("/");
            router.refresh();
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>

            {/* Background Decorativo para la marca blanca */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(0,112,192,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

            <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '3rem', borderRadius: '16px', zIndex: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, var(--azul-c), var(--naranja))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 800, fontSize: '20px', color: 'white', margin: '0 auto 1rem' }}>NS</div>
                    <h1 style={{ fontFamily: 'Syne', fontSize: '1.5rem', color: 'white', letterSpacing: '1px' }}>Nexus SCG</h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--texto3)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '2px' }}>Control de Gestión</p>
                </div>

                {errorMsg && (
                    <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', color: 'var(--rojo)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--texto3)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Corporativo</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="usuario@empresa.com"
                            style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg2)', border: '1px solid var(--borde)', borderRadius: '8px', color: 'white', fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--texto3)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Contraseña</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg2)', border: '1px solid var(--borde)', borderRadius: '8px', color: 'white', fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ width: '100%', padding: '0.9rem', background: 'var(--azul-c)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem', transition: 'all 0.2s', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Autenticando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--borde)', paddingTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--texto3)' }}>Desarrollado sobre Nexus Engine v1.0</p>
                </div>
            </div>
        </div>
    );
}
