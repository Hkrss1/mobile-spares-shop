"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatMobileNumber } from './validation';

export interface User {
    mobile: string;
    name: string;
    role: 'admin' | 'user';
}

interface AuthContextType {
    user: User | null;
    login: (mobile: string, password: string) => Promise<boolean>;
    signup: (mobile: string, password: string, name: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    sendPasswordReset: (mobile: string) => Promise<boolean>;
    deleteAccount: () => Promise<boolean>;
}

// NOTE: Authentication now uses database for user management.
// Only the current session (user object) is stored in localStorage for persistence.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("mss_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (mobile: string, password: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, password }),
            });

            if (!res.ok) return false;

            const userData = await res.json();
            setUser(userData);
            localStorage.setItem("mss_user", JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const signup = async (mobile: string, password: string, name: string) => {
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, password, name }),
            });

            if (!res.ok) return false;

            const userData = await res.json();
            setUser(userData);
            localStorage.setItem("mss_user", JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Signup failed:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("mss_user");
        router.push("/login");
    };

    const deleteAccount = async () => {
        if (!user) return false;

        // Prevent admin deletion
        if (user.role === 'admin') {
            return false;
        }

        try {
            const res = await fetch('/api/auth/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: user.mobile }),
            });

            if (!res.ok) return false;

            logout();
            return true;
        } catch (error) {
            console.error('Delete account failed:', error);
            return false;
        }
    };

    const sendPasswordReset = async (mobile: string) => {
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile }),
            });

            if (!res.ok) return false;

            const userData = await res.json();

            // Format mobile with +91
            const formattedMobile = formatMobileNumber(mobile);

            // Create WhatsApp message
            const message = `🔐 *Password Reset Request - QuikFix*\\n\\nHello ${userData.name},\\n\\nYou requested to reset your password for mobile number: ${formattedMobile}\\n\\nYour current password is: ${userData.password}\\n\\nFor security, please change your password after logging in.\\n\\n- QuikFix Team`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${formattedMobile.replace('+', '')}?text=${encodedMessage}`;

            // Open WhatsApp
            window.open(whatsappURL, '_blank');

            return true;
        } catch (error) {
            console.error('Password reset failed:', error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, isLoading, sendPasswordReset, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
