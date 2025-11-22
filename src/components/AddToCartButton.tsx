"use client";

import React from "react";
import { useCart } from "@/lib/cart";
import { Product } from "@/lib/products";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, items, updateQuantity } = useCart();

  // Find if this product is already in cart
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleIncrease = () => {
    addItem(product);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "2rem",
      }}
    >
      {quantity > 0 ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "2px solid hsl(var(--primary))",
              borderRadius: "var(--radius)",
              overflow: "hidden",
            }}
          >
            <button
              onClick={handleDecrease}
              style={{
                padding: "0.75rem 1.25rem",
                background: "hsl(var(--card))",
                border: "none",
                color: "hsl(var(--foreground))",
                cursor: "pointer",
                fontSize: "1.25rem",
                fontWeight: 700,
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "hsl(var(--primary) / 0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "hsl(var(--card))")
              }
            >
              −
            </button>
            <span
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1.125rem",
                fontWeight: 600,
                minWidth: "60px",
                textAlign: "center",
                backgroundColor: "hsl(var(--card))",
              }}
            >
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              style={{
                padding: "0.75rem 1.25rem",
                background: "hsl(var(--card))",
                border: "none",
                color: "hsl(var(--foreground))",
                cursor: "pointer",
                fontSize: "1.25rem",
                fontWeight: 700,
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "hsl(var(--primary) / 0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "hsl(var(--card))")
              }
            >
              +
            </button>
          </div>
          <span
            style={{
              fontSize: "0.875rem",
              color: "hsl(var(--muted-foreground))",
            }}
          >
            {quantity} {quantity === 1 ? "item" : "items"} in cart
          </span>
        </>
      ) : (
        <button
          onClick={handleIncrease}
          className="btn btn-primary"
          style={{
            padding: "0.875rem 2rem",
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}
