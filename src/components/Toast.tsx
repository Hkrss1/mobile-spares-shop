"use client";

import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            style={{
                position: 'fixed',
                top: '5rem',
                right: '2rem',
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--primary))',
                borderRadius: 'var(--radius)',
                padding: '1rem 1.5rem',
                boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                minWidth: '300px',
                animation: 'slideIn 0.3s ease-out'
            }}
        >
            <div
                style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'hsl(var(--primary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    flexShrink: 0
                }}
            >
                ✓
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{message}</span>
            <button
                onClick={onClose}
                style={{
                    marginLeft: 'auto',
                    background: 'none',
                    border: 'none',
                    color: 'hsl(var(--muted-foreground))',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    lineHeight: 1,
                    padding: 0
                }}
            >
                ×
            </button>
            <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
}
