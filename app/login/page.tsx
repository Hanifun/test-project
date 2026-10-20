"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthService, StudentService } from "@/lib/data";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const [nisn, setNisn] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nisn.trim()) {
      setError("Silakan masukkan NISN.");
      return;
    }

    const student = StudentService.login(nisn, password);
    if (!student) {
      setError("NISN atau kata sandi tidak cocok. Akun siswa didaftarkan oleh Admin di sekolah.");
      return;
    }

    // Set sesi profil siswa
    AuthService.setUser({
      id: student.id,
      nama: student.nama,
      nisn_kelas: `${student.nisn} - ${student.kelas}`,
      role: "siswa",
      created_at: student.created_at,
    });

    router.push(redirectTarget);
  };

  return (
    <div className="card p-6 sm:p-8 bg-white border border-amber-200/90 shadow-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-900 flex items-center justify-center mx-auto mb-3 shadow-xs">
          <User className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900">
          Masuk Akun Siswa
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Gunakan akun siswa yang telah didaftarkan oleh Admin sekolah.
        </p>
      </div>

      {/* Form Login Siswa */}
      <form onSubmit={handleStudentLogin} className="space-y-4">
        <div>
          <label className="form-label">Nomor Induk Siswa Nasional (NISN)</label>
          <input
            type="text"
            required
            placeholder="Masukkan NISN kamu"
            value={nisn}
            onChange={(e) => setNisn(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="form-label">Kata Sandi / PIN</label>
          <input
            type="password"
            required
            placeholder="Masukkan kata sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" className="btn-primary w-full py-3 text-sm font-bold shadow-xs">
          Masuk ke Akun Saya <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Informasi Melapor Anonim */}
      <div className="mt-6 pt-5 border-t border-amber-100 text-center space-y-2">
        <p className="text-xs text-stone-500 leading-relaxed">
          Belum punya akun atau ingin melapor tanpa nama?
        </p>
        <Link
          href="/"
          className="inline-block font-bold text-xs text-amber-700 hover:text-amber-800 underline"
        >
          Kirim Pengaduan Bebas Secara Anonim
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-amber-50/50">
      <Navbar />

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-12 flex flex-col justify-center">
        {/* Tombol Kembali ke Halaman Utama */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-stone-500 hover:text-amber-700 text-xs sm:text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Form Laporan
          </Link>
        </div>

        <Suspense fallback={<div className="text-center text-xs text-stone-400">Memuat form login...</div>}>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
