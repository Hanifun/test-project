"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Eye, EyeOff, Lock, User as UserIcon } from "lucide-react";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { AuthService, StudentService } from "@/lib/data";
import { useToast } from "@/components/ToastProvider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";
  const { toast } = useToast();

  const [nisn, setNisn] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validasi Pop-up Sesuai Standar Web
    if (!nisn.trim()) {
      toast("Silakan masukkan Nomor Induk Siswa Nasional (NISN) kamu.", "warning");
      return;
    }
    if (!password) {
      toast("Silakan masukkan kata sandi / PIN kamu.", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const student = StudentService.login(nisn, password);
      if (!student) {
        toast("NISN atau kata sandi tidak cocok. Akun siswa didaftarkan oleh Admin di sekolah.", "error");
        setIsLoading(false);
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

      toast(`Selamat datang kembali, ${student.nama.split(" ")[0]}!`, "success");
      router.push(redirectTarget);
    } catch {
      toast("Terjadi kendala saat memproses login. Silakan coba kembali.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-6 sm:p-8 bg-white border border-amber-200/90 shadow-sm">
      {/* Header Form Login dengan Logo Standar Web */}
      <div className="flex flex-col items-center text-center mb-6 pb-4 border-b border-stone-100">
        <Logo size="lg" showTagline={true} href="/" className="justify-center mb-4" />
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
          Masuk Akun Siswa
        </h1>
        <p className="text-xs text-stone-500 mt-1 max-w-xs">
          Gunakan akun siswa resmi yang telah didaftarkan oleh Admin sekolah.
        </p>
      </div>

      {/* Form Login Siswa */}
      <form onSubmit={handleStudentLogin} className="space-y-4">
        <div>
          <label className="form-label">Nomor Induk Siswa Nasional (NISN)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
              <UserIcon className="w-4 h-4" />
            </span>
            <input
              type="text"
              required
              placeholder="Masukkan NISN kamu"
              value={nisn}
              onChange={(e) => setNisn(e.target.value)}
              className="input pl-10 text-xs sm:text-sm"
              autoFocus
            />
          </div>
        </div>

        <div>
          <label className="form-label">Kata Sandi / PIN</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-10 pr-10 text-xs sm:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
              title={showPassword ? "Sembunyikan password" : "Lihat password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 text-sm font-bold shadow-xs cursor-pointer disabled:opacity-60"
        >
          {isLoading ? "Memeriksa Akun..." : "Masuk ke Akun Saya"} <ArrowRight className="w-4 h-4" />
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
      {/* Tanpa Navbar di halaman login siswa sesuai permintaan pengguna */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-10 flex flex-col justify-center">
        {/* Tombol Kembali ke Formulir Pengaduan */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-stone-500 hover:text-amber-700 text-xs sm:text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Formulir Pengaduan
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
