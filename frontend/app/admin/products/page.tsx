"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import jwt from "jsonwebtoken";
/* ── Types ── */
interface Product {
  description: string;
  _id:    string;
  name:   string;
  price:  number;
  stock?: number;
  image?: string;
  images?: string[];
  category?: string;
}

interface ProductForm {
  name:     string;
  price:    string;
  description: string;
  stock:    string;
  image:    string;
  category: string;
}

const EMPTY_FORM: ProductForm = { name: "", price: "", description: "", stock: "", image: "", category: "" };

/* ── Sidebar nav ── */
const NAV_ITEMS = [
  { href: "/admin",           label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/admin/products",  label: "Products",  icon: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" },
  { href: "/admin/orders",    label: "Orders",    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/admin/customers", label: "Customers", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 7a4 4 0 100 8 4 4 0 000-8z" },
  { href: "/admin/settings",  label: "Settings",  icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

export default function Products() {
  const router   = useRouter();
  const pathname = usePathname();

  const [products,    setProducts]    = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search,      setSearch]      = useState("");
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editTarget,  setEditTarget]  = useState<Product | null>(null);
  const [form,        setForm]        = useState<ProductForm>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const getHeaders = () => {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
    return { Authorization: `Bearer ${t}` };
  };

  /* ── Auth guard + fetch ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    const decoded = jwt.decode(token) as any;
    if (!decoded || decoded.role !== "admin") {
      router.push("/");
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products", { headers: getHeaders() });
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => { localStorage.removeItem("token"); router.push("/login"); };

  /* ── Open modal ── */
  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditTarget(p);
    setForm({
      name:     p.name,
      price:    String(p.price),
      description: p.description ?? "",
      stock:    String(p.stock ?? ""),
      image:    p.image ?? p.images?.[0] ?? "",
      category: p.category ?? "",
    });
    setModalOpen(true);
  };

  /* ── Save (add or edit) ── */
  const save = async () => {
    if (!form.name.trim() || form.price === "" || form.price === null) return;
    setSaving(true);
    const payload = Object.fromEntries(
  Object.entries({
    name: form.name.trim(),
    price: parseFloat(form.price),
    description: form.description.trim(),
    stock: form.stock !== "" ? parseInt(form.stock) : undefined,
    images: form.image ? [form.image.trim()] : [], // ✔ đúng schema
    category: form.category.trim() || undefined,
  }).filter(([_, v]) => v !== undefined)
);
console.log(payload);
    try {
      const headers = getHeaders();
      if (editTarget) {
        await axios.put(`http://localhost:5000/api/products/${editTarget._id}`, payload, { headers });
        console.log("Product updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/products", payload, { headers });
        console.log("Product added successfully");
      }
      await fetchProducts();
      setModalOpen(false);
    } catch {
      alert("Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const deleteProduct = async (id: string) => {
    setDeleting(id);
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, { headers: getHeaders() });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete product.");
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
  };

  /* ── Filtered list ── */
  const visible = useMemo(() =>
    products.filter((p) =>
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    ),
    [products, search]
  );

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
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 flex-1">Products</h1>
          <span className="text-xs text-gray-400 hidden sm:block" suppressHydrationWarning>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </span>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-6 space-y-5">

          {/* ── Stat bar ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Total Products", value: products.length,   color: "text-blue-600",  bg: "bg-blue-50"  },
              { label: "In Stock",       value: products.filter(p => (p.stock ?? 1) > 0).length, color: "text-green-600", bg: "bg-green-50" },
              { label: "Out of Stock",   value: products.filter(p => p.stock === 0).length, color: "text-red-500",   bg: "bg-red-50"   },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${bg} ${color} flex items-center justify-center font-extrabold text-sm`}>
                  {value}
                </div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
              </div>
            ))}
          </div>

          {/* ── Toolbar ── */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or category…"
                className="w-full pl-9 pr-4 py-2.5 border border-black rounded-xl bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
              />
            </div>
            <button onClick={openAdd}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-sm active:scale-95 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>

          {/* ── Loading skeleton ── */}
          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-200 animate-pulse aspect-[3/4]" />
              ))}
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && visible.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-sm mb-4">No products found.</p>
              <button onClick={openAdd}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition">
                Add your first product
              </button>
            </div>
          )}

          {/* ── Product grid ── */}
          {!loading && visible.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visible.map((p) => {
                const thumb = p.image ?? p.images?.[0];
                const isDel = deleting === p._id;
                return (
                  <div key={p._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group flex flex-col">

                    {/* Image */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {thumb ? (
                        <img src={thumb} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">🪴</div>
                      )}
                      {/* Action overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(p)}
                          className="p-2 bg-white rounded-xl hover:bg-amber-50 transition shadow">
                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteConfirm(p._id)}
                          className="p-2 bg-white rounded-xl hover:bg-red-50 transition shadow">
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 flex flex-col flex-1">
                      {p.category && (
                        <span className="text-[10px] font-semibold text-amber-500 uppercase tracking-wide">{p.category}</span>
                      )}
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1 mt-0.5">{p.name}</p>
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="text-sm font-bold text-gray-900">${p.price.toLocaleString()}</span>
                        {p.stock !== undefined && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                            ${p.stock === 0 ? "bg-red-100 text-red-500" : "bg-green-100 text-green-600"}`}>
                            {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md z-10 overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-extrabold text-gray-900">
                {editTarget ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="px-5 py-4 space-y-3">

              {/* Image preview */}
              {form.image && (
                <div className="w-full h-36 rounded-xl overflow-hidden bg-gray-100">
                  <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}

              {[
                { key: "name",        label: "Product Name *", placeholder: "e.g. Ceramic Vase",    type: "text"   },
                { key: "price",       label: "Price (VND) *",  placeholder: "e.g. 10000",            type: "number" },
                { key: "description", label: "Description",    placeholder: "Product details...",    type: "textarea" },
                { key: "stock",       label: "Stock",          placeholder: "e.g. 20",               type: "number" },
                { key: "category",    label: "Category",       placeholder: "e.g. Vases, Lighting",  type: "text"   },
                { key: "image",       label: "Image URL",      placeholder: "https://…",             type: "url"    },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                  {type === "textarea" ? (
                    <textarea
                      value={(form as any)[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-black rounded-xl bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition resize-none"
                    />
                  ) : (
                    <input
                      type={type}
                      value={(form as any)[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-4 py-2.5 border border-black rounded-xl bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Modal footer */}
            <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={save} disabled={saving || !form.name.trim() || !form.price}
                className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition active:scale-95">
                {saving && (
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {saving ? "Saving…" : editTarget ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Delete Product?</h3>
              <p className="text-sm text-gray-400 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={() => deleteProduct(deleteConfirm)}
                disabled={deleting === deleteConfirm}
                className="flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition">
                {deleting === deleteConfirm ? (
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}