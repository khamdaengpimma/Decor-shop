"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

/* ── Types ── */
interface StoreSettings {
  storeName:    string;
  storeEmail:   string;
  storePhone:   string;
  storeAddress: string;
  currency:     string;
  timezone:     string;
  logoUrl:      string;
  taxRate:      string;
  shippingFee:  string;
  freeShippingThreshold: string;
}

interface AdminProfile {
  name:     string;
  email:    string;
  password: string;
  confirm:  string;
}

const EMPTY_STORE: StoreSettings = {
  storeName:    "",
  storeEmail:   "",
  storePhone:   "",
  storeAddress: "",
  currency:     "VND",
  timezone:     "Asia/Ho_Chi_Minh",
  logoUrl:      "",
  taxRate:      "0",
  shippingFee:  "0",
  freeShippingThreshold: "0",
};

const EMPTY_PROFILE: AdminProfile = { name: "", email: "", password: "", confirm: "" };

const CURRENCIES = ["USD","EUR","GBP","JPY","VND","AUD","CAD","SGD"];
const TIMEZONES  = ["UTC","Asia/Ho_Chi_Minh","Asia/Bangkok","Asia/Tokyo","Europe/London","America/New_York","America/Los_Angeles"];

/* ── Sidebar nav ── */
const NAV_ITEMS = [
  { href: "/admin",           label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/admin/products",  label: "Products",  icon: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" },
  { href: "/admin/orders",    label: "Orders",    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { href: "/admin/customers", label: "Customers", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M9 7a4 4 0 100 8 4 4 0 000-8z" },
  { href: "/admin/settings",  label: "Settings",  icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

/* ── Section tab config ── */
const TABS = [
  { key: "store",    label: "Store",    icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
  { key: "shipping", label: "Shipping", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 11a2 2 0 002 2h8a2 2 0 002-2L19 8" },
  { key: "profile",  label: "Profile",  icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { key: "danger",   label: "Danger",   icon: "M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function Settings() {
  const router   = useRouter();
  const pathname = usePathname();

  const [activeTab,   setActiveTab]   = useState<TabKey>("store");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [store,       setStore]       = useState<StoreSettings>(EMPTY_STORE);
  const [profile,     setProfile]     = useState<AdminProfile>(EMPTY_PROFILE);
  const [loading,     setLoading]     = useState(true);
  const [savingStore, setSavingStore] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [toastMsg,    setToastMsg]    = useState<string | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const token   = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  const headers = { Authorization: `Bearer ${token}` };

  /* ── Toast helper ── */
  const toast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  /* ── Auth + fetch settings ── */
  useEffect(() => {
    if (!token) { router.push("/login"); return; }
    Promise.all([
      axios.get("http://localhost:5000/api/settings",      { headers }),
      axios.get("http://localhost:5000/api/admin/profile", { headers }),
    ])
      .then(([s, p]) => {
        if (s.data) setStore({ ...EMPTY_STORE, ...s.data });
        if (p.data) setProfile((prev) => ({ ...prev, name: p.data.name, email: p.data.email }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const logout = () => { localStorage.removeItem("token"); router.push("/login"); };

  /* ── Save store settings ── */
  const saveStore = async () => {
    setSavingStore(true);
    try {
      await axios.put("http://localhost:5000/api/settings", store, { headers });
      toast("Store settings saved successfully.");
    } catch {
      toast("Failed to save settings.");
    } finally {
      setSavingStore(false);
    }
  };

  /* ── Save profile ── */
  const saveProfile = async () => {
    if (profile.password && profile.password !== profile.confirm) {
      toast("Passwords do not match.");
      return;
    }
    setSavingProfile(true);
    try {
      const payload: any = { name: profile.name, email: profile.email };
      if (profile.password) payload.password = profile.password;
      await axios.put("http://localhost:5000/api/admin/profile", payload, { headers });
      setProfile((p) => ({ ...p, password: "", confirm: "" }));
      toast("Profile updated successfully.");
    } catch {
      toast("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  /* ── Shared field component ── */
  const Field = ({
    label, value, onChange, type = "text", placeholder = "", hint = "",
  }: {
    label: string; value: string; onChange: (v: string) => void;
    type?: string; placeholder?: string; hint?: string;
  }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-black rounded-xl text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
      />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );

  const SelectField = ({
    label, value, onChange, options,
  }: {
    label: string; value: string; onChange: (v: string) => void; options: string[];
  }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-black rounded-xl text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="w-8 h-8 animate-spin text-amber-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

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
          <h1 className="text-base sm:text-lg font-bold text-gray-900 flex-1">Settings</h1>
          <span className="text-xs text-gray-400 hidden sm:block">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </span>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-6 space-y-5 max-w-3xl">

          {/* ── Tab bar ── */}
          <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1 shadow-sm w-fit">
            {TABS.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all
                  ${activeTab === key
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  } ${key === "danger" && activeTab !== "danger" ? "hover:bg-red-50 hover:text-red-500" : ""}`}
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
                <span className="hidden sm:block">{label}</span>
              </button>
            ))}
          </div>

          {/* ══════════════ STORE TAB ══════════════ */}
          {activeTab === "store" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-extrabold text-gray-900">Store Information</h2>
                <p className="text-xs text-gray-400 mt-0.5">Basic details shown to your customers.</p>
              </div>

              <div className="px-5 py-5 space-y-4">

                {/* Logo preview */}
                {store.logoUrl && (
                  <div className="flex items-center gap-3">
                    <img src={store.logoUrl} alt="logo" className="w-14 h-14 rounded-xl object-cover border border-gray-100" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Store Logo</p>
                      <p className="text-[11px] text-gray-400">Shown in your storefront header</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Store Name"  value={store.storeName}  onChange={(v) => setStore((s) => ({ ...s, storeName: v }))}  placeholder="Décor Shop" />
                  <Field label="Logo URL"    value={store.logoUrl}    onChange={(v) => setStore((s) => ({ ...s, logoUrl: v }))}    placeholder="https://…" type="url" />
                  <Field label="Email"       value={store.storeEmail} onChange={(v) => setStore((s) => ({ ...s, storeEmail: v }))} placeholder="hello@shop.com" type="email" />
                  <Field label="Phone"       value={store.storePhone} onChange={(v) => setStore((s) => ({ ...s, storePhone: v }))} placeholder="+1 555 000 0000" />
                </div>

                <Field
                  label="Address"
                  value={store.storeAddress}
                  onChange={(v) => setStore((s) => ({ ...s, storeAddress: v }))}
                  placeholder="123 Main St, City, Country"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField label="Currency" value={store.currency} onChange={(v) => setStore((s) => ({ ...s, currency: v }))} options={CURRENCIES} />
                  <SelectField label="Timezone" value={store.timezone} onChange={(v) => setStore((s) => ({ ...s, timezone: v }))} options={TIMEZONES} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Tax Rate (%)" value={store.taxRate}
                    onChange={(v) => setStore((s) => ({ ...s, taxRate: v }))}
                    type="number" placeholder="0" hint="Applied to all orders at checkout."
                  />
                </div>
              </div>

              <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
                <button onClick={saveStore} disabled={savingStore}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition active:scale-95">
                  {savingStore && (
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  {savingStore ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════ SHIPPING TAB ══════════════ */}
          {activeTab === "shipping" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-extrabold text-gray-900">Shipping Settings</h2>
                <p className="text-xs text-gray-400 mt-0.5">Control fees and free shipping thresholds.</p>
              </div>

              <div className="px-5 py-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Flat Shipping Fee ($)"
                    value={store.shippingFee}
                    onChange={(v) => setStore((s) => ({ ...s, shippingFee: v }))}
                    type="number" placeholder="5.00"
                    hint="Charged per order unless free shipping applies."
                  />
                  <Field
                    label="Free Shipping Threshold ($)"
                    value={store.freeShippingThreshold}
                    onChange={(v) => setStore((s) => ({ ...s, freeShippingThreshold: v }))}
                    type="number" placeholder="50.00"
                    hint="Orders above this amount get free shipping."
                  />
                </div>

                {/* Preview card */}
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 space-y-2">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">Preview</p>
                  <p className="text-sm text-gray-700">
                    Orders under <span className="font-bold">${store.freeShippingThreshold || "0"}</span> will be charged{" "}
                    <span className="font-bold">${store.shippingFee || "0"}</span> shipping.
                  </p>
                  <p className="text-sm text-gray-700">
                    Orders <span className="font-bold">${store.freeShippingThreshold || "0"}+</span> ship{" "}
                    <span className="font-bold text-green-600">free</span>.
                  </p>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
                <button onClick={saveStore} disabled={savingStore}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition active:scale-95">
                  {savingStore && (
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  {savingStore ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════ PROFILE TAB ══════════════ */}
          {activeTab === "profile" && (
            <div className="space-y-4">

              {/* Account info */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-extrabold text-gray-900">Admin Account</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Update your name and login email.</p>
                </div>
                <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" value={profile.name}  onChange={(v) => setProfile((p) => ({ ...p, name: v }))}  placeholder="Admin Name" />
                  <Field label="Email"     value={profile.email} onChange={(v) => setProfile((p) => ({ ...p, email: v }))} placeholder="admin@shop.com" type="email" />
                </div>
              </div>

              {/* Change password */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-extrabold text-gray-900">Change Password</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Leave blank to keep your current password.</p>
                </div>
                <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="New Password" value={profile.password}
                    onChange={(v) => setProfile((p) => ({ ...p, password: v }))}
                    type="password" placeholder="••••••••"
                    hint="Min. 8 characters recommended."
                  />
                  <Field
                    label="Confirm Password" value={profile.confirm}
                    onChange={(v) => setProfile((p) => ({ ...p, confirm: v }))}
                    type="password" placeholder="••••••••"
                    hint={profile.password && profile.confirm && profile.password !== profile.confirm
                      ? "⚠ Passwords do not match." : ""}
                  />
                </div>
                <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
                  <button onClick={saveProfile} disabled={savingProfile}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition active:scale-95">
                    {savingProfile && (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    )}
                    {savingProfile ? "Saving…" : "Update Profile"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ DANGER TAB ══════════════ */}
          {activeTab === "danger" && (
            <div className="space-y-4">

              {/* Clear orders */}
              <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-red-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-gray-900">Clear All Orders</h2>
                    <p className="text-xs text-red-400">Permanently deletes every order record.</p>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center justify-between gap-4">
                  <p className="text-sm text-gray-500">This cannot be undone. Revenue history will be lost.</p>
                  <button
                    onClick={() => setShowConfirmReset("orders" as any)}
                    className="flex-shrink-0 px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold rounded-xl transition">
                    Clear Orders
                  </button>
                </div>
              </div>

              {/* Clear products */}
              <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-red-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-gray-900">Clear All Products</h2>
                    <p className="text-xs text-red-400">Permanently removes every product listing.</p>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center justify-between gap-4">
                  <p className="text-sm text-gray-500">All product images and data will be deleted.</p>
                  <button
                    onClick={() => setShowConfirmReset("products" as any)}
                    className="flex-shrink-0 px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold rounded-xl transition">
                    Clear Products
                  </button>
                </div>
              </div>

              {/* Reset entire store */}
              <div className="bg-red-50 rounded-2xl border border-red-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-red-200 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-200 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-red-700">Reset Entire Store</h2>
                    <p className="text-xs text-red-500">Wipes all data — orders, products, and customers.</p>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center justify-between gap-4">
                  <p className="text-sm text-red-600 font-medium">⚠ There is no going back from this action.</p>
                  <button
                    onClick={() => setShowConfirmReset(true)}
                    className="flex-shrink-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition">
                    Reset Store
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── Toast ── */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {toastMsg}
        </div>
      )}

      {/* ── Danger confirm modal ── */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowConfirmReset(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Are you absolutely sure?</h3>
              <p className="text-sm text-gray-400 mt-1">This action is permanent and cannot be undone.</p>
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setShowConfirmReset(false)}
                className="px-5 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await axios.delete("http://localhost:5000/api/reset", { headers });
                    toast("Store reset successfully.");
                  } catch {
                    toast("Reset failed.");
                  } finally {
                    setShowConfirmReset(false);
                  }
                }}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition">
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}