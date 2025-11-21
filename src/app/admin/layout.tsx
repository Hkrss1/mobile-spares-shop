"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#ef4444' }}>
                    Access Denied
                </h1>
                <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '2rem' }}>
                    You don't have permission to access this page.
                </p>
                <Link href="/" className="btn btn-primary">
                    Go to Homepage
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div style={{
                backgroundColor: 'hsl(var(--card))',
                borderBottom: '1px solid hsl(var(--border))',
                padding: '1rem 0'
            }}>
                <div className="container">
                    <nav style={{ display: 'flex', gap: '2rem' }}>
                        <Link
                            href="/admin"
                            style={{
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                color: 'hsl(var(--foreground))',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius)',
                                transition: 'background-color 0.2s'
                            }}
                            className="nav-link"
                        >
                            📊 Dashboard
                        </Link>
                        <Link
                            href="/admin/inventory"
                            style={{
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                color: 'hsl(var(--foreground))',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius)',
                                transition: 'background-color 0.2s'
                            }}
                            className="nav-link"
                        >
                            📦 Inventory
                        </Link>
                        <Link
                            href="/admin/orders"
                            style={{
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                color: 'hsl(var(--foreground))',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius)',
                                transition: 'background-color 0.2s'
                            }}
                            className="nav-link"
                        >
                            📋 Orders
                        </Link>
                        <Link
                            href="/admin/users"
                            style={{
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                color: 'hsl(var(--foreground))',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius)',
                                transition: 'background-color 0.2s'
                            }}
                            className="nav-link"
                        >
                            👥 Users
                        </Link>
                    </nav>
                </div>
            </div>
            {children}
        </div>
    );
}
