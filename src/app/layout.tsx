import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";
import { OrderProvider } from "@/lib/orders";
import Navbar from "@/components/Navbar";

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
      <body>
        <AuthProvider>
          <OrderProvider>
            <CartProvider>
              <Navbar />
              <main style={{ minHeight: 'calc(100vh - 140px)' }}>
                {children}
              </main>

              <footer style={{ borderTop: '1px solid hsl(var(--border))', padding: '2rem 0', marginTop: '4rem' }}>
                <div className="container" style={{ textAlign: 'center', color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }}>
                  © 2025 QuikFix. All rights reserved.
                </div>
              </footer>
            </CartProvider>
          </OrderProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
