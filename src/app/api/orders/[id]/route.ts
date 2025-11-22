import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force Node.js runtime (required for Prisma)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { status, trackingLink, cancelledBy } = body;

        console.log('[ORDER UPDATE] Updating order:', params.id, body);

        // Get the current order to check previous status
        const currentOrder = await prisma.order.findUnique({
            where: { id: params.id },
            include: { items: true }
        });

        if (!currentOrder) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: any = {};
        if (status !== undefined) updateData.status = status;
        if (trackingLink !== undefined) updateData.trackingLink = trackingLink;
        if (cancelledBy !== undefined) updateData.cancelledBy = cancelledBy;

        // Use transaction to update order and potentially deduct stock
        const result = await prisma.$transaction(async (tx) => {
            // Update the order
            const updatedOrder = await tx.order.update({
                where: { id: params.id },
                data: updateData,
                include: { items: true }
            });

            // If status changed to 'in-transit' and was previously 'processing', deduct stock
            if (status === 'in-transit' && currentOrder.status === 'processing') {
                console.log('[ORDER UPDATE] Deducting stock for order items');

                for (const item of currentOrder.items) {
                    // Extract product ID from item name or use a mapping
                    // For now, we'll need to find products by name (not ideal but works)
                    const product = await tx.product.findFirst({
                        where: { name: item.name }
                    });

                    if (product) {
                        await tx.product.update({
                            where: { id: product.id },
                            data: {
                                stock: {
                                    decrement: item.quantity
                                }
                            }
                        });
                        console.log(`[ORDER UPDATE] Deducted ${item.quantity} units from ${product.name}`);
                    } else {
                        console.warn(`[ORDER UPDATE] Product not found for item: ${item.name}`);
                    }
                }
            }

            return updatedOrder;
        });

        console.log('[ORDER UPDATE] Success:', result.id);

        return NextResponse.json(result);
    } catch (error) {
        console.error('[ORDER UPDATE] Error:', error);
        return NextResponse.json(
            { error: 'Failed to update order', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
