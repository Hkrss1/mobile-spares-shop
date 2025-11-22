import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
                brand: true
            },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, price, categoryId, brandId, description, image, stock, specs } = body;

        if (!name || !price || !categoryId || !image || stock === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                categoryId,
                brandId: brandId || null,
                description: description || '',
                image,
                stock: parseInt(stock),
                specs: specs || {},
            },
            include: {
                category: true,
                brand: true
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
