"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  User,
  Lock,
  ArrowRight,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthService } from "@/lib/data";

export default function LoginPage() {
  const router = useRouter();
  const [nisn, setNisn] = useState("");
  const [nama, setNama] = useState("");

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    AuthService.setUser({
      id: `siswa-${Date.now()}`,
      nama: nama.trim(),
      nisn_kelas: nisn.trim() || "Siswa Kelas",
      role: "siswa",
      created_at: new Date().toISOString(),
    });

    router.push("/dashboard");
  };

  const handleQuickDemo = () => {
    AuthService.loginDemoSiswa();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/60">
      <Navbar />

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-12 flex flex-col justify-center">
        {/* Tombol Kembali */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-stone-500 hover:text-amber-600 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Beranda
          </Link>
        </div>

        <div className="card p-6 sm:p-8 bg-white border border-amber-100 shadow-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-900 flex items-center justify-center mx-auto mb-3 shadow-sm shadow-amber-200">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-stone-900">
              Portal Masuk Siswa
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Masuk untuk memantau seluruh riwayat pengaduan yang pernah kamu buat.
            </p>
          </div>

          {/* Quick 1-Click Demo Login Button */}
          <div className="mb-6">
            <button
              onClick={handleQuickDemo}
              type="button"
              className="w-full p-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-900 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              1-Klik Demo: Masuk sbg Budi Santoso (XI IPA 2)
            </button>
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-amber-200" />
              </div>
              <span className="relative bg-white px-3 text-xs text-stone-400 font-semibold uppercase">
                Atau Isi Manual
              </span>
            </div>
          </div>

          {/* Manual Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="form-label">Nama Lengkap Siswa</label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="form-label">
                NISN & Kelas <span className="text-stone-400 font-normal">(opsional)</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: 0072349 - XI IPA 2"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                className="input"
              />
            </div>

            <button type="submit" className="btn-primary w-full py-3">
              Masuk ke Akun Saya <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Hint lapor anonim */}
          <div className="mt-6 pt-5 border-t border-amber-100 text-center text-xs text-stone-500">
            Ingin melapor tanpa diketahui identitasmu?{" "}
            <Link
              href="/lapor"
              className="font-bold text-amber-600 hover:text-amber-700 underline"
            >
              Gunakan Mode Anonim
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
