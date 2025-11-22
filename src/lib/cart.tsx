"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Product } from "./products";
import Toast from "@/components/Toast";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("mss_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Validate that items have new schema (category is object)
        const isValid =
          Array.isArray(parsedCart) &&
          parsedCart.every(
            (item) =>
              item.category &&
              typeof item.category === "object" &&
              "name" in item.category,
          );

        if (isValid) {
          setItems(parsedCart as CartItem[]);
        } else {
          console.warn("Old cart format detected, clearing cart");
          localStorage.removeItem("mss_cart");
        }
      } catch (error) {
        console.error("Failed to parse cart data:", error);
        localStorage.removeItem("mss_cart");
      }
    }
  }, []);

  // Debounced save to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("mss_cart", JSON.stringify(items));
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [items]);

  const addItem = useCallback((product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Check if we can add more (stock limit)
        if (existingItem.quantity >= product.stock) {
          setToastMessage(`Cannot add more! Only ${product.stock} in stock.`);
          return currentItems; // Don't add more
        }
        setToastMessage(`${product.name} quantity increased!`);
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      // Check stock before adding new item
      if (product.stock < 1) {
        setToastMessage(`${product.name} is out of stock!`);
        return currentItems;
      }

      setToastMessage(`${product.name} added to cart!`);
      return [...currentItems, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(productId);
        return;
      }

      setItems((currentItems) => {
        const item = currentItems.find((i) => i.id === productId);
        if (!item) return currentItems;

        // Check stock limit
        if (quantity > item.stock) {
          setToastMessage(`Cannot add more! Only ${item.stock} in stock.`);
          return currentItems; // Don't update
        }

        return currentItems.map((i) =>
          i.id === productId ? { ...i, quantity } : i,
        );
      });
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Memoize expensive calculations
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const contextValue = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      count,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, total, count],
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
