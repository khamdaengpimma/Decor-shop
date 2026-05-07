"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { useCart, selectCount } from "@/store/cart";
import Navbar from "@/components/Navbar";
import { useTranslations } from "@/lib/i18n";


interface Product {
  _id: string;
  name: string;
  price: number;
  stock?: number;
  image?: string;
  images?: string[];
  category?: string;
}

const CATEGORIES = ["All", "Vases", "Lighting", "Cushions", "Rugs", "Plants", "Art"];

export default function ProductsPage() {
  const t = useTranslations();
  const [products,  setProducts]  = useState<Product[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [category,  setCategory]  = useState("All");
  const cartCount = useCart(selectCount);
  const { add } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [addedId,   setAddedId]   = useState<string | null>(null);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    axios.get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const addToCart = (product: Product) => {
    add(product as any);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const filtered = useMemo(() =>
    products.filter((p) => {
      const matchSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat    = category === "All" || p.category?.toLowerCase() === category.toLowerCase();
      return matchSearch && matchCat;
    }),
    [products, search, category]
  );

  return (
    <div className="bg-[#f7f5f2] min-h-screen font-sans">
      <Navbar />
      

      
      
      

      

      {/* ── MAIN ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("products.searchPlaceholder")}
              className="w-full pl-9 pr-4 py-2.5 border border-black rounded-full bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition
                ${category === cat
                  ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
              {t(`products.categories.${cat}`)}
            </button>
          ))}
        </div>

        {/* Cart */}
              <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition">
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
  {cartCount > 0 && (
    <span className="absolute top-0.5 right-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
      {cartCount}
    </span>
  )}
</Link>

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
            <p className="text-sm">{t("products.noProductsFound")}</p>
            <button onClick={() => { setSearch(""); setCategory("All"); }}
              className="mt-4 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-full transition">
              {t("products.clearFilters")}
            </button>
          </div>
        )}

        {/* Product grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filtered.map((p) => {
              const thumb = p.image ?? p.images?.[0];
              const isAdded = addedId === p._id;
              return (
                <div key={p._id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

                  {/* Image */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <Link href={`/products/${p._id}`}>
                      {thumb ? (
                        <img src={thumb} alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">🪴</div>
                      )}
                    </Link>

                    {/* Out of stock badge */}
                    {p.stock === 0 && (
                      <span className="absolute top-2 left-2 bg-gray-800 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        {t("products.outOfStock")}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1">
                    {p.category && (
                      <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide">{p.category}</span>
                    )}
                    <Link href={`/products/${p._id}`}>
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1 mt-0.5 hover:text-amber-500 transition-colors">{p.name}</p>
                    </Link>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-sm font-bold text-gray-900">₫{p.price.toLocaleString()}</span>
                      {p.stock !== undefined && p.stock > 0 && (
                        <span className="text-[10px] text-gray-400">{t("products.itemsLeft", { count: p.stock })}</span>
                      )}
                    </div>

                    {/* Add to cart */}
                    <button
                      onClick={() => addToCart(p)}
                      disabled={p.stock === 0 || isAdded}
                      className={`mt-2.5 w-full py-2 rounded-xl text-xs font-bold transition active:scale-95
                        ${p.stock === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : isAdded
                            ? "bg-green-500 text-white"
                            : "bg-amber-500 hover:bg-amber-600 text-white shadow-sm"}`}
                    >
                      {p.stock === 0 ? t("products.unavailable") : isAdded ? t("products.added") : t("products.addToCart")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex md:hidden">
        {[
          { label: t("navbar.home"),    icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",               href: "/" },
          { label: t("navbar.cart"),    icon: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0", href: "/cart" },
          isLoggedIn
            ? { label: t("navbar.logout"),   icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1", href: "#", action: handleLogout }
            : { label: t("navbar.register"), icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z", href: "/register" },
        ].map(({ label, icon, href, action }: any) => (
          <a key={label} href={href} onClick={action}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors
              ${label === "Collections" ? "text-amber-500" : "text-gray-500 hover:text-amber-500"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
            <span className="text-[10px] font-medium">{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}