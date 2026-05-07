"use client";

import {
  useCart,
  selectTotal,
  selectCount,
  CartItem,
} from "@/store/cart";

import api from "@/lib/api";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useTranslations } from "@/lib/i18n";

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const EMPTY_FORM: CheckoutForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

export default function CartPage() {
  const t = useTranslations();
  const {
    items: cart,
    remove,
    add,
    decrement,
    clear,
  } = useCart();

  const subtotal = useCart(selectTotal);
  const count = useCart(selectCount);

  const [loading, setLoading] =
    useState(false);

  const [ordered, setOrdered] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [userId, setUserId] = useState<
    string | null
  >(null);

  const [form, setForm] =
    useState<CheckoutForm>(EMPTY_FORM);

  const [errors, setErrors] = useState<
    Partial<CheckoutForm>
  >({});

  /* =========================
     LOGIN
  ========================= */

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    setIsLoggedIn(!!token);

    if (token) {
      setUserId(
        localStorage.getItem("userId") ||
          "user001"
      );
    }
  }, []);

  /* =========================
     ORDER MATH
  ========================= */

  const shipping = useMemo(() => {
    if (subtotal >= 500) return 0;

    return cart.length > 0 ? 25 : 0;
  }, [subtotal, cart.length]);

  const tax = useMemo(() => {
    return subtotal * 0.1;
  }, [subtotal]);

  const grandTotal = useMemo(() => {
    return subtotal + shipping + tax;
  }, [subtotal, shipping, tax]);

  /* =========================
     VALIDATION
  ========================= */

  const validate = () => {
    const e: Partial<CheckoutForm> = {};

    if (!form.name.trim()) {
      e.name = t("cart.nameRequired");
    }

    if (!form.email.trim()) {
      e.email = t("cart.emailRequired");
    } else if (
      !/\S+@\S+\.\S+/.test(form.email)
    ) {
      e.email = t("cart.invalidEmail");
    }

    if (!form.phone.trim()) {
      e.phone = t("cart.phoneRequired");
    }

    if (!form.address.trim()) {
      e.address = t("cart.addressRequired");
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  /* =========================
     CHECKOUT
  ========================= */

  const checkout = async () => {
    if (!validate()) return;

    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        userId,

        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,

        items: cart.map(
          (item: CartItem) => ({
            productId:
              item.product._id,

            name: item.product.name,

            price:
              item.product.price,

            qty: item.qty,

            subtotal:
              item.product.price *
              item.qty,
          })
        ),

        subtotal,
        shipping,
        tax,
        total: grandTotal,

        status: "pending",
      };

      await api.post(
        "/api/orders",
        orderData
      );

      clear();

      setOrdered(true);

      setForm(EMPTY_FORM);
    } catch (err) {
      console.error(err);

      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SUCCESS
  ========================= */

  if (ordered) {
    return (
      <div className="min-h-screen bg-[#f7f5f2]">
        <Navbar />

        <main className="max-w-xl mx-auto px-4 py-20">
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
            <div className="text-7xl mb-5">
              🎉
            </div>

            <h1 className="text-3xl font-black text-gray-900">
              {t("cart.thankYouTitle")}
            </h1>

            <p className="mt-3 text-gray-500">
              {t("cart.thankYouMessage")}
            </p>

            <Link
              href="/orders"
              className="inline-flex mt-8 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl font-bold transition"
            >
              {t("cart.viewOrders")}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">
            {t("cart.checkoutLabel")}
          </p>

          <h1 className="mt-2 text-4xl font-black text-gray-900">
            {t("cart.shoppingCart")}
          </h1>

          <p className="mt-2 text-gray-500">
            {t("cart.itemsReady", { count })}
          </p>
        </div>

        {/* EMPTY */}

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
            <div className="text-7xl">
              🛒
            </div>

            <h2 className="mt-5 text-3xl font-black text-gray-900">
              {t("cart.emptyTitle")}
            </h2>

            <p className="mt-2 text-gray-500">
              {t("cart.emptyMessage")}
            </p>

            <Link
              href="/products"
              className="inline-flex mt-8 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl font-bold"
            >
              {t("cart.browseProducts")}
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* LEFT */}

            <div className="space-y-6">
              {/* CART ITEMS */}

              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                {cart.map(
                  (item: CartItem) => {
                    const itemTotal =
                      item.product.price *
                      item.qty;

                    return (
                      <div
                        key={
                          item.product._id
                        }
                        className="flex gap-4 p-5 border-b border-gray-100"
                      >
                        {/* IMAGE */}

                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                          {item.product
                            .image ? (
                            <img
                              src={
                                item.product
                                  .image
                              }
                              alt={
                                item.product
                                  .name
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">
                              📦
                            </div>
                          )}
                        </div>

                        {/* INFO */}

                        <div className="flex-1">
                          <h3 className="font-black text-gray-900">
                            {
                              item.product
                                .name
                            }
                          </h3>

                          <p className="mt-1 text-sm text-gray-400">
                            ₫
                            {item.product.price.toLocaleString()}{" "}
                            {t("cart.each")}
                          </p>

                          <p className="mt-3 text-xxl font-black text-amber-800">
                            ₫
                            {itemTotal.toLocaleString()}
                          </p>

                          {/* QTY */}

                          <div className="mt-4 flex items-center gap-2">
                            <button
                              onClick={() =>
                                item.qty ===
                                1
                                  ? remove(
                                      item
                                        .product
                                        ._id
                                    )
                                  : decrement(
                                      item
                                        .product
                                        ._id
                                    )
                              }
                              className="w-9 h-9 rounded-xl bg-gray-500 hover:bg-gray-100 font-bold"
                            >
                              −
                            </button>

                            <span className="w-10 text-center font-bold text-red-500">
                              {
                                item.qty
                              }
                            </span>

                            <button
                              onClick={() =>
                                add(
                                  item.product
                                )
                              }
                              className="w-9 h-9 rounded-xl bg-gray-500 hover:bg-gray-100 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* FORM */}

              <div className="bg-white rounded-3xl border border-gray-100 p-6">
                <h2 className="text-xl font-black text-gray-900">
                  {t("cart.deliveryInfo")}
                </h2>

                <div className="mt-6 grid gap-4">
                  {(
                    [
                      "name",
                      "email",
                      "phone",
                      "address",
                    ] as const
                  ).map((field) => (
                    <div key={field}>
                      <input
                        type={
                          field ===
                          "email"
                            ? "email"
                            : "text"
                        }
                        placeholder={t("cart.enterField", { field })}
                        value={
                          form[field]
                        }
                        onChange={(
                          e
                        ) =>
                          setForm(
                            (
                              prev
                            ) => ({
                              ...prev,
                              [field]:
                                e
                                  .target
                                  .value,
                            })
                          )
                        }
                        className="
    w-full
    px-4
    py-4
    rounded-2xl
    bg-black
    text-white
    border
    border-gray-800
    placeholder:text-gray-400
    focus:outline-none
    focus:ring-2
    focus:ring-amber-400
    focus:border-amber-400
    transition-all
    duration-200
    shadow-sm
  "
                      />

                      {errors[
                        field
                      ] && (
                        <p className="text-red-500 text-sm mt-1">
                          {
                            errors[
                              field
                            ]
                          }
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div>
              <div className="bg-white rounded-3xl border border-gray-100 p-6 sticky top-6">
                <h2 className="text-2xl font-black text-gray-900">
                  {t("cart.orderSummary")}
                </h2>

                {/* SUMMARY */}

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-gray-500">
                    <span>
                      {t("cart.subtotal")}
                    </span>

                    <span>
                      đ
                      {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-500">
                    <span>
                      {t("cart.shipping")}
                    </span>

                    <span>
                      {shipping ===
                      0
                        ? t("cart.free")
                        : `$${shipping}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-500">
                    <span>
                      {t("cart.tax")}
                    </span>

                    <span>
                      đ
                      {tax.toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex justify-between">
                    <span className="text-lg font-black text-gray-900">
                      {t("cart.grandTotal")}
                    </span>

                    <span className="text-3xl font-black text-amber-500">
                      đ
                      {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* BUTTON */}

                <button
                  onClick={checkout}
                  disabled={
                    loading ||
                    !isLoggedIn
                  }
                  className="mt-8 w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white py-4 rounded-2xl font-black text-lg transition"
                >
                  {loading
                    ? t("cart.processing")
                    : !isLoggedIn
                    ? t("cart.loginRequired")
                    : t("cart.checkoutButton", { total: grandTotal.toLocaleString() })}
                </button>

                {!isLoggedIn && (
                  <p className="mt-3 text-sm text-center text-amber-600">
                    {t("cart.pleaseLogin")}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}