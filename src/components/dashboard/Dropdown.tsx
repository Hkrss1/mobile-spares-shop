"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const menuItems = [
    { label: 'View Profile', shortcut: '' },
    { label: 'Account Settings', shortcut: '' },
    { label: 'Keyboard Shortcuts', shortcut: '⌘K' },
    { label: 'Updates', shortcut: '' },
    { label: 'Log out', shortcut: '' },
];

export default function Dropdown() {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ position: 'relative' }}>
            <div
                onClick={() => setOpen(!open)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
            >
                <Image src="/placeholder.png" alt="User" width={40} height={40} style={{ borderRadius: '9999px' }} />
            </div>
            {open && (
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        marginTop: '0.5rem',
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                        minWidth: '180px',
                        zIndex: 10,
                    }}
                >
                    {menuItems.map((item) => (
                        <div
                            key={item.label}
                            style={{
                                padding: '0.75rem 1rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                borderBottom: '1px solid hsl(var(--border))',
                            }}
                        >
                            <span>{item.label}</span>
                            {item.shortcut && <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.75rem' }}>{item.shortcut}</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
