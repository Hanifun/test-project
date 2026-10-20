"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, LayoutDashboard } from "lucide-react";
import Logo from "@/components/Logo";
import { AuthService } from "@/lib/data";
import { Profile } from "@/types";
import { useToast } from "@/components/ToastProvider";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { confirmModal, toast } = useToast();
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    setUser(AuthService.getUser());
  }, [pathname]);

  const handleLogout = async () => {
    const ok = await confirmModal({
      title: "Konfirmasi Keluar",
      message: "Apakah Anda yakin ingin keluar dari akun Anda?",
      confirmText: "Ya, Keluar",
      cancelText: "Batal",
      destructive: true,
    });

    if (ok) {
      AuthService.logout();
      setUser(null);
      toast("Anda berhasil keluar dari akun.", "info");
      router.push("/");
    }
  };

  // 1. Jangan tampilkan di area admin internal
  if (pathname?.startsWith("/admin")) return null;

  // 2. Pada halaman login siswa, jangan tampilkan navbar sama sekali sesuai instruksi standar web
  if (pathname === "/login") return null;

  // 3. Pada halaman utama (home) jika belum login, navbar tidak ditampilkan karena logo sudah ada di form
  if (pathname === "/" && !user) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-2xs">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo standar web */}
        {pathname !== "/" ? (
          <Logo size="sm" showTagline={true} href="/" />
        ) : (
          <div />
        )}

        {/* Menu Kanan (Tampil saat user sudah login) */}
        {user ? (
          <div className="flex items-center gap-2">
            <Link
              href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-900 text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="max-w-[120px] truncate">{user.nama.split(" ")[0]}</span>
            </Link>
            <button
              onClick={handleLogout}
              title="Keluar dari akun"
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
