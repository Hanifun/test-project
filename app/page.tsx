"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Lock,
  HeartHandshake,
  ArrowRight,
  Info,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormLaporan from "@/components/FormLaporan";
import ModalTiket from "@/components/ModalTiket";
import { AuthService } from "@/lib/data";
import { Profile } from "@/types";

export default function HomePage() {
  const [user, setUser] = useState<Profile | null>(null);
  const [submittedKode, setSubmittedKode] = useState<string | null>(null);

  useEffect(() => {
    setUser(AuthService.getUser());
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/50">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 sm:py-10">
        {/* Banner Penjelasan Sederhana & Ramah */}
        <div className="card p-6 sm:p-7 mb-6 border border-amber-200/90 bg-gradient-to-br from-white via-amber-50/50 to-white shadow-xs">
          <div className="flex items-start gap-3.5 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-stone-900 flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-stone-900" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Lock className="w-3 h-3 text-amber-700" /> Pengaduan Rahasia & Bebas Hambatan
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                Sampaikan Pengaduan Bullying
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                Kamu bisa melapor secara <strong>100% Anonim</strong> tanpa harus login atau menyebutkan identitasmu. Laporan akan langsung ditangani oleh Guru Bimbingan Konseling (BK).
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 mt-3 border-t border-amber-100 text-xs text-stone-500">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Sudah pernah mengirim laporan?</span>
            </div>
            <Link
              href="/status"
              className="font-bold text-amber-700 hover:text-amber-800 underline inline-flex items-center gap-1"
            >
              Cek status laporan menggunakan Kode Tiket <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Kontainer Formulir Pengaduan */}
        <div className="card p-6 sm:p-8 border border-amber-200/90 shadow-sm">
          <FormLaporan
            user={user}
            onSuccess={(kode) => setSubmittedKode(kode)}
          />
        </div>
      </main>

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
