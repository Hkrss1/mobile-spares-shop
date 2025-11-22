import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force Node.js runtime (required for Prisma)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.error("[BRANDS GET] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch brands",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Brand name is required" },
        { status: 400 },
      );
    }

    const brand = await prisma.brand.create({
      data: { name: name.trim() },
    });

    console.log("[BRANDS POST] Created brand:", brand.id);

    return NextResponse.json(brand);
  } catch (error) {
    console.error("[BRANDS POST] Error:", error);

    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Brand already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create brand",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
