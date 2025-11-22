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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Smart Inventory Dashboard</h1>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium">
            Total Stock Value
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ₹{data.totalStockValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium">
            Monthly Inwards (Qty)
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {data.monthlyInwards}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <h3 className="text-gray-500 text-sm font-medium">
            Monthly Outwards (Qty)
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {data.monthlyOutwards}
          </p>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
          <h3 className="text-lg font-semibold text-red-800">
            Low Stock Alerts
          </h3>
        </div>
        <div className="p-6">
          {data.lowStockItems.length === 0 ? (
            <p className="text-gray-500">All stock levels are healthy.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.lowStockItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Critical
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
