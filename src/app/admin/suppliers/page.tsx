"use client";

import { useState, useEffect } from "react";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string | null;
  mobile: string | null;
  email: string | null;
  address: string | null;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    mobile: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    try {
      const res = await fetch("/api/admin/suppliers");
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data);
      }
    } catch (error) {
      console.error("Failed to fetch suppliers", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          name: "",
          contactPerson: "",
          mobile: "",
          email: "",
          address: "",
        });
        fetchSuppliers();
      } else {
        alert("Failed to create supplier");
      }
    } catch (error) {
      console.error("Error creating supplier", error);
    }
  }

  return (
    <div className="container animate-fade-in" style={{ padding: "4rem 1rem" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "2rem" }}>
        Supplier Management
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* Create Supplier Form */}
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "1.5rem",
            height: "fit-content",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "1.5rem",
            }}
          >
            Add New Supplier
          </h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  marginBottom: "0.5rem",
                }}
              >
                Name *
              </label>
              <input
                type="text"
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--input)",
                  backgroundColor: "var(--background)",
                  fontSize: "0.875rem",
                }}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  marginBottom: "0.5rem",
                }}
              >
                Contact Person
              </label>
              <input
                type="text"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--input)",
                  backgroundColor: "var(--background)",
                  fontSize: "0.875rem",
                }}
                value={formData.contactPerson}
                onChange={(e) =>
                  setFormData({ ...formData, contactPerson: e.target.value })
                }
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    marginBottom: "0.5rem",
                  }}
                >
                  Mobile
                </label>
                <input
                  type="text"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--input)",
                    backgroundColor: "var(--background)",
                    fontSize: "0.875rem",
                  }}
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    marginBottom: "0.5rem",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--input)",
                    backgroundColor: "var(--background)",
                    fontSize: "0.875rem",
                  }}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  marginBottom: "0.5rem",
                }}
              >
                Address
              </label>
              <textarea
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--input)",
                  backgroundColor: "var(--background)",
                  fontSize: "0.875rem",
                  minHeight: "80px",
                }}
                rows={3}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius)",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Add Supplier
            </button>
          </form>
        </div>

        {/* Suppliers List */}
        <div
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "1.5rem",
            }}
          >
            Existing Suppliers
          </h2>
          {loading ? (
            <p style={{ color: "var(--muted-foreground)" }}>Loading...</p>
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
                      Name
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
                      Contact
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
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => (
                    <tr
                      key={supplier.id}
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <td style={{ padding: "1rem" }}>
                        <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                          {supplier.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--muted-foreground)",
                            marginTop: "0.25rem",
                          }}
                        >
                          {supplier.address}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ fontSize: "0.875rem" }}>
                          {supplier.contactPerson}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          {supplier.mobile}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          {supplier.email}
                        </div>
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
