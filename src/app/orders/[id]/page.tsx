"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, MapPin, ArrowRight, Loader2 } from "lucide-react";
import ProductGrid from "@/components/landing/ProductGrid";
import { Product } from "@/lib/products";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface Order {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
    customerName: string;
    customerMobile: string;
}

export default function OrderConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                if (!params?.id) return;

                // Fetch Order Details
                const orderRes = await fetch(`/api/orders/${params.id}`);
                if (!orderRes.ok) {
                    throw new Error("Order not found");
                }
                const orderData = await orderRes.json();
                setOrder(orderData);

                // Fetch Related Products (Random selection for now)
                const productsRes = await fetch("/api/products");
                if (productsRes.ok) {
                    const productsData = await productsRes.json();
                    // Shuffle and take 4
                    const shuffled = productsData.sort(() => 0.5 - Math.random());
                    setRelatedProducts(shuffled.slice(0, 4));
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [params?.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                <Link href="/" className="text-primary hover:underline">
                    Return to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto">
                {/* Success Message */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
                    <p className="text-muted-foreground text-lg">
                        Thank you for your purchase, {order.customerName}.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Order #{order.orderNumber} has been placed successfully.
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-12">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-8 border-b border-border">
                            <div>
                                <h2 className="text-lg font-semibold mb-1">Order Details</h2>
                                <p className="text-sm text-muted-foreground">
                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                <Package size={16} />
                                <span className="capitalize">{order.status}</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-secondary/30 rounded-lg overflow-hidden relative flex-shrink-0 border border-border/50">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-contain p-1"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium truncate">{item.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-semibold">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-foreground">Delivery Address</p>
                                    <p>Mobile: {order.customerMobile}</p>
                                    {/* Address would go here if we collected it separately */}
                                </div>
                            </div>
                            <div className="text-right w-full sm:w-auto">
                                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                                <p className="text-2xl font-bold text-primary">
                                    ₹{order.total.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-secondary/30 p-4 sm:p-6 text-center sm:text-right">
                        <Link
                            href="/orders"
                            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                        >
                            View All Orders <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Related Items */}
                <div className="mt-16">
                    <ProductGrid title="You Might Also Like" products={relatedProducts} />
                </div>
            </div>
        </div>
    );
}
