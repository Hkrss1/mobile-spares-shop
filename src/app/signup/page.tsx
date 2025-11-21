"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { validateMobileNumber, validatePassword } from '@/lib/validation';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate mobile number
        const mobileValidation = validateMobileNumber(mobile);
        if (!mobileValidation.valid) {
            setError(mobileValidation.error || 'Invalid mobile number');
            return;
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            setError(passwordValidation.error || 'Invalid password');
            return;
        }

        // Check password match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const success = await signup(mobile, password, name);
        setLoading(false);

        if (success) {
            router.push('/');
        } else {
            setError('Mobile number already registered');
        }
    };

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Only digits
        setMobile(value);
    };

    return (
        <div className="container animate-fade-in" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 80px)',
            padding: '2rem 1rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'hsl(var(--card))',
                padding: 'clamp(1.5rem, 5vw, 2.5rem)',
                borderRadius: 'var(--radius)',
                border: '1px solid hsl(var(--border))',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create Account</h1>
                    <p style={{ color: 'hsl(var(--muted-foreground))' }}>Join QuikFix for premium spare parts</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid hsl(var(--input))',
                                backgroundColor: 'hsl(var(--background))',
                                color: 'hsl(var(--foreground))',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="mobile" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                            Mobile Number
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'hsl(var(--muted-foreground))',
                                fontWeight: 500
                            }}>
                                +91
                            </span>
                            <input
                                id="mobile"
                                type="tel"
                                value={mobile}
                                onChange={handleMobileChange}
                                placeholder="9999999999"
                                required
                                maxLength={10}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 3.5rem',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid hsl(var(--input))',
                                    backgroundColor: 'hsl(var(--background))',
                                    color: 'hsl(var(--foreground))',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid hsl(var(--input))',
                                backgroundColor: 'hsl(var(--background))',
                                color: 'hsl(var(--foreground))',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                        <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginTop: '0.5rem' }}>
                            Must be at least 8 characters with 1 special character (@$!%*?&)
                        </p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid hsl(var(--input))',
                                backgroundColor: 'hsl(var(--background))',
                                color: 'hsl(var(--foreground))',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: '0.75rem',
                            backgroundColor: '#fee2e2',
                            border: '1px solid #fecaca',
                            borderRadius: 'var(--radius)',
                            color: '#991b1b',
                            fontSize: '0.875rem',
                            marginBottom: '1.5rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', fontSize: '1rem', padding: '0.875rem' }}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: 'hsl(var(--primary))', fontWeight: 600 }}>
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
