import ProductGrid from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = [];

  try {
    products = await prisma.product.findMany();
  } catch (error) {
    console.error('Failed to fetch products:', error);
    // Return empty array if database is not available
    products = [];
  }

  // Cast specs to match Product interface
  const formattedProducts = products.map(p => ({
    ...p,
    specs: p.specs as Record<string, string>
  }));

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        padding: 'clamp(4rem, 10vw, 6rem) 0',
        textAlign: 'center',
        background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.15) 0%, transparent 70%)'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '1.5rem',
            lineHeight: 1.1
          }}>
            Premium Parts for <br />
            <span style={{
              background: 'linear-gradient(to right, hsl(var(--primary)), #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Professional Repairs
            </span>
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'hsl(var(--muted-foreground))',
            maxWidth: '600px',
            margin: '0 auto 2.5rem'
          }}>
            High-quality displays, batteries, and components for all major smartphone brands.
            Restoring devices to their original glory.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#products" className="btn btn-primary">Shop Now</a>
            <a href="/about" className="btn btn-outline">Learn More</a>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Featured Products</h2>
              <p style={{ color: 'hsl(var(--muted-foreground))' }}>Top-rated components for popular devices</p>
            </div>
            <a href="/products" style={{ color: 'hsl(var(--primary))', fontWeight: 500 }}>View All &rarr;</a>
          </div>

          <ProductGrid products={formattedProducts} />
        </div>
      </section>
    </div>
  );
}
