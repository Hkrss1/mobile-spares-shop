import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProductWithRelations = Prisma.ProductGetPayload<{
    include: { category: true; brand: true; stockLevels: true };
}>;

interface PageProps {
    searchParams: Promise<{ search?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
    const { search } = await searchParams;
    const searchQuery = search || "";

    let products: ProductWithRelations[] = [];

    try {
        products = await prisma.product.findMany({
            where: searchQuery
                ? {
                    OR: [
                        { name: { contains: searchQuery, mode: "insensitive" } },
                        { description: { contains: searchQuery, mode: "insensitive" } },
                        { category: { name: { contains: searchQuery, mode: "insensitive" } } },
                        { brand: { name: { contains: searchQuery, mode: "insensitive" } } },
                    ],
                }
                : undefined,
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
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">
                        {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
                    </h1>
                    <p className="text-muted-foreground">
                        {formattedProducts.length} {formattedProducts.length === 1 ? "product" : "products"} found
                    </p>
                </div>

                <ProductGrid products={formattedProducts} />

                {formattedProducts.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-xl text-muted-foreground mb-4">
                            No products found{searchQuery && ` for "${searchQuery}"`}
                        </p>
                        <a
                            href="/products"
                            className="text-primary hover:underline font-medium"
                        >
                            View all products
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
