import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        stockLevels: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const productsWithStock = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      description: p.description,
      specs: p.specs as Record<string, string>,
      categoryId: p.categoryId,
      brandId: p.brandId,
      category: p.category,
      brand: p.brand,
      stock: p.stockLevels.reduce(
        (sum, level: { quantity: number }) => sum + level.quantity,
        0,
      ),
    }));

    return NextResponse.json(productsWithStock);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, categoryId, brandId, description, image, specs } =
      body;

    if (!name || !price || !categoryId || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        categoryId,
        brandId: brandId || null,
        description: description || "",
        image,
        specs: specs || {},
      },
      include: {
        category: true,
        brand: true,
      },
    });

    return NextResponse.json({
      ...product,
      stock: 0,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
