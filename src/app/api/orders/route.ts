import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const mobile = searchParams.get('mobile');

        if (!mobile) {
            // If no mobile provided, return all orders (Admin view)
            // In a real app, check for Admin role here
            const orders = await prisma.order.findMany({
                include: { items: true },
                orderBy: { createdAt: 'desc' },
            });
            return NextResponse.json(orders);
        }

        const orders = await prisma.order.findMany({
            where: { customerMobile: mobile },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

interface OrderItemInput {
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerName, customerMobile, total, items } = body;

        if (!customerName || !customerMobile || !items || items.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create order and order items in a transaction
        const order = await prisma.order.create({
            data: {
                orderNumber: `ORD-${Date.now().toString().substring(5)}`,
                customerName,
                customerMobile,
                total: parseFloat(total),
                status: 'processing',
                items: {
                    create: items.map((item: OrderItemInput) => ({
                        name: item.name,
                        price: parseFloat(String(item.price)),
                        quantity: parseInt(String(item.quantity)),
                        image: item.image,
                    })),
                },
            },
            include: { items: true },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
