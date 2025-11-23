import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> },
) {
    try {
        const params = await context.params;
        const body = await request.json();
        const { quantity, locationId } = body;

        console.log("[STOCK UPDATE] Updating stock for product:", params.id, body);

        // Find or create stock level
        const stockLevel = await prisma.stockLevel.upsert({
            where: {
                productId_locationId: {
                    productId: params.id,
                    locationId: locationId || "loc_main",
                },
            },
            update: {
                quantity: parseInt(quantity),
            },
            create: {
                productId: params.id,
                locationId: locationId || "loc_main",
                quantity: parseInt(quantity),
            },
        });

        console.log("[STOCK UPDATE] Success:", stockLevel.id);

        return NextResponse.json(stockLevel);
    } catch (error) {
        console.error("[STOCK UPDATE] Error:", error);
        return NextResponse.json(
            {
                error: "Failed to update stock",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
