"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

interface OrderItem {
  name: string;
  price: number;
  qty: number;
}

interface Order {
  _id: string;
  userId: string;

  name: string;
  email: string;
  phone: string;
  address: string;

  items: OrderItem[];

  total: number;
  status: OrderStatus;
  createdAt: string;
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
  pending:
    "bg-yellow-100 text-yellow-700 border-yellow-200",

  processing:
    "bg-blue-100 text-blue-700 border-blue-200",

  shipped:
    "bg-indigo-100 text-indigo-700 border-indigo-200",

  delivered:
    "bg-green-100 text-green-700 border-green-200",

  cancelled:
    "bg-red-100 text-red-700 border-red-200",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);

      try {
        const userId = getStoredUserId();

        const res = await axios.get(
          "http://localhost:5000/api/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const orderList = Array.isArray(res.data)
          ? res.data
          : [];

        const filteredOrders = orderList
          .filter(
            (order: Order) =>
              order.userId === userId
          )
          .sort(
            (a: Order, b: Order) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          );

        setOrders(filteredOrders);
      } catch (error) {
        console.error(error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, []);

  const totalSpent = useMemo(() => {
    return orders.reduce(
      (sum, order) => sum + order.total,
      0
    );
  }, [orders]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf7f2] to-[#f2eee8]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">
              Purchase History
            </p>

            <h1 className="mt-2 text-3xl sm:text-4xl font-black text-gray-900">
              Your Orders
            </h1>

            <p className="mt-2 text-gray-500">
              View all your purchases and order
              tracking
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 min-w-[140px]">
              <p className="text-xs text-gray-400 uppercase font-bold">
                Orders
              </p>

              <h3 className="mt-2 text-3xl font-black text-gray-900">
                {orders.length}
              </h3>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 min-w-[140px]">
              <p className="text-xs text-gray-400 uppercase font-bold">
                Total Spent
              </p>

              <h3 className="mt-2 text-3xl font-black text-amber-500">
                ${totalSpent.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        {/* LOGIN REQUIRED */}
        {!isLoggedIn ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
            <div className="text-5xl mb-4">
              🔐
            </div>

            <h2 className="text-2xl font-black text-gray-900">
              Login Required
            </h2>

            <p className="mt-2 text-gray-500">
              Please sign in to view your order
              history
            </p>

            <Link
              href="/login"
              className="inline-flex mt-6 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl font-bold transition"
            >
              Sign In
            </Link>
          </div>
        ) : loading ? (
          /* LOADING */
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map(
              (_, i) => (
                <div
                  key={i}
                  className="h-[420px] rounded-3xl bg-gray-200 animate-pulse"
                />
              )
            )}
          </div>
        ) : orders.length === 0 ? (
          /* EMPTY */
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-center">
            <div className="text-6xl">
              📦
            </div>

            <h2 className="mt-5 text-2xl font-black text-gray-900">
              No Orders Yet
            </h2>

            <p className="mt-2 text-gray-500">
              Your purchased products will appear
              here
            </p>

            <Link
              href="/products"
              className="inline-flex mt-6 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl font-bold transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* ORDERS */
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map((order) => {
              const createdDate =
                new Date(
                  order.createdAt
                ).toLocaleDateString();

              return (
                <article
                  key={order._id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition duration-300 overflow-hidden"
                >
                  {/* TOP BAR */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-400">
                          {createdDate}
                        </p>

                        <h2 className="mt-1 text-lg font-black text-gray-900">
                          #
                          {order._id
                            .slice(-8)
                            .toUpperCase()}
                        </h2>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-bold capitalize ${
                          statusClass[
                            order.status
                          ]
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* CUSTOMER */}
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="text-sm font-black text-gray-900 mb-4">
                      Customer Info
                    </h3>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        👤 {order.name}
                      </p>

                      <p className="text-sm text-gray-600">
                        📧 {order.email}
                      </p>

                      <p className="text-sm text-gray-600">
                        📞 {order.phone}
                      </p>

                      <p className="text-sm text-gray-600">
                        📍 {order.address}
                      </p>
                    </div>
                  </div>

                  {/* ITEMS */}
                  <div className="p-5">
                    <h3 className="text-sm font-black text-gray-900 mb-4">
                      Order Items
                    </h3>

                    <div className="space-y-3">
                      {order.items.map(
                        (item, index) => {
                          const subtotal =
                            item.price * item.qty;

                          return (
                            <div
                              key={`${order._id}-${index}`}
                              className="flex items-center justify-between bg-gray-50 rounded-2xl p-3"
                            >
                              <div>
                                <p className="font-bold text-gray-900 text-sm">
                                  {item.name}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                  $
                                  {item.price.toLocaleString()}{" "}
                                  × {item.qty}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="font-black text-amber-500">
                                  $
                                  {subtotal.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>

                    {/* TOTAL */}
                    <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-500">
                        Total Payment
                      </span>

                      <span className="text-2xl font-black text-amber-500">
                        $
                        {order.total.toLocaleString()}
                      </span>
                    </div>
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