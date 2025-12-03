"use client";

import React from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useOrders } from "@/lib/orders";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, Truck, MapPin, XCircle, ChevronLeft } from "lucide-react";

interface Address {
  id?: string;
  name: string;
  mobile: string;
  pincode: string;
  locality: string;
  address: string;
  city: string;
  state: string;
  landmark?: string;
  alternateMobile?: string;
  type: "HOME" | "WORK";
  isDefault?: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { user, logout } = useAuth();
  const { createOrder } = useOrders();
  const router = useRouter();

  const [view, setView] = React.useState<'CART' | 'CHECKOUT'>('CART');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [savedAddresses, setSavedAddresses] = React.useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = React.useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = React.useState(false);
  const [isAddressLocked, setIsAddressLocked] = React.useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = React.useState<{ date: string; courier: string } | null>(null);
  const [isLocating, setIsLocating] = React.useState(false);

  const [newAddress, setNewAddress] = React.useState<Address>({
    name: "",
    mobile: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    alternateMobile: "",
    type: "HOME",
  });

  const lookupPincode = React.useCallback(async (code: string) => {
    if (code.length !== 6) return;

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
      const data = await res.json();

      if (data && data[0].Status === "Success") {
        const details = data[0].PostOffice[0];
        setNewAddress((prev) => ({
          ...prev,
          city: details.District,
          state: details.State,
          locality: details.Name, // Auto-fill locality with PO Name as a suggestion
          pincode: code
        }));
      }
    } catch (error) {
      console.error("Failed to lookup pincode", error);
    }
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(`/api/user/addresses?mobile=${user?.mobile}`);

      if (res.status === 404) {
        alert("Session expired or user not found. Please login again.");
        logout();
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setSavedAddresses(data);
        if (data.length > 0) {
          // If we have saved addresses, select the default one but DON'T lock it yet
          // unless the user explicitly confirms. 
          // Actually, let's auto-select default but keep unlocked so they can see/change it.
          const defaultAddr = data.find((a: any) => a.isDefault) || data[0];
          setSelectedAddress(defaultAddr);
        } else {
          setShowAddressForm(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    }
  };

  const detectLocation = React.useCallback(() => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setNewAddress((prev) => ({
            ...prev,
            pincode: data.address.postcode || "",
            locality: data.address.suburb || data.address.neighbourhood || "",
            city: data.address.city || data.address.town || data.address.village || "",
            state: data.address.state || "",
            address: data.display_name, // Full address as fallback
          }));
        } catch (error) {
          alert("Failed to fetch location details");
        } finally {
          setIsLocating(false);
        }
      }, () => {
        alert("Location access denied");
        setIsLocating(false);
      });
    } else {
      alert("Geolocation is not supported by your browser");
    }
  }, []);

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddress(addr);
    setIsAddressLocked(true);
  };

  const saveAddress = React.useCallback(async () => {
    if (!newAddress.name || !newAddress.mobile || !newAddress.pincode || !newAddress.address) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: user?.mobile,
          addressMobile: newAddress.mobile,
          ...(() => {
            const { mobile, ...rest } = newAddress;
            return rest;
          })(),
          isDefault: savedAddresses.length === 0,
        }),
      });

      if (res.status === 404) {
        alert("Session expired or user not found. Please login again.");
        logout();
        return;
      }

      if (res.ok) {
        const saved = await res.json();
        setSavedAddresses([saved, ...savedAddresses]);
        setSelectedAddress(saved);
        setIsAddressLocked(true);
        setShowAddressForm(false);
        setNewAddress({
          name: "",
          mobile: "",
          pincode: "",
          locality: "",
          address: "",
          city: "",
          state: "",
          landmark: "",
          alternateMobile: "",
          type: "HOME",
        });
      }
    } catch (error) {
      alert("Failed to save address");
    }
  }, [newAddress, user?.mobile, savedAddresses, logout]);

  const fetchDeliveryEstimate = React.useCallback(async (pincode: string) => {
    setDeliveryEstimate(null);
    try {
      const res = await fetch(`/api/delivery/serviceability?pincode=${pincode}`);
      if (res.ok) {
        const data = await res.json();
        if (data.estimated_delivery_date) {
          setDeliveryEstimate({
            date: new Date(data.estimated_delivery_date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }),
            courier: data.courier_name
          });
        } else {
          const days = pincode.startsWith("11") ? 2 : 5;
          const date = new Date();
          date.setDate(date.getDate() + days);
          setDeliveryEstimate({
            date: date.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' }),
            courier: "Standard Delivery"
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch delivery estimate");
    }
  }, []);

  const handlePlaceOrderClick = () => {
    if (!user) {
      alert("Please login to place an order");
      router.push("/login");
      return;
    }
    setView('CHECKOUT');
  };

  const handlePayment = React.useCallback(async () => {
    if (!user) {
      alert("Please login to place an order");
      router.push("/login");
      return;
    }

    if (!selectedAddress) {
      alert("Please select or add a delivery address");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Order on Razorpay
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to initiate payment");
        setIsProcessing(false);
        return;
      }

      const order = await res.json();

      // 2. Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Mobile Spares Shop",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response: any) {
          // 3. On Success, Create Order in Backend
          const orderItems = items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          }));

          const newOrder = await createOrder(
            user.name,
            user.mobile,
            selectedAddress,
            orderItems,
            total,
            response // Pass payment details
          );

          if (newOrder) {
            clearCart();
            router.push(`/orders/${newOrder.id}`);
          } else {
            alert("Payment successful but order creation failed. Please contact support.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user.name,
          contact: user.mobile,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response: any) {
        alert(response.error.description);
        setIsProcessing(false);
      });
      rzp1.open();
    } catch (error) {
      console.error("Payment Error:", error);
      console.error("Error details:", {
        razorpayAvailable: typeof window.Razorpay !== 'undefined',
        razorpayKeyDefined: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      alert(`Payment initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}. Check console for details.`);
      setIsProcessing(false);
    }
  }, [user, selectedAddress, total, items, createOrder, clearCart, router]);

  React.useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  React.useEffect(() => {
    if (selectedAddress?.pincode) {
      fetchDeliveryEstimate(selectedAddress.pincode);
    }
  }, [selectedAddress]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
        <p className="text-muted-foreground">Please wait while we confirm your order...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-secondary/30 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Looks like you haven&apos;t added any parts yet. Browse our catalog to find high-quality spares for your devices.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-white/10"
          style={{ backgroundColor: "#ffffff", color: "#000000" }}
        >
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {view === 'CHECKOUT' && (
            <button onClick={() => setView('CART')} className="p-2 hover:bg-secondary rounded-full transition-colors">
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className="text-3xl font-bold flex items-center gap-3">
            {view === 'CART' ? 'Shopping Cart' : 'Checkout'}
            <span className="text-lg font-normal text-muted-foreground bg-secondary/50 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50">
              {items.length} items
            </span>
          </h1>
        </div>

        {/* Deliver To Bar (Only in Cart View and if User has address) */}
        {view === 'CART' && user && selectedAddress && (
          <div className="bg-card border border-border rounded-xl p-4 mb-6 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <MapPin className="text-primary" size={20} />
              <div>
                <p className="text-sm text-muted-foreground">Deliver to: <span className="font-bold text-foreground">{selectedAddress.name}, {selectedAddress.pincode}</span> <span className="text-xs bg-secondary px-2 py-0.5 rounded uppercase ml-2">{selectedAddress.type}</span></p>
                <p className="text-xs text-muted-foreground truncate max-w-md">{selectedAddress.address}, {selectedAddress.locality}, {selectedAddress.city}</p>
              </div>
            </div>
            <button
              onClick={() => setView('CHECKOUT')}
              className="text-primary font-bold text-sm border border-border px-4 py-2 rounded hover:bg-secondary transition-colors"
            >
              Change
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-4">

            {/* VIEW: CART */}
            {view === 'CART' && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 border-b border-border last:border-0">
                      <div className="relative w-24 h-24 bg-secondary/30 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Category: {item.category.name}</p>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-border rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-secondary transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-secondary transition-colors"
                                disabled={item.quantity >= item.stock}
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-sm font-bold text-red-500 hover:text-red-600 uppercase">Remove</button>
                          </div>

                          <div className="flex flex-col items-end">
                            <span className="font-bold text-xl">₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Delivery Estimate for Item */}
                        <div className="mt-3 text-xs text-green-600 flex items-center gap-1">
                          <Truck size={14} />
                          <span>
                            {deliveryEstimate ? `Delivery by ${deliveryEstimate.date}` : "Calculating delivery..."}
                            {deliveryEstimate?.courier && ` | ${deliveryEstimate.courier}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW: CHECKOUT */}
            {view === 'CHECKOUT' && (
              <>
                {/* 1. LOGIN SECTION */}
                <div className="bg-card border border-border rounded-xl p-4 flex justify-between items-center">
                  <div className="flex gap-4">
                    <span className="bg-muted text-muted-foreground w-6 h-6 flex items-center justify-center text-xs font-bold rounded-sm">1</span>
                    <div>
                      <h3 className="font-bold text-muted-foreground text-sm uppercase">Login</h3>
                      {user && <p className="text-sm font-bold text-foreground mt-1">{user.name} <span className="ml-2 text-muted-foreground">{user.mobile}</span></p>}
                    </div>
                  </div>
                  <button className="text-primary font-bold text-sm uppercase border border-border px-4 py-2 rounded hover:bg-secondary transition-colors">Change</button>
                </div>

                {/* 2. DELIVERY ADDRESS SECTION */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className={`p-4 flex justify-between items-center ${isAddressLocked ? 'bg-primary text-primary-foreground' : 'bg-primary/5'}`}>
                    <div className="flex gap-4 items-center">
                      <span className="bg-background text-primary w-6 h-6 flex items-center justify-center text-xs font-bold rounded-sm">2</span>
                      <h3 className="font-bold text-sm uppercase">Delivery Address</h3>
                    </div>
                    {isAddressLocked && (
                      <button
                        onClick={() => setIsAddressLocked(false)}
                        className="text-primary-foreground font-bold text-sm uppercase border border-primary-foreground/20 px-4 py-2 rounded hover:bg-primary-foreground/10 transition-colors"
                      >
                        Change
                      </button>
                    )}
                  </div>

                  {!isAddressLocked ? (
                    <div className="p-4">
                      {/* Address List */}
                      <div className="space-y-4 mb-4">
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress?.id === addr.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                              }`}
                            onClick={() => setSelectedAddress(addr)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedAddress?.id === addr.id ? "border-primary" : "border-muted-foreground"
                                }`}>
                                {selectedAddress?.id === addr.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold">{addr.name}</span>
                                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-secondary text-secondary-foreground uppercase">
                                    {addr.type}
                                  </span>
                                  <span className="text-sm font-bold text-foreground ml-2">{addr.mobile}</span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {addr.address}, {addr.locality}, {addr.city}, {addr.state} - <span className="font-semibold text-foreground">{addr.pincode}</span>
                                </p>
                                {selectedAddress?.id === addr.id && (
                                  <button
                                    onClick={() => handleSelectAddress(addr)}
                                    className="mt-3 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-primary/25 hover:opacity-90 transition-all"
                                  >
                                    DELIVER HERE
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add New Address Button & Form */}
                      {!showAddressForm ? (
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="w-full py-3 border-2 border-primary/20 text-primary font-bold rounded-xl hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={18} /> Add New Address
                        </button>
                      ) : (
                        <div className="bg-card border border-border rounded-xl p-4 animate-in slide-in-from-top-2">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-blue-500 uppercase text-sm">Add New Address</h4>
                            <button onClick={() => setShowAddressForm(false)} className="text-muted-foreground hover:text-foreground">
                              <XCircle size={20} />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <button
                              onClick={detectLocation}
                              type="button"
                              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-md"
                            >
                              <MapPin size={18} /> Use my current location
                            </button>

                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="Name"
                                className="p-3 bg-secondary/30 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
                                value={newAddress.name}
                                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                              />
                              <input
                                type="tel"
                                placeholder="10-digit mobile number"
                                maxLength={10}
                                className="p-3 bg-secondary/30 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
                                value={newAddress.mobile}
                                onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="Pincode"
                                maxLength={6}
                                className="p-3 bg-secondary/30 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
                                value={newAddress.pincode}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, '');
                                  setNewAddress({ ...newAddress, pincode: val });
                                  if (val.length === 6) lookupPincode(val);
                                }}
                              />
                              <input
                                type="text"
                                placeholder="Locality"
                                className="p-3 bg-secondary/30 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
                                value={newAddress.locality}
                                onChange={(e) => setNewAddress({ ...newAddress, locality: e.target.value })}
                              />
                            </div>

                            <textarea
                              placeholder="Address (Area and Street)"
                              className="w-full p-3 bg-secondary/30 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors resize-none h-20"
                              value={newAddress.address}
                              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="City/District/Town"
                                className="p-3 bg-secondary/30 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
                                value={newAddress.city}
                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              />
                              <input
                                type="text"
                                placeholder="State"
                                className="p-3 bg-secondary/30 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
                                value={newAddress.state}
                                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="Landmark (Optional)"
                                className="p-3 bg-secondary/30 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
                                value={newAddress.landmark}
                                onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                              />
                              <input
                                type="tel"
                                placeholder="Alt Phone (Optional)"
                                className="p-3 bg-secondary/30 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
                                value={newAddress.alternateMobile}
                                onChange={(e) => setNewAddress({ ...newAddress, alternateMobile: e.target.value })}
                              />
                            </div>

                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="addressType"
                                  checked={newAddress.type === "HOME"}
                                  onChange={() => setNewAddress({ ...newAddress, type: "HOME" })}
                                  className="accent-primary"
                                />
                                <span className="text-sm font-medium">Home</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="addressType"
                                  checked={newAddress.type === "WORK"}
                                  onChange={() => setNewAddress({ ...newAddress, type: "WORK" })}
                                  className="accent-primary"
                                />
                                <span className="text-sm font-medium">Work</span>
                              </label>
                            </div>

                            <div className="flex gap-3 pt-2">
                              <button
                                onClick={saveAddress}
                                className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-bold shadow-lg shadow-primary/25 hover:opacity-90 transition-all"
                              >
                                SAVE AND DELIVER HERE
                              </button>
                              <button
                                onClick={() => setShowAddressForm(false)}
                                className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors"
                              >
                                CANCEL
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold">{selectedAddress?.name}</span>
                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-secondary text-secondary-foreground uppercase">
                              {selectedAddress?.type}
                            </span>
                            <span className="text-sm font-bold text-foreground ml-2">{selectedAddress?.mobile}</span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {selectedAddress?.address}, {selectedAddress?.locality}, {selectedAddress?.city}, {selectedAddress?.state} - <span className="font-semibold text-foreground">{selectedAddress?.pincode}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. ORDER SUMMARY SECTION */}
                {isAddressLocked && (
                  <div className="bg-card border border-border rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-primary text-primary-foreground p-4 flex gap-4 items-center">
                      <span className="bg-background text-primary w-6 h-6 flex items-center justify-center text-xs font-bold rounded-sm">3</span>
                      <h3 className="font-bold text-sm uppercase">Order Summary</h3>
                    </div>
                    <div className="p-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4 py-4 border-b border-border last:border-0">
                          <div className="relative w-20 h-20 bg-secondary/30 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                            <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground line-clamp-2">{item.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">Category: {item.category.name}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            </div>
                            {/* Delivery Estimate for Item */}
                            <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                              <Truck size={12} />
                              <span>
                                {deliveryEstimate ? `Delivery by ${deliveryEstimate.date}` : "Calculating delivery..."}
                                {deliveryEstimate?.courier && ` | ${deliveryEstimate.courier}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT COLUMN: Price Details */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h3 className="font-bold text-muted-foreground uppercase text-sm mb-4 border-b border-border pb-4">Price Details</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price ({items.length} items)</span>
                  <span className="font-medium">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Charges</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
              </div>
              <div className="border-t border-dashed border-border pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total Payable</span>
                  <span className="font-bold text-lg">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {view === 'CART' ? (
                <button
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  onClick={handlePlaceOrderClick}
                >
                  Place Order <ArrowRight size={20} />
                </button>
              ) : (
                isAddressLocked ? (
                  <button
                    className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Proceed to Pay"} <ArrowRight size={20} />
                  </button>
                ) : (
                  <button disabled className="w-full bg-muted text-muted-foreground py-4 rounded-xl font-bold text-lg cursor-not-allowed">
                    Select Address to Proceed
                  </button>
                )
              )}

              <div className="mt-6 flex items-start gap-3 p-3 bg-secondary/30 rounded-lg text-xs text-muted-foreground">
                <ShieldCheck className="text-primary flex-shrink-0" size={16} />
                <p>Safe and Secure Payments. Easy returns. 100% Authentic products.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
