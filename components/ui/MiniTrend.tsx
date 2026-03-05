import React from "react";

interface MiniTrendProps {
    points: number[];
    labels?: string[];
    compact?: boolean;
    color?: string;
}

export function MiniTrend({ points, compact = false, color = "var(--azul-primary)" }: MiniTrendProps) {
    if (points.length < 2) return <div style={{ fontSize: '0.7rem', color: 'var(--texto3)' }}>Sin datos</div>;

    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1; // prevent div by 0

    const svgWidth = 100; // relative percentage box
    const svgHeight = 40; // relative px height baseline

    const stepX = svgWidth / (points.length - 1);

    const getPt = (val: number, i: number) => {
        const x = Math.round(i * stepX);
        // Add small padding to Y
        const padding = 2;
        const y = Math.round(svgHeight - padding - ((val - min) / range) * (svgHeight - padding * 2));
        return `${x},${y}`;
    };

    const polylineStr = points.map((p, i) => getPt(p, i)).join(" ");

    return (
        <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
            style={{ overflow: 'visible' }}
        >
            <polyline
                points={polylineStr}
                fill="none"
                stroke={color}
                strokeWidth={compact ? "2" : "3"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Little dot at the end */}
            {points.length > 0 && (
                <circle
                    cx={getPt(points[points.length - 1], points.length - 1).split(',')[0]}
                    cy={getPt(points[points.length - 1], points.length - 1).split(',')[1]}
                    r="2.5"
                    fill={color}
                />
            )}
        </svg>
    );
}
