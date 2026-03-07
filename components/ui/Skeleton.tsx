"use client";

import React from "react";

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    style?: React.CSSProperties;
    className?: string;
}

export function Skeleton({ width = "100%", height = "20px", borderRadius = "var(--radius-sm)", style, className = "" }: SkeletonProps) {
    return (
        <div
            className={`skeleton-loader ${className}`}
            style={{
                width: typeof width === "number" ? `${width}px` : width,
                height: typeof height === "number" ? `${height}px` : height,
                borderRadius,
                background: "var(--bg3)", // Base oscura Dark Mode
                position: "relative",
                overflow: "hidden",
                ...style
            }}
        >
            {/* Shimmer effect */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    transform: "translateX(-100%)",
                    backgroundImage: `linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0) 0,
                        rgba(255, 255, 255, 0.04) 20%,
                        rgba(255, 255, 255, 0.08) 60%,
                        rgba(255, 255, 255, 0)
                    )`,
                    animation: "shimmer 1.5s infinite",
                    zIndex: 1
                }}
            />

            {/* Inyección CSS Local - Percepción de Velocidad (Fase 2) */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}} />
        </div>
    );
}

// Helpers útiles para layouts predefinidos de carga

export function CardSkeleton() {
    return (
        <div style={{
            background: "var(--card)",
            padding: "20px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--borde)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            height: "100%"
        }}>
            <Skeleton width="40px" height="40px" borderRadius="var(--radius-md)" />
            <Skeleton width="60%" height="24px" style={{ marginTop: "4px" }} />
            <Skeleton width="40%" height="16px" />
        </div>
    );
}

export function RowSkeleton() {
    return (
        <div style={{
            background: "var(--card)",
            padding: "16px 20px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--borde)",
            display: "flex",
            alignItems: "center",
            gap: "16px"
        }}>
            <Skeleton width="48px" height="48px" borderRadius="12px" />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                <Skeleton width="30%" height="18px" />
                <Skeleton width="50%" height="12px" />
            </div>
            <Skeleton width="60px" height="24px" borderRadius="12px" />
        </div>
    );
}
