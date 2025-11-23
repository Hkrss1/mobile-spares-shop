"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MapPin,
  Factory,
  ArrowDownToLine,
  History,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Manage Inventory", href: "/admin/inventory", icon: Package },
  { name: "Manage Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "View Users", href: "/admin/users", icon: Users },
  { name: "Locations", href: "/admin/locations", icon: MapPin },
  { name: "Suppliers", href: "/admin/suppliers", icon: Factory },
  { name: "Inward Entry", href: "/admin/inventory/inward", icon: ArrowDownToLine },
  { name: "History", href: "/admin/inventory/transaction", icon: History },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: isCollapsed ? "64px" : "280px",
          backgroundColor: "#000000", // Black background
          color: "#ffffff", // White text
          borderRight: "1px solid var(--sidebar-border)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          transition: "width 0.3s ease",
          zIndex: 50,
        }}
      >
        <div
          style={{
            padding: isCollapsed ? "1.5rem 0.5rem" : "1.5rem",
            borderBottom: "1px solid #333",
            display: "flex",
            justifyContent: isCollapsed ? "center" : "space-between",
            alignItems: "center",
          }}
        >
          {!isCollapsed && (
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#ffffff" }}>
              Admin Panel
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: "transparent",
              border: "none",
              color: "#ffffff",
              cursor: "pointer",
              padding: "0.25rem",
            }}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav style={{ flex: 1, padding: "1rem 0.5rem" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={isCollapsed ? item.name : ""}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: isCollapsed ? "center" : "flex-start",
                      gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      textDecoration: "none",
                      color: isActive ? "#000000" : "#ffffff", // Black text on active, white otherwise
                      backgroundColor: isActive ? "#ffffff" : "transparent", // White bg on active
                      transition: "all 0.2s",
                    }}
                  >
                    <item.icon size={20} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ padding: "1rem", borderTop: "1px solid #333" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "flex-start",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "50%",
                backgroundColor: "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Users size={20} />
            </div>
            {!isCollapsed && (
              <div style={{ overflow: "hidden" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#ffffff" }}>Admin</p>
                <p style={{ fontSize: "0.75rem", color: "#9ca3af", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>admin@example.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          marginLeft: isCollapsed ? "64px" : "280px",
          padding: "2rem",
          paddingTop: "80px", // Account for fixed navbar height
          maxWidth: "100%",
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
