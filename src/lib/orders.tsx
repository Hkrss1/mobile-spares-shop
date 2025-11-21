"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from './products';

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerMobile: string;
    items: OrderItem[];
    total: number;
    status: 'processing' | 'in-transit' | 'delivered' | 'cancelled';
    cancelledBy?: 'user' | 'admin';
    trackingLink?: string;
    createdAt: string;
}

interface OrderContextType {
    orders: Order[];
    createOrder: (customerName: string, customerMobile: string, items: OrderItem[], total: number) => Order;
    updateOrderStatus: (orderId: string, status: Order['status'], trackingLink?: string) => void;
    cancelOrder: (orderId: string, cancelledBy: 'user' | 'admin') => void;
    getUserOrders: (mobile: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);

    // Load orders from localStorage
    useEffect(() => {
        const savedOrders = localStorage.getItem('fixquik_orders');
        if (savedOrders) {
            try {
                setOrders(JSON.parse(savedOrders));
            } catch (error) {
                console.error('Failed to parse orders:', error);
                localStorage.removeItem('fixquik_orders');
            }
        }
    }, []);

    // Save orders to localStorage
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            localStorage.setItem('fixquik_orders', JSON.stringify(orders));
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [orders]);

    const createOrder = useCallback((customerName: string, customerMobile: string, items: OrderItem[], total: number): Order => {
        const order: Order = {
            id: `order-${Date.now()}`,
            orderNumber: `ORD-${Date.now().toString().substring(5)}`,
            customerName,
            customerMobile,
            items,
            total,
            status: 'processing',
            createdAt: new Date().toISOString()
        };

        setOrders(currentOrders => {
            const updatedOrders = [...currentOrders, order];
            localStorage.setItem('fixquik_orders', JSON.stringify(updatedOrders));
            return updatedOrders;
        });

        return order;
    }, []);

    const updateOrderStatus = useCallback((orderId: string, status: Order['status'], trackingLink?: string) => {
        setOrders(currentOrders => currentOrders.map(order =>
            order.id === orderId
                ? { ...order, status, trackingLink: trackingLink || order.trackingLink }
                : order
        ));
    }, []);

    const cancelOrder = useCallback((orderId: string, cancelledBy: 'user' | 'admin') => {
        setOrders(currentOrders => currentOrders.map(order =>
            order.id === orderId
                ? { ...order, status: 'cancelled', cancelledBy }
                : order
        ));
    }, []);

    const getUserOrders = useCallback((mobile: string) => {
        return orders.filter(order => order.customerMobile === mobile);
    }, [orders]);

    const contextValue = useMemo(() => ({
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        getUserOrders
    }), [orders, createOrder, updateOrderStatus, cancelOrder, getUserOrders]);

    return (
        <OrderContext.Provider value={contextValue}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
}
