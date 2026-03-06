'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Truck, Shield, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import ProductGrid from '@/components/product/ProductGrid';

const categories = [
  { name: 'Electronics', icon: '⚡', gradient: 'from-blue-600 to-cyan-500' },
  { name: 'Clothing', icon: '👕', gradient: 'from-pink-500 to-rose-400' },
  { name: 'Books', icon: '📚', gradient: 'from-emerald-600 to-teal-400' },
  { name: 'Home & Garden', icon: '🏡', gradient: 'from-amber-500 to-orange-400' },
];

const values = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
  { icon: Shield, title: 'Secure Payments', desc: 'SSL encrypted checkout' },
  { icon: RefreshCw, title: '30-Day Returns', desc: 'No questions asked' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await api.get('/api/products?limit=8');
      if (data) {
        const payload = data.data || data;
        setProducts(payload.products || []);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-gray-900 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-[1.1] tracking-tight">
              Everything you need,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric to-cyan-400">
                delivered fast
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-400 leading-relaxed max-w-lg">
              Discover curated products with premium quality and lightning-fast delivery. Your next favorite thing is one click away.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center mt-8 px-8 py-3.5 bg-electric hover:bg-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-display font-bold text-white mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative overflow-hidden rounded-xl p-6 bg-gray-800/50 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-0.5"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <span className="text-3xl">{cat.icon}</span>
              <h3 className="mt-3 text-sm font-semibold text-white">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold text-white">Featured Products</h2>
          <Link href="/products" className="text-sm text-electric hover:text-blue-400 transition-colors">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl border border-white/5 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-700/50" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-700/50 rounded w-3/4" />
                  <div className="h-4 bg-gray-700/50 rounded w-1/2" />
                  <div className="h-10 bg-gray-700/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>

      {/* Value Props */}
      <section className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-electric/10 text-electric flex-shrink-0">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
