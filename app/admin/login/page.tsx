"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { AuthService } from "@/lib/data";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    AuthService.setUser({
      id: `admin-${Date.now()}`,
      nama: nama.trim(),
      nisn_kelas: "Guru BK / Staf Kesiswaan",
      email: email.trim() || "admin.bk@sekolah.id",
      role: "admin",
      created_at: new Date().toISOString(),
    });

    router.push("/admin/dashboard");
  };

  const handleQuickDemo = () => {
    AuthService.loginDemoAdmin();
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-900 text-stone-100 px-4 py-12 justify-center items-center">
      <div className="max-w-md w-full">
        {/* Tombol Kembali ke Beranda */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-stone-400 hover:text-amber-400 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Portal Siswa
          </Link>
        </div>

        <div className="bg-stone-800/90 border border-stone-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-400/20 font-black">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white">
              Portal Guru BK & Admin
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Khusus staf Bimbingan Konseling dan Satgas Pencegahan Kekerasan Sekolah.
            </p>
          </div>

          {/* Quick Demo Button */}
          <div className="mb-6">
            <button
              onClick={handleQuickDemo}
              type="button"
              className="w-full p-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-stone-900" />
              1-Klik Masuk Demo: Ibu Ratna, S.Pd (Guru BK)
            </button>
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-700" />
              </div>
              <span className="relative bg-stone-800 px-3 text-[11px] text-stone-400 font-semibold uppercase">
                Atau Masuk Staf
              </span>
            </div>
          </div>

          {/* Manual Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Nama Guru BK / Admin
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Ibu Ratna, S.Pd"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-700 text-white text-sm placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Email Sekolah / NIP
              </label>
              <input
                type="text"
                placeholder="bk@sekolah.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-700 text-white text-sm placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-stone-700 hover:bg-stone-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              Masuk Dashboard BK <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-stone-500">
            Akses diawasi oleh kebijakan perlindungan data & privasi peserta didik.
          </p>
        </div>
      </div>
    </div>
  );
}
