"use client";

import React, { useState, useEffect } from 'react';
import { useProducts, Brand, Category } from '@/lib/products';
import Image from 'next/image';

export default function AdminInventoryPage() {
    const { products } = useProducts();
    const [brands, setBrands] = useState<(Brand & { _count?: { products: number } })[]>([]);
    const [categories, setCategories] = useState<(Category & { _count?: { products: number } })[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [showAddBrand, setShowAddBrand] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [newBrandName, setNewBrandName] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        categoryId: '',
        brandId: '',
        description: '',
        image: '',
        stock: ''
    });

    // Fetch brands and categories
    useEffect(() => {
        fetchBrands();
        fetchCategories();
    }, []);

    const fetchBrands = async () => {
        try {
            const res = await fetch('/api/brands');
            if (res.ok) {
                const data = await res.json();
                setBrands(data);
            }
        } catch (error) {
            console.error('Failed to fetch brands:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleAddBrand = async () => {
        if (!newBrandName.trim()) return;

        try {
            const res = await fetch('/api/brands', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newBrandName }),
            });

            if (res.ok) {
                setNewBrandName('');
                setShowAddBrand(false);
                fetchBrands();
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to add brand');
            }
        } catch (error) {
            console.error('Failed to add brand:', error);
            alert('Failed to add brand');
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;

        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName }),
            });

            if (res.ok) {
                const newCat = await res.json();
                setNewCategoryName('');
                setShowAddCategory(false);
                fetchCategories();
                // Auto-select the new category
                setNewProduct({ ...newProduct, categoryId: newCat.id });
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to add category');
            }
        } catch (error) {
            console.error('Failed to add category:', error);
            alert('Failed to add category');
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            categoryId: newProduct.categoryId,
            brandId: newProduct.brandId || null,
            description: newProduct.description,
            image: newProduct.image || '/placeholder.png',
            stock: parseInt(newProduct.stock),
            specs: {}
        };

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (res.ok) {
                window.location.reload();
            } else {
                const error = await res.json();
                alert(`Failed to add product: ${error.details || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Failed to add product:', error);
            alert('Failed to add product');
        }
    };

    const updateStock = async (productId: string, newStock: number) => {
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: newStock }),
            });

            if (res.ok) {
                window.location.reload();
            } else {
                const error = await res.json();
                alert(`Failed to update stock: ${error.details || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Failed to update stock:', error);
            alert('Failed to update stock. Please try again.');
        }
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Out of Stock', color: '#ef4444', bg: '#ef444420' };
        if (stock <= 10) return { label: 'Low Stock', color: '#f59e0b', bg: '#f59e0b20' };
        return { label: 'In Stock', color: '#10b981', bg: '#10b98120' };
    };

    // Filter products by brand
    const filteredProducts = selectedBrand
        ? products.filter(p => p.brandId === selectedBrand)
        : products;

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

            {/* Brand Management Section */}
            <div style={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                padding: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Brand Management</h2>
                    <button
                        className="btn btn-outline"
                        onClick={() => setShowAddBrand(!showAddBrand)}
                        style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                        + Add Brand
                    </button>
                </div>

                {showAddBrand && (
                    <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            value={newBrandName}
                            onChange={(e) => setNewBrandName(e.target.value)}
                            placeholder="Brand name (e.g., Apple, Samsung)"
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid hsl(var(--border))',
                                backgroundColor: 'hsl(var(--background))',
                                color: 'hsl(var(--foreground))'
                            }}
                        />
                        <button className="btn btn-primary" onClick={handleAddBrand}>
                            Create
                        </button>
                        <button className="btn btn-outline" onClick={() => setShowAddBrand(false)}>
                            Cancel
                        </button>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {brands.map(brand => (
                        <div
                            key={brand.id}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid hsl(var(--border))',
                                backgroundColor: 'hsl(var(--muted))',
                                fontSize: '0.875rem'
                            }}
                        >
                            {brand.name} ({brand._count?.products || 0})
                        </div>
                    ))}
                    {brands.length === 0 && (
                        <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
                            No brands yet. Add your first brand!
                        </p>
                    )}
                </div>
            </div>

            {/* Add Product Form */}
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
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <select
                                        required
                                        value={newProduct.categoryId}
                                        onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            borderRadius: 'var(--radius)',
                                            border: '1px solid hsl(var(--border))',
                                            backgroundColor: 'hsl(var(--background))',
                                            color: 'hsl(var(--foreground))'
                                        }}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => setShowAddCategory(!showAddCategory)}
                                        style={{ padding: '0.75rem' }}
                                    >
                                        +
                                    </button>
                                </div>
                                {showAddCategory && (
                                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="New category name"
                                            style={{
                                                flex: 1,
                                                padding: '0.5rem',
                                                borderRadius: 'var(--radius)',
                                                border: '1px solid hsl(var(--border))',
                                                backgroundColor: 'hsl(var(--background))',
                                                color: 'hsl(var(--foreground))'
                                            }}
                                        />
                                        <button type="button" className="btn btn-primary" onClick={handleAddCategory}>
                                            Add
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                    Brand
                                </label>
                                <select
                                    value={newProduct.brandId}
                                    onChange={(e) => setNewProduct({ ...newProduct, brandId: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid hsl(var(--border))',
                                        backgroundColor: 'hsl(var(--background))',
                                        color: 'hsl(var(--foreground))'
                                    }}
                                >
                                    <option value="">No Brand</option>
                                    {brands.map(brand => (
                                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                                    ))}
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
                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
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
                                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
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
                                    Image URL *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newProduct.image}
                                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
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
                                Description
                            </label>
                            <textarea
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

            {/* Brand Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    Filter by Brand
                </label>
                <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid hsl(var(--border))',
                        backgroundColor: 'hsl(var(--background))',
                        color: 'hsl(var(--foreground))'
                    }}
                >
                    <option value="">All Brands</option>
                    {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                </select>
            </div>

            {/* Products List */}
            <div style={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                overflow: 'hidden'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: 'hsl(var(--muted))' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Product</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Brand</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Category</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Price</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Stock</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product, index) => {
                            const stockStatus = getStockStatus(product.stock);
                            return (
                                <tr
                                    key={product.id}
                                    style={{
                                        borderTop: index > 0 ? '1px solid hsl(var(--border))' : 'none'
                                    }}
                                >
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={50}
                                                height={50}
                                                style={{ borderRadius: 'var(--radius)', objectFit: 'cover' }}
                                            />
                                            <span style={{ fontWeight: 500 }}>{product.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {product.brand?.name || '-'}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {product.category.name}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>
                                        ₹{product.price.toFixed(2)}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <input
                                            type="number"
                                            value={product.stock}
                                            onChange={(e) => updateStock(product.id, parseInt(e.target.value))}
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
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: 'var(--radius)',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            backgroundColor: stockStatus.bg,
                                            color: stockStatus.color
                                        }}>
                                            {stockStatus.label}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>
                        {selectedBrand ? 'No products found for this brand' : 'No products yet. Add your first product!'}
                    </div>
                )}
            </div>
        </div>
    );
}
