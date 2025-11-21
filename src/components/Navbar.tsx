"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useState } from "react";

export default function Navbar() {
    const { count } = useCart();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header style={{
            borderBottom: '1px solid hsl(var(--border))',
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            backgroundColor: 'hsl(var(--background) / 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 50
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, hsl(var(--primary)), #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    QuikFix
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-only"
                    onClick={toggleMenu}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'hsl(var(--foreground))',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        padding: '0.5rem'
                    }}
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                {/* Desktop Navigation */}
                <nav className="desktop-only" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {/* Hide shopping features for admin */}
                    {user?.role !== 'admin' && (
                        <>
                            <Link href="/" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'hsl(var(--muted-foreground))', transition: 'color 0.2s' }} className="nav-link">Home</Link>

                            {user && (
                                <Link href="/orders" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'hsl(var(--muted-foreground))', transition: 'color 0.2s' }} className="nav-link">My Orders</Link>
                            )}

                            <Link href="/cart" style={{ position: 'relative', fontSize: '0.9rem', fontWeight: 500, color: 'hsl(var(--muted-foreground))', transition: 'color 0.2s' }} className="nav-link">
                                Cart
                                {count > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-12px',
                                        backgroundColor: 'hsl(var(--primary))',
                                        color: 'white',
                                        borderRadius: '9999px',
                                        width: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}>
                                        {count}
                                    </span>
                                )}
                            </Link>
                        </>
                    )}

                    {user ? (
                        <>
                            <div style={{ borderLeft: '1px solid hsl(var(--border))', height: '20px' }}></div>

                            <Link href="/profile" style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', textDecoration: 'underline', cursor: 'pointer' }}>
                                Hi, {user.name}
                            </Link>

                            {user.role === 'admin' && (
                                <Link href="/admin" className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                                    Dashboard
                                </Link>
                            )}

                            <button
                                onClick={logout}
                                style={{
                                    fontSize: '0.875rem',
                                    padding: '0.5rem 1rem',
                                    backgroundColor: 'hsl(var(--secondary))',
                                    border: 'none',
                                    borderRadius: 'var(--radius)',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    color: 'hsl(var(--foreground))'
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/cart" style={{ position: 'relative', fontSize: '0.9rem', fontWeight: 500, color: 'hsl(var(--muted-foreground))', transition: 'color 0.2s' }} className="nav-link">
                                Cart
                                {count > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-12px',
                                        backgroundColor: 'hsl(var(--primary))',
                                        color: 'white',
                                        borderRadius: '9999px',
                                        width: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 600
                                    }}>
                                        {count}
                                    </span>
                                )}
                            </Link>

                            <Link href="/login" className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                                Login
                            </Link>
                        </>
                    )}
                </nav>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="mobile-only" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'hsl(var(--background))',
                    borderBottom: '1px solid hsl(var(--border))',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    {user?.role !== 'admin' && (
                        <>
                            <Link href="/" onClick={toggleMenu} style={{ padding: '0.5rem', fontSize: '1rem', fontWeight: 500 }}>Home</Link>
                            {user && <Link href="/orders" onClick={toggleMenu} style={{ padding: '0.5rem', fontSize: '1rem', fontWeight: 500 }}>My Orders</Link>}
                            <Link href="/cart" onClick={toggleMenu} style={{ padding: '0.5rem', fontSize: '1rem', fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
                                Cart
                                {count > 0 && <span style={{ backgroundColor: 'hsl(var(--primary))', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem' }}>{count}</span>}
                            </Link>
                        </>
                    )}

                    {user ? (
                        <>
                            <div style={{ borderTop: '1px solid hsl(var(--border))', margin: '0.5rem 0' }}></div>
                            <Link href="/profile" onClick={toggleMenu} style={{ padding: '0.5rem', fontSize: '1rem', fontWeight: 500 }}>Profile ({user.name})</Link>
                            {user.role === 'admin' && (
                                <Link href="/admin" onClick={toggleMenu} className="btn btn-primary" style={{ textAlign: 'center' }}>Dashboard</Link>
                            )}
                            <button onClick={() => { logout(); toggleMenu(); }} style={{ padding: '0.75rem', backgroundColor: 'hsl(var(--secondary))', border: 'none', borderRadius: 'var(--radius)', color: 'hsl(var(--foreground))', fontWeight: 600 }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <div style={{ borderTop: '1px solid hsl(var(--border))', margin: '0.5rem 0' }}></div>
                            <Link href="/login" onClick={toggleMenu} className="btn btn-primary" style={{ textAlign: 'center' }}>Login</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
