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
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Stock Inward Entry</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-6"
      >
        {/* Supplier Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Supplier *
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
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
          <label className="block text-sm font-medium text-gray-700">
            Location (Godown) *
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
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
          <label className="block text-sm font-medium text-gray-700">
            Product *
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
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
          <label className="block text-sm font-medium text-gray-700">
            Quantity *
          </label>
          <input
            type="number"
            required
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notes / Batch No.
          </label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            rows={3}
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-semibold"
        >
          Process Inward
        </button>
      </form>
    </div>
  );
}
