// store/cart.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ── Types ── */
export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  category?: string;
  stock?: number;
}

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartState {
  items: CartItem[];
  add:       (product: Product) => void;
  decrement: (id: string)       => void;
  remove:    (id: string)       => void;
  clear:     ()                 => void;
}

/* ── Selector helper ── */
export const selectItemQty = (id: string) => (s: CartState) =>
  s.items.find((i) => i.product._id === id)?.qty ?? 0;

export const selectTotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

export const selectCount = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.qty, 0);


/* ── Store ── */
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      add: (product) =>
        set((s) => {
          const existing = s.items.find((i) => i.product._id === product._id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.product._id === product._id ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return { items: [...s.items, { product, qty: 1 }] };
        }),

      decrement: (id) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.product._id === id ? { ...i, qty: i.qty - 1 } : i))
            .filter((i) => i.qty > 0),
        })),

      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.product._id !== id) })),

      clear: () => set({ items: [] }),
    }),
    { name: "decor-cart" } // persists to localStorage
  )
);