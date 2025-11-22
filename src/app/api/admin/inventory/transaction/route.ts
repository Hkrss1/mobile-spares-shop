import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const productId = searchParams.get("productId");

    const where: any = {};
    if (type) where.type = type;
    if (productId) where.productId = productId;

    const transactions = await prisma.inventoryTransaction.findMany({
      where,
      include: {
        product: { select: { name: true } },
        location: { select: { name: true } },
        supplier: { select: { name: true } },
        order: { select: { orderNumber: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}
