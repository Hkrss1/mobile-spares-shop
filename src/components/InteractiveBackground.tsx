"use client";

import React from 'react';
import { motion } from 'framer-motion';

const InteractiveBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-background">
            {/* Dot Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: 'radial-gradient(var(--foreground) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                    maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
                }}
            />

            {/* Blob 1 - Primary Blue (Top Left) */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -50, 50, 0],
                    scale: [1, 1.2, 0.9, 1]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-500/20 dark:bg-blue-600/10 blur-[60px] will-change-transform backface-hidden"
                style={{ transform: 'translate3d(0,0,0)' }}
            />

            {/* Blob 2 - Purple Accent (Bottom Right) */}
            <motion.div
                animate={{
                    x: [0, -70, 30, 0],
                    y: [0, 60, -40, 0],
                    scale: [1, 1.1, 0.95, 1]
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] rounded-full bg-purple-500/20 dark:bg-purple-600/10 blur-[80px] will-change-transform backface-hidden"
                style={{ transform: 'translate3d(0,0,0)' }}
            />

            {/* Blob 3 - Subtle Cyan (Top Right) */}
            <motion.div
                animate={{
                    x: [0, 40, -40, 0],
                    y: [0, -30, 30, 0],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[20%] right-[20%] w-[400px] h-[400px] rounded-full bg-cyan-400/15 dark:bg-cyan-500/10 blur-[50px] will-change-transform backface-hidden"
                style={{ transform: 'translate3d(0,0,0)' }}
            />
        </div>
    );
};

export default InteractiveBackground;
