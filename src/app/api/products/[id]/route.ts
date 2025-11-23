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
    const { name, price, description, image, specs } = body;

    console.log("[PRODUCT UPDATE] Updating product:", params.id, body);

    // Build update data object with only provided fields
    const updateData: {
      name?: string;
      price?: number;
      categoryId?: string;
      brandId?: string | null;
      description?: string;
      image?: string;
      specs?: Record<string, string>;
    } = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (specs !== undefined) updateData.specs = specs;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
    });

    console.log("[PRODUCT UPDATE] Success:", product.id);

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT UPDATE] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to update product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
