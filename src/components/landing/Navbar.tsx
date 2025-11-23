"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, Smartphone, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import UserProfileMenu from './UserProfileMenu';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { count } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    // Initialize dark mode from localStorage
    useEffect(() => {
        // Initialize theme on mount
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

        setIsDark(shouldBeDark);
        if (shouldBeDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-sm'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
                        <div className="bg-primary text-primary-foreground p-2 rounded-lg group-hover:scale-105 transition-transform">
                            <Smartphone size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">QuikFix<span className="text-primary">
                        </span></span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Parts</Link>
                        <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">Products</Link>
                        <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Accessories</Link>
                        <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Repairs</Link>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="text"
                                placeholder="Search parts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-full bg-secondary/50 border-transparent focus:bg-background focus:border-primary focus:ring-2 focus:ring-ring outline-none transition-all w-64 text-sm"
                            />
                        </form>

                        <Link href="/cart" className="relative p-2 hover:bg-accent rounded-full transition-colors">
                            <ShoppingCart size={22} />
                            {count > 0 && (
                                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                    {count}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <UserProfileMenu />
                        ) : (
                            <Link
                                href="/login"
                                className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
                                style={{ 
                                  color: 'var(--primary-foreground)',
                                  backgroundColor: 'var(--primary)'
                                }}
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <Link href="/cart" className="relative p-2">
                            <ShoppingCart size={22} />
                            {count > 0 && (
                                <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                    {count}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-foreground hover:bg-accent rounded-md"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b border-border overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-4">
                            <form onSubmit={handleSearch} className="relative mt-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search parts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/50 border-transparent focus:bg-background focus:border-primary outline-none"
                                />
                            </form>
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground">Parts</Link>
                            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground">Products</Link>
                            <Link href="#" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground">Accessories</Link>
                            <Link href="#" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground">Repairs</Link>

                            {user ? (
                                <div className="pt-4 border-t border-border space-y-2">
                                    <p className="px-3 text-sm text-muted-foreground">Signed in as {user.name}</p>
                                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent">Profile</Link>
                                    <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent">My Orders</Link>
                                    {user.role === 'admin' && (
                                        <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent">Admin Dashboard</Link>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-center mt-4"
                                    style={{ 
                                      color: 'var(--primary-foreground)',
                                      backgroundColor: 'var(--primary)'
                                    }}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
