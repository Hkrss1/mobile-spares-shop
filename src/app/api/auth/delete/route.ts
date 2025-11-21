import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { mobile },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Prevent admin deletion
        if (user.role === 'admin') {
            return NextResponse.json(
                { error: 'Cannot delete admin account' },
                { status: 403 }
            );
        }

        // Delete user
        await prisma.user.delete({
            where: { mobile },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete account error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
