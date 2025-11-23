"use client";

import React, { useState } from 'react';
import Image from 'next/image';

type Customer = {
    id: string;
    name: string;
    logo: string; // URL to logo image
    website: string;
};

const initialCustomers: Customer[] = [
    { id: '1', name: 'Linear', logo: '/placeholder.png', website: 'linear.app' },
    { id: '2', name: 'Stripe', logo: '/placeholder.png', website: 'stripe.com' },
    { id: '3', name: 'Webflow', logo: '/placeholder.png', website: 'webflow.com' },
    { id: '4', name: 'Intercom', logo: '/placeholder.png', website: 'intercom.com' },
    { id: '5', name: 'Basecamp', logo: '/placeholder.png', website: 'basecamp.com' },
    { id: '6', name: 'Figma', logo: '/placeholder.png', website: 'figma.com' },
];

export default function CustomerTable() {
    const [search, setSearch] = useState('');
    const filtered = initialCustomers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={20} height={20} style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
                </svg>
                <input
                    type="text"
                    placeholder="Search customers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: 'hsl(var(--muted))' }}>
                    <tr>
                        <th style={{ padding: '1rem' }}></th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Company</th>
                        <th style={{ padding: '1rem', textAlign: 'left' }}>Website</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((c, idx) => (
                        <tr
                            key={c.id}
                            style={{
                                borderTop: idx > 0 ? '1px solid hsl(var(--border))' : 'none',
                                backgroundColor: 'transparent',
                                transition: 'background-color 0.2s',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(var(--muted))')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                            <td style={{ padding: '1rem' }}>
                                <input type="checkbox" />
                            </td>
                            <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Image src={c.logo} alt={c.name} width={24} height={24} style={{ borderRadius: 'var(--radius)' }} />
                                {c.name}
                            </td>
                            <td style={{ padding: '1rem' }}>{c.website}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
