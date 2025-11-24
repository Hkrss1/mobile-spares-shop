import ProductListing from "@/components/products/ProductListing";
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
        category: p.category.name,
    }));

    return (
        <ProductListing initialProducts={formattedProducts} />
    );
}
