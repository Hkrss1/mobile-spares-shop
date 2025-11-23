"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ShoppingBag, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

const UserProfileMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
            >
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
                    >
                        {/* User Info */}
                        <div className="p-4 border-b border-border bg-secondary/30">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.mobile}</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            <Link
                                href="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors"
                            >
                                <User size={18} className="text-muted-foreground" />
                                <span className="text-sm font-medium">Profile</span>
                            </Link>

                            <Link
                                href="/orders"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors"
                            >
                                <ShoppingBag size={18} className="text-muted-foreground" />
                                <span className="text-sm font-medium">My Orders</span>
                            </Link>

                            {user.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors"
                                >
                                    <LayoutDashboard size={18} className="text-muted-foreground" />
                                    <span className="text-sm font-medium">Admin Dashboard</span>
                                </Link>
                            )}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-border p-2">
                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-destructive/10 hover:text-destructive transition-colors rounded-lg"
                            >
                                <LogOut size={18} />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserProfileMenu;
