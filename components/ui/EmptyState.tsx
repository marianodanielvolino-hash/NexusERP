"use client";

import React from "react";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}

export function EmptyState({
    title,
    description,
    actionLabel,
    onAction,
    icon = <FolderOpen size={48} strokeWidth={1} />
}: EmptyStateProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem',
            background: 'var(--bg3)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--borde2)',
            textAlign: 'center',
            margin: '2rem 0'
        }}>
            <div style={{
                color: 'var(--texto3)',
                marginBottom: '1rem',
                background: 'var(--bg)',
                padding: '1.5rem',
                borderRadius: '50%',
                boxShadow: 'var(--shadow-inner)'
            }}>
                {icon}
            </div>
            <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--texto)',
                marginBottom: '0.5rem'
            }}>
                {title}
            </h3>
            <p style={{
                fontSize: '0.9rem',
                color: 'var(--texto2)',
                maxWidth: '400px',
                marginBottom: actionLabel ? '1.5rem' : '0'
            }}>
                {description}
            </p>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'var(--azul-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                        boxShadow: 'var(--shadow-glow)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--azul-primary-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--azul-primary)'}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
