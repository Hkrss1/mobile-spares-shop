import React from 'react';

type SidebarItemProps = {
    icon: React.ReactNode | string;
    label: string;
    active?: boolean;
    onClick?: () => void;
};

export default function SidebarItem({ icon, label, active = false, onClick }: SidebarItemProps) {
    const baseStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius)',
        cursor: 'pointer',
        backgroundColor: active ? 'hsl(var(--muted))' : 'transparent',
        fontWeight: active ? 600 : 400,
    };

    return (
        <div style={baseStyle} onClick={onClick}>
            <span>{icon}</span>
            <span>{label}</span>
        </div>
    );
}
