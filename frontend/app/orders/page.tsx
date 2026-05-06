"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  name?: string;
  price?: number;
  qty?: number;
}

interface Order {
  _id: string;
  userId?: string;
  items?: OrderItem[];
  total?: number;
  status?: OrderStatus;
  createdAt?: string;
}

function getStoredUserId() {
  const directUserId = localStorage.getItem("userId");
  if (directUserId) return directUserId;

  const storedUser = localStorage.getItem("user");
  if (!storedUser) return "user001";

  try {
    return JSON.parse(storedUser)?._id || "user001";
  } catch {
    return "user001";
  }
}

const statusClass: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  processing: "bg-blue-50 text-blue-600 border-blue-100",
  shipped: "bg-indigo-50 text-indigo-600 border-indigo-100",
  delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
  cancelled: "bg-red-50 text-red-600 border-red-100",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setOrdersLoading(false);
        return;
      }

      setIsLoggedIn(true);
      const userId = getStoredUserId();
      setOrdersLoading(true);

      try {
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const orderList = Array.isArray(res.data) ? res.data : [];
        setOrders(
          orderList
            .filter((order: Order) => order.userId === userId)
            .sort(
              (a: Order, b: Order) =>
                new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            )
        );
      } catch {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    void loadOrders();
  }, []);

  return (
    <div className="bg-[#f7f5f2] min-h-screen font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <div className="mb-6">
          <p className="text-xs font-semibold text-amber-500 uppercase tracking-widest">Your Purchases</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">Orders You Bought</h1>
          <p className="text-sm text-gray-500 mt-1">{orders.length} orders</p>
        </div>

        {!isLoggedIn ? (
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Please log in to view your orders</h4>
              <p className="text-xs text-gray-400 mt-1">Sign in to see all your purchases and order history.</p>
            </div>
            <Link href="/login" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
              Sign In
            </Link>
          </div>
        ) : ordersLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-12 shadow-sm flex flex-col items-center justify-center text-center">
            <p className="text-4xl mb-3">📦</p>
            <h4 className="text-sm font-bold text-gray-800">No orders yet</h4>
            <p className="text-xs text-gray-400 mt-1">Products you buy will appear here after checkout.</p>
            <Link href="/products" className="mt-4 text-sm font-semibold text-amber-600 hover:text-amber-700">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => {
              const status = order.status || "pending";
              const items = order.items || [];
              const created = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString()
                : "Recent order";

              return (
                <article key={order._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-400">{created}</p>
                      <h4 className="mt-1 text-sm font-extrabold text-gray-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold capitalize ${statusClass[status]}`}>
                      {status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1">
                    {items.slice(0, 2).map((item, index) => (
                      <div key={`${order._id}-${index}`} className="flex justify-between gap-3 text-xs text-gray-500">
                        <span className="line-clamp-1">{item.name || "Product"}</span>
                        <span className="font-semibold">x{item.qty || 1}</span>
                      </div>
                    ))}
                    {items.length > 2 && (
                      <p className="text-xs text-gray-400">
                        +{items.length - 2} more item{items.length - 2 === 1 ? "" : "s"}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400">Total</span>
                    <span className="text-sm font-extrabold text-amber-500">${(order.total || 0).toLocaleString()}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
