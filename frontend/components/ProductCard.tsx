"use client";

import { useCart, selectItemQty } from "@/store/cart";
import { Product } from "@/store/cart";
import { useTranslations } from "@/lib/i18n";

import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  const t = useTranslations();
  const add       = useCart((s) => s.add);
  const decrement = useCart((s) => s.decrement);
  const remove    = useCart((s) => s.remove);
  const qty       = useCart(selectItemQty(product._id));

  const inCart    = qty > 0;
  const soldOut   = product.stock === 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group flex flex-col">

      {/* ── IMAGE ── */}
      <div className="relative overflow-hidden aspect-square bg-gray-100">
        <Link href={`/products/${product._id}`}>
          <img
            src={product.image ?? product.images?.[0] ?? "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Sold-out overlay */}
        {soldOut && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
              {t("products.outOfStock")}
            </span>
          </div>
        )}

        {/* Quick-add (hover, desktop, not sold out) */}
        {!inCart && !soldOut && (
          <button
            onClick={() => add(product)}
            aria-label="Quick add to cart"
            className="
              absolute bottom-2 left-1/2 -translate-x-1/2
              opacity-0 group-hover:opacity-100
              translate-y-2 group-hover:translate-y-0
              transition-all duration-200
              bg-white text-gray-900 text-xs font-semibold
              px-4 py-1.5 rounded-full shadow-md
              whitespace-nowrap hidden sm:block
            "
          >
            {t("products.quickAdd")}
          </button>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div className="p-3 flex flex-col flex-1">

        {/* Category badge */}
        {product.category && (
          <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide">
            {product.category}
          </span>
        )}

        {/* Name */}
        <Link href={`/products/${product._id}`} className="flex-1 mt-0.5">
          <h2 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 leading-snug hover:text-amber-500 transition-colors">
            {product.name}
          </h2>
        </Link>

        {/* Price row */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm sm:text-base font-bold text-gray-900">
            ₫{product.price.toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ₫{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* ── CART CONTROL ── */}
        <div className="mt-2.5">
          {soldOut ? (
            <button disabled
              className="w-full py-1.5 sm:py-2 bg-gray-100 text-gray-400 text-xs sm:text-sm font-semibold rounded-xl cursor-not-allowed">
              {t("products.unavailable")}
            </button>
          ) : !inCart ? (
            <button
              onClick={() => add(product)}
              className="w-full py-1.5 sm:py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-150"
            >
              {t("products.addToCart")}
            </button>
          ) : (
            <div className="flex items-center justify-between bg-gray-100 rounded-xl px-1 py-0.5">

              {/* Decrement / Remove */}
              <button
                onClick={() => qty === 1 ? remove(product._id) : decrement(product._id)}
                aria-label={qty === 1 ? "Remove from cart" : "Decrease quantity"}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-700 hover:bg-white hover:shadow-sm active:scale-90 transition-all duration-150 text-lg font-bold"
              >
                {qty === 1 ? (
                  <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                  </svg>
                ) : "−"}
              </button>

              {/* Quantity */}
              <span className="text-sm font-bold text-gray-800 min-w-[1.5rem] text-center">
                {qty}
              </span>

              {/* Increment */}
              <button
                onClick={() => add(product)}
                aria-label="Increase quantity"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-700 hover:bg-white hover:shadow-sm active:scale-90 transition-all duration-150 text-lg font-bold"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}