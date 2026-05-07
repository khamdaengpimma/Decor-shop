"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n";

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;

  discount?: number;
  salePrice?: number;
}

async function getProducts() {
  const res = await axios.get(
    "http://localhost:5000/api/products"
  );

  return res.data;
}

export default function SalePage() {
  const t = useTranslations();
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => {
        const saleProducts = data
          .slice(0, 12)
          .map((product: Product) => {
            const discount =
              Math.floor(
                Math.random() * 26
              ) + 5;

            const salePrice =
              product.price -
              product.price *
                (discount / 100);

            return {
              ...product,
              discount,
              salePrice,
            };
          });

        setProducts(saleProducts);
      })
      .finally(() =>
        setLoading(false)
      );
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-gray-900 overflow-hidden">
      <Navbar />

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-rose-100">
        {/* BACKGROUND */}

        <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-orange-50 to-[#fcfbf9]" />

        {/* BLUR */}

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-rose-200/40 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl">
            {/* BADGE */}

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-200 bg-white/70 backdrop-blur text-xs font-black uppercase tracking-[0.25em] text-rose-500 shadow-sm">
              🔥 {t("sale.trendingSale")}
            </div>

            {/* TITLE */}

            <h1 className="mt-8 text-5xl sm:text-6xl lg:text-8xl font-black leading-none tracking-tight text-gray-900">
              {t("sale.titleLine1")}
              <br />

              <span className="bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent">
                {t("sale.titleLine2")}
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p className="mt-8 text-lg text-gray-600 max-w-2xl leading-relaxed">
              {t("sale.description")}
            </p>

            {/* ACTIONS */}

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="
                  px-8
                  py-4
                  rounded-2xl
                  bg-black
                  text-white
                  font-black
                  hover:bg-gray-900
                  transition
                  shadow-xl
                "
              >
                {t("sale.shopCollection")}
              </Link>

              <Link
                href="/cart"
                className="
                  px-8
                  py-4
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  text-gray-900
                  font-black
                  hover:border-rose-300
                  hover:text-rose-500
                  transition
                "
              >
                {t("sale.viewCart")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}

      <main className="max-w-7xl mx-auto px-4 pb-24 pt-14">
        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-rose-500 font-black">
              {t("sale.newCollection")}
            </p>

            <h2 className="mt-3 text-4xl font-black text-gray-900">
              {t("sale.popularProducts")}
            </h2>
          </div>

          {/* STATS */}

          <div className="flex items-center gap-4">
            <div className="px-5 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase">
                {t("sale.activeDeals")}
              </p>

              <h3 className="mt-1 text-2xl font-black text-rose-500">
                {products.length}
              </h3>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase">
                {t("sale.discount")}
              </p>

              <h3 className="mt-1 text-2xl font-black text-orange-400">
                30%
              </h3>
            </div>
          </div>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({
              length: 8,
            }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-[32px] bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(
              (product) => (
                <div
                  key={product._id}
                  className="group relative"
                >
                  {/* PRODUCT CARD */}

                  <div
                    className="
                      relative
                      overflow-hidden
                      rounded-[32px]
                      border
                      border-gray-200
                      bg-white
                      hover:border-rose-300
                      transition-all
                      duration-500
                      hover:-translate-y-2
                      shadow-sm
                      hover:shadow-2xl
                    "
                  >
                    {/* TOP SALE BAR */}

                    <div
                      className="
                        absolute
                        top-0
                        left-0
                        right-0
                        z-30
                        flex
                        items-center
                        justify-between
                        px-4
                        py-3
                        bg-gradient-to-r
                        from-rose-500
                        to-orange-400
                      "
                    >
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white">
                        {t("sale.limitedSale")}
                      </span>

                      <span className="text-sm font-black text-white">
                        -
                        {
                          product.discount
                        }
                        %
                      </span>
                    </div>

                    {/* PRODUCT */}

                    <div className="pt-12">
                      <ProductCard
                        product={{
                          ...product,
                          price:
                            product.salePrice ||
                            product.price,
                        }}
                      />
                    </div>

                    {/* OVERLAY */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

                    {/* PRICE CARD */}

                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                      <div className="rounded-2xl bg-white/95 backdrop-blur-xl border border-gray-200 p-4 shadow-lg">
                        {/* PRICE */}

                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black text-gray-900">
                            ₫
                            {product.salePrice?.toLocaleString()}
                          </span>

                          <span className="text-sm text-gray-400 line-through">
                            ₫
                            {product.price.toLocaleString()}
                          </span>
                        </div>

                        {/* SAVE */}

                        <p className="mt-2 text-xs font-bold text-green-600">
                          {t("sale.saveAmount", { amount: (product.price - (product.salePrice || 0)).toLocaleString() })}
                        </p>

                        {/* BUTTON */}

                        <button
                          className="
                            mt-4
                            w-full
                            py-3
                            rounded-2xl
                            bg-black
                            text-white
                            font-black
                            hover:bg-gray-900
                            transition
                          "
                        >
                          {t("products.addToCart")}
                        </button>
                      </div>
                    </div>

                    {/* HOVER GLOW */}

                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                      <div className="absolute inset-0 bg-rose-200/30 blur-3xl" />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}