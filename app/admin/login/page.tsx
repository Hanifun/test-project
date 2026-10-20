"use client";

import { RateLimiter } from "@/lib/security";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  KeyRound,
  UserPlus,
  LogIn,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { AdminService, AuthService } from "@/lib/data";

export default function AdminLoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // State Login
  const [loginEmail, setLoginEmail] = useState("admin@sekolah.id");
  const [loginPassword, setLoginPassword] = useState("admin");
  const [loginError, setLoginError] = useState<string | null>(null);

  // State Buat Akun Admin Baru
  const [regNama, setRegNama] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regJabatan, setRegJabatan] = useState("");
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    // Proteksi Brute Force (Maksimal 5 percobaan gagal per 5 menit)
    const rateCheck = RateLimiter.check("admin_login_attempt", 5, 5 * 60 * 1000, 2000);
    if (!rateCheck.allowed) {
      setLoginError(rateCheck.error || "Terlalu banyak percobaan login. Silakan tunggu.");
      return;
    }

    const admin = AdminService.login(loginEmail, loginPassword);
    if (!admin) {
      RateLimiter.record("admin_login_attempt");
      setLoginError("Email atau kata sandi tidak cocok. Percobaan gagal tercatat demi keamanan.");
      return;
    }

    AuthService.setUser({
      id: admin.id,
      nama: admin.nama,
      email: admin.email,
      nisn_kelas: admin.nip_jabatan || "Admin",
      role: "admin",
      created_at: admin.created_at,
    });

    router.push("/admin/dashboard");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNama.trim() || !regEmail.trim()) return;

    const newAdmin = AdminService.create({
      nama: regNama.trim(),
      email: regEmail.trim(),
      password: regPassword || "admin123",
      nip_jabatan: regJabatan.trim() || "Administrator Sekolah",
    });

    setRegSuccess(`Akun admin atas nama "${newAdmin.nama}" berhasil dibuat. Silakan masuk.`);
    setLoginEmail(newAdmin.email);
    setLoginPassword(newAdmin.password || "");
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-900 text-stone-100 px-4 py-12 justify-center items-center">
      <div className="max-w-md w-full">
        

        <div className="bg-stone-800/90 border border-stone-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xs">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center mx-auto mb-3 shadow-md font-black">
              <ShieldCheck className="w-6 h-6 text-stone-950" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Portal Admin
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Pusat kelola pengaduan dan manajemen akun siswa sekolah.
            </p>
          </div>

          {/* Tab Selector: Masuk / Buat Akun Admin */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-stone-900 border border-stone-700 mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "login"
                  ? "bg-amber-400 text-stone-950 shadow-xs"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Masuk Admin
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "register"
                  ? "bg-amber-400 text-stone-950 shadow-xs"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Buat Akun Admin
            </button>
          </div>

          {regSuccess && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{regSuccess}</span>
            </div>
          )}

          {activeTab === "login" ? (
            /* Tab 1: Form Login */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Email Admin / Admin
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@sekolah.id"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-700 text-white text-xs sm:text-sm placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan kata sandi"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-700 text-white text-xs sm:text-sm placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
              >
                Masuk Dashboard Admin <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 rounded-2xl bg-stone-900/90 border border-stone-700/80 text-[11px] text-stone-400 leading-relaxed">
                <span className="font-bold text-amber-300 block mb-0.5">Akun Bawaan Awal:</span>
                Email: <code className="text-stone-200">admin@sekolah.id</code> • Sandi: <code className="text-stone-200">admin</code>
              </div>
            </form>
          ) : (
            /* Tab 2: Form Buat Akun Admin */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Nama Lengkap Admin
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ibu Ratna, S.Pd"
                  value={regNama}
                  onChange={(e) => setRegNama(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-700 text-white text-xs sm:text-sm placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Email Admin
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@sekolah.sch.id"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-700 text-white text-xs sm:text-sm placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Jabatan / Unit
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Administrator Sekolah / Satgas Disiplin"
                  value={regJabatan}
                  onChange={(e) => setRegJabatan(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-700 text-white text-xs sm:text-sm placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-900 border border-stone-700 text-white text-xs sm:text-sm placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
              >
                Daftarkan Akun Admin Baru <UserPlus className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-[11px] text-stone-500">
            Akses terbatas hanya untuk staf yang berwenang.
          </p>
        </div>
      </div>
    </div>
  );
}
