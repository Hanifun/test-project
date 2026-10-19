import Link from "next/link";
import { ShieldCheck, Phone, Lock, HeartHandshake } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-amber-200/80 bg-white/80 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {/* Brand & Komitmen */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4 text-stone-900" />
              </div>
              <span className="font-black text-stone-900">SafeReport</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Layanan pelaporan perundungan sekolah yang aman, rahasia, dan berpihak kepada keselamatan peserta didik.
            </p>
          </div>

          {/* Kontak Darurat Nasional */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              <Phone className="w-3.5 h-3.5 text-rose-500" />
              Bantuan Darurat Anak
            </div>
            <ul className="text-xs text-stone-500 space-y-1">
              <li>
                <span className="font-semibold text-stone-700">Hotline SAPPA:</span>{" "}
                <span className="text-rose-600 font-bold">129</span>
              </li>
              <li>
                <span className="font-semibold text-stone-700">WhatsApp SAPPA:</span>{" "}
                <span className="font-medium">08111-129-129</span>
              </li>
              <li>
                <span className="font-semibold text-stone-700">Layanan Darurat:</span>{" "}
                <span className="font-medium">110 / 112</span>
              </li>
            </ul>
          </div>

          {/* Jaminan Privasi */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Kerahasiaan Data
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Laporan anonim tidak merekam identitas diri pelapor. Seluruh isi aduan hanya dapat diakses oleh Guru Bimbingan Konseling yang berwenang.
            </p>
          </div>
        </div>

        {/* Baris Bawah */}
        <div className="pt-4 border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400">
          <span>SafeReport • Sistem Pengaduan Terpadu Sekolah</span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hover:text-amber-700 transition-colors"
            >
              Masuk Akun Siswa
            </Link>
            <span>•</span>
            <Link
              href="/admin/login"
              className="hover:text-amber-700 font-bold transition-colors text-stone-600"
            >
              Portal Guru BK
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
