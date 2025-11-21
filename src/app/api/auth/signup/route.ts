import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, mobile, password } = body;

        if (!name || !mobile || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { mobile },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 409 }
            );
        }

        // Create new user
        // Note: In a real app, you should hash the password using bcrypt
        const user = await prisma.user.create({
            data: {
                name,
                mobile,
                password, // Storing plain text as per current implementation (should be improved)
            },
        });

        return NextResponse.json({
            id: user.id,
            name: user.name,
            mobile: user.mobile,
            role: user.role,
        });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
