'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Check, Search, ShoppingBag, Star, X } from 'lucide-react';
import Link from 'next/link';

// Types for our props
interface Product {
    id: string;
    name: string;
    price: number;
    rating?: number;
    category: string;
    image: string;
    badge?: string;
    description?: string;
}

interface ProductListingProps {
    initialProducts: Product[];
    categories?: string[];
}

const DEFAULT_CATEGORIES = ["All", "Screens", "Batteries", "Housing", "Tools", "Cameras", "Charging", "Accessories"];
const COMPATIBILITY = ["iPhone", "Samsung", "Pixel", "iPad", "MacBook"];

export default function ProductListing({ initialProducts, categories = DEFAULT_CATEGORIES }: ProductListingProps) {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedModels, setSelectedModels] = useState<string[]>([]);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

    const toggleModel = (model: string) => {
        setSelectedModels(prev =>
            prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
        );
    };

    const filteredProducts = initialProducts.filter(p => {
        const categoryMatch = selectedCategory === "All" || p.category === selectedCategory;
        // Basic compatibility filter simulation - in a real app this would check product attributes
        const modelMatch = selectedModels.length === 0 || selectedModels.some(m => p.name.includes(m));
        return categoryMatch && modelMatch;
    });

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Shop All Parts</h1>
                    <p className="text-muted-foreground">Professional grade components for every repair.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMobileFiltersOpen(true)}
                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg font-medium text-sm"
                    >
                        <Filter size={16} /> Filters
                    </button>
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg font-medium text-sm hover:border-primary transition-colors min-w-[180px] justify-between">
                            <span>Sort by</span>
                            <ChevronDown size={16} className="text-muted-foreground" />
                        </button>
                        {/* Dropdown would go here */}
                    </div>
                </div>
            </div>

            <div className="flex gap-12">

                {/* Sidebar Filters (Desktop) */}
                <div className="hidden lg:block w-64 flex-shrink-0 space-y-8 sticky top-32 h-fit">
                    {/* Categories */}
                    <div>
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Category</h3>
                        <ul className="space-y-2">
                            {categories.map(cat => (
                                <li key={cat}>
                                    <button
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedCategory === cat
                                            ? 'bg-primary text-primary-foreground font-medium shadow-md'
                                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Compatibility */}
                    <div>
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Compatibility</h3>
                        <div className="space-y-2">
                            {COMPATIBILITY.map(model => (
                                <label key={model} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedModels.includes(model) ? 'bg-primary border-primary text-primary-foreground' : 'border-input group-hover:border-primary'
                                        }`}>
                                        {selectedModels.includes(model) && <Check size={12} strokeWidth={3} />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={selectedModels.includes(model)}
                                        onChange={() => toggleModel(model)}
                                    />
                                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">{model}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range (Visual Only) */}
                    <div>
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Price Range</h3>
                        <div className="h-1 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full w-1/2 bg-primary ml-1/4"></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>$0</span>
                            <span>$500+</span>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {filteredProducts.map((product) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={product.id}
                                    onMouseEnter={() => setHoveredProduct(product.id)}
                                    onMouseLeave={() => setHoveredProduct(null)}
                                    className="group bg-card/40 backdrop-blur-md rounded-3xl border border-border overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer relative"
                                >
                                    <Link href={`/products/${product.id}`} className="absolute inset-0 z-0" />

                                    {/* Badge */}
                                    {product.badge && (
                                        <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-black/80 backdrop-blur text-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-black/5">
                                            {product.badge}
                                        </div>
                                    )}

                                    {/* Image Area */}
                                    <div className="aspect-square bg-gradient-to-b from-transparent to-secondary/30 p-8 relative overflow-hidden flex items-center justify-center pointer-events-none">
                                        <motion.img
                                            src={product.image || "https://picsum.photos/400/400?random=1"}
                                            alt={product.name}
                                            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal drop-shadow-xl"
                                            animate={{ scale: hoveredProduct === product.id ? 1.05 : 1 }}
                                            transition={{ duration: 0.4 }}
                                        />

                                        {/* Quick Add Overlay */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{
                                                opacity: hoveredProduct === product.id ? 1 : 0,
                                                y: hoveredProduct === product.id ? 0 : 20
                                            }}
                                            className="absolute inset-x-4 bottom-4 pointer-events-auto z-10"
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    // Add to cart logic here
                                                }}
                                                className="w-full bg-primary/90 hover:bg-primary backdrop-blur text-primary-foreground py-3 rounded-2xl font-semibold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
                                            >
                                                <ShoppingBag size={18} /> Add to Cart
                                            </button>
                                        </motion.div>
                                    </div>

                                    {/* Info Area */}
                                    <div className="p-6 pointer-events-none">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-medium text-primary uppercase tracking-wide bg-primary/10 px-2 py-0.5 rounded-md">
                                                {product.category}
                                            </span>
                                            <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
                                                <Star size={12} fill="currentColor" /> {product.rating || 4.5}
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-base leading-snug mb-3 group-hover:text-primary transition-colors h-10 line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xs text-muted-foreground">$</span>
                                            <span className="text-xl font-bold tracking-tight">{Math.floor(product.price)}</span>
                                            <span className="text-xs font-bold tracking-tight">.{(product.price % 1).toFixed(2).substring(2)}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <Search size={48} className="text-muted-foreground/30 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No products found</h3>
                            <p className="text-muted-foreground">Try adjusting your filters or category.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filters Modal */}
            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[300px] bg-background z-50 lg:hidden shadow-2xl border-l border-border p-6 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold">Filters</h2>
                                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 hover:bg-secondary rounded-full">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Category</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${selectedCategory === cat
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'border-border text-muted-foreground'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
