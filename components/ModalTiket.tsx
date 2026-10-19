"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, Check, Camera, ArrowRight } from "lucide-react";

interface Props {
  kode: string;
  onClose: () => void;
}

export default function ModalTiket({ kode, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(kode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-amber-100 text-center animate-pop-in">

        {/* Garis atas dekoratif */}
        <div className="h-1.5 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 rounded-t-3xl -mx-6 -mt-6 mb-5" />

        {/* Icon sukses */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-extrabold text-stone-900 mb-1">
          Laporan Berhasil Terkirim! 🎉
        </h2>
        <p className="text-sm text-stone-500 mb-5 leading-relaxed">
          Terima kasih sudah berani bersuara. Guru BK akan segera menindaklanjuti laporanmu.
        </p>

        {/* Kode Tiket */}
        <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-4 mb-4 text-left">
          <p className="text-xs font-bold text-stone-500 mb-1.5 uppercase tracking-wider">
            Kode Tiket Pelacak
          </p>
          <div className="flex items-center justify-between gap-3">
            <span className="text-3xl font-extrabold font-mono tracking-widest text-amber-600 select-all">
              {kode}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-900 text-xs font-bold transition-colors"
            >
              {copied ? (
                <><Check className="w-3.5 h-3.5" /> Disalin!</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Salin</>
              )}
            </button>
          </div>
        </div>

        {/* Peringatan screenshot */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-left mb-5">
          <Camera className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Penting!</strong> Screenshot atau catat kode ini. Karena kamu melapor anonim, kode ini adalah satu-satunya cara untuk melihat balasan dari Guru BK.
          </p>
        </div>

        {/* Tombol aksi */}
        <div className="flex flex-col gap-2.5">
          <Link
            href={`/status?kode=${kode}`}
            className="btn-primary w-full py-2.5"
          >
            Cek Status Laporan <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={onClose}
            className="btn-secondary w-full py-2.5"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
