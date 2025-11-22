"use client";

import React from 'react';
import { useOrders } from '@/lib/orders';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function OrdersPage() {
    const { getUserOrders, cancelOrder } = useOrders();
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="container animate-fade-in" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Please Login</h1>
                <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '2rem' }}>You need to be logged in to view your orders.</p>
                <Link href="/login" className="btn btn-primary">
                    Go to Login
                </Link>
            </div>
        );
    }

    const userOrders = getUserOrders(user.mobile);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processing': return { bg: '#f59e0b20', color: '#f59e0b' };
            case 'in-transit': return { bg: '#3b82f620', color: '#3b82f6' };
            case 'delivered': return { bg: '#10b98120', color: '#10b981' };
            case 'cancelled': return { bg: '#ef444420', color: '#ef4444' };
            default: return { bg: '#6b728020', color: '#6b7280' };
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'processing': return '⏳';
            case 'in-transit': return '🚚';
            case 'delivered': return '✅';
            case 'cancelled': return '❌';
            default: return '📦';
        }
    };

    const handleCancel = (orderId: string) => {
        if (confirm('Are you sure you want to cancel this order?')) {
            cancelOrder(orderId, 'user');
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>My Orders</h1>

            {userOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                    <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '2rem' }}>You haven&apos;t placed any orders yet.</p>
                    <Link href="/" className="btn btn-primary">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {userOrders.map(order => {
                        const statusStyle = getStatusColor(order.status);
                        return (
                            <div key={order.id} style={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                                padding: '1.5rem'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                            Order #{order.orderNumber}
                                        </h3>
                                        <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                        <div style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: 'var(--radius)',
                                            backgroundColor: statusStyle.bg,
                                            color: statusStyle.color,
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <span>{getStatusIcon(order.status)}</span>
                                            <span style={{ textTransform: 'capitalize' }}>{order.status.replace('-', ' ')}</span>
                                        </div>
                                        {order.status === 'cancelled' && (
                                            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
                                                Cancelled by {order.cancelledBy === 'user' ? 'You' : 'QuikFix'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid hsl(var(--border))', paddingTop: '1rem', marginBottom: '1rem' }}>
                                    {order.items.map((item, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '0.5rem',
                                            fontSize: '0.875rem'
                                        }}>
                                            <span>{item.name} × {item.quantity}</span>
                                            <span style={{ fontWeight: 500 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderTop: '1px solid hsl(var(--border))',
                                    paddingTop: '1rem'
                                }}>
                                    <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                                        Total: ₹{order.total.toFixed(2)}
                                    </span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {order.status === 'processing' && (
                                            <button
                                                onClick={() => handleCancel(order.id)}
                                                className="btn"
                                                style={{
                                                    backgroundColor: '#ef4444',
                                                    color: 'white',
                                                    fontSize: '0.875rem',
                                                    padding: '0.5rem 1rem',
                                                    border: 'none'
                                                }}
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                        {order.trackingLink && (
                                            <a
                                                href={order.trackingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-primary"
                                                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                                            >
                                                Track Order 🔗
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
