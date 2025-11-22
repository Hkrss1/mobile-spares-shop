import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, locationId, supplierId, quantity, notes, performedBy } =
      body;

    if (!productId || !locationId || !quantity || !performedBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const qty = parseInt(quantity);

    // Use a transaction to ensure data integrity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Inventory Transaction
      const transaction = await tx.inventoryTransaction.create({
        data: {
          type: "INWARD",
          quantity: qty,
          productId,
          locationId,
          supplierId,
          performedBy,
          notes,
        },
      });

      // 2. Update or Create Stock Level
      const stockLevel = await tx.stockLevel.upsert({
        where: {
          productId_locationId: {
            productId,
            locationId,
          },
        },
        update: {
          quantity: {
            increment: qty,
          },
        },
        create: {
          productId,
          locationId,
          quantity: qty,
        },
      });

      return { transaction, stockLevel };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Inward Error:", error);
    return NextResponse.json(
      { error: "Failed to process inward transaction" },
      { status: 500 },
    );
  }
}
