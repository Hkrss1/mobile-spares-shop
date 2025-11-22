import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Total Stock Value
    // We need to join Product and StockLevel. Prisma doesn't support direct sum across relations easily in one query for value,
    // so we might need to fetch and calculate or use raw query.
    // For simplicity/speed in this MVP, let's fetch products with their total stock.

    const products = await prisma.product.findMany({
      include: {
        stockLevels: true,
      },
    });

    let totalStockValue = 0;
    let lowStockItems = [];
    const LOW_STOCK_THRESHOLD = 5;

    for (const product of products) {
      const totalQty = product.stockLevels.reduce(
        (sum, level) => sum + level.quantity,
        0,
      );
      totalStockValue += totalQty * product.price;

      if (totalQty < LOW_STOCK_THRESHOLD) {
        lowStockItems.push({
          id: product.id,
          name: product.name,
          quantity: totalQty,
        });
      }
    }

    // 2. Monthly Stats
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyInwards = await prisma.inventoryTransaction.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        type: "INWARD",
        createdAt: {
          gte: firstDayOfMonth,
        },
      },
    });

    const monthlyOutwards = await prisma.inventoryTransaction.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        type: "OUTWARD",
        createdAt: {
          gte: firstDayOfMonth,
        },
      },
    });

    return NextResponse.json({
      totalStockValue,
      lowStockItems,
      monthlyInwards: monthlyInwards._sum.quantity || 0,
      monthlyOutwards: monthlyOutwards._sum.quantity || 0,
    });
  } catch (error) {
    console.error("Report Error:", error);
    return NextResponse.json(
      { error: "Failed to generate reports" },
      { status: 500 },
    );
  }
}
