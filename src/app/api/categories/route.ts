import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force Node.js runtime (required for Prisma)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('[CATEGORIES GET] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name || !name.trim()) {
            return NextResponse.json(
                { error: 'Category name is required' },
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: { name: name.trim() }
        });

        console.log('[CATEGORIES POST] Created category:', category.id);

        return NextResponse.json(category);
    } catch (error) {
        console.error('[CATEGORIES POST] Error:', error);

        // Handle unique constraint violation
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return NextResponse.json(
                { error: 'Category already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create category', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
