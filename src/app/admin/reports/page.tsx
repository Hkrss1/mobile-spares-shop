"use client";

import { useState, useEffect } from "react";

interface ReportData {
  totalStockValue: number;
  monthlyInwards: number;
  monthlyOutwards: number;
  lowStockItems: {
    id: string;
    name: string;
    quantity: number;
  }[];
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load reports", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading Dashboard...</div>;
  if (!data) return <div className="p-6">Failed to load data.</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: "4rem 1rem" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "2rem" }}>
        Smart Inventory Dashboard
      </h1>

      {/* Key Metrics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "1.5rem",
            borderLeft: "4px solid #3b82f6",
          }}
        >
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--muted-foreground)",
            }}
          >
            Total Stock Value
          </h3>
          <p style={{ fontSize: "2rem", fontWeight: 700, marginTop: "0.5rem" }}>
            ₹{data.totalStockValue.toLocaleString()}
          </p>
        </div>
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "1.5rem",
            borderLeft: "4px solid #10b981",
          }}
        >
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--muted-foreground)",
            }}
          >
            Monthly Inwards (Qty)
          </h3>
          <p style={{ fontSize: "2rem", fontWeight: 700, marginTop: "0.5rem" }}>
            {data.monthlyInwards}
          </p>
        </div>
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "1.5rem",
            borderLeft: "4px solid #f97316",
          }}
        >
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--muted-foreground)",
            }}
          >
            Monthly Outwards (Qty)
          </h3>
          <p style={{ fontSize: "2rem", fontWeight: 700, marginTop: "0.5rem" }}>
            {data.monthlyOutwards}
          </p>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div
        style={{
          backgroundColor: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--border)",
            backgroundColor: "#fef2f2",
          }}
        >
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#991b1b",
            }}
          >
            Low Stock Alerts
          </h3>
        </div>
        <div style={{ padding: "1.5rem" }}>
          {data.lowStockItems.length === 0 ? (
            <p style={{ color: "var(--muted-foreground)" }}>
              All stock levels are healthy.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
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
                      Current Stock
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
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.lowStockItems.map((item) => (
                    <tr
                      key={item.id}
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <td
                        style={{
                          padding: "1rem",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        }}
                      >
                        {item.name}
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          fontSize: "0.875rem",
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            backgroundColor: "#fee2e2",
                            color: "#991b1b",
                          }}
                        >
                          Critical
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
