import React from 'react';

type StatCardProps = {
    label: string;
    value: string | number;
    growth?: string; // e.g. '+20%'
    color?: string; // text color for value
};

export default function StatCard({ label, value, growth, color = '#111827' }: StatCardProps) {
    return (
        <div
            style={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            }}
        >
            <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', margin: 0 }}>
                {label}
            </p>
            <h3 style={{ fontSize: '2rem', fontWeight: 700, color, margin: 0 }}>{value}</h3>
            {growth && (
                <span
                    style={{
                        fontSize: '0.75rem',
                        color: growth.startsWith('+') ? '#10b981' : '#ef4444',
                    }}
                >
                    {growth}
                </span>
            )}
        </div>
    );
}
