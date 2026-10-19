import Link from "next/link";
import { ShieldCheck, Phone, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-amber-100 bg-white mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">

          {/* Kolom 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-xl bg-amber-400 text-white flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-stone-800">SafeReport</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Platform pengaduan perundungan sekolah yang aman, rahasia, dan berpihak pada siswa.
            </p>
          </div>

          {/* Kolom 2: Kontak Darurat */}
          <div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-stone-700 mb-2">
              <Phone className="w-4 h-4 text-rose-500" />
              Bantuan Darurat
            </div>
            <ul className="text-xs text-stone-500 space-y-1.5">
              <li>
                <span className="font-semibold text-stone-700">Hotline SAPPA KemenPPPA:</span>{" "}
                <span className="text-rose-600 font-bold">129</span>
              </li>
              <li>
                <span className="font-semibold text-stone-700">WhatsApp SAPPA:</span>{" "}
                <span className="font-medium">08111-129-129</span>
              </li>
              <li>
                <span className="font-semibold text-stone-700">Polisi:</span>{" "}
                <span className="font-medium">110</span>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Privasi */}
          <div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-stone-700 mb-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              Jaminan Privasi
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Laporan anonim tidak menyimpan nama, IP, atau data perangkat. Hanya Guru BK yang berwenang dapat mengakses isi laporan.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-4 border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400">
          <span>© SafeReport — Proyek Pengaduan Lingkup Kelas & Sekolah</span>
          <Link
            href="/admin/login"
            className="hover:text-amber-600 transition-colors"
            title="Portal Guru BK"
          >
            Portal Staf BK →
          </Link>
        </div>
      </div>
    </footer>
  );
}
