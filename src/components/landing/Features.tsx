"use client";

import React from 'react';
import { Award, Zap, RefreshCw, Shield } from 'lucide-react';

const Features: React.FC = () => {
    return (
        <section className="py-16 bg-secondary/30 border-y border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                            <Award size={32} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Original Quality</h3>
                        <p className="text-muted-foreground text-sm">
                            We source authentic OEM parts to ensure your device works exactly like new.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
                            <Zap size={32} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Same Day Shipping</h3>
                        <p className="text-muted-foreground text-sm">
                            Order before 2:00 PM EST and we&apos;ll ship your parts the very same day.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                            <RefreshCw size={32} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">30-Day Returns</h3>
                        <p className="text-muted-foreground text-sm">
                            Unused parts can be returned within 30 days. No restocking fees.
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6">
                        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                            <Shield size={32} />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Lifetime Warranty</h3>
                        <p className="text-muted-foreground text-sm">
                            We stand by our premium screens with a comprehensive lifetime warranty.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Features;
