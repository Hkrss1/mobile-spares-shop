import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/products/ProductDetails";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const productData = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      stockLevels: true,
    },
  });

  if (!productData) {
    notFound();
  }

  const relatedProductsData = await prisma.product.findMany({
    where: {
      categoryId: productData.categoryId,
      id: { not: id },
    },
    take: 4,
    include: {
      category: true,
      brand: true,
      stockLevels: true,
    },
  });

  const product = {
    id: productData.id,
    name: productData.name,
    price: productData.price,
    image: productData.image,
    description: productData.description,
    specs: productData.specs as Record<string, string>,
    categoryId: productData.categoryId,
    brandId: productData.brandId,
    category: { id: productData.category.id, name: productData.category.name },
    brand: productData.brand
      ? { id: productData.brand.id, name: productData.brand.name }
      : null,
    stock: productData.stockLevels.reduce(
      (sum, level: { quantity: number }) => sum + level.quantity,
      0,
    ),
  };

  const relatedProducts = relatedProductsData.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    description: p.description,
    specs: p.specs as Record<string, string>,
    categoryId: p.categoryId,
    brandId: p.brandId,
    category: { id: p.category.id, name: p.category.name },
    brand: p.brand
      ? { id: p.brand.id, name: p.brand.name }
      : null,
    stock: p.stockLevels.reduce(
      (sum, level: { quantity: number }) => sum + level.quantity,
      0,
    ),
  }));

  return <ProductDetails product={product} relatedProducts={relatedProducts} />;
}
