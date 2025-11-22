"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';


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
    createOrder: (customerName: string, customerMobile: string, items: OrderItem[], total: number) => Promise<Order | null>;
    updateOrderStatus: (orderId: string, status: Order['status'], trackingLink?: string) => void;
    cancelOrder: (orderId: string, cancelledBy: 'user' | 'admin') => void;
    getUserOrders: (mobile: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);

    // Load orders on mount and when user changes
    useEffect(() => {
        async function fetchOrders() {
            try {
                const user = JSON.parse(localStorage.getItem('mss_user') || 'null');
                const mobile = user?.mobile;

                let url = '/api/orders';
                if (mobile && user.role !== 'admin') {
                    url += `?mobile=${mobile}`;
                }

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        }

        fetchOrders();
    }, []);

    const createOrder = useCallback(async (customerName: string, customerMobile: string, items: OrderItem[], total: number): Promise<Order | null> => {
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName,
                    customerMobile,
                    items,
                    total
                }),
            });

            if (res.ok) {
                const newOrder = await res.json();
                setOrders(prev => [newOrder, ...prev]);
                return newOrder;
            }
            return null;
        } catch (error) {
            console.error('Failed to create order:', error);
            return null;
        }
    }, []);

    const updateOrderStatus = useCallback(async (orderId: string, status: Order['status'], trackingLink?: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, trackingLink }),
            });

            if (res.ok) {
                const updatedOrder = await res.json();
                setOrders(currentOrders => currentOrders.map(order =>
                    order.id === orderId ? updatedOrder : order
                ));
            } else {
                console.error('Failed to update order status');
                alert('Failed to update order status. Please try again.');
            }
        } catch (error) {
            console.error('Failed to update order status:', error);
            alert('Failed to update order status. Please try again.');
        }
    }, []);

    const cancelOrder = useCallback(async (orderId: string, cancelledBy: 'user' | 'admin') => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled', cancelledBy }),
            });

            if (res.ok) {
                const updatedOrder = await res.json();
                setOrders(currentOrders => currentOrders.map(order =>
                    order.id === orderId ? updatedOrder : order
                ));
            } else {
                console.error('Failed to cancel order');
                alert('Failed to cancel order. Please try again.');
            }
        } catch (error) {
            console.error('Failed to cancel order:', error);
            alert('Failed to cancel order. Please try again.');
        }
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
