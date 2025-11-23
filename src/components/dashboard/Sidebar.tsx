"use client";

import React, { useState } from 'react';
import SidebarItem from './SidebarItem';
import Image from 'next/image';

const icons = {
    dashboard: '📊',
    store: '🏬',
    emails: '✉️',
    reports: '📈',
    design: '🎨',
    settings: '⚙️',
};

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [storeOpen, setStoreOpen] = useState(true);
    const toggleCollapse = () => setCollapsed(!collapsed);
    const toggleStore = () => setStoreOpen(!storeOpen);

    const width = collapsed ? '60px' : '260px';
    const itemStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius)',
        cursor: 'pointer',
    } as React.CSSProperties;



    return (
        <aside
            style={{
                width,
                backgroundColor: 'hsl(var(--muted))',
                transition: 'width 0.3s ease',
                height: '100vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <div>
                {/* Top toggle button */}
                <div
                    onClick={toggleCollapse}
                    style={{ ...itemStyle, justifyContent: collapsed ? 'center' : 'flex-start' }}
                >
                    {collapsed ? '▶' : '◀'}
                </div>
                {/* Main navigation */}
                <SidebarItem icon={icons.dashboard} label="Dashboard" active />
                <SidebarItem icon={icons.store} label="Store" onClick={toggleStore} />
                {storeOpen && (
                    <div style={{ paddingLeft: collapsed ? '0' : '2rem' }}>
                        <SidebarItem icon='📦' label='Products' />
                        <SidebarItem icon='🧾' label='Orders' />
                        <SidebarItem icon='🔁' label='Subscriptions' />
                        <SidebarItem icon='👥' label='Customers' active />
                        <SidebarItem icon='🏷️' label='Discounts' />
                        <SidebarItem icon='🔑' label='Licenses' />
                    </div>
                )}
                <SidebarItem icon={icons.emails} label="Emails" />
                <SidebarItem icon={icons.reports} label="Reports" />
                <SidebarItem icon={icons.design} label="Design" />
                <SidebarItem icon={icons.settings} label="Settings" />
            </div>
            {/* Bottom avatar dropdown placeholder */}
            <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: collapsed ? 'center' : 'flex-start' }}>
                    <Image src="/placeholder.png" alt="User" width={40} height={40} style={{ borderRadius: '9999px' }} />
                </div>
            </div>
        </aside>
    );
}
