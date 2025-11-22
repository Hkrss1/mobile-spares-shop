"use client";

import React, { useState } from 'react';
import { useProducts, addProduct } from '@/lib/products';
import Image from 'next/image';

export default function AdminInventoryPage() {
    const { products } = useProducts();
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category: 'Screen',
        description: '',
        image: '',
        stock: ''
    });

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            category: newProduct.category,
            description: newProduct.description,
            image: newProduct.image || '/placeholder.png',
            stock: parseInt(newProduct.stock),
            specs: {}
        };

        await addProduct(productData);
        // In a real app, we'd re-fetch or update local state. 
        // For now, reloading the page is a simple way to see changes.
        window.location.reload();
    };

    const updateStock = async (productId: string, newStock: number) => {
        // TODO: Implement API endpoint for updating stock
        console.log('Update stock:', productId, newStock);
        alert('Stock update feature coming soon!');
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Out of Stock', color: '#ef4444', bg: '#ef444420' };
        if (stock <= 10) return { label: 'Low Stock', color: '#f59e0b', bg: '#f59e0b20' };
        return { label: 'In Stock', color: '#10b981', bg: '#10b98120' };
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Inventory Management</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setIsAdding(!isAdding)}
                >
                    {isAdding ? 'Cancel' : '+ Add New Product'}
                </button>
            </div>

            {isAdding && (
                <div style={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    padding: '2rem',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Add New Product</h2>
                    <form onSubmit={handleAddProduct}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid hsl(var(--border))',
                                        backgroundColor: 'hsl(var(--background))',
                                        color: 'hsl(var(--foreground))'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                    Category *
                                </label>
                                <select
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid hsl(var(--border))',
                                        backgroundColor: 'hsl(var(--background))',
                                        color: 'hsl(var(--foreground))'
                                    }}
                                >
                                    <option value="Screen">Screen</option>
                                    <option value="Battery">Battery</option>
                                    <option value="Camera">Camera</option>
                                    <option value="Charging Port">Charging Port</option>
                                    <option value="Back Panel">Back Panel</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                    Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    value={newProduct.price}
                                    onChange={(e) => {
                                        const val = parseFloat(e.target.value);
                                        if (val < 0) return;
                                        setNewProduct({ ...newProduct, price: e.target.value })
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid hsl(var(--border))',
                                        backgroundColor: 'hsl(var(--background))',
                                        color: 'hsl(var(--foreground))'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                    Stock Quantity *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={newProduct.stock}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (val < 0) return;
                                        setNewProduct({ ...newProduct, stock: e.target.value })
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid hsl(var(--border))',
                                        backgroundColor: 'hsl(var(--background))',
                                        color: 'hsl(var(--foreground))'
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                Product Image *
                            </label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.size > 500 * 1024) { // 500KB limit
                                                    alert('Image size must be less than 500KB');
                                                    e.target.value = ''; // Reset input
                                                    return;
                                                }

                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setNewProduct({ ...newProduct, image: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: 'var(--radius)',
                                            border: '1px solid hsl(var(--border))',
                                            backgroundColor: 'hsl(var(--background))',
                                            color: 'hsl(var(--foreground))'
                                        }}
                                    />
                                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', marginTop: '0.25rem' }}>
                                        Max size: 500KB. Formats: JPG, PNG, WEBP.
                                    </p>
                                </div>
                                {newProduct.image && (
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        position: 'relative',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: 'var(--radius)',
                                        overflow: 'hidden'
                                    }}>
                                        <Image
                                            src={newProduct.image}
                                            alt="Preview"
                                            fill
                                            style={{ objectFit: 'contain', padding: '2px' }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                Description *
                            </label>
                            <textarea
                                required
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid hsl(var(--border))',
                                    backgroundColor: 'hsl(var(--background))',
                                    color: 'hsl(var(--foreground))',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Add Product
                        </button>
                    </form>
                </div>
            )}

            {/* Products Table */}
            <div style={{
                backgroundColor: 'hsl(var(--card))',
                borderRadius: 'var(--radius)',
                border: '1px solid hsl(var(--border))',
                overflow: 'hidden'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--muted))' }}>
                            <th style={{ padding: '1rem' }}>Image</th>
                            <th style={{ padding: '1rem' }}>Product</th>
                            <th style={{ padding: '1rem' }}>Category</th>
                            <th style={{ padding: '1rem' }}>Price</th>
                            <th style={{ padding: '1rem' }}>Stock</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Update Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => {
                            const status = getStockStatus(product.stock);
                            return (
                                <tr key={product.id} style={{ borderBottom: '1px solid hsl(var(--border))' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ width: '50px', height: '50px', position: 'relative', backgroundColor: '#1a1a1a', borderRadius: 'var(--radius)' }}>
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                style={{ objectFit: 'contain', padding: '0.25rem' }}
                                                sizes="50px"
                                            />
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{product.name}</td>
                                    <td style={{ padding: '1rem' }}>{product.category}</td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>₹{product.price.toFixed(2)}</td>
                                    <td style={{ padding: '1rem' }}>{product.stock}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            backgroundColor: status.bg,
                                            color: status.color
                                        }}>
                                            {status.label}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <input
                                            type="number"
                                            min="0"
                                            value={product.stock}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (val < 0) return;
                                                updateStock(product.id, val || 0);
                                            }}
                                            style={{
                                                width: '80px',
                                                padding: '0.5rem',
                                                borderRadius: 'var(--radius)',
                                                border: '1px solid hsl(var(--border))',
                                                backgroundColor: 'hsl(var(--background))',
                                                color: 'hsl(var(--foreground))'
                                            }}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
