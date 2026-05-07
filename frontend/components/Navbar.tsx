"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart, selectCount } from "@/store/cart";
import { useI18n, useTranslations } from "@/lib/i18n";

export default function Navbar() {
  const cartCount = useCart(selectCount);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { locale, setLocale } = useI18n();
  const t = useTranslations();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleLocaleToggle = () => {
    setLocale(locale === "en" ? "vn" : "en");
  };

  const labels = {
    home: t("navbar.home"),
    collections: t("navbar.collections"),
    sale: t("navbar.sale"),
    about: t("navbar.about"),
    orders: t("navbar.orders"),
    signIn: t("navbar.signIn"),
    register: t("navbar.register"),
    logout: t("navbar.logout"),
    shop: t("navbar.shop"),
    cart: t("navbar.cart"),
    login: t("navbar.login"),
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 transition hover:opacity-80">
              Décor<span className="text-amber-500">Shop</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
              <Link href="/" className="hover:text-amber-500 transition-colors">{labels.home}</Link>
              <Link href="/products" className="hover:text-amber-500 transition-colors">{labels.collections}</Link>
              <Link href="/sale" className="hover:text-rose-500 text-rose-600 transition-colors relative">
                {labels.sale}
                <span className="absolute -top-2 -right-3 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              </Link>
              <Link href="/about" className="hover:text-amber-500 transition-colors">{labels.about}</Link>
              {isLoggedIn && (
                <Link href="/orders" className="hover:text-amber-500 transition-colors">{labels.orders}</Link>
              )}
            </nav>

            {/* Icons + Auth */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Orders */}
              {isLoggedIn && (
                <Link href="/orders" className="relative p-2 rounded-full hover:bg-amber-50 transition text-gray-700 hover:text-amber-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </Link>
              )}

              {/* Cart */}
              <Link href="/cart" className="relative p-2 rounded-full hover:bg-amber-50 transition text-gray-700 hover:text-amber-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={handleLocaleToggle}
                className="hidden md:inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition"
              >
                {t("navbar.language")}
              </button>

              {/* Auth buttons (desktop) */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-full hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                  </svg>
                  {labels.logout}
                </button>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-1.5 text-xs font-bold text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition"
                  >
                    {labels.signIn}
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-gray-900 hover:bg-amber-500 rounded-full transition shadow-sm"
                  >
                    {labels.register}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE BOTTOM NAV (Moved from page.tsx so it's globally available) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200 flex md:hidden pb-safe">
        {[
          { label: labels.home, icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", href: "/" },
          { label: labels.shop, icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", href: "/products" },
          { label: labels.sale, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", href: "/sale" },
          ...(isLoggedIn ? [{ label: labels.orders, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", href: "/orders" }] : []),
          { label: labels.cart, icon: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0", href: "/cart" },
          isLoggedIn
            ? { label: labels.logout, icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1", href: "#", onClick: handleLogout }
            : { label: labels.login, icon: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1", href: "/login" },
        ].map(({ label, icon, href, onClick }: any) => (
          <Link
            key={label}
            href={href}
            onClick={onClick}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${href === '/sale' ? 'text-rose-500 hover:text-rose-600' : 'text-gray-500 hover:text-amber-500'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
