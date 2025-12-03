'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Truck, ShieldCheck, RefreshCw, ChevronRight, Minus, Plus, ShoppingBag, Heart, Share2, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import ProductGrid from '@/components/landing/ProductGrid';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { Product } from '@/lib/products';

interface ProductDetailProps {
    product: Product;
    relatedProducts: Product[];
}

// Mock Extended Data
const MOCK_SPECS = [
    { label: "Compatibility", value: "iPhone 13 Pro Max (A2643, A2484, A2641)" },
    { label: "Screen Type", value: "Super Retina XDR OLED" },
    { label: "Size", value: "6.7 inches" },
    { label: "Resolution", value: "2778 x 1284 pixels at 458 ppi" },
    { label: "Refresh Rate", value: "120Hz ProMotion" },
    { label: "Warranty", value: "Lifetime Warranty (Defects only)" },
    { label: "Condition", value: "Premium Aftermarket (Soft OLED)" },
];

const MOCK_REVIEWS = [
    { id: 1, user: "Alex M.", rating: 5, date: "2 days ago", content: "Screen looks exactly like the original. True Tone transfer worked perfectly with the programmer. Highly recommend!" },
    { id: 2, user: "Sarah K.", rating: 4, date: "1 week ago", content: "Great quality display. Installation was straightforward following the guide. Shipping was super fast." },
    { id: 3, user: "TechRepair Solutions", rating: 5, date: "2 weeks ago", content: "As a shop owner, I buy these in bulk. The color accuracy is spot on and touch sensitivity is perfect." },
];

const ProductDetails: React.FC<ProductDetailProps> = ({ product, relatedProducts }) => {
    const router = useRouter();
    const { addItem } = useCart();
    const [activeImage, setActiveImage] = useState(0);
    const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
    const [quantity, setQuantity] = useState(1);
    const [pincode, setPincode] = useState('');
    const [deliveryStatus, setDeliveryStatus] = useState<'idle' | 'checking' | 'available' | 'invalid'>('idle');

    // Use passed product data, with fallbacks for missing fields
    const currentProduct = {
        ...product,
        rating: 4.9, // Mock rating
        reviews: 128, // Mock reviews count
        originalPrice: product.price * 1.2, // Mock original price
        images: [product.image, product.image, product.image, product.image], // Mock multiple images using the single image
        sku: `SKU-${product.id.substring(0, 8).toUpperCase()}`
    };

    // Zoom Logic
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left) / width * 100;
        const y = (e.clientY - top) / height * 100;
        e.currentTarget.style.setProperty('--x', `${x}%`);
        e.currentTarget.style.setProperty('--y', `${y}%`);
    };

    const [deliveryEstimate, setDeliveryEstimate] = useState<{ date: string; courier: string } | null>(null);

    const checkDelivery = async () => {
        if (!pincode || pincode.length !== 6) {
            setDeliveryStatus('invalid');
            return;
        }

        setDeliveryStatus('checking');
        setDeliveryEstimate(null);

        try {
            const res = await fetch(`/api/delivery/serviceability?pincode=${pincode}`);
            if (res.ok) {
                const data = await res.json();
                if (data.estimated_delivery_date) {
                    setDeliveryEstimate({
                        date: new Date(data.estimated_delivery_date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }),
                        courier: data.courier_name
                    });
                    setDeliveryStatus('available');
                } else {
                    // Fallback
                    const days = pincode.startsWith("11") ? 2 : 5;
                    const date = new Date();
                    date.setDate(date.getDate() + days);
                    setDeliveryEstimate({
                        date: date.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }),
                        courier: "Standard Delivery"
                    });
                    setDeliveryStatus('available');
                }
            } else {
                setDeliveryStatus('invalid');
            }
        } catch (error) {
            console.error("Delivery check failed", error);
            setDeliveryStatus('invalid');
        }
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 animate-in fade-in duration-500">
            {/* Breadcrumbs & Back */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <button onClick={() => router.back()} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4 transition-colors">
                    <ChevronRight className="rotate-180" size={16} /> Back to Products
                </button>
                <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <span>Home</span> <ChevronRight size={12} />
                    <span>Parts</span> <ChevronRight size={12} />
                    <span>{product.category.name}</span> <ChevronRight size={12} />
                    <span className="text-foreground font-medium truncate">{currentProduct.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">

                    {/* LEFT: Image Gallery */}
                    <div className="space-y-6">
                        {/* Main Image Area with Zoom */}
                        <div
                            className="relative aspect-square bg-secondary/30 rounded-3xl overflow-hidden border border-border group cursor-crosshair"
                            onMouseMove={handleMouseMove}
                        >
                            <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-black/5" />
                            <img
                                src={currentProduct.images[activeImage]}
                                alt={currentProduct.name}
                                className="w-full h-full object-contain p-8 transition-transform duration-200 origin-[var(--x)_var(--y)] group-hover:scale-[2]"
                            />
                            {/* Floating Badge */}
                            {product.stock > 0 && (
                                <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                                    IN STOCK
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-4">
                            {currentProduct.images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{currentProduct.name}</h1>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star fill="currentColor" size={18} />
                                    <Star fill="currentColor" size={18} />
                                    <Star fill="currentColor" size={18} />
                                    <Star fill="currentColor" size={18} />
                                    <Star fill="currentColor" size={18} />
                                    <span className="text-foreground font-medium ml-1">{currentProduct.rating}</span>
                                </div>
                                <span className="text-muted-foreground text-sm">({currentProduct.reviews} Reviews)</span>
                                <span className="text-border">|</span>
                                <span className="text-muted-foreground text-sm">SKU: {currentProduct.sku}</span>
                            </div>

                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-4xl font-bold text-primary">₹{currentProduct.price.toFixed(2)}</span>
                                {currentProduct.originalPrice && (
                                    <>
                                        <span className="text-xl text-muted-foreground line-through decoration-destructive/50 mb-1">₹{currentProduct.originalPrice.toFixed(2)}</span>
                                        <span className="mb-2 px-2 py-0.5 bg-destructive/10 text-destructive text-xs font-bold rounded-md">
                                            {Math.round((1 - currentProduct.price / currentProduct.originalPrice) * 100)}% OFF
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">Inclusive of all taxes. Free shipping on orders over ₹500.</p>
                        </div>

                        <hr className="border-border mb-8" />

                        {/* Delivery Checker */}
                        <div className="bg-secondary/30 p-5 rounded-2xl border border-border mb-8">
                            <div className="flex items-center gap-2 mb-3">
                                <Truck size={18} className="text-primary" />
                                <span className="font-semibold text-sm">Delivery Availability</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Enter Pincode"
                                        maxLength={6}
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                                        className="w-full pl-10 pr-4 py-2.5 bg-background rounded-xl border border-input focus:border-primary outline-none text-sm transition-all"
                                    />
                                </div>
                                <button
                                    onClick={checkDelivery}
                                    disabled={deliveryStatus === 'checking' || !pincode}
                                    className="px-5 py-2.5 bg-foreground text-background font-medium rounded-xl text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                                >
                                    {deliveryStatus === 'checking' ? 'Checking...' : 'Check'}
                                </button>
                            </div>
                            {/* Delivery Status Messages */}
                            <div className="mt-3 min-h-[20px]">
                                {deliveryStatus === 'available' && deliveryEstimate && (
                                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1 text-sm">
                                        <div className="flex items-center gap-2 text-green-600">
                                            <CheckCircle2 size={14} />
                                            <span>Estimated delivery by <span className="font-bold">{deliveryEstimate.date}</span></span>
                                        </div>
                                        <div className="text-xs text-muted-foreground ml-6">
                                            via {deliveryEstimate.courier}
                                        </div>
                                    </motion.div>
                                )}
                                {deliveryStatus === 'invalid' && (
                                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-destructive text-sm">
                                        <AlertCircle size={14} />
                                        <span>Invalid pincode or delivery not available.</span>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="flex items-center bg-secondary/50 rounded-xl border border-border w-fit">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3 hover:text-primary transition-colors"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-3 hover:text-primary transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`flex-1 py-3 px-6 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${product.stock > 0
                                    ? 'bg-primary text-primary-foreground shadow-primary/25 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]'
                                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                                    }`}
                            >
                                <ShoppingBag size={20} /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <div className="flex gap-2">
                                <button className="p-3 rounded-xl border border-border hover:bg-secondary text-muted-foreground hover:text-destructive transition-colors">
                                    <Heart size={22} />
                                </button>
                                <button className="p-3 rounded-xl border border-border hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                                    <Share2 size={22} />
                                </button>
                            </div>
                        </div>

                        {/* Quick Features */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-secondary/20">
                                <ShieldCheck className="text-primary mb-2" size={20} />
                                <span className="text-xs text-muted-foreground">Genuine Part</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-secondary/20">
                                <RefreshCw className="text-primary mb-2" size={20} />
                                <span className="text-xs text-muted-foreground">7 Day Return</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-secondary/20">
                                <Truck className="text-primary mb-2" size={20} />
                                <span className="text-xs text-muted-foreground">Free Ship</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABS SECTION */}
                <div className="mb-24">
                    <div className="flex items-center gap-8 border-b border-border mb-8 overflow-x-auto no-scrollbar">
                        {['desc', 'specs', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`pb-4 text-sm font-semibold tracking-wide uppercase transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {tab === 'desc' && 'Description'}
                                {tab === 'specs' && 'Specifications'}
                                {tab === 'reviews' && `Reviews (${currentProduct.reviews})`}
                                {activeTab === tab && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="min-h-[300px]"
                        >
                            {activeTab === 'desc' && (
                                <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                                    <p className="text-lg mb-4">{currentProduct.description}</p>
                                    <h3 className="text-foreground font-bold text-xl mt-8 mb-4">Why choose our parts?</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Factory calibrated color profiles</li>
                                        <li>Oleophobic coating for fingerprint resistance</li>
                                        <li>Reinforced glass structure</li>
                                        <li>Pre-installed adhesive and camera bracket</li>
                                    </ul>
                                </div>
                            )}

                            {activeTab === 'specs' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                                    {Object.entries(currentProduct.specs || {}).map(([key, value], idx) => (
                                        <div key={idx} className="flex justify-between py-3 border-b border-border/50">
                                            <span className="text-muted-foreground font-medium">{key}</span>
                                            <span className="text-foreground font-semibold">{String(value)}</span>
                                        </div>
                                    ))}
                                    {(!currentProduct.specs || Object.keys(currentProduct.specs).length === 0) && (
                                        <div className="col-span-2 text-muted-foreground">No specifications available.</div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-8">
                                    <div className="bg-secondary/20 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-8">
                                        <div className="text-center">
                                            <div className="text-5xl font-bold text-foreground mb-2">4.9</div>
                                            <div className="flex text-yellow-500 gap-1 justify-center mb-2">
                                                <Star fill="currentColor" size={20} />
                                                <Star fill="currentColor" size={20} />
                                                <Star fill="currentColor" size={20} />
                                                <Star fill="currentColor" size={20} />
                                                <Star fill="currentColor" size={20} />
                                            </div>
                                            <div className="text-sm text-muted-foreground">Based on 128 reviews</div>
                                        </div>
                                        <div className="flex-1 w-full space-y-2">
                                            {[5, 4, 3, 2, 1].map((star) => (
                                                <div key={star} className="flex items-center gap-3">
                                                    <span className="text-xs font-medium w-3">{star}</span>
                                                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-yellow-500 rounded-full"
                                                            style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : '2%' }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid gap-6">
                                        {MOCK_REVIEWS.map((review) => (
                                            <div key={review.id} className="border border-border rounded-xl p-6">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                            {review.user.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold">{review.user}</h4>
                                                            <div className="flex text-yellow-500 text-[10px] gap-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{review.date}</span>
                                                </div>
                                                <p className="text-muted-foreground text-sm">{review.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* RELATED PRODUCTS */}
                <div className="pt-12 border-t border-border">
                    <ProductGrid title="You Might Also Need" products={relatedProducts} />
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
