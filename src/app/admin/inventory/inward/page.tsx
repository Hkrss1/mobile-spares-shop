"use client";

import { useState, useEffect } from "react";

interface Supplier {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
}

export default function InwardEntryPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState({
    supplierId: "",
    locationId: "",
    productId: "",
    quantity: "",
    notes: "",
  });

  useEffect(() => {
    // Fetch dependencies
    Promise.all([
      fetch("/api/admin/suppliers").then((res) => res.json()),
      fetch("/api/admin/locations").then((res) => res.json()),
      fetch("/api/products").then((res) => res.json()), // Assuming this exists
    ]).then(([suppliersData, locationsData, productsData]) => {
      setSuppliers(suppliersData);
      setLocations(locationsData);
      setProducts(productsData);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Get user ID from local storage (mock implementation)
      const user = JSON.parse(localStorage.getItem("mss_user") || "{}");
      const performedBy = user.id || "ADMIN";

      const res = await fetch("/api/admin/inventory/inward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          performedBy,
        }),
      });

      if (res.ok) {
        alert("Stock Inward Successful!");
        setFormData({
          supplierId: "",
          locationId: "",
          productId: "",
          quantity: "",
          notes: "",
        });
      } else {
        const error = await res.json();
        alert(`Failed: ${error.error}`);
      }
    } catch (error) {
      console.error("Error processing inward", error);
      alert("Error processing inward");
    }
  }

  return (
    <div
      className="container animate-fade-in"
      style={{ padding: "4rem 1rem", maxWidth: "800px", margin: "0 auto" }}
    >
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "2rem" }}>
        Stock Inward Entry
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Supplier Selection */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: 500,
              marginBottom: "0.5rem",
            }}
          >
            Supplier *
          </label>
          <select
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--input)",
              backgroundColor: "var(--background)",
              fontSize: "0.875rem",
            }}
            value={formData.supplierId}
            onChange={(e) =>
              setFormData({ ...formData, supplierId: e.target.value })
            }
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location Selection */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: 500,
              marginBottom: "0.5rem",
            }}
          >
            Location (Godown) *
          </label>
          <select
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--input)",
              backgroundColor: "var(--background)",
              fontSize: "0.875rem",
            }}
            value={formData.locationId}
            onChange={(e) =>
              setFormData({ ...formData, locationId: e.target.value })
            }
          >
            <option value="">Select Location</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Selection */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: 500,
              marginBottom: "0.5rem",
            }}
          >
            Product *
          </label>
          <select
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--input)",
              backgroundColor: "var(--background)",
              fontSize: "0.875rem",
            }}
            value={formData.productId}
            onChange={(e) =>
              setFormData({ ...formData, productId: e.target.value })
            }
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: 500,
              marginBottom: "0.5rem",
            }}
          >
            Quantity *
          </label>
          <input
            type="number"
            required
            min="1"
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--input)",
              backgroundColor: "var(--background)",
              fontSize: "0.875rem",
            }}
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
          />
        </div>

        {/* Notes */}
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: 500,
              marginBottom: "0.5rem",
            }}
          >
            Notes / Batch No.
          </label>
          <textarea
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--input)",
              backgroundColor: "var(--background)",
              fontSize: "0.875rem",
              minHeight: "100px",
            }}
            rows={3}
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{
            width: "100%",
            padding: "1rem",
            borderRadius: "var(--radius)",
            fontWeight: 600,
            cursor: "pointer",
            backgroundColor: "#10b981", // Green for inward
            borderColor: "#10b981",
            color: "white",
          }}
        >
          Process Inward
        </button>
      </form>
    </div>
  );
}
