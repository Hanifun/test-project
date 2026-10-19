"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, HeartHandshake } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormLaporan from "@/components/FormLaporan";
import ModalTiket from "@/components/ModalTiket";
import { AuthService } from "@/lib/data";
import { Profile } from "@/types";

export default function LaporPage() {
  const [user, setUser] = useState<Profile | null>(null);
  const [submittedKode, setSubmittedKode] = useState<string | null>(null);

  useEffect(() => {
    setUser(AuthService.getUser());
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/60">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {/* Tombol Kembali & Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-stone-500 hover:text-amber-600 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>

        {/* Header Form */}
        <div className="card p-6 sm:p-8 mb-6 bg-gradient-to-br from-white via-amber-50/40 to-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-900 flex items-center justify-center shadow-sm shadow-amber-200">
              <HeartHandshake className="w-6 h-6 text-stone-900" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-stone-900">
                Formulir Pengaduan
              </h1>
              <p className="text-xs text-stone-500">
                Suaramu penting. Kami siap mendengarkan dan mendampingimu.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-100/60 border border-amber-200 text-xs text-amber-900 font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Laporanmu dilindungi dan hanya akan dibaca oleh tim Guru Bimbingan Konseling (BK) berwenang.
            </span>
          </div>
        </div>

        {/* Kontainer Form */}
        <div className="card p-6 sm:p-8">
          <FormLaporan
            user={user}
            onSuccess={(kode) => setSubmittedKode(kode)}
          />
        </div>
      </main>

      {/* Modal Tiket Sukses */}
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
