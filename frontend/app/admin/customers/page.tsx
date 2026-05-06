"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import jwt from "jsonwebtoken";
/* ── Types ── */
interface Customer {
  _id:       string;
  name:      string;
  email:     string;
  phone?:    string;
  createdAt: string;
  orders?:   number;
  spent?:    number;
  status?:   "active" | "inactive" | "banned";
}

type CustomerStatus = "active" | "inactive" | "banned";

const STATUS_CONFIG: Record<CustomerStatus, { label: string; color: string; dot: string }> = {
  active:   { label: "Active",   color: "bg-green-100 text-green-700", dot: "bg-green-400"  },
  inactive: { label: "Inactive", color: "bg-gray-100  text-gray-500",  dot: "bg-gray-400"   },
  banned:   { label: "Banned",   color: "bg-red-100   text-red-500",   dot: "bg-red-400"    },
};

/* ── Sidebar nav ── */
const NAV_ITEMS = [
  { href: "/admin",           label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/admin/products",  label: "Products",  icon: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" },
  { href: "/admin/orders",    label: "Orders",    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/admin/customers", label: "Customers", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 7a4 4 0 100 8 4 4 0 000-8z" },
  { href: "/admin/settings",  label: "Settings",  icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

const AVATAR_COLORS = [
  "bg-amber-100  text-amber-600",
  "bg-blue-100   text-blue-600",
  "bg-purple-100 text-purple-600",
  "bg-green-100  text-green-600",
  "bg-rose-100   text-rose-600",
];

function avatarColor(id: string) {
  const idx = id.charCodeAt(id.length - 1) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export default function Customers() {
  const router   = useRouter();
  const pathname = usePathname();

  const [customers,   setCustomers]   = useState<Customer[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search,      setSearch]      = useState("");
  const [filter,      setFilter]      = useState<CustomerStatus | "all">("all");
  const [expanded,    setExpanded]    = useState<string | null>(null);
  const [updating,    setUpdating]    = useState<string | null>(null);

  const token   = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  const headers = { Authorization: `Bearer ${token}` };

  /* ── Auth + fetch ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    const decoded = jwt.decode(token) as any;
    if (!decoded || decoded.role !== "admin") {
      router.push("/");
      return;
    }
    axios
      .get("http://localhost:5000/api/users", { headers })
      .then((r) => setCustomers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const logout = () => { localStorage.removeItem("token"); router.push("/login"); };

  /* ── Update status ── */
  const updateStatus = async (id: string, status: CustomerStatus) => {
    setUpdating(id);
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, { status }, { headers });
      setCustomers((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
    } catch {
      alert("Failed to update customer status.");
    } finally {
      setUpdating(null);
    }
  };

  /* ── Derived ── */
  const visible = useMemo(() =>
    customers
      .filter((c) => filter === "all" || (c.status ?? "active") === filter)
      .filter((c) =>
        search === "" ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [customers, filter, search]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: customers.length };
    (["active","inactive","banned"] as CustomerStatus[]).forEach((s) => {
      c[s] = customers.filter((cu) => (cu.status ?? "active") === s).length;
    });
    return c;
  }, [customers]);

  const totalSpent = customers.reduce((s, c) => s + (c.spent ?? 0), 0);

  /* ── Sidebar ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 border-b border-gray-100">
        <span className="text-lg font-extrabold tracking-tight text-gray-900">
          Décor<span className="text-amber-500">Admin</span>
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${active ? "bg-amber-50 text-amber-600" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-gray-100">
        <button onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors">
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

      {/* ── Sidebar desktop ── */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 shadow-sm fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* ── Sidebar mobile ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-white shadow-xl z-50"><SidebarContent /></aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm px-4 sm:px-6 py-3 flex items-center gap-4">
          <button className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 flex-1">Customers</h1>
          <span className="text-xs text-gray-400 hidden sm:block" suppressHydrationWarning>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </span>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-6 space-y-5">

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Total Customers", value: customers.length,        bg: "bg-blue-50",   color: "text-blue-600",  icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8z" },
              { label: "Active",          value: counts["active"]  ?? 0,  bg: "bg-green-50",  color: "text-green-600", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Inactive",        value: counts["inactive"] ?? 0, bg: "bg-gray-100",  color: "text-gray-500",  icon: "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Total Spent",     value: `$${totalSpent.toLocaleString()}`, bg: "bg-amber-50", color: "text-amber-600", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map(({ label, value, bg, color, icon }) => (
              <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3">
                <div className={`w-9 h-9 rounded-xl ${bg} ${color} flex items-center justify-center`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className="text-xl font-extrabold text-gray-900 mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Search + filter ── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or phone…"
                className="w-full pl-9 pr-4 py-2.5 border border-black rounded-xl bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
              {(["all", "active", "inactive", "banned"] as const).map((s) => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition
                    ${filter === s
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >
                  {s === "all" ? "All" : STATUS_CONFIG[s].label}
                  <span className={`ml-1 ${filter === s ? "text-amber-100" : "text-gray-400"}`}>
                    {counts[s] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Loading skeleton ── */}
          {loading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && visible.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">👥</p>
              <p className="text-sm">No customers found.</p>
            </div>
          )}

          {/* ── Customer list ── */}
          {!loading && visible.length > 0 && (
            <ul className="space-y-3">
              {visible.map((customer) => {
                const status     = customer.status ?? "active";
                const cfg        = STATUS_CONFIG[status];
                const isExpanded = expanded === customer._id;
                const isUpdating = updating === customer._id;

                return (
                  <li key={customer._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* ── Row ── */}
                    <button
                      onClick={() => setExpanded(isExpanded ? null : customer._id)}
                      className="w-full text-left px-4 sm:px-5 py-4 flex items-center gap-3 sm:gap-4 hover:bg-gray-50 transition"
                    >
                      {/* Avatar */}
                      <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-extrabold ${avatarColor(customer._id)}`}>
                        {initials(customer.name)}
                      </div>

                      {/* Name + email */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{customer.name}</p>
                        <p className="text-xs text-gray-400 truncate">{customer.email}</p>
                      </div>

                      {/* Orders count */}
                      {customer.orders !== undefined && (
                        <span className="hidden sm:block text-xs text-gray-400 flex-shrink-0">
                          {customer.orders} order{customer.orders !== 1 ? "s" : ""}
                        </span>
                      )}

                      {/* Spent */}
                      {customer.spent !== undefined && (
                        <span className="hidden sm:block text-sm font-bold text-gray-900 flex-shrink-0">
                          ${customer.spent.toLocaleString()}
                        </span>
                      )}

                      {/* Status badge */}
                      <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>

                      {/* Chevron */}
                      <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* ── Expanded detail ── */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 px-4 sm:px-5 py-4 bg-gray-50 space-y-4">

                        {/* Info grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {[
                            { label: "Email",    value: customer.email },
                            { label: "Phone",    value: customer.phone ?? "—" },
                            { label: "Joined",   value: fmt(customer.createdAt) },
                            { label: "Orders",   value: customer.orders ?? "—" },
                            { label: "Spent",    value: customer.spent !== undefined ? `$${customer.spent.toLocaleString()}` : "—" },
                            { label: "Customer ID", value: `#${customer._id.slice(-8).toUpperCase()}` },
                          ].map(({ label, value }) => (
                            <div key={label} className="bg-white rounded-xl p-3 border border-gray-100">
                              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                              <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Status control */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-gray-500">Status:</label>
                            <select
                              value={status}
                              onChange={(e) => updateStatus(customer._id, e.target.value as CustomerStatus)}
                              disabled={isUpdating}
                              className="text-xs border border-black rounded-lg px-2 py-1.5 bg-white text-black focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50 transition"
                            >
                              {(["active","inactive","banned"] as CustomerStatus[]).map((s) => (
                                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                              ))}
                            </select>
                            {isUpdating && (
                              <svg className="w-3.5 h-3.5 animate-spin text-amber-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                              </svg>
                            )}
                          </div>

                          {/* Email shortcut */}
                          <a href={`mailto:${customer.email}`}
                            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-xl transition">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Send Email
                          </a>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}