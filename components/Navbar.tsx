"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, Search, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { AuthService } from "@/lib/data";
import { Profile } from "@/types";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    setUser(AuthService.getUser());
  }, [pathname]);

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    router.push("/");
  };

  // Jangan tampilkan navbar di halaman admin
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-amber-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-amber-400 text-white flex items-center justify-center shadow-sm shadow-amber-200 group-hover:bg-amber-500 transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-stone-900 text-base tracking-tight group-hover:text-amber-600 transition-colors">
              SafeReport
            </div>
            <div className="text-[10px] text-stone-400 font-medium hidden sm:block">
              Pengaduan Bullying Aman & Rahasia
            </div>
          </div>
        </Link>

        {/* Badge anonim aktif (hanya di halaman publik non-admin) */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Mode Anonim Aktif
        </div>

        {/* Nav kanan */}
        <div className="flex items-center gap-2">
          <Link
            href="/status"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
              pathname === "/status"
                ? "bg-amber-100 text-amber-700"
                : "text-stone-600 hover:bg-amber-50 hover:text-amber-700"
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Cek Status</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-900 text-sm font-bold shadow-sm transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="max-w-[100px] truncate">{user.nama.split(" ")[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Keluar"
                className="p-2 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-700 text-white text-sm font-bold transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Siswa</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
