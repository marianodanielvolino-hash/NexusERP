"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface SlideDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: string;
}

export function SlideDrawer({ isOpen, onClose, title, children, width = "400px" }: SlideDrawerProps) {

    // Bloquear el scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop Blur */}
            <div
                className="fade-in"
                onClick={onClose}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(4px)",
                    zIndex: 9998,
                    transition: "all var(--transition-normal)"
                }}
            />

            {/* Panel lateral que irrumpe */}
            <div
                className="slide-left"
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: width,
                    maxWidth: "100%",
                    background: "var(--bg2)",
                    borderLeft: "1px solid var(--borde)",
                    boxShadow: "-10px 0 40px rgba(0,0,0,0.5)",
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                }}
            >
                {/* Header Navbar */}
                <div style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid var(--borde)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "var(--bg3)"
                }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--texto)", margin: 0 }}>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--texto2)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "6px",
                            borderRadius: "var(--radius-sm)",
                            transition: "all var(--transition-fast)"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "var(--borde)";
                            e.currentTarget.style.color = "var(--texto)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "var(--texto2)";
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Scrolling Content */}
                <div style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "24px"
                }}>
                    {children}
                </div>
            </div>

            {/* Inyección de CSS Keyframes globalmente */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}} />
        </>
    );
}
