"use client";

import React, { useState } from "react";
import { useOrders, Order } from "@/lib/orders";
import Link from "next/link";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, cancelOrder } = useOrders();
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [trackingLink, setTrackingLink] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return { bg: "#f59e0b20", color: "#f59e0b" };
      case "in-transit":
        return { bg: "#3b82f620", color: "#3b82f6" };
      case "delivered":
        return { bg: "#10b98120", color: "#10b981" };
      case "cancelled":
        return { bg: "#ef444420", color: "#ef4444" };
      default:
        return { bg: "#6b728020", color: "#6b7280" };
    }
  };

  const handleCancel = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      cancelOrder(orderId, "admin");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getEstimatedDelivery = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 5); // Assume 5 days for now
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="container animate-fade-in" style={{ padding: "4rem 1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Order Management</h1>
        <Link href="/admin" className="btn btn-primary">
          Back to Inventory
        </Link>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
          <p style={{ color: "var(--muted-foreground)" }}>
            No orders yet.
          </p>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "var(--card)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            overflow: "hidden",
            overflowX: "auto", // Handle wide tables
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              minWidth: "1000px", // Ensure minimum width for readability
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border)",
                  backgroundColor: "var(--muted)",
                }}
              >
                <th style={{ padding: "1rem" }}>Order #</th>
                <th style={{ padding: "1rem" }}>Date</th>
                <th style={{ padding: "1rem" }}>Customer</th>
                <th style={{ padding: "1rem", width: "20%" }}>Address</th>
                <th style={{ padding: "1rem" }}>Items</th>
                <th style={{ padding: "1rem" }}>Total</th>
                <th style={{ padding: "1rem" }}>Status</th>
                <th style={{ padding: "1rem" }}>Est. Delivery</th>
                <th style={{ padding: "1rem" }}>Tracking</th>
                <th style={{ padding: "1rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusStyle = getStatusColor(order.status);
                return (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td style={{ padding: "1rem", fontWeight: 600 }}>
                      {order.orderNumber}
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem" }}>
                      {formatDate(order.createdAt)}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div>{order.customerName}</div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        +91 {order.customerMobile}
                      </div>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem" }}>
                      {order.shippingAddress ? (
                        <div>
                          <p style={{ fontWeight: 600 }}>{order.shippingAddress.name}</p>
                          <p style={{ color: "var(--muted-foreground)" }}>
                            {order.shippingAddress.address}, {order.shippingAddress.locality}
                          </p>
                          <p style={{ color: "var(--muted-foreground)" }}>
                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                          </p>
                        </div>
                      ) : (
                        <span style={{ color: "var(--muted-foreground)" }}>N/A</span>
                      )}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 600 }}>
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.25rem",
                        }}
                      >
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(
                              order.id,
                              e.target.value as Order["status"],
                            )
                          }
                          disabled={order.status === "cancelled"}
                          style={{
                            padding: "0.5rem",
                            borderRadius: "var(--radius)",
                            border: "1px solid var(--border)",
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 600,
                            cursor:
                              order.status === "cancelled"
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          <option value="processing">⏳ Processing</option>
                          <option value="in-transit">🚚 In Transit</option>
                          <option value="delivered">✅ Delivered</option>
                          {order.status === "cancelled" && (
                            <option value="cancelled">❌ Cancelled</option>
                          )}
                        </select>
                        {order.status === "cancelled" && (
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--muted-foreground)",
                            }}
                          >
                            By:{" "}
                            {order.cancelledBy === "admin" ? "Admin" : "User"}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem" }}>
                      {getEstimatedDelivery(order.createdAt)}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      {editingOrder === order.id ? (
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <input
                            type="text"
                            value={trackingLink}
                            onChange={(e) => setTrackingLink(e.target.value)}
                            placeholder="Tracking URL"
                            style={{
                              padding: "0.5rem",
                              borderRadius: "var(--radius)",
                              border: "1px solid var(--border)",
                              backgroundColor: "var(--background)",
                              color: "var(--foreground)",
                              width: "150px",
                            }}
                          />
                          <button
                            onClick={() => {
                              updateOrderStatus(
                                order.id,
                                order.status,
                                trackingLink,
                              );
                              setEditingOrder(null);
                              setTrackingLink("");
                            }}
                            style={{
                              padding: "0.5rem 1rem",
                              backgroundColor: "var(--primary)",
                              color: "white",
                              border: "none",
                              borderRadius: "var(--radius)",
                              cursor: "pointer",
                            }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div>
                          {order.trackingLink ? (
                            <a
                              href={order.trackingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "var(--primary)",
                                textDecoration: "underline",
                              }}
                            >
                              View Link
                            </a>
                          ) : (
                            <span
                              style={{ color: "var(--muted-foreground)" }}
                            >
                              No link
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => {
                            setEditingOrder(order.id);
                            setTrackingLink(order.trackingLink || "");
                          }}
                          disabled={order.status === "cancelled"}
                          style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "var(--secondary)",
                            border: "none",
                            borderRadius: "var(--radius)",
                            cursor:
                              order.status === "cancelled"
                                ? "not-allowed"
                                : "pointer",
                            fontSize: "0.875rem",
                            opacity: order.status === "cancelled" ? 0.5 : 1,
                          }}
                        >
                          {editingOrder === order.id
                            ? "Cancel"
                            : "Track"}
                        </button>
                        {order.status !== "cancelled" && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            style={{
                              padding: "0.5rem 1rem",
                              backgroundColor: "#ef4444",
                              color: "white",
                              border: "none",
                              borderRadius: "var(--radius)",
                              cursor: "pointer",
                              fontSize: "0.875rem",
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
