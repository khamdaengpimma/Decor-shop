"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import jwt from "jsonwebtoken";
/* ── Types ── */
interface Stats {
  totalProducts: number;
  totalOrders:   number;
  revenue:       number;
  pendingOrders: number;
}

const NAV_ITEMS = [
  { href: "/admin/products", label: "Products",  icon: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" },
  { href: "/admin/orders",   label: "Orders",    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/admin/customers",label: "Customers", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 7a4 4 0 100 8 4 4 0 000-8z" },
  { href: "/admin/settings", label: "Settings",  icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

const STAT_CARDS = (s: Stats) => [
  {
    label: "Total Products",
    value: s.totalProducts,
    icon:  "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z",
    color: "bg-blue-50 text-blue-600",
    trend: "+3 this week",
  },
  {
    label: "Total Orders",
    value: s.totalOrders,
    icon:  "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    color: "bg-amber-50 text-amber-600",
    trend: `${s.pendingOrders} pending`,
  },
  {
    label: "Revenue",
    value: `₫${s.revenue.toLocaleString()}`,
    icon:  "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "bg-green-50 text-green-600",
    trend: "+12% this month",
  },
  {
    label: "Pending Orders",
    value: s.pendingOrders,
    icon:  "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "bg-red-50 text-red-500",
    trend: "Needs attention",
  },
];

export default function Admin() {
  const router   = useRouter();
  const pathname = usePathname();

  const [loading, setLoading]   = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats]       = useState<Stats>({
    totalProducts: 0,
    totalOrders:   0,
    revenue:       0,
    pendingOrders: 0,
  });

  /* ── Auth guard ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    const decoded = jwt.decode(token) as any;
    if (!decoded || decoded.role !== "admin") {
      router.push("/");
      return;
    }

    /* ── Fetch real stats ── */
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get("http://localhost:5000/api/products", { headers }),
      axios.get("http://localhost:5000/api/orders",   { headers }),
    ])
      .then(([products, orders]) => {
        const orderList = orders.data as any[];
        setStats({
          totalProducts: products.data.length,
          totalOrders:   orderList.length,
          revenue:       orderList.reduce((sum: number, o: any) => sum + (o.total ?? 0), 0),
          pendingOrders: orderList.filter((o: any) => o.status === "pending").length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="w-8 h-8 animate-spin text-amber-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  /* ── Sidebar shared markup ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-gray-100">
        <span className="text-lg font-extrabold tracking-tight text-gray-900">
          Décor<span className="text-amber-500">Admin</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${active
                  ? "bg-amber-50 text-amber-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
              `}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
              {label}
              {label === "Orders" && stats.pendingOrders > 0 && (
                <span className="ml-auto bg-red-100 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {stats.pendingOrders}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── SIDEBAR — desktop ── */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 shadow-sm fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* ── SIDEBAR — mobile overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative flex flex-col w-64 bg-white shadow-xl z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── MAIN ── */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm px-4 sm:px-6 py-3 flex items-center gap-4">
          {/* Hamburger (mobile) */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <line x1="3" y1="6"  x2="21" y2="6"  />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 flex-1">Dashboard</h1>
          <span className="text-xs text-gray-400 hidden sm:block">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </span>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 py-6 space-y-8">

          {/* Welcome */}
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Welcome back 👋</h2>
            <p className="text-sm text-gray-500 mt-1">Here's what's happening in your store today.</p>
          </div>

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {STAT_CARDS(stats).map(({ label, value, icon, color, trend }) => (
              <div key={label} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5">{value}</p>
                </div>
                <p className="text-xs text-gray-400">{trend}</p>
              </div>
            ))}
          </div>

          {/* ── Quick links ── */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/admin/products"
                className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:border-amber-300 hover:shadow-sm transition group"
              >
                <span className="w-9 h-9 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center text-lg group-hover:bg-amber-100 transition">+</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">View Products</p>
                  <p className="text-xs text-gray-400">Upload photos, set price & stock</p>
                </div>
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 hover:border-amber-300 hover:shadow-sm transition group"
              >
                <span className="w-9 h-9 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">View Orders</p>
                  <p className="text-xs text-gray-400">{stats.pendingOrders} pending — needs review</p>
                </div>
              </Link>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}