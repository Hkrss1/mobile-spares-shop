import React from 'react';
import Link from 'next/link';

export default function Header() {
    return (
        <header
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 0',
                borderBottom: '1px solid hsl(var(--border))',
            }}
        >
            <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
                    Online store
                </h1>
                <div style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                    <span>Untitled UI</span> • <span>Learn Figma</span>
                </div>
            </div>
            <Link href="https://www.figma.com/community/file/" target="_blank" rel="noopener noreferrer">
                <span style={{ fontSize: '1.25rem' }}>🔗</span>
            </Link>
        </header>
    );
}
