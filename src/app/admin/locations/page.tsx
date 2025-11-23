"use client";

import { useState, useEffect } from "react";

interface Location {
  id: string;
  name: string;
  address: string | null;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    try {
      const res = await fetch("/api/admin/locations");
      if (res.ok) {
        const data = await res.json();
        setLocations(data);
      }
    } catch (error) {
      console.error("Failed to fetch locations", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          name: "",
          address: "",
        });
        fetchLocations();
      } else {
        alert("Failed to create location");
      }
    } catch (error) {
      console.error("Error creating location", error);
    }
  }

  return (
    <div className="container animate-fade-in" style={{ padding: "4rem 1rem" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "2rem" }}>
        Location (Godown) Management
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* Create Location Form */}
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
            Add New Location
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
                placeholder="e.g. Main Warehouse"
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
              Add Location
            </button>
          </form>
        </div>

        {/* Locations List */}
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
            Existing Locations
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
                      Address
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location) => (
                    <tr
                      key={location.id}
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <td style={{ padding: "1rem" }}>
                        <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                          {location.name}
                        </div>
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          {location.address}
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
