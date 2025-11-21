import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { mobile, password } = body;

        if (!mobile || !password) {
            return NextResponse.json(
                { error: 'Missing credentials' },
                { status: 400 }
            );
        }

        // Hardcoded Admin Check (for backward compatibility)
        if (mobile === '9999999999' && password === 'admin123') {
            return NextResponse.json({
                id: 'admin-id',
                name: 'Admin',
                mobile: '9999999999',
                role: 'admin',
            });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { mobile },
        });

        if (!user || user.password !== password) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            id: user.id,
            name: user.name,
            mobile: user.mobile,
            role: user.role,
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
