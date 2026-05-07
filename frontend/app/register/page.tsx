"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n";

export default function Register() {
  const t = useTranslations();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      setError(t("register.fillFields"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/api/users", form);
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || t("register.registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRegister();
  };

  const fields = [
    {
      name: "name",
      label: "register.fullName",
      type: "text",
      placeholder: "register.namePlaceholder",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      name: "email",
      label: "register.email",
      type: "email",
      placeholder: "register.emailPlaceholder",
      icon: "M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207",
    },
    {
      name: "password",
      label: "register.password",
      type: "password",
      placeholder: "register.passwordPlaceholder",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <span className="text-lg font-extrabold tracking-tight text-gray-900">
            Décor<span className="text-amber-500">Shop</span>
          </span>
          <p className="text-xs text-gray-400 mt-0.5">{t("register.subtitle")}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-3">

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <p className="text-xs font-medium text-red-500">{error}</p>
            </div>
          )}

          {fields.map(({ name, label, type, placeholder, icon }) => (
            <div key={name}>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{t(label)}</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
                <input
                  name={name}
                  type={type}
                  placeholder={t(placeholder)}
                  value={(form as any)[name]}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-9 pr-4 py-2.5 border border-black rounded-xl bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 space-y-3">
          <button
            onClick={handleRegister}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl shadow-sm active:scale-95 transition"
          >
            {loading && (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {loading ? t("register.creatingAccount") : t("register.createAccount")}
          </button>

          <p className="text-center text-xs text-gray-400">
            {t("register.alreadyHave")} {" "}
            <a href="/login" className="text-amber-500 font-semibold hover:text-amber-600 transition">
              {t("register.signIn")}
            </a>
          </p>
        </div>
            {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex md:hidden">
        {[
          { label: t("navbar.home"),    icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",               href: "/" },
          
        ].map(({ label, icon, href, active, action }: any) => (
          <Link key={label} href={href} onClick={action}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors
              ${active ? "text-amber-500" : "text-gray-500 hover:text-amber-500"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </nav>
      </div>
    </div>
  );
}