"use client";

import React from "react";
import { useOrders } from "@/lib/orders";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { Package, Truck, CheckCircle, XCircle, Clock, ArrowRight, MapPin, Calendar } from "lucide-react";

export default function OrdersPage() {
  const { getUserOrders, cancelOrder } = useOrders();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-secondary/30 rounded-full flex items-center justify-center mb-6">
          <Package size={40} className="text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Please Login</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          You need to be logged in to view your order history.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/25"
        >
          Go to Login <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const userOrders = getUserOrders(user.mobile);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "processing":
        return { color: "text-amber-500", bg: "bg-amber-500/10", icon: Clock, label: "Processing" };
      case "in-transit":
        return { color: "text-blue-500", bg: "bg-blue-500/10", icon: Truck, label: "In Transit" };
      case "delivered":
        return { color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle, label: "Delivered" };
      case "cancelled":
        return { color: "text-red-500", bg: "bg-red-500/10", icon: XCircle, label: "Cancelled" };
      default:
        return { color: "text-gray-500", bg: "bg-gray-500/10", icon: Package, label: status };
    }
  };

  const handleCancel = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      cancelOrder(orderId, "user");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          My Orders
          <span className="text-lg font-normal text-muted-foreground bg-secondary/50 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50">
            {userOrders.length} orders
          </span>
        </h1>

        {userOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card/40 backdrop-blur-md border border-white/10 rounded-3xl">
            <div className="w-24 h-24 bg-secondary/30 rounded-full flex items-center justify-center mb-6">
              <Package size={48} className="text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              You haven&apos;t placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/25"
            >
              Start Shopping <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => {
              const status = getStatusConfig(order.status);
              const StatusIcon = status.icon;

              return (
                <div
                  key={order.id}
                  className="group bg-card/40 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-white/10 flex flex-wrap gap-4 justify-between items-center bg-secondary/20">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${status.bg} ${status.color}`}>
                        <StatusIcon size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Order #{order.orderNumber}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar size={14} />
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${status.bg} ${status.color} border-current/20`}>
                      {status.label}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-secondary/30 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold whitespace-nowrap">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin size={16} />
                        <span>Delivery to: {order.customerMobile}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground block">Total Amount</span>
                          <span className="text-xl font-bold text-primary">₹{order.total.toFixed(2)}</span>
                        </div>

                        {order.status === "processing" && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm font-medium transition-colors"
                          >
                            Cancel Order
                          </button>
                        )}

                        {order.trackingLink && (
                          <a
                            href={order.trackingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 flex items-center gap-2"
                          >
                            Track Order <ArrowRight size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
