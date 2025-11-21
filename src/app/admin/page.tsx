"use client";

import React from 'react';
import { PRODUCTS } from '@/lib/products';
import { useOrders } from '@/lib/orders';
import Link from 'next/link';

export default function AdminDashboard() {
    const { orders } = useOrders();
    const products = PRODUCTS;

    // Calculate statistics
    const totalProducts = products.length;
    const inStockProducts = products.filter(p => p.stock > 0).length;
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    // Order statistics
    const totalOrders = orders.length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const inTransitOrders = orders.filter(o => o.status === 'in-transit').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    // User statistics
    const users = JSON.parse(localStorage.getItem('mss_users') || '[]');
    const totalUsers = users.length;
    const recentOrders = orders.slice(0, 5);

    const StatCard = ({ title, value, subtitle, color, icon }: any) => (
        <div style={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>
                        {title}
                    </p>
                    <h3 style={{ fontSize: '2rem', fontWeight: 700, color }}>
                        {value}
                    </h3>
                    {subtitle && (
                        <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginTop: '0.25rem' }}>
                            {subtitle}
                        </p>
                    )}
                </div>
                <span style={{ fontSize: '2rem' }}>{icon}</span>
            </div>
        </div>
    );

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>
                Admin Dashboard
            </h1>

            {/* Overview Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <StatCard
                    title="Total Revenue"
                    value={`₹${totalRevenue.toFixed(2)}`}
                    subtitle={`From ${totalOrders} orders`}
                    color="#10b981"
                    icon="💰"
                />
                <StatCard
                    title="Total Orders"
                    value={totalOrders}
                    subtitle={`${processingOrders} processing`}
                    color="#3b82f6"
                    icon="📦"
                />
                <StatCard
                    title="Total Products"
                    value={totalProducts}
                    subtitle={`${inStockProducts} in stock`}
                    color="#8b5cf6"
                    icon="📱"
                />
                <StatCard
                    title="Registered Users"
                    value={totalUsers}
                    subtitle="Total customers"
                    color="#f59e0b"
                    icon="👥"
                />
            </div>

            {/* Inventory Overview */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    Inventory Overview
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        padding: '1.5rem',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>
                            In Stock
                        </p>
                        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>
                            {inStockProducts}
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        padding: '1.5rem',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>
                            Low Stock
                        </p>
                        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>
                            {lowStockProducts}
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        padding: '1.5rem',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>
                            Out of Stock
                        </p>
                        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>
                            {outOfStockProducts}
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        padding: '1.5rem',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>
                            Inventory Value
                        </p>
                        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#8b5cf6' }}>
                            ₹{totalInventoryValue.toFixed(0)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Order Status */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    Order Status
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        padding: '1.5rem',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>
                            ⏳ Processing
                        </p>
                        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>
                            {processingOrders}
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        padding: '1.5rem',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>
                            🚚 In Transit
                        </p>
                        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6' }}>
                            {inTransitOrders}
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        padding: '1.5rem',
                        textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>
                            ✅ Delivered
                        </p>
                        <p style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>
                            {deliveredOrders}
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                        Recent Orders
                    </h2>
                    <Link href="/admin/orders" className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                        View All Orders
                    </Link>
                </div>
                <div style={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden'
                }}>
                    {recentOrders.length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--muted))' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Order #</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Customer</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Total</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                                        <td style={{ padding: '1rem' }}>{order.orderNumber}</td>
                                        <td style={{ padding: '1rem' }}>{order.customerName}</td>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>₹{order.total.toFixed(2)}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                backgroundColor: order.status === 'delivered' ? '#10b98120' : order.status === 'in-transit' ? '#3b82f620' : '#f59e0b20',
                                                color: order.status === 'delivered' ? '#10b981' : order.status === 'in-transit' ? '#3b82f6' : '#f59e0b'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ padding: '2rem', textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
                            No orders yet
                        </p>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    Quick Actions
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <Link
                        href="/admin/inventory"
                        className="btn btn-primary"
                        style={{
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            fontSize: '1rem',
                            justifyContent: 'center'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>📦</span>
                        Manage Inventory
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="btn btn-primary"
                        style={{
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            fontSize: '1rem',
                            justifyContent: 'center'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>📋</span>
                        Manage Orders
                    </Link>
                    <Link
                        href="/admin/users"
                        className="btn btn-primary"
                        style={{
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            fontSize: '1rem',
                            justifyContent: 'center'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>👥</span>
                        View Users
                    </Link>
                </div>
            </div>
        </div>
    );
}
