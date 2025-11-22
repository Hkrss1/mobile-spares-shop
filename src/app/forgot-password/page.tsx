"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { validateMobileNumber } from '@/lib/validation';

export default function ForgotPasswordPage() {
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { sendPasswordReset } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validate mobile number
        const validation = validateMobileNumber(mobile);
        if (!validation.valid) {
            setError(validation.error || 'Invalid mobile number');
            return;
        }

        setLoading(true);
        const result = await sendPasswordReset(mobile);
        setLoading(false);

        if (result) {
            setSuccess(true);
        } else {
            setError('Mobile number not found. Please check and try again.');
        }
    };

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Only digits
        if (value.length <= 10) {
            setMobile(value);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem', maxWidth: '450px', margin: '0 auto' }}>
            <div style={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                padding: '2.5rem'
            }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
                    Forgot Password?
                </h1>
                <p style={{ color: 'hsl(var(--muted-foreground))', textAlign: 'center', marginBottom: '2rem' }}>
                    Enter your registered mobile number to receive password reset instructions via WhatsApp
                </p>

                {success ? (
                    <div>
                        <div style={{
                            padding: '1.5rem',
                            backgroundColor: '#10b98120',
                            border: '1px solid #10b981',
                            borderRadius: 'var(--radius)',
                            color: '#10b981',
                            marginBottom: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                WhatsApp Opened!
                            </h3>
                            <p style={{ fontSize: '0.875rem' }}>
                                Check your WhatsApp for password reset instructions sent to +91{mobile}
                            </p>
                        </div>

                        <Link href="/login" className="btn btn-primary" style={{ width: '100%', display: 'block', textAlign: 'center' }}>
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                Mobile Number
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'hsl(var(--muted-foreground))',
                                    fontSize: '0.875rem',
                                    fontWeight: 600
                                }}>
                                    +91
                                </span>
                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={handleMobileChange}
                                    placeholder="9876543210"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem 0.75rem 3.5rem',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid hsl(var(--border))',
                                        backgroundColor: 'hsl(var(--background))',
                                        color: 'hsl(var(--foreground))',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginTop: '0.25rem' }}>
                                Enter your registered 10-digit mobile number
                            </p>
                        </div>

                        {error && (
                            <div style={{
                                padding: '0.75rem 1rem',
                                backgroundColor: '#ef444420',
                                border: '1px solid #ef4444',
                                borderRadius: 'var(--radius)',
                                color: '#ef4444',
                                fontSize: '0.875rem',
                                marginBottom: '1.5rem'
                            }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%', marginBottom: '1rem' }}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link via WhatsApp'}
                        </button>

                        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                            Remember your password?{' '}
                            <Link href="/login" style={{ color: 'hsl(var(--primary))', fontWeight: 600, textDecoration: 'none' }}>
                                Login
                            </Link>
                        </div>
                    </form>
                )}

                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    backgroundColor: 'hsl(var(--muted))',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.75rem',
                    color: 'hsl(var(--muted-foreground))'
                }}>
                    <strong>📱 How it works:</strong><br />
                    1. Enter your registered mobile number<br />
                    2. Click &quot;Send Reset Link&quot;<br />
                    3. WhatsApp will open with your password<br />
                    4. Use the password to login
                </div>
            </div>
        </div>
    );
}