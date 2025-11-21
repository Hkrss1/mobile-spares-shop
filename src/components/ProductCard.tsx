"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart';
import { Product } from '@/lib/products';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
    const { addItem } = useCart();

    const handleAddToCart = React.useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        addItem(product);
    }, [addItem, product]);

    return (
        <Link href={`/products/${product.id}`} style={{ display: 'block' }}>
            <div style={{
                backgroundColor: 'hsl(var(--card))',
                borderRadius: 'var(--radius)',
                border: '1px solid hsl(var(--border))',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
                className="product-card"
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px -10px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                <div style={{ position: 'relative', aspectRatio: '1/1', width: '100%', backgroundColor: '#1a1a1a' }}>
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'contain', padding: '1rem' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                    />
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'hsl(var(--primary))',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {product.category}
                    </div>
                    <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        lineHeight: 1.4
                    }}>
                        {product.name}
                    </h3>

                    {product.stock <= 10 && product.stock > 0 && (
                        <div style={{
                            fontSize: '0.75rem',
                            color: '#f59e0b',
                            fontWeight: 600,
                            marginBottom: '0.5rem'
                        }}>
                            ⚠️ Only {product.stock} left!
                        </div>
                    )}

                    {product.stock === 0 && (
                        <div style={{
                            fontSize: '0.75rem',
                            color: '#ef4444',
                            fontWeight: 600,
                            marginBottom: '0.5rem'
                        }}>
                            Out of Stock
                        </div>
                    )}

                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                            ₹{product.price.toFixed(2)}
                        </span>
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            style={{
                                backgroundColor: product.stock === 0 ? 'hsl(var(--muted))' : 'hsl(var(--secondary))',
                                color: product.stock === 0 ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))',
                                border: 'none',
                                borderRadius: '9999px',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.2s',
                                opacity: product.stock === 0 ? 0.5 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (product.stock > 0) {
                                    e.currentTarget.style.backgroundColor = 'hsl(var(--primary))';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (product.stock > 0) {
                                    e.currentTarget.style.backgroundColor = 'hsl(var(--secondary))';
                                }
                            }}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
