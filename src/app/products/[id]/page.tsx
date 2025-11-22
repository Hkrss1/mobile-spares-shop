import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import Image from "next/image";

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

  return (
    <div className="container animate-fade-in" style={{ padding: "4rem 1rem" }}>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          marginBottom: "2rem",
          color: "hsl(var(--muted-foreground))",
          fontSize: "0.875rem",
        }}
      >
        &larr; Back to Products
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "4rem",
        }}
      >
        {/* Image Section */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "var(--radius)",
            aspectRatio: "1/1",
            position: "relative",
            border: "1px solid hsl(var(--border))",
            overflow: "hidden",
          }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: "contain", padding: "2rem" }}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Details Section */}
        <div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "hsl(var(--primary))",
              fontWeight: 600,
              marginBottom: "0.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {product.category.name}
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              marginBottom: "1rem",
              lineHeight: 1.1,
            }}
          >
            {product.name}
          </h1>
          <div
            style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}
          >
            ₹{product.price.toFixed(2)}
          </div>

          {/* Stock Status */}
          <div style={{ marginBottom: "1.5rem" }}>
            {product.stock > 10 ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#10b98120",
                  color: "#10b981",
                  borderRadius: "var(--radius)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                ✓ In Stock ({product.stock} available)
              </div>
            ) : product.stock > 0 ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#f59e0b20",
                  color: "#f59e0b",
                  borderRadius: "var(--radius)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                ⚠️ Low Stock - Only {product.stock} left!
              </div>
            ) : (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#ef444420",
                  color: "#ef4444",
                  borderRadius: "var(--radius)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                ✕ Out of Stock
              </div>
            )}
          </div>

          <p
            style={{
              fontSize: "1.125rem",
              color: "hsl(var(--muted-foreground))",
              lineHeight: 1.6,
              marginBottom: "2.5rem",
            }}
          >
            {product.description}
          </p>

          {product.stock > 0 ? (
            <AddToCartButton
              product={{
                ...product,
                specs: product.specs as Record<string, string>,
                categoryId: product.categoryId,
                category: product.category,
              }}
            />
          ) : (
            <div
              style={{
                padding: "0.875rem 2rem",
                backgroundColor: "hsl(var(--muted))",
                color: "hsl(var(--muted-foreground))",
                borderRadius: "var(--radius)",
                fontSize: "1rem",
                fontWeight: 600,
                textAlign: "center",
                marginBottom: "2rem",
              }}
            >
              Currently Unavailable
            </div>
          )}

          <div
            style={{
              borderTop: "1px solid hsl(var(--border))",
              paddingTop: "2rem",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              Specifications
            </h3>
            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "1rem",
              }}
            >
              {product.specs &&
                Object.entries(product.specs as Record<string, string>).map(
                  ([key, value]) => (
                    <React.Fragment key={key}>
                      <dt style={{ color: "hsl(var(--muted-foreground))" }}>
                        {key}
                      </dt>
                      <dd style={{ fontWeight: 500 }}>{value}</dd>
                    </React.Fragment>
                  ),
                )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
