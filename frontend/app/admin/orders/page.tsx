"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import jwt from "jsonwebtoken";
/* ── Types ── */
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  productId: string;
  name:      string;
  price:     number;
  qty:       number;
}

interface Order {
  _id:       string;
  items:     OrderItem[];
  total:     number;
  status:    OrderStatus;
  createdAt: string;
  userId:    string;
  name:      string;
  email:     string;
  phone:     string;
  address:   string;
}

/* ── Status config ── */
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  pending:    { label: "Pending",    color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-400" },
  processing: { label: "Processing", color: "bg-blue-100   text-blue-700",   dot: "bg-blue-400"   },
  shipped:    { label: "Shipped",    color: "bg-purple-100 text-purple-700", dot: "bg-purple-400" },
  delivered:  { label: "Delivered",  color: "bg-green-100  text-green-700",  dot: "bg-green-400"  },
  cancelled:  { label: "Cancelled",  color: "bg-red-100    text-red-500",    dot: "bg-red-400"    },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as OrderStatus[];

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending:    "processing",
  processing: "shipped",
  shipped:    "delivered",
};

/* ── Sidebar nav (same as Admin) ── */
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

export default function Orders() {
  const router   = useRouter();
  const pathname = usePathname();

  const [orders,      setOrders]      = useState<Order[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter,      setFilter]      = useState<OrderStatus | "all">("all");
  const [search,      setSearch]      = useState("");
  const [expanded,    setExpanded]    = useState<string | null>(null);
  const [updating,    setUpdating]    = useState<string | null>(null);

  const token   = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  const headers = { Authorization: `Bearer ${token}` };

  /* ── Auth guard ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    const decoded = jwt.decode(token) as any;
    if (!decoded || decoded.role !== "admin") {
      router.push("/");
      return;
    }
    axios
      .get("http://localhost:5000/api/orders", { headers })
      .then((r) => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  /* ── Status update ── */
  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id);
    try {
      await axios.patch(`http://localhost:5000/api/orders/${id}`, { status }, { headers });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch (err) {
      console.log(err);
      console.log(id);
      // console.log(status);
      // console.log(headers);
      console.log(orders);
      alert("Failed to update order status.");
    } finally {
      setUpdating(null);
    }
  };

  /* ── Derived lists ── */
  const visible = useMemo(() =>
    orders
      .filter((o) => filter === "all" || o.status === filter)
      .filter((o) =>
        search === "" ||
        o._id.toLowerCase().includes(search.toLowerCase()) ||
        o.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.email?.toLowerCase().includes(search.toLowerCase()) ||
        o.phone?.toLowerCase().includes(search.toLowerCase()) ||
        o.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders, filter, search]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    ALL_STATUSES.forEach((s) => { c[s] = orders.filter((o) => o.status === s).length; });
    return c;
  }, [orders]);

  const pendingCount = counts["pending"] ?? 0;

  /* ── Shared sidebar markup ── */
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
              {label === "Orders" && pendingCount > 0 && (
                <span className="ml-auto bg-red-100 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingCount}
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

      {/* ── Sidebar — desktop ── */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 shadow-sm fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* ── Sidebar — mobile overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-white shadow-xl z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm px-4 sm:px-6 py-3 flex items-center gap-4">
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
          <h1 className="text-base sm:text-lg font-bold text-gray-900 flex-1">Orders</h1>
          <span className="text-xs text-gray-400 hidden sm:block">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </span>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 py-6 space-y-5">

          {/* ── Summary stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {(["pending","processing","shipped","delivered"] as OrderStatus[]).map((s) => {
              const cfg = STATUS_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => setFilter(filter === s ? "all" : s)}
                  className={`
                    text-left bg-white rounded-2xl p-4 border shadow-sm transition
                    ${filter === s ? "border-amber-400 ring-2 ring-amber-200" : "border-gray-100 hover:border-amber-200"}
                  `}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                    <span className="text-xs font-semibold text-gray-500">{cfg.label}</span>
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900">{counts[s] ?? 0}</p>
                </button>
              );
            })}
          </div>

          {/* ── Search + filter row ── */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order ID, customer name, email, or product…"
                className="w-full pl-9 pr-4 py-2.5 border border-black rounded-xl bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
              />
            </div>

            {/* Status filter pills */}
            <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
              {(["all", ...ALL_STATUSES] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`
                    flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition
                    ${filter === s
                      ? "bg-amber-500 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"}
                  `}
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
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-gray-200 animate-pulse" />
              ))}
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && visible.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-sm">No orders match your filter.</p>
            </div>
          )}

          {/* ── Order list ── */}
          {!loading && visible.length > 0 && (
            <ul className="space-y-3">
              {visible.map((order) => {
                const cfg        = STATUS_CONFIG[order.status];
                const isExpanded = expanded === order._id;
                const isUpdating = updating === order._id;
                const next       = NEXT_STATUS[order.status];

                return (
                  <li key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Row */}
                    <button
                      onClick={() => setExpanded(isExpanded ? null : order._id)}
                      className="w-full text-left px-4 sm:px-5 py-4 flex items-center gap-3 hover:bg-gray-50 transition"
                    >
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">
                          #{order._id.slice(-8).toUpperCase()} • {order.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {fmt(order.createdAt)} • {order.email || "No email"}
                        </p>
                        {order.phone && (
                          <p className="text-xs text-gray-400">{order.phone}</p>
                        )}
                      </div>

                      <span className="hidden lg:block text-xs text-gray-400 flex-shrink-0">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </span>

                      <span className="text-sm font-bold text-gray-900 flex-shrink-0">
                        ${order.total.toLocaleString()}
                      </span>

                      <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>

                      <svg
                        className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 px-4 sm:px-5 py-4 space-y-4 bg-gray-50">
                        {/* Customer Info */}
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Customer Info</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white rounded-lg p-3">
                            <div>
                              <p className="text-xs text-gray-500">Name</p>
                              <p className="text-sm font-semibold text-gray-800">{order.name || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="text-sm font-semibold text-gray-800 break-all">{order.email || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Phone</p>
                              <p className="text-sm font-semibold text-gray-800">{order.phone || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Address</p>
                              <p className="text-sm font-semibold text-gray-800 break-words">{order.address || "N/A"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Items */}
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Items</p>
                          <ul className="space-y-2">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                  {item.name}
                                  <span className="text-gray-400 ml-1">× {item.qty}</span>
                                </span>
                                <span className="font-semibold text-gray-900">
                                  ${(item.price * item.qty).toLocaleString()}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div className="border-t border-gray-200 mt-3 pt-2 flex justify-between text-sm font-bold text-gray-900">
                            <span>Total</span>
                            <span className="text-amber-500">${order.total.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Status controls */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-gray-500">Status:</label>
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order._id, e.target.value as OrderStatus)}
                              disabled={isUpdating}
                              className="text-xs border border-black rounded-lg px-2 py-1.5 bg-white text-black focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50 transition"
                            >
                              {ALL_STATUSES.map((s) => (
                                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                              ))}
                            </select>
                          </div>

                          {next && (
                            <button
                              onClick={() => updateStatus(order._id, next)}
                              disabled={isUpdating}
                              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition active:scale-95"
                            >
                              {isUpdating ? (
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                              ) : (
                                <>
                                  Mark as {STATUS_CONFIG[next].label}
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                </>
                              )}
                            </button>
                          )}
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