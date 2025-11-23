"use client";

import React from "react";
import { useProducts } from "@/lib/products";
import { useOrders } from "@/lib/orders";
import Link from "next/link";
import {
  Banknote,
  Package,
  Smartphone,
  Users,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Gem,
  ArrowRight,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, subtitle, color, icon }: StatCardProps) => (
  <div
    style={{
      backgroundColor: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
      }}
    >
      <div>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--muted-foreground)",
            marginBottom: "0.5rem",
          }}
        >
          {title}
        </p>
        <h3 style={{ fontSize: "2rem", fontWeight: 700, color }}>{value}</h3>
        {subtitle && (
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--muted-foreground)",
              marginTop: "0.25rem",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      <span style={{ color: color }}>{icon}</span>
    </div>
  </div>
);

export default function AdminDashboard() {
  const { orders } = useOrders();
  const { products } = useProducts();

  // Calculate statistics
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.stock > 0).length;
  const lowStockProducts = products.filter(
    (p) => p.stock > 0 && p.stock <= 10,
  ).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0,
  );

  // Order statistics
  const totalOrders = orders.length;
  const processingOrders = orders.filter(
    (o) => o.status === "processing",
  ).length;
  const inTransitOrders = orders.filter(
    (o) => o.status === "in-transit",
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // User statistics
  const users = JSON.parse(localStorage.getItem("mss_users") || "[]");
  const totalUsers = users.length;
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "hsl(var(--foreground))" }}>
          Dashboard Overview
        </h1>
        <p style={{ color: "hsl(var(--muted-foreground))", marginTop: "0.5rem" }}>
          Welcome back! Here's what's happening with your store today.
        </p>
      </header>

      {/* Overview Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toFixed(2)}`}
          subtitle={`From ${totalOrders} orders`}
          color="#10b981"
          icon={<Banknote size={32} />}
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          subtitle={`${processingOrders} processing`}
          color="#3b82f6"
          icon={<Package size={32} />}
        />
        <StatCard
          title="Total Products"
          value={totalProducts}
          subtitle={`${inStockProducts} in stock`}
          color="#8b5cf6"
          icon={<Smartphone size={32} />}
        />
        <StatCard
          title="Registered Users"
          value={totalUsers}
          subtitle="Total customers"
          color="#f59e0b"
          icon={<Users size={32} />}
        />
      </div>

      {/* Inventory Overview */}
      <div style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
            color: "hsl(var(--foreground))",
          }}
        >
          Inventory Status
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>In Stock</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#10b981" }}>
                {inStockProducts}
              </p>
            </div>
            <CheckCircle size={24} color="#10b981" />
          </div>
          <div
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Low Stock</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f59e0b" }}>
                {lowStockProducts}
              </p>
            </div>
            <AlertTriangle size={24} color="#f59e0b" />
          </div>
          <div
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Out of Stock</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#ef4444" }}>
                {outOfStockProducts}
              </p>
            </div>
            <XCircle size={24} color="#ef4444" />
          </div>
          <div
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Value</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#8b5cf6" }}>
                ₹{totalInventoryValue.toFixed(0)}
              </p>
            </div>
            <Gem size={24} color="#8b5cf6" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "hsl(var(--foreground))" }}>
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            style={{
              fontSize: "0.875rem",
              color: "#2563eb",
              fontWeight: 500,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            View All Orders <ArrowRight size={16} />
          </Link>
        </div>
        <div
          style={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            overflow: "hidden",
          }}
        >
          {recentOrders.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border)",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Order #
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Customer
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Total
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#6b7280",
                      textTransform: "uppercase",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td style={{ padding: "1rem", fontSize: "0.875rem", fontWeight: 500 }}>
                      {order.orderNumber}
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem" }}>
                      {order.customerName}
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 600, fontSize: "0.875rem" }}>
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          backgroundColor:
                            order.status === "delivered"
                              ? "#d1fae5"
                              : order.status === "in-transit"
                                ? "#dbeafe"
                                : "#fef3c7",
                          color:
                            order.status === "delivered"
                              ? "#059669"
                              : order.status === "in-transit"
                                ? "#2563eb"
                                : "#d97706",
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p
              style={{
                padding: "3rem",
                textAlign: "center",
                color: "#6b7280",
              }}
            >
              No orders yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
