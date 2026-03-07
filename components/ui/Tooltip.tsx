"use client";

import React, { useState, useRef, useEffect } from "react";

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactElement;
    position?: "top" | "bottom" | "left" | "right";
    delay?: number;
}

export function Tooltip({ content, children, position = "top", delay = 200 }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsVisible(false);
    };

    // Estilos base dinámicos dependiendo de la posición
    const getPositionStyle = (): React.CSSProperties => {
        const offset = "8px";
        switch (position) {
            case "top":
                return { bottom: `calc(100% + ${offset})`, left: "50%", transform: "translateX(-50%)" };
            case "bottom":
                return { top: `calc(100% + ${offset})`, left: "50%", transform: "translateX(-50%)" };
            case "left":
                return { right: `calc(100% + ${offset})`, top: "50%", transform: "translateY(-50%)" };
            case "right":
                return { left: `calc(100% + ${offset})`, top: "50%", transform: "translateY(-50%)" };
            default:
                return {};
        }
    };

    return (
        <div
            style={{ position: "relative", display: "inline-block" }}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {children}
            {isVisible && (
                <div style={{
                    position: "absolute",
                    ...getPositionStyle(),
                    background: "rgba(15, 16, 22, 0.95)", // Glass effect oscuro
                    color: "var(--texto)",
                    fontSize: "12px",
                    fontWeight: 500,
                    padding: "6px 12px",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                    border: "1px solid var(--borde)",
                    zIndex: 9999,
                    backdropFilter: "blur(10px)",
                    pointerEvents: "none", // Avoid flicker
                    animation: "fadeInTooltip 0.2s ease forwards"
                }}>
                    {content}
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInTooltip {
                    from { opacity: 0; transform: ${position === 'top' || position === 'bottom' ? 'translateX(-50%) scale(0.95)' : 'translateY(-50%) scale(0.95)'}; }
                    to { opacity: 1; transform: ${position === 'top' || position === 'bottom' ? 'translateX(-50%) scale(1)' : 'translateY(-50%) scale(1)'}; }
                }
            `}} />
        </div>
    );
}
