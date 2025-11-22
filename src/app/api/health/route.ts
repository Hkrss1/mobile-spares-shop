import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Try to execute a simple query to check database connection
        await prisma.$queryRaw`SELECT 1`;

        // Get database connection info (without sensitive data)
        const result = await prisma.$queryRaw<Array<{ version: string }>>`SELECT version()`;

        return NextResponse.json({
            status: 'success',
            message: 'Database connected successfully',
            database: {
                connected: true,
                version: result[0]?.version || 'unknown',
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Database connection error:', error);

        return NextResponse.json(
            {
                status: 'error',
                message: 'Database connection failed',
                database: {
                    connected: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date().toISOString(),
                },
            },
            { status: 500 }
        );
    }
}
