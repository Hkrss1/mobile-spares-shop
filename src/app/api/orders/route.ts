import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mobile = searchParams.get("mobile");

    if (!mobile) {
      // If no mobile provided, return all orders (Admin view)
      // In a real app, check for Admin role here
      const orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(orders);
    }

    const orders = await prisma.order.findMany({
      where: { customerMobile: mobile },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

interface OrderItemInput {
  id: string; // Product ID
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerMobile, total, items } = body;

    if (!customerName || !customerMobile || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 1. Get Default Location (For MVP, just pick the first one or create one)
    let location = await prisma.location.findFirst();
    if (!location) {
      location = await prisma.location.create({
        data: { name: "Main Warehouse", address: "Default Address" },
      });
    }
    const locationId = location.id;

    // 2. Process Order in Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Check Stock for all items first
      for (const item of items as OrderItemInput[]) {
        const stockLevel = await tx.stockLevel.findUnique({
          where: {
            productId_locationId: {
              productId: item.id,
              locationId: locationId,
            },
          },
        });

        const currentQty = stockLevel?.quantity || 0;
        if (currentQty < item.quantity) {
          throw new Error(
            `Insufficient stock for item: ${item.name}. Available: ${currentQty}`,
          );
        }
      }

      // Create Order
      const order = await tx.order.create({
        data: {
          orderNumber: `ORD-${Date.now().toString().substring(5)}`,
          customerName,
          customerMobile,
          total: parseFloat(total),
          status: "processing",
          items: {
            create: items.map((item: OrderItemInput) => ({
              name: item.name,
              price: parseFloat(String(item.price)),
              quantity: parseInt(String(item.quantity)),
              image: item.image,
            })),
          },
        },
        include: { items: true },
      });

      // Deduct Stock and Create Transactions
      for (const item of items as OrderItemInput[]) {
        await tx.stockLevel.update({
          where: {
            productId_locationId: {
              productId: item.id,
              locationId: locationId,
            },
          },
          data: {
            quantity: { decrement: item.quantity },
          },
        });

        await tx.inventoryTransaction.create({
          data: {
            type: "OUTWARD",
            quantity: item.quantity,
            productId: item.id,
            locationId: locationId,
            orderId: order.id,
            performedBy: "SYSTEM", // Or user ID if available
            notes: `Order ${order.orderNumber}`,
          },
        });
      }

      return order;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error creating order:", error);
    const message = error.message || "Internal server error";
    if (message.includes("Insufficient stock")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
