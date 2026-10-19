import Link from "next/link";
import { ShieldCheck, Send, Search, Lock, ArrowRight, Users, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Statistik dummy yang terlihat nyata
const STATS = [
  { label: "Laporan Masuk", value: "47", icon: <Send className="w-5 h-5" /> },
  { label: "Kasus Terselesaikan", value: "38", icon: <ShieldCheck className="w-5 h-5" /> },
  { label: "Siswa Terbantu", value: "53+", icon: <Users className="w-5 h-5" /> },
];

const FITUR = [
  {
    emoji: "🕵️",
    judul: "100% Anonim",
    deskripsi: "Laporkan tanpa takut. Identitasmu tidak pernah tersimpan kecuali kamu mau.",
  },
  {
    emoji: "🔒",
    judul: "Hanya Guru BK yang Akses",
    deskripsi: "Laporan dienkripsi dan hanya dapat dibuka oleh staf BK yang berwenang.",
  },
  {
    emoji: "📊",
    judul: "Pantau Prosesnya",
    deskripsi: "Setiap laporan punya kode tiket unik untuk melacak progres penanganannya.",
  },
  {
    emoji: "⚡",
    judul: "Langsung Ditangani",
    deskripsi: "Notifikasi otomatis ke Guru BK setiap ada laporan baru masuk.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50 py-20 px-4">
          {/* Dekorasi lingkaran blur */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-100/60 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-amber-200/40 blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-sm font-semibold mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Platform Aman untuk Bersuara
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight mb-5 animate-fade-in">
              Laporkan Perundungan{" "}
              <span className="text-amber-500 underline decoration-wavy decoration-amber-300/70 underline-offset-4">
                dengan Aman
              </span>
              , <br />Tanpa Takut
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto mb-8 leading-relaxed animate-fade-in">
              SafeReport membantu siswa melaporkan kejadian bullying secara anonim dan aman.
              Guru BK akan segera menindaklanjuti setiap laporan.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in">
              <Link
                href="/lapor"
                id="btn-hero-lapor"
                className="btn-primary text-base px-8 py-3.5 shadow-md shadow-amber-200"
              >
                <Send className="w-5 h-5" />
                Buat Laporan Sekarang
              </Link>
              <Link
                href="/status"
                className="btn-secondary text-base px-8 py-3.5"
              >
                <Search className="w-5 h-5" />
                Cek Status Laporan
              </Link>
            </div>
          </div>
        </section>

        {/* ===== STATISTIK ===== */}
        <section className="py-10 px-4 bg-white border-y border-amber-100">
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
                  {s.icon}
                </div>
                <div className="text-2xl font-extrabold text-stone-900">{s.value}</div>
                <div className="text-xs text-stone-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FITUR ===== */}
        <section className="py-16 px-4 bg-amber-50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-extrabold text-stone-900 mb-2">
                Kenapa SafeReport?
              </h2>
              <p className="text-stone-500 text-sm">
                Dirancang khusus untuk lingkungan sekolah dengan privasi dan keamanan sebagai prioritas utama.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FITUR.map((f) => (
                <div key={f.judul} className="card p-5 hover:shadow-md hover:border-amber-200 transition-all">
                  <div className="text-2xl mb-3">{f.emoji}</div>
                  <h3 className="font-bold text-stone-800 mb-1">{f.judul}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{f.deskripsi}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CARA PAKAI ===== */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-extrabold text-stone-900 mb-2">Cara Penggunaan</h2>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { no: "01", judul: "Isi Form Laporan", desc: "Ceritakan apa yang terjadi, boleh anonim, boleh pakai nama." },
                { no: "02", judul: "Simpan Kode Tiket", desc: "Setelah mengirim, kamu dapat kode unik. Screenshot dan simpan baik-baik." },
                { no: "03", judul: "Guru BK Menindaklanjuti", desc: "BK akan memproses laporan secara rahasia dan merespons dalam 1-2 hari." },
                { no: "04", judul: "Pantau Status", desc: "Pakai kode tiket di halaman /status untuk melihat perkembangan kasus." },
              ].map((s) => (
                <div key={s.no} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-amber-50 transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-700 font-extrabold text-sm flex items-center justify-center shrink-0 font-mono">
                    {s.no}
                  </div>
                  <div>
                    <div className="font-bold text-stone-800 mb-0.5">{s.judul}</div>
                    <div className="text-sm text-stone-500">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA BAWAH ===== */}
        <section className="py-14 px-4 bg-amber-400 text-center">
          <h2 className="text-2xl font-extrabold text-stone-900 mb-3">
            Kamu Tidak Sendirian 💛
          </h2>
          <p className="text-stone-800/80 text-sm mb-6 max-w-md mx-auto">
            Berani melapor adalah langkah pertama. SafeReport ada untuk mendampingimu.
          </p>
          <Link
            href="/lapor"
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold px-6 py-3 rounded-2xl transition-colors shadow-md"
          >
            Mulai Laporan <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
