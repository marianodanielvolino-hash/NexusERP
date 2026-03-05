interface ProgressRingProps {
    value: number; // 0-100
    label?: string;
    subLabel?: string;
    size?: number;
    strokeWidth?: number;
    color?: string;
}

export function ProgressRing({
    value,
    label,
    subLabel,
    size = 60,
    strokeWidth = 6,
    color = "var(--azul-primary)"
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: size, height: size, position: 'relative' }}>
                <svg fill="transparent" width={size} height={size}>
                    {/* Background circle */}
                    <circle
                        stroke="var(--borde)"
                        strokeWidth={strokeWidth}
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                    {/* Progress circle */}
                    <circle
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                        style={{ transition: 'stroke-dashoffset 0.5s ease-in-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                </svg>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: size > 80 ? '1.2rem' : '0.85rem',
                    fontWeight: 700,
                    color: 'var(--texto)'
                }}>
                    {Math.round(value)}%
                </div>
            </div>
            {(label || subLabel) && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {label && <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--texto)' }}>{label}</span>}
                    {subLabel && <span style={{ fontSize: '0.75rem', color: 'var(--texto2)' }}>{subLabel}</span>}
                </div>
            )}
        </div>
    );
}
