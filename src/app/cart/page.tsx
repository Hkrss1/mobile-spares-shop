"use client";

import React from 'react';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { useOrders } from '@/lib/orders';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCart();
    const { user } = useAuth();
    const { createOrder } = useOrders();

    if (items.length === 0) {
        return (
            <div className="container animate-fade-in" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Your Cart is Empty</h1>
                <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '2rem' }}>Looks like you haven't added any parts yet.</p>
                <Link href="/" className="btn btn-primary">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Shopping Cart</h1>

            <div className="grid-cols-responsive" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 350px',
                gap: '2rem'
            }}>
                {/* Cart Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {items.map(item => (
                        <div key={item.id} style={{
                            display: 'flex',
                            gap: '1rem',
                            padding: '1rem',
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: '#1a1a1a',
                                borderRadius: 'var(--radius)',
                                position: 'relative',
                                overflow: 'hidden',
                                flexShrink: 0
                            }}>
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    style={{ objectFit: 'contain', padding: '0.5rem' }}
                                    sizes="80px"
                                />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontWeight: 600 }}>{item.name}</h3>
                                    <span style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem' }}>
                                    {item.category}
                                    {item.quantity >= item.stock && (
                                        <span style={{ marginLeft: '0.5rem', color: '#f59e0b', fontWeight: 600 }}>
                                            • Max stock reached
                                        </span>
                                    )}
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            style={{ padding: '0.25rem 0.75rem', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                                        >
                                            -
                                        </button>
                                        <span style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>
                                            {item.quantity} / {item.stock}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.stock}
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                background: 'none',
                                                border: 'none',
                                                color: item.quantity >= item.stock ? 'hsl(var(--muted-foreground))' : 'inherit',
                                                cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                                                opacity: item.quantity >= item.stock ? 0.5 : 1
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        style={{ fontSize: '0.875rem', color: 'hsl(var(--destructive))', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div style={{ height: 'fit-content' }}>
                    <div style={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        padding: '1.5rem'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Order Summary</h2>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'hsl(var(--muted-foreground))' }}>Subtotal</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'hsl(var(--muted-foreground))' }}>Shipping</span>
                            <span>Free</span>
                        </div>

                        <div style={{ borderTop: '1px solid hsl(var(--border))', margin: '1rem 0' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            onClick={() => {
                                if (!user) {
                                    alert('Please login to place an order');
                                    window.location.href = '/login';
                                    return;
                                }

                                // Create order in system
                                const orderItems = items.map(item => ({
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,
                                    quantity: item.quantity,
                                    image: item.image
                                }));

                                const order = createOrder(user.name, user.mobile, orderItems, total);

                                // Format order details for WhatsApp
                                const orderDetails = items.map((item, index) =>
                                    `${index + 1}. ${item.name}\n   Qty: ${item.quantity} × ₹${item.price.toFixed(2)} = ₹${(item.quantity * item.price).toFixed(2)}`
                                ).join('\n\n');

                                const message = `🛒 *New Order from QuikFix*\n\n*Order #${order.orderNumber}*\n*Customer:* ${user.name}\n*Mobile:* +91${user.mobile}\n\n${orderDetails}\n\n━━━━━━━━━━━━━━━━\n💰 *Total: ₹${total.toFixed(2)}*\n\nPlease confirm my order and provide payment details.`;

                                // Encode message for URL
                                const encodedMessage = encodeURIComponent(message);

                                // WhatsApp API URL
                                const whatsappURL = `https://wa.me/917488177051?text=${encodedMessage}`;

                                // Clear cart after order
                                clearCart();

                                // Redirect to WhatsApp (more reliable than window.open on mobile)
                                window.location.href = whatsappURL;
                            }}
                        >
                            Proceed to Checkout via WhatsApp
                        </button>

                        <p style={{
                            marginTop: '1rem',
                            fontSize: '0.75rem',
                            color: 'hsl(var(--muted-foreground))',
                            textAlign: 'center'
                        }}>
                            You'll be redirected to WhatsApp to complete your order
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
