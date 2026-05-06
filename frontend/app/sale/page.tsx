"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

async function getProducts() {
  const res = await axios.get("http://localhost:5000/api/products");
  return res.data;
}

export default function SalePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        // Mock a "sale" by showing a subset of products (e.g., first 8)
        setProducts(data.slice(0, 8));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#fcfbf9] min-h-screen font-sans">
      <Navbar />

      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden bg-rose-50 border-b border-rose-100">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-rose-200/50 blur-3xl mix-blend-multiply pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-200/40 blur-3xl mix-blend-multiply pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-rose-100 text-rose-600 text-xs font-bold tracking-widest uppercase mb-6 animate-pulse">
            Limited Time Offer
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
            Summer <span className="text-rose-500">Clearance</span> Sale
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
            Upgrade your space with our premium pieces at unmatched prices. Up to 40% off selected items while stocks last.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Clearance Items</h2>
          <span className="bg-rose-100 text-rose-700 py-1 px-3 rounded-full text-xs font-bold">
            {products.length} Products
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-200 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 pb-20">
            {products.map((p: any) => (
              <div key={p._id} className="relative group">
                <div className="absolute top-3 right-3 z-10 bg-rose-500 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-lg transform rotate-3 group-hover:rotate-6 transition-transform">
                  SALE
                </div>
                <ProductCard product={p} />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-rose-400 rounded-3xl pointer-events-none transition-colors opacity-50 z-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-4xl mb-4">✨</p>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Check back soon!</h3>
            <p className="text-sm text-gray-500">More clearance items are being added.</p>
          </div>
        )}
      </main>
    </div>
  );
}
