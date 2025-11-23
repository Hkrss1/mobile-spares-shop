"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/products';

interface ProductGridProps {
    title: string;
    products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ title, products }) => {
    // Show only first 4 products for each section
    const displayProducts = products.slice(0, 4);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                    <p className="text-muted-foreground mt-2">Top quality components selected for you</p>
                </div>
                <Link href="/products" className="hidden sm:block text-primary font-semibold hover:underline">View All Products</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </div>

            {displayProducts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No products available at the moment.</p>
                </div>
            )}
        </section>
    );
};

export default ProductGrid;
