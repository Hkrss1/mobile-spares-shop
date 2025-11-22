"use client";

import { useState, useMemo, useEffect } from 'react';
import { Product } from '@/lib/products';
import ProductCard from './ProductCard';

interface ProductGridProps {
    products: Product[];
}

const ITEMS_PER_PAGE = 15;

export default function ProductGrid({ products }: ProductGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category.name));
        return ['All', ...Array.from(cats)];
    }, [products]);

    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Filter and paginate products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || product.category.name === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, debouncedSearchQuery, selectedCategory]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const currentProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery, selectedCategory]);

    return (
        <div>
            {/* Filters & Search */}
            <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Search Box */}
                    <div style={{ position: 'relative', flex: '1 1 300px' }}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                paddingLeft: '2.5rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid hsl(var(--border))',
                                backgroundColor: 'hsl(var(--background))',
                                color: 'hsl(var(--foreground))',
                                fontSize: '1rem'
                            }}
                        />
                        <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                            🔍
                        </span>
                    </div>

                    {/* Category Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '9999px',
                                    border: '1px solid',
                                    borderColor: selectedCategory === category ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                                    backgroundColor: selectedCategory === category ? 'hsl(var(--primary))' : 'transparent',
                                    color: selectedCategory === category ? 'white' : 'hsl(var(--muted-foreground))',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
                <>
                    <div className="grid-cols-responsive" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {currentProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="btn"
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: 'transparent',
                                    border: '1px solid hsl(var(--border))',
                                    opacity: currentPage === 1 ? 0.5 : 1,
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid',
                                        borderColor: currentPage === page ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                                        backgroundColor: currentPage === page ? 'hsl(var(--primary))' : 'transparent',
                                        color: currentPage === page ? 'white' : 'hsl(var(--foreground))',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="btn"
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: 'transparent',
                                    border: '1px solid hsl(var(--border))',
                                    opacity: currentPage === totalPages ? 0.5 : 1,
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'hsl(var(--muted-foreground))' }}>
                    <p style={{ fontSize: '1.25rem' }}>No products found matching your criteria.</p>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                        style={{ marginTop: '1rem', color: 'hsl(var(--primary))', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}
