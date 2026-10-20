"use client";

import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

export default function Navbar() {
  const pathname = usePathname();

  // 1. Jangan tampilkan di area admin internal
  if (pathname?.startsWith("/admin")) return null;

  // 2. Jangan tampilkan di halaman login siswa
  if (pathname === "/login") return null;

  // 3. Jangan tampilkan di halaman formulir pengaduan utama
  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-2xs">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo SafeReport */}
        <Logo size="sm" showTagline={true} href="/" />
      </div>
    </header>
  );
}
