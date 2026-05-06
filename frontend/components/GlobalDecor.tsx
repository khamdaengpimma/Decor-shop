"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";

export default function GlobalDecor() {
  const pathname = usePathname();
  
  // Hide footer and chat on admin, login, and register pages to keep them focused
  if (
    pathname?.startsWith("/admin") || 
    pathname?.startsWith("/login") || 
    pathname?.startsWith("/register")
  ) {
    return null;
  }

  return (
    <>
      <Footer />
      <ChatWidget />
    </>
  );
}
