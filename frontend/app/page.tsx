"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/api";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import type { Product } from "@/store/cart";

async function getProducts() {
  try {
    const res = await api.get("/api/products");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#f7f5f2] min-h-screen font-sans">

      <Navbar />

      

      {/* ── HERO BANNER ── */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs sm:text-sm font-semibold text-amber-500 uppercase tracking-widest mb-2">New Arrivals</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
              Style Your <br className="hidden sm:block" />Living Space
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-md">
              Curated home décor to make every corner feel like yours.
            </p>
            <div className="mt-5 flex items-center gap-3 justify-center sm:justify-start flex-wrap">
              

<Link
  href="/products"
  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-full shadow transition-colors"
>
  Shop Now
</Link>
              <a
                href="/register"
                className="px-6 py-2.5 border border-amber-300 text-amber-600 hover:bg-amber-50 text-sm font-semibold rounded-full transition-colors"
              >
                Create Account
              </a>
            </div>
          </div>
          <div className="hidden sm:flex gap-3">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-amber-200 opacity-60" />
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-orange-200 opacity-60 mt-6" />
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 border border-black rounded-full bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
          </div>

          <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-full bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition sm:w-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
            </svg>
            Filter
          </button>
        </div>

        {/* Section title */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {search ? `Results for "${search}"` : "All Products"}
          </h3>
          <span className="text-xs text-gray-400">{filtered.length} items</span>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-200 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🪴</p>
            <p className="text-sm">No products found</p>
          </div>
        )}

        {/* Product grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 pb-16">
            {filtered.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </main>

      {/* Mobile nav removed because it is now inside Navbar */}
    </div>
  );
}
