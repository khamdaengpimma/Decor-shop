"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "@/lib/i18n";

export default function AboutPage() {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-[#fcfbf9] min-h-screen font-sans">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-20 pb-32 overflow-hidden border-b border-gray-100">
        <div className="absolute top-10 left-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl mix-blend-multiply opacity-70 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl mix-blend-multiply opacity-70 pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            {t("about.heroTitle")}
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 font-light leading-relaxed mb-10">
            {t("about.heroDescription")}
          </p>
        </div>
      </section>

      {/* ── OUR STORY GRID ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-16">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Images */}
          <div className={`relative transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="aspect-[4/5] bg-gray-100 rounded-[2.5rem] overflow-hidden relative shadow-sm border border-white/50 group">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop&crop=center"
                alt="Modern living room interior"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="absolute -bottom-10 -right-10 w-2/3 aspect-[4/3] bg-white rounded-3xl p-3 shadow-xl backdrop-blur-md bg-white/70 border border-white">
              <div className="w-full h-full bg-gray-50 rounded-2xl relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=225&fit=crop&crop=center"
                  alt="Home decor details"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Right: Text */}
          <div className="pl-0 md:pl-10 space-y-8 mt-16 md:mt-0">
            <div>
              <span className="text-sm font-bold text-amber-500 tracking-widest uppercase mb-2 block">{t("about.ourStoryLabel")}</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-snug">
                {t("about.ourStoryTitle")}
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-600 leading-relaxed font-light">
              <p>{t("about.paragraph1")}</p>
              <p>{t("about.paragraph2")}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-100">
              <div>
                <p className="text-4xl font-extrabold text-gray-900">10k+</p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{t("about.statHomes")}</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-gray-900">4.9</p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{t("about.statRating")}</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── VALUES SECTION ── */}
      <section className="bg-white py-24 border-y border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-16">{t("about.promiseTitle")}</h2>
          
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              { icon: "🌱", title: t("about.promise1.title"), desc: t("about.promise1.desc") },
              { icon: "✨", title: t("about.promise2.title"), desc: t("about.promise2.desc") },
              { icon: "🛡️", title: t("about.promise3.title"), desc: t("about.promise3.desc") },
            ].map((val, i) => (
              <div key={i} className="flex flex-col items-center bg-gray-50/50 p-8 rounded-[2rem] hover:bg-amber-50/30 transition-colors border border-transparent hover:border-amber-100/50">
                <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center text-2xl mb-6">
                  {val.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{val.title}</h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 text-center pb-40">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{t("about.ctaTitle")}</h2>
        <p className="text-gray-500 mb-10 max-w-lg mx-auto">
          {t("about.ctaSubtitle")}
        </p>
        <Link href="/products" className="inline-block px-10 py-4 bg-gray-900 hover:bg-amber-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
          {t("about.exploreCollections")}
        </Link>
      </section>
    </div>
  );
}
