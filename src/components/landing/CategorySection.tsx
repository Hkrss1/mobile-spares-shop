"use client";

import React from 'react';
import { Smartphone, Battery, Camera, Speaker, Wifi, Settings, Cable, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
    { name: 'Displays', icon: Monitor, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Batteries', icon: Battery, color: 'text-green-500', bg: 'bg-green-500/10' },
    { name: 'Cameras', icon: Camera, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Housings', icon: Smartphone, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { name: 'Charging', icon: Cable, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { name: 'Audio', icon: Speaker, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { name: 'Sensors', icon: Wifi, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { name: 'Tools', icon: Settings, color: 'text-gray-500', bg: 'bg-gray-500/10' },
];

const CategorySection: React.FC = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Browse by Category</h2>
                <p className="text-muted-foreground">Find exactly what you need for your repair</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {categories.map((category, index) => (
                    <motion.div
                        key={category.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5 }}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group"
                    >
                        <div className={`p-4 rounded-xl ${category.bg} mb-3 group-hover:scale-110 transition-transform`}>
                            <category.icon className={`${category.color}`} size={28} />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                            {category.name}
                        </span>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default CategorySection;
