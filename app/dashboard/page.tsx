"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  PlusCircle,
  Clock,
  ShieldCheck,
  Search,
  LogOut,
  ChevronRight,
  Inbox,
  ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthService, LaporanService } from "@/lib/data";
import { formatTanggal } from "@/lib/utils";
import { Laporan, Profile } from "@/types";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [laporanList, setLaporanList] = useState<Laporan[]>([]);

  useEffect(() => {
    const current = AuthService.getUser();
    if (!current) {
      router.push("/login");
      return;
    }
    setUser(current);
    const list = LaporanService.getByPelaporId(current.id);
    setLaporanList(list);
  }, [router]);

  const handleLogout = () => {
    AuthService.logout();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Banner Profil Siswa */}
        <div className="card p-6 sm:p-7 mb-8 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-stone-900 border border-amber-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white text-stone-900 flex items-center justify-center font-black text-xl shadow-xs">
              {user.nama.charAt(0)}
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-extrabold text-stone-800/80">
                Dashboard Siswa
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                {user.nama}
              </h1>
              <p className="text-xs text-stone-800 font-medium mt-0.5">
                {user.nisn_kelas || "Siswa Terdaftar"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="btn-primary bg-stone-900 hover:bg-stone-800 text-white shadow-none text-xs sm:text-sm font-bold"
            >
              <PlusCircle className="w-4 h-4" /> Buat Aduan Baru
            </Link>
            <button
              onClick={handleLogout}
              className="btn-secondary bg-white hover:bg-stone-50 text-stone-800 border-none text-xs sm:text-sm font-bold cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </div>

        {/* Daftar Laporan Pengguna */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Riwayat Pengaduan Saya ({laporanList.length})
            </h2>
          </div>

          {laporanList.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {laporanList.map((item) => (
                <div
                  key={item.id}
                  className="card p-5 hover:border-amber-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-amber-200/80 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-xs sm:text-sm text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-lg border border-amber-300">
                        {item.kode_pelacak}
                      </span>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          item.status === "baru"
                            ? "badge-baru"
                            : item.status === "diverifikasi"
                            ? "badge-verifikasi"
                            : item.status === "diproses"
                            ? "badge-proses"
                            : "badge-selesai"
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-xs text-stone-400">
                        • {formatTanggal(item.tanggal_kejadian)}
                      </span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-sm capitalize">
                      Perundungan {item.kategori} di {item.lokasi}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-1">
                      {item.deskripsi}
                    </p>
                  </div>

                  <Link
                    href={`/status?kode=${item.kode_pelacak}`}
                    className="btn-secondary text-xs px-4 py-2 self-start sm:self-center shrink-0 font-bold"
                  >
                    Pantau Detail <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center bg-white border border-dashed border-amber-200">
              <Inbox className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-sm sm:text-base font-bold text-stone-800 mb-1">
                Belum Ada Pengaduan
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-5 leading-relaxed">
                Kamu belum pernah mengirim laporan dengan akun ini. Jika mengalami atau melihat perundungan, jangan ragu untuk bersuara.
              </p>
              <Link href="/" className="btn-primary text-xs px-6 py-2.5 font-bold">
                <PlusCircle className="w-4 h-4" /> Buat Pengaduan Sekarang
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
