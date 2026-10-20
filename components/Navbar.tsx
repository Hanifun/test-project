"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, LogOut, LayoutDashboard } from "lucide-react";
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

  // Jangan tampilkan di area admin internal
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-amber-200/80 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-amber-400 text-stone-900 flex items-center justify-center shadow-xs group-hover:bg-amber-500 transition-colors">
            <ShieldCheck className="w-5 h-5 text-stone-900" />
          </div>
          <div>
            <div className="font-black text-stone-900 text-base tracking-tight group-hover:text-amber-700 transition-colors">
              SafeReport
            </div>
            <div className="text-[10px] text-stone-400 font-medium hidden sm:block">
              Layanan Pengaduan Bullying Sekolah
            </div>
          </div>
        </Link>

        {/* Menu Kanan (Hanya tampil saat user sudah login) */}
        {user ? (
          <div className="flex items-center gap-1.5">
            <Link
              href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-900 text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="max-w-[110px] truncate">{user.nama.split(" ")[0]}</span>
            </Link>
            <button
              onClick={handleLogout}
              title="Keluar"
              className="p-2 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
