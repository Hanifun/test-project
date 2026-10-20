"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  UserCheck,
  Search,
  ArrowRight,
  ArrowLeft,
  LayoutDashboard,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
} from "lucide-react";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import FormLaporan from "@/components/FormLaporan";
import ModalTiket from "@/components/ModalTiket";
import { AuthService } from "@/lib/data";
import { Profile } from "@/types";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryMode = searchParams.get("mode");

  const [user, setUser] = useState<Profile | null>(null);
  const [selectedMode, setSelectedMode] = useState<"anonim" | "identitas" | null>(
    queryMode === "anonim" || queryMode === "identitas" ? queryMode : null
  );
  const [submittedKode, setSubmittedKode] = useState<string | null>(null);

  useEffect(() => {
    setUser(AuthService.getUser());
  }, []);

  useEffect(() => {
    if (queryMode === "anonim" || queryMode === "identitas") {
      setSelectedMode(queryMode);
    }
  }, [queryMode]);

  // Aksi memilih "Lapor Pakai Identitas"
  const handlePilihIdentitas = () => {
    if (user) {
      setSelectedMode("identitas");
    } else {
      router.push("/login?redirect=/?mode=identitas");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/50">
      {/* TAMPILAN 1: TIGA PILIHAN UTAMA LAYANAN (SEBELUM FORM) */}
      {!selectedMode ? (
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10 sm:py-14 flex flex-col justify-center">
          {/* Header Portal Utama */}
          <div className="text-center mb-8 sm:mb-12">


            <Logo size="lg" showTagline={true} href="/" className="justify-center mb-3" />

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-3">
              Layanan Pengaduan Bullying
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
              Ruang aman dan terpercaya untuk seluruh siswa. Pilih salah satu layanan di bawah ini:
            </p>

            {/* Banner Status Akun jika siswa sudah login */}
            {user && (
              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white border border-amber-200 text-xs text-stone-700 shadow-2xs">
                <span>Masuk sebagai: <strong>{user.nama}</strong> ({user.nisn_kelas || "Siswa"})</span>
                <span className="text-stone-300">•</span>
                <Link
                  href={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                  className="font-bold text-amber-700 hover:text-amber-800 underline inline-flex items-center gap-1"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Buka Dashboard
                </Link>
              </div>
            )}
          </div>

          {/* TIGA PILIHAN UTAMA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* PILIHAN 1: Lapor Pengaduan Anonim */}
            <div
              onClick={() => setSelectedMode("anonim")}
              className="group bg-white hover:bg-amber-50/60 rounded-3xl p-6 sm:p-7 border-2 border-stone-200/90 hover:border-amber-400 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                    <ShieldAlert className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    100% Rahasia
                  </span>
                </div>

                <h2 className="text-lg font-black text-stone-900 group-hover:text-amber-900 tracking-tight transition-colors">
                  Lapor Anonim
                </h2>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  Identitasmu sama sekali tidak dicatat atau ditampilkan ke siapapun. Langsung sampaikan pengaduan tanpa perlu login akun.
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  className="btn-primary w-full py-2.5 text-xs sm:text-sm font-bold shadow-xs cursor-pointer group-hover:bg-amber-500"
                >
                  Mulai Lapor Anonim <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* PILIHAN 2: Lapor Pakai Identitas */}
            <div
              onClick={handlePilihIdentitas}
              className="group bg-white hover:bg-amber-50/60 rounded-3xl p-6 sm:p-7 border-2 border-stone-200/90 hover:border-amber-400 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                    <UserCheck className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                    Akun Siswa
                  </span>
                </div>

                <h2 className="text-lg font-black text-stone-900 group-hover:text-amber-900 tracking-tight transition-colors">
                  Lapor Pakai Identitas
                </h2>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  Melapor dengan nama resmi agar tim Admin sekolah dapat memberikan perlindungan dan pendampingan personal langsung.
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  className="btn-primary w-full py-2.5 text-xs sm:text-sm font-bold shadow-xs cursor-pointer group-hover:bg-amber-500"
                >
                  {user ? `Lapor sebagai ${user.nama.split(" ")[0]}` : "Masuk & Lapor Identitas"}{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* PILIHAN 3: Cek Laporan */}
            <div
              onClick={() => router.push("/status")}
              className="group bg-white hover:bg-amber-50/60 rounded-3xl p-6 sm:p-7 border-2 border-stone-200/90 hover:border-amber-400 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                    <Search className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-300">
                    Kode Tiket
                  </span>
                </div>

                <h2 className="text-lg font-black text-stone-900 group-hover:text-amber-900 tracking-tight transition-colors">
                  Cek Status Laporan
                </h2>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  Sudah pernah mengirimkan pengaduan? Masukkan kode tiket pelacakmu untuk melihat penanganan dan balasan dari Admin.
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  className="btn-secondary w-full py-2.5 text-xs sm:text-sm font-bold shadow-xs cursor-pointer hover:border-amber-400 hover:bg-white"
                >
                  Cek Status Aduan <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* TAMPILAN 2: FORMULIR PENGADUAN (SETELAH MEMILIH OPSI) */
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 sm:py-10">
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setSelectedMode(null)}
              className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-800 text-xs sm:text-sm font-bold bg-white px-3.5 py-2 rounded-2xl border border-stone-200/90 shadow-2xs hover:border-amber-400 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-amber-600" /> Kembali ke Pilihan Menu
            </button>
          </div>

          <div className="card p-6 sm:p-8 border border-amber-200/90 shadow-sm">
            <FormLaporan
              user={user}
              initialMode={selectedMode === "identitas" ? "siswa" : "anonim"}
              onBackToMenu={() => setSelectedMode(null)}
              onSuccess={(kode) => setSubmittedKode(kode)}
            />
          </div>
        </main>
      )}

      {/* Modal Tiket Sukses Setelah Laporan Terkirim */}
      {submittedKode && (
        <ModalTiket
          kode={submittedKode}
          onClose={() => setSubmittedKode(null)}
        />
      )}

      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-stone-400">Memuat layanan...</div>}>
      <HomeContent />
    </Suspense>
  );
}
