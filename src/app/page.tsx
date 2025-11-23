import Hero from "@/components/landing/Hero";
import CategorySection from "@/components/landing/CategorySection";
import ProductGrid from "@/components/landing/ProductGrid";
import Features from "@/components/landing/Features";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { category: true; brand: true; stockLevels: true };
}>;

export default async function Home() {
  let products: ProductWithRelations[] = [];

  try {
    products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        stockLevels: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    products = [];
  }

  // Format products for display
  const formattedProducts = products.map((p) => ({
    ...p,
    specs: p.specs as Record<string, string>,
    stock: p.stockLevels.reduce(
      (sum, level: { quantity: number }) => sum + level.quantity,
      0,
    ),
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    description: p.description,
    brandId: p.brandId,
    brand: p.brand ? { id: p.brand.id, name: p.brand.name } : null,
    category: { id: p.category.id, name: p.category.name },
  }));

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <main className="flex flex-col gap-16 pb-20">
        <Hero />
        <CategorySection />
        <ProductGrid title="Trending Replacements" products={formattedProducts} />
        <Features />
        <ProductGrid title="New Arrivals" products={formattedProducts} />
      </main>
    </div>
  );
}
