"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Mail, KeyRound, ArrowRight, Loader2, Link2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isMagicLink, setIsMagicLink] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        if (isMagicLink) {
            // Flujo Magic Link
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                setErrorMsg(error.message);
            } else {
                setSuccessMsg("¡Enlace mágico enviado! Revisa tu bandeja de entrada.");
            }
        } else {
            // Flujo Contraseña Real
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setErrorMsg("Credenciales inválidas. Por favor, verifica tu correo y contraseña.");
            } else {
                router.push("/");
                router.refresh();
                return; // Prevent setLoading(false) to keep the loading state during redirect
            }
        }

        setLoading(false);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#000000', position: 'relative', overflow: 'hidden' }}>

            {/* Background Futurista Dynamic */}
            <div style={{ position: 'absolute', top: '-15%', left: '-15%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(50, 145, 255, 0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(40px)' }}></div>
            <div style={{ position: 'absolute', bottom: '-20%', right: '-15%', width: '70vw', height: '70vw', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(50px)' }}></div>
            <div style={{ position: 'absolute', width: '200%', height: '200%', background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '60px 60px', opacity: 0.5 }}></div>

            <div style={{
                width: '100%',
                maxWidth: '420px',
                padding: '3rem',
                borderRadius: 'var(--radius-xl)',
                zIndex: 1,
                boxShadow: '0 0 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                background: 'rgba(10, 10, 10, 0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'relative'
            }}>
                {/* Glow orbital */}
                <div style={{ position: 'absolute', top: '-1px', left: '15%', right: '15%', height: '1px', background: 'linear-gradient(90deg, transparent, var(--azul-primary), transparent)', filter: 'blur(1px)', opacity: 0.6 }}></div>

                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        background: 'linear-gradient(135deg, #0070f3, #3291ff)',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '24px',
                        color: 'white',
                        margin: '0 auto 1.2rem',
                        boxShadow: 'var(--shadow-glow)',
                    }}>NX</div>
                    <h1 style={{ fontWeight: 700, fontSize: '1.6rem', color: 'var(--texto)', letterSpacing: '-0.03em', marginBottom: '0.2rem' }}>Entrar a Nexus</h1>
                    <p style={{ fontSize: '0.85rem', color: 'var(--texto3)' }}>El sistema central de operaciones</p>
                </div>

                {errorMsg && (
                    <div className="fade-in" style={{ background: 'var(--rojo-bg)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--rojo)', padding: '0.8rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {errorMsg}
                    </div>
                )}

                {successMsg && (
                    <div className="fade-in" style={{ background: 'var(--verde-bg)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--verde)', padding: '0.8rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {successMsg}
                    </div>
                )}

                <div style={{ display: 'flex', background: 'var(--bg3)', padding: '4px', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--borde)' }}>
                    <button
                        onClick={() => { setIsMagicLink(false); setErrorMsg(""); setSuccessMsg(""); }}
                        style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: 'none', background: !isMagicLink ? 'var(--card)' : 'transparent', color: !isMagicLink ? 'var(--texto)' : 'var(--texto3)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all var(--transition-fast)', boxShadow: !isMagicLink ? 'var(--shadow-inner)' : 'none' }}>
                        Contraseña
                    </button>
                    <button
                        onClick={() => { setIsMagicLink(true); setErrorMsg(""); setSuccessMsg(""); }}
                        style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: 'none', background: isMagicLink ? 'var(--card)' : 'transparent', color: isMagicLink ? 'var(--texto)' : 'var(--texto3)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all var(--transition-fast)', boxShadow: isMagicLink ? 'var(--shadow-inner)' : 'none' }}>
                        Magic Link
                    </button>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--texto2)', marginBottom: '0.4rem', fontWeight: 500 }}>Email corporativo</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--texto3)' }}>
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@empresa.com"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px 10px 40px',
                                    background: 'var(--bg3)',
                                    border: '1px solid var(--borde)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--texto)',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = 'var(--borde2)'; }}
                                onBlur={(e) => { e.target.style.borderColor = 'var(--borde)'; }}
                            />
                        </div>
                    </div>

                    {!isMagicLink && (
                        <div className="fade-in">
                            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--texto2)', marginBottom: '0.4rem', fontWeight: 500 }}>Contraseña</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--texto3)' }}>
                                    <KeyRound size={18} />
                                </span>
                                <input
                                    type="password"
                                    required={!isMagicLink}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px 10px 40px',
                                        background: 'var(--bg3)',
                                        border: '1px solid var(--borde)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--texto)',
                                        fontSize: '0.9rem',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)'
                                    }}
                                    onFocus={(e) => { e.target.style.borderColor = 'var(--borde2)'; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'var(--borde)'; }}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            background: 'var(--azul-primary)',
                            color: 'white',
                            border: '1px solid var(--azul-primary-hover)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '0.5rem',
                            transition: 'all 0.2s',
                            boxShadow: 'var(--shadow-glow)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--azul-primary-hover)'; }}
                        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'var(--azul-primary)'; }}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : isMagicLink ? <><Link2 size={18} /> Enviar Magic Link</> : <><ArrowRight size={18} /> Iniciar Sesión</>}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', borderTop: '1px solid var(--borde)', paddingTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--texto3)' }}>¿No tienes una cuenta? <a href="/register" style={{ color: 'var(--texto)', textDecoration: 'none', fontWeight: 500 }}>Registrarse</a></p>
                    {!isMagicLink && <a href="/forgot-password" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--texto3)', textDecoration: 'none', marginTop: '0.5rem' }}>Recuperar contraseña</a>}
                </div>

                {/* Global Style specifically for the loading spinner animation */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}} />
            </div>
        </div>
    );
}
