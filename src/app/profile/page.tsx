"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useOrders } from '@/lib/orders';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, deleteAccount } = useAuth();
    const { getUserOrders } = useOrders();
    const [isDeleting, setIsDeleting] = useState(false);

    if (!user) {
        return (
            <div className="container animate-fade-in" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Please Login</h1>
                <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '2rem' }}>You need to be logged in to view your profile.</p>
                <Link href="/login" className="btn btn-primary">
                    Go to Login
                </Link>
            </div>
        );
    }

    const userOrders = getUserOrders(user.mobile);
    const activeOrders = userOrders.filter(order =>
        order.status === 'processing' || order.status === 'in-transit'
    );
    const hasActiveOrders = activeOrders.length > 0;

    const handleDeleteAccount = async () => {
        if (hasActiveOrders) {
            alert('You cannot delete your account while you have active orders. Please wait for them to be delivered or cancel them.');
            return;
        }

        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            setIsDeleting(true);
            const success = await deleteAccount();
            if (!success) {
                setIsDeleting(false);
                alert('Failed to delete account. Please try again.');
            }
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem', maxWidth: '600px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>My Profile</h1>

            <div style={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                padding: '2rem',
                marginBottom: '2rem'
            }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>
                        Name
                    </label>
                    <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{user.name}</div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>
                        Mobile Number
                    </label>
                    <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>+91 {user.mobile}</div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>
                        Account Type
                    </label>
                    <div style={{ fontSize: '1.125rem', fontWeight: 600, textTransform: 'capitalize' }}>{user.role}</div>
                </div>
            </div>

            {user.role !== 'admin' && (
                <div style={{
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: 'var(--radius)',
                    padding: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#991b1b', marginBottom: '1rem' }}>Danger Zone</h2>
                    <p style={{ color: '#7f1d1d', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                        Deleting your account will permanently remove your profile and order history. This action cannot be undone.
                    </p>

                    {hasActiveOrders && (
                        <div style={{
                            backgroundColor: '#fff1f2',
                            border: '1px solid #fda4af',
                            borderRadius: 'var(--radius)',
                            padding: '1rem',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem',
                            color: '#be123c'
                        }}>
                            <strong>Cannot Delete Account:</strong> You have {activeOrders.length} active order(s) in progress. Please wait for them to be delivered or cancel them before deleting your account.
                        </div>
                    )}

                    <button
                        onClick={handleDeleteAccount}
                        disabled={hasActiveOrders || isDeleting}
                        style={{
                            backgroundColor: hasActiveOrders ? '#ef444480' : '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius)',
                            padding: '0.75rem 1.5rem',
                            fontWeight: 600,
                            cursor: hasActiveOrders || isDeleting ? 'not-allowed' : 'pointer',
                            width: '100%'
                        }}
                    >
                        {isDeleting ? 'Deleting Account...' : 'Delete Account'}
                    </button>
                </div>
            )}
        </div>
    );
}
