"use client";

import { useEffect, useState } from "react";

export interface Brand {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  categoryId: string;
  brand?: Brand | null;
  brandId?: string | null;
  image: string;
  description: string;
  specs: Record<string, string>;
  stock: number;
}

// Hook to fetch products from API
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, isLoading };
}

// Helper to add product (Admin)
export async function addProduct(productData: Omit<Product, "id">) {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  return res.json();
}

// Helper to update product (Admin)
export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, "id">>,
) {
  const res = await fetch(`/api/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    throw new Error("Failed to update product");
  }
  return res.json();
}
