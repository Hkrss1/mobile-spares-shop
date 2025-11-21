import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force Node.js runtime (required for Prisma)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { mobile } = body;

        if (!mobile) {
            return NextResponse.json(
                { error: 'Missing mobile number' },
                { status: 400 }
            );
        }

        // Check if user exists in database
        const user = await prisma.user.findUnique({
            where: { mobile },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Return user data for password reset
        return NextResponse.json({
            name: user.name,
            mobile: user.mobile,
            password: user.password, // In production, never send password - use reset token instead
        });
    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
