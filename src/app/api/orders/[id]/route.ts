import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force Node.js runtime (required for Prisma)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const { status, trackingLink, cancelledBy } = body;

    console.log("[ORDER UPDATE] Updating order:", params.id, body);

    // Get the current order to check previous status
    const currentOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
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
        include: { items: true },
      });

      // Legacy stock deduction logic removed. Stock is now deducted at order creation.
      // if (status === 'in-transit' && currentOrder.status === 'processing') { ... }

      return updatedOrder;
    });

    console.log("[ORDER UPDATE] Success:", result.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[ORDER UPDATE] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to update order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
