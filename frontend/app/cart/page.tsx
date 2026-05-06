"use client";

import { useCart, selectTotal, selectCount, CartItem } from "@/store/cart";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const EMPTY_FORM: CheckoutForm = { name: "", email: "", phone: "", address: "" };

interface CheckoutError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
}

export default function CartPage() {
  const { items: cart, remove, add, decrement, clear } = useCart();
  const total = useCart(selectTotal);
  const count = useCart(selectCount);

  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState<CheckoutForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  // Check login status and userId
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      // For now using your example userId. Later you can decode JWT or store userId separately
      if (token) {
        setUserId(localStorage.getItem("userId") || "user001");
      }
    };

    void loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserId(null);
  };

  const validate = () => {
    const e: Partial<CheckoutForm> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.address.trim()) e.address = "Delivery address is required.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const checkout = async () => {
    if (cart.length === 0) return;
    if (!userId) {
      alert("Please log in to place an order.");
      return;
    }
    if (!validate()) return;

    try {
      setLoading(true);

      const orderData = {
        userId,
        customer: {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          address: form.address.trim(),
        },
        items: cart.map((item: CartItem) => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
          qty: item.qty,
        })),
        total,
        status: "pending",
      };

      await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Optional but recommended
        },
      });

      // Success
      clear();
      setForm(EMPTY_FORM);
      setErrors({});
      setOrdered(true);

    } catch (err: unknown) {
      console.error("Checkout failed:", err);
      const checkoutError = err as CheckoutError;
      const message =
        checkoutError.response?.data?.message ||
        checkoutError.response?.data?.error ||
        "Failed to place order. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      key: "name" as const,
      label: "Full Name",
      type: "text",
      placeholder: "John Doe",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      key: "email" as const,
      label: "Email",
      type: "email",
      placeholder: "john@example.com",
      icon: "M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207",
    },
    {
      key: "phone" as const,
      label: "Phone Number",
      type: "tel",
      placeholder: "+84 987 654 321",
      icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    },
    {
      key: "address" as const,
      label: "Delivery Address",
      type: "text",
      placeholder: "123 Main Street, Quang Tri, Vietnam",
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
    },
  ];

  return (
    <div className="bg-[#f7f5f2] min-h-screen font-sans">
      <Navbar />
      

      {/* PAGE TITLE */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <p className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-1">Review</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Your Cart</h1>
          <p className="mt-1 text-sm text-gray-500">
            {count > 0 ? `${count} ${count === 1 ? "item" : "items"} ready to checkout.` : "Your cart is empty."}
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-28">
        {/* Order Success */}
        {ordered && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center text-center gap-4">
            <span className="text-6xl">🎉</span>
            <h2 className="text-xl font-extrabold text-gray-800">Order Placed Successfully!</h2>
            <p className="text-sm text-gray-500">Thank you for shopping with us. We&apos;ll process your order soon.</p>
            <Link
              href="/products"
              onClick={() => setOrdered(false)}
              className="mt-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-full transition shadow-sm"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {/* Empty Cart */}
        {!ordered && cart.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center text-center gap-4">
            <span className="text-6xl">🛒</span>
            <h2 className="text-xl font-extrabold text-gray-800">Your cart is empty</h2>
            <p className="text-sm text-gray-500">Add some beautiful décor to get started.</p>
            <Link
              href="/products"
              className="mt-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-full transition shadow-sm"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* Cart + Checkout */}
        {!ordered && cart.length > 0 && (
          <>
            {/* Clear All */}
            <div className="flex justify-end mb-3">
              <button onClick={clear} className="text-xs text-red-400 hover:text-red-600 font-medium transition">
                Clear all
              </button>
            </div>

            {/* Cart Items */}
            <ul className="divide-y divide-gray-100 rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
              {cart.map((item: CartItem) => (
                <li key={item.product._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🪴</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {item.product.category && (
                      <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide">
                        {item.product.category}
                      </span>
                    )}
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">${item.product.price.toLocaleString()} each</p>
                    <p className="text-sm font-bold text-amber-500 mt-0.5">
                      ${(item.product.price * item.qty).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-gray-100 rounded-xl px-1 py-0.5">
                    <button
                      onClick={() => (item.qty === 1 ? remove(item.product._id) : decrement(item.product._id))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition text-gray-600 font-bold active:scale-90"
                    >
                      {item.qty === 1 ? "🗑" : "−"}
                    </button>
                    <span className="min-w-[1.5rem] text-center text-sm font-bold text-gray-800">{item.qty}</span>
                    <button
                      onClick={() => add(item.product)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition text-gray-600 font-bold active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Delivery Details */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-extrabold text-gray-900">Delivery Details</h2>
                <p className="text-xs text-gray-400 mt-0.5">We&apos;ll deliver to this address.</p>
              </div>
              <div className="px-5 py-5 space-y-4">
                {fields.map(({ key, label, type, placeholder, icon }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                      </svg>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, [key]: e.target.value }));
                          if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl text-black text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition
                          ${errors[key] ? "border-red-300 bg-red-50" : "border-black bg-white"}`}
                      />
                    </div>
                    {errors[key] && <p className="text-xs text-red-500 mt-1 ml-1">{errors[key]}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Order Summary</h2>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal ({count} {count === 1 ? "item" : "items"})</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className="text-green-500 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-extrabold text-lg text-gray-900">
                <span>Total</span>
                <span className="text-amber-500">${total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={checkout}
              disabled={loading || !isLoggedIn}
              className="mt-6 w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold text-base rounded-2xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Placing Order...
                </>
              ) : !isLoggedIn ? (
                "Please Sign In to Checkout"
              ) : (
                `Checkout — $${total.toLocaleString()}`
              )}
            </button>

            {!isLoggedIn && (
              <p className="text-center text-sm text-amber-600 mt-3">
                Please <Link href="/login" className="underline font-medium">sign in</Link> to complete your purchase.
              </p>
            )}
          </>
        )}
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex md:hidden">
        {[
          { label: "Home", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", href: "/" },
          { label: "Cart", icon: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0", href: "/cart", active: true },
          isLoggedIn
            ? { label: "Logout", icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1", href: "#", action: handleLogout }
            : { label: "Register", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z", href: "/register" },
        ].map(({ label, icon, href, active, action }) => (
          <Link
            key={label}
            href={href}
            onClick={action}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors
              ${active ? "text-amber-500" : "text-gray-500 hover:text-amber-500"}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
