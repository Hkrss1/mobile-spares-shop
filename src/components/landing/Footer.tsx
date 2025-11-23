"use client";

import React from 'react';
import { Smartphone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-card border-t border-border pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                                <Smartphone size={20} />
                            </div>
                            <span className="text-xl font-bold tracking-tight">QuikFix<span className="text-primary"></span></span>
                        </div>
                        <p className="text-muted-foreground mb-6 max-w-sm">
                            Your trusted source for premium quality smartphone spare parts, tools, and accessories.
                            Restoring connections, one device at a time.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold mb-6">Shop</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">New Arrivals</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Best Sellers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Repair Tools</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Sale</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Support</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Repair Guides</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Warranty Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Stay Updated</h4>
                        <p className="text-sm text-muted-foreground mb-4">Subscribe to get special offers and repair tips.</p>
                        <div className="flex flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-secondary border border-transparent focus:border-primary focus:ring-2 focus:ring-ring rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                            />
                            <button className="bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © 2024 QuikFix. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <a href="#" className="hover:text-foreground">Privacy Policy</a>
                        <a href="#" className="hover:text-foreground">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
