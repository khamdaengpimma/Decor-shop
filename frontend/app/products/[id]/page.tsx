"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart, selectItemQty, selectCount, Product } from "@/store/cart";
import Navbar from "@/components/Navbar";
import { useTranslations } from "@/lib/i18n";

export default function ProductDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);

  const cartCount = useCart(selectCount);
  const add = useCart((s) => s.add);
  const decrement = useCart((s) => s.decrement);
  const remove = useCart((s) => s.remove);
  const qty = useCart(selectItemQty(id));

  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <div className="bg-[#f7f5f2] min-h-screen font-sans flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-[#f7f5f2] min-h-screen font-sans flex flex-col items-center justify-center p-4">
        <p className="text-6xl mb-4">🌿</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("product.notFoundTitle")}</h1>
        <p className="text-gray-500 mb-6 text-center">{t("product.notFoundMessage")}</p>
        <button 
          onClick={() => router.back()}
          className="px-6 py-2 bg-amber-500 text-white rounded-full font-semibold shadow hover:bg-amber-600 transition"
        >
          {t("product.goBack")}
        </button>
      </div>
    );
  }

  const inCart = qty > 0;
  const soldOut = product.stock === 0;
  const imageDisplay = product.image ?? product.images?.[0] ?? "/placeholder.png";

  return (
    <div className="bg-[#f7f5f2] min-h-screen font-sans flex flex-col">
      <Navbar />
      
      {/* ── BREADCRUMB ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        <nav className="flex text-xs text-gray-500 pb-2">
          <Link href="/" className="hover:text-amber-500 transition">{t("product.breadcrumbHome")}</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-amber-500 transition">{t("product.breadcrumbProducts")}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 w-full pb-24">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            
            {/* ── IMAGE SECTION ── */}
            <div className="w-full md:w-1/2 lg:w-[55%] relative bg-gray-50 p-6 md:p-12 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
              {imageDisplay ? (
                <img 
                  src={imageDisplay} 
                  alt={product.name} 
                  className="w-full max-h-[500px] object-contain object-center drop-shadow-xl"
                />
              ) : (
                <div className="text-8xl text-gray-300">🪴</div>
              )}
              {soldOut && (
                <div className="absolute top-6 left-6 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Out of Stock
                </div>
              )}
              {product.category && !soldOut && (
                <div className="absolute top-6 left-6 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {product.category}
                </div>
              )}
            </div>

            {/* ── INFO SECTION ── */}
            <div className="w-full md:w-1/2 lg:w-[45%] p-6 md:p-10 flex flex-col">
              
              {/* Title & Price */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                  {product.name}
                </h1>
                
                <div className="flex items-end gap-3 mt-4">
                  <span className="text-3xl font-extrabold text-amber-500">
                    ₫{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-lg text-gray-400 line-through mb-1">
                      ₫{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full h-px bg-gray-100 mb-6"></div>

              {/* Status */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-20">{t("product.availability")}:</span>
                  {soldOut ? (
                    <span className="text-sm font-semibold text-red-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> {t("product.outOfStock")}
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 
                      {t("product.inStock", { count: product.stock || 0 })}
                    </span>
                  )}
                </div>
                
                {product.category && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 w-20">{t("product.categoryLabel")}:</span>
                    <span className="text-sm font-medium text-gray-900">{product.category}</span>
                  </div>
                )}
              </div>

              {/* Description (Mocked or real if available in product type) */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">{t("product.descriptionTitle")}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {(product as any).description || t("product.descriptionText")}
                </p>
              </div>

              {/* Add to Cart Actions */}
              <div className="mt-auto pt-6 border-t border-gray-100">
                {soldOut ? (
                  <button disabled className="w-full py-4 rounded-2xl bg-gray-100 text-gray-400 font-bold text-lg cursor-not-allowed">
                    {t("product.currentlyUnavailable")}
                  </button>
                ) : !inCart ? (
                  <button 
                    onClick={handleAddToCart}
                    className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2"
                  >
                    {added ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        {t("product.addedToCart")}
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                        {t("product.addToCart")}
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-2xl border border-gray-200">
                      <button 
                        onClick={() => qty === 1 ? remove(product._id) : decrement(product._id)}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-100 transition-all font-bold text-xl active:scale-95"
                      >
                        {qty === 1 ? (
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" /></svg>
                        ) : "−"}
                      </button>
                      
                      <div className="flex flex-col items-center justify-center px-4">
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">{t("product.quantity")}</span>
                        <span className="text-xl font-bold text-gray-900 leading-none">{qty}</span>
                      </div>
                      
                      <button 
                        onClick={() => add(product)}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-100 transition-all font-bold text-xl active:scale-95"
                      >
                        +
                      </button>
                    </div>
                    <Link href="/cart" className="w-full py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm text-center transition-colors">
                      {t("product.proceedToCheckout")}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex md:hidden">
        {[
          { label: t("navbar.home"),    icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",               href: "/" },
          { label: t("navbar.shop"),    icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",          href: "/products" },
          { label: t("navbar.cart"),    icon: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0", href: "/cart" },
          isLoggedIn
            ? { label: t("navbar.logout"),  icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1", href: "#", onClick: handleLogout }
            : { label: t("navbar.register"), icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z", href: "/register" },
        ].map(({ label, icon, href, onClick }: any) => (
          <a
            key={label}
            href={href}
            onClick={onClick}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-1 text-gray-500 hover:text-amber-500 transition-colors"
          >
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
