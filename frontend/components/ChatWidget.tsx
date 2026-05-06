"use client";

import { useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div suppressHydrationWarning className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-[100] flex flex-col items-end gap-3 pb-safe">
      
      {/* ── Chat Options ── */}
      <div className={`flex flex-col items-end gap-3 transition-all duration-300 transform origin-bottom border-transparent ${open ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'}`}>
        
        {/* Messenger */}
        <a href="https://m.me/yourpage" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
          <span className="bg-white px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">Messenger</span>
          <div className="w-12 h-12 bg-[#0084ff] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 2C6.48 2 2 6.13 2 11.23c0 2.89 1.48 5.48 3.79 7.18v3.59l3.46-1.9a10.97 10.97 0 002.75.36c5.52 0 10-4.13 10-9.23S17.52 2 12 2zm1.09 12.39l-2.73-2.9-5.33 2.9 5.86-6.22 2.76 2.9 5.29-2.9-5.85 6.22z"/>
            </svg>
          </div>
        </a>

        {/* Zalo */}
        <a href="https://zalo.me/yourphone" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
          <span className="bg-white px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">Zalo</span>
          <div className="w-12 h-12 bg-[#0068ff] rounded-full flex items-center justify-center text-white shadow-lg text-[13px] tracking-wide font-extrabold hover:scale-110 transition-transform">
            Zalo
          </div>
        </a>

        {/* WhatsApp */}
        <a href="https://wa.me/yourphone" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
          <span className="bg-white px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">WhatsApp</span>
          <div className="w-12 h-12 bg-[#25d366] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.03 2.5a9.54 9.54 0 00-8.26 14.33l-1.34 4.01 4.14-1.31a9.53 9.53 0 0013.9-9.98 9.55 9.55 0 00-8.44-7.05zm5.12 13.56c-.23.63-1.34 1.22-1.85 1.28-.5.06-1.12.18-3.41-.75-2.76-1.13-4.53-4-4.66-4.18-.15-.17-1.12-1.48-1.12-2.83s.71-2.02.96-2.28c.24-.26.54-.32.72-.32s.35 0 .5.08c.15.08.38.64.43.74.05.1.08.23 0 .42-.08.18-.13.3-.26.46-.12.15-.26.34-.37.45-.12.13-.24.27-.1.52.12.24.55.94 1.18 1.49.8.7 1.45.92 1.69 1.05.24.12.38.1.52-.05.15-.15.65-.75.82-1 .18-.26.35-.22.58-.13.23.1 1.46.68 1.71.8.25.13.41.19.47.3s.06.63-.17 1.26z"/>
            </svg>
          </div>
        </a>

      </div>

      {/* ── Main Toggle Button ── */}
      <button 
        onClick={() => setOpen(!open)}
        className="relative w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-amber-500 hover:scale-105 transition-all outline-none focus:ring-4 focus:ring-amber-200 focus:ring-opacity-50"
      >
        <span className="absolute flex h-full w-full inset-0">
          {!open && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-40"></span>}
        </span>
        {open ? (
          <svg className="w-6 h-6 animate-in zoom-in duration-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 relative z-10 animate-in zoom-in duration-200" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

    </div>
  );
}
