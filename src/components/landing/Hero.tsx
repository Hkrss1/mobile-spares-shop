"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, Wrench } from 'lucide-react';

const Hero: React.FC = () => {
    return (
        <section className="relative pt-32 pb-12 lg:pt-48 lg:pb-24 overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Official OEM Parts Available
                        </motion.div>

                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                            Revive Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                                Broken Device
                            </span>
                        </h1>

                        <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                            Premium spare parts for iPhone, Samsung, Pixel and more.
                            Same-day shipping on orders before 2PM.
                            Lifetime warranty on selected screens.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-primary/20">
                                Find Your Part <ArrowRight size={20} />
                            </button>
                            <button className="bg-secondary text-secondary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:bg-secondary/80 transition-colors border border-border">
                                View Repair Guides
                            </button>
                        </div>

                        <div className="mt-12 flex items-center gap-6 text-sm font-medium text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="text-primary" size={18} /> 1-Year Warranty
                            </div>
                            <div className="flex items-center gap-2">
                                <Truck className="text-primary" size={18} /> Fast Shipping
                            </div>
                            <div className="flex items-center gap-2">
                                <Wrench className="text-primary" size={18} /> Expert Support
                            </div>
                        </div>
                    </motion.div>

                    {/* Visual Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative lg:h-[600px] flex items-center justify-center"
                    >
                        {/* Abstract Phone Representation */}
                        <div className="relative w-[300px] h-[600px] bg-card border-8 border-muted rounded-[3rem] shadow-2xl overflow-hidden flex flex-col items-center p-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-muted rounded-b-2xl z-20" />

                            {/* Fixed positioning - components stay within phone border */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute top-16 left-4 right-4 h-32 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl border border-blue-200 dark:border-blue-800 p-3 flex items-center justify-center"
                            >
                                <div className="text-center">
                                    <span className="block text-xs font-mono text-blue-500 mb-1">OLED DISPLAY</span>
                                    <div className="w-12 h-0.5 bg-blue-200 mx-auto rounded-full"></div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 6, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                                className="absolute top-[250px] left-6 right-6 h-28 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center"
                            >
                                <div className="text-center">
                                    <span className="block text-xs font-mono text-muted-foreground mb-1">LI-ION BATTERY</span>
                                    <div className="w-6 h-6 border-2 border-muted-foreground rounded-full mx-auto flex items-center justify-center">
                                        <div className="w-0.5 h-2 bg-muted-foreground"></div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-20 left-8 right-8 h-16 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-center"
                            >
                                <span className="block text-xs font-mono text-primary">LOGIC BOARD</span>
                            </motion.div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="absolute top-20 right-10 lg:right-0 bg-card p-4 rounded-2xl shadow-xl border border-border"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Quality</p>
                                    <p className="text-sm font-bold">Tested 100%</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [10, -10, 10] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute bottom-40 left-0 bg-card p-4 rounded-2xl shadow-xl border border-border"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400">
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Delivery</p>
                                    <p className="text-sm font-bold">Express</p>
                                </div>
                            </div>
                        </motion.div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
