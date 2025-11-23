"use client";

import { useState, useEffect } from "react";

interface Transaction {
  id: string;
  type: string;
  quantity: number;
  product: { name: string };
  location: { name: string };
  supplier: { name: string } | null;
  order: { orderNumber: string } | null;
  createdAt: string;
  performedBy: string;
}

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/inventory/transaction")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load transactions", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container animate-fade-in" style={{ padding: "4rem 1rem" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "2rem" }}>
        Inventory Transaction History
      </h1>

      <div
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "1.5rem" }}>Loading...</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border)",
                    backgroundColor: "var(--muted)",
                  }}
                >
                  <th
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Type
                  </th>
                  <th
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Product
                  </th>
                  <th
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Qty
                  </th>
                  <th
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Location
                  </th>
                  <th
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td
                      style={{
                        padding: "1rem",
                        fontSize: "0.875rem",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          backgroundColor:
                            tx.type === "INWARD"
                              ? "#10b98120"
                              : tx.type === "OUTWARD"
                                ? "#3b82f620"
                                : "#f3f4f6",
                          color:
                            tx.type === "INWARD"
                              ? "#10b981"
                              : tx.type === "OUTWARD"
                                ? "#3b82f6"
                                : "#1f2937",
                        }}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      }}
                    >
                      {tx.product?.name}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      {tx.quantity}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        fontSize: "0.875rem",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {tx.location?.name}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        fontSize: "0.875rem",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {tx.supplier
                        ? `Supplier: ${tx.supplier.name}`
                        : tx.order
                          ? `Order: ${tx.order.orderNumber}`
                          : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
