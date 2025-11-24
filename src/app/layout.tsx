import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";
import { OrderProvider } from "@/lib/orders";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import InteractiveBackground from "@/components/InteractiveBackground";

export const metadata: Metadata = {
  title: "QuikFix - Mobile Spare Parts",
  description: "Premium mobile spare parts for all your repair needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <InteractiveBackground />
        <AuthProvider>
          <OrderProvider>
            <CartProvider>
              <Navbar />
              <main style={{ flex: "1", position: "relative" }}>
                {children}
              </main>
              <div style={{ position: "relative", zIndex: 1 }}>
                <Footer />
              </div>
            </CartProvider>
          </OrderProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
