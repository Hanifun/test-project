"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Filter,
  LogOut,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  User,
  UserX,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronRight,
  X,
} from "lucide-react";
import { AuthService, LaporanService } from "@/lib/data";
import { formatTanggal, formatTanggalWaktu } from "@/lib/utils";
import { Laporan, Profile, StatusLaporan, KategoriBullying } from "@/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Profile | null>(null);
  const [laporanList, setLaporanList] = useState<Laporan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("semua");
  const [selectedKategori, setSelectedKategori] = useState<string>("semua");

  // State untuk modal detail laporan
  const [activeLaporan, setActiveLaporan] = useState<Laporan | null>(null);
  const [balasanPesan, setBalasanPesan] = useState("");
  const [isSendingBalasan, setIsSendingBalasan] = useState(false);

  // Muat data awal
  const loadData = () => {
    const list = LaporanService.getAll();
    setLaporanList(list);
  };

  useEffect(() => {
    const user = AuthService.getUser();
    if (!user || user.role !== "admin") {
      router.push("/admin/login");
      return;
    }
    setAdmin(user);
    loadData();
  }, [router]);

  const handleLogout = () => {
    AuthService.logout();
    router.push("/");
  };

  // Ubah status laporan
  const handleChangeStatus = (id: string, newStatus: StatusLaporan) => {
    LaporanService.updateStatus(id, newStatus);
    loadData();
    if (activeLaporan && activeLaporan.id === id) {
      setActiveLaporan({ ...activeLaporan, status: newStatus });
    }
  };

  // Tambah balasan tindak lanjut
  const handleKirimBalasan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLaporan || !balasanPesan.trim() || !admin) return;

    setIsSendingBalasan(true);
    LaporanService.addTindakLanjut(activeLaporan.id, balasanPesan.trim(), admin.nama);
    setBalasanPesan("");
    loadData();

    // Perbarui activeLaporan agar balasan langsung terlihat di modal
    const updated = LaporanService.getByKode(activeLaporan.kode_pelacak);
    if (updated) setActiveLaporan(updated);
    setIsSendingBalasan(false);
  };

  // Filter list
  const filteredList = laporanList.filter((item) => {
    const matchQuery =
      item.kode_pelacak.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nama_pelaku && item.nama_pelaku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.nama_pelapor && item.nama_pelapor.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStatus =
      selectedStatus === "semua" || item.status === selectedStatus;

    const matchKategori =
      selectedKategori === "semua" || item.kategori === selectedKategori;

    return matchQuery && matchStatus && matchKategori;
  });

  // Statistik ringkas
  const countTotal = laporanList.length;
  const countBaru = laporanList.filter((l) => l.status === "baru").length;
  const countProses = laporanList.filter((l) => l.status === "diproses" || l.status === "diverifikasi").length;
  const countSelesai = laporanList.filter((l) => l.status === "selesai").length;

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Topbar Admin */}
      <header className="bg-stone-900 text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black flex items-center gap-2">
                SafeReport <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">PORTAL BK</span>
              </div>
              <div className="text-[11px] text-stone-400">
                {admin.nama} • {admin.nisn_kelas || "Staf Bimbingan Konseling"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-amber-300 font-semibold transition-colors"
            >
              Lihat Portal Siswa <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-rose-900/50 hover:text-rose-300 text-stone-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Konten Dashboard */}
      <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 space-y-6">
        {/* Kartu Ringkasan Metrik */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="card p-4 sm:p-5 border-l-4 border-l-stone-700">
            <div className="text-xs text-stone-500 font-bold uppercase tracking-wider">Total Laporan</div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">{countTotal}</div>
          </div>
          <div className="card p-4 sm:p-5 border-l-4 border-l-rose-500 bg-rose-50/30">
            <div className="text-xs text-rose-700 font-bold uppercase tracking-wider">Perlu Ditinjau (Baru)</div>
            <div className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">{countBaru}</div>
          </div>
          <div className="card p-4 sm:p-5 border-l-4 border-l-blue-500 bg-blue-50/30">
            <div className="text-xs text-blue-700 font-bold uppercase tracking-wider">Sedang Diproses</div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">{countProses}</div>
          </div>
          <div className="card p-4 sm:p-5 border-l-4 border-l-emerald-500 bg-emerald-50/30">
            <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Terselesaikan</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{countSelesai}</div>
          </div>
        </div>

        {/* Bar Filter & Pencarian */}
        <div className="card p-4 flex flex-col md:flex-row items-center gap-3">
          {/* Input Pencarian */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode tiket, lokasi, pelaku, nama pelapor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="semua">Semua Status</option>
              <option value="baru">Baru</option>
              <option value="diverifikasi">Diverifikasi</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
            </select>

            {/* Filter Kategori */}
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="semua">Semua Kategori</option>
              <option value="verbal">Verbal</option>
              <option value="fisik">Fisik</option>
              <option value="cyber">Cyberbullying</option>
              <option value="psikologis">Psikologis</option>
              <option value="sosial">Sosial</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        {/* Tabel / List Pengaduan */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-extrabold text-stone-800 text-sm sm:text-base">
              Daftar Pengaduan Siswa ({filteredList.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[11px] border-b border-stone-100">
                <tr>
                  <th className="py-3 px-4">Kode Tiket</th>
                  <th className="py-3 px-4">Tgl & Kategori</th>
                  <th className="py-3 px-4">Pelapor</th>
                  <th className="py-3 px-4">Pelaku / Lokasi</th>
                  <th className="py-3 px-4">Status Kasus</th>
                  <th className="py-3 px-4 text-right">Aksi BK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                    {/* Kode Tiket */}
                    <td className="py-3.5 px-4 font-mono font-black text-amber-600">
                      {item.kode_pelacak}
                    </td>

                    {/* Tgl & Kategori */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-800 capitalize">
                        {item.kategori}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        {formatTanggal(item.tanggal_kejadian)}
                      </div>
                    </td>

                    {/* Pelapor */}
                    <td className="py-3.5 px-4">
                      {item.is_anonim ? (
                        <span className="inline-flex items-center gap-1 text-stone-500 font-medium text-xs">
                          <UserX className="w-3.5 h-3.5 text-stone-400" /> Anonim ({item.peran_pelapor})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-blue-700 font-semibold text-xs">
                          <User className="w-3.5 h-3.5 text-blue-500" /> {item.nama_pelapor}
                        </span>
                      )}
                    </td>

                    {/* Pelaku / Lokasi */}
                    <td className="py-3.5 px-4">
                      <div className="text-stone-800 font-medium truncate max-w-[180px]">
                        {item.nama_pelaku || "Tidak disebutkan"}
                      </div>
                      <div className="text-[11px] text-stone-400 truncate max-w-[180px]">
                        📍 {item.lokasi}
                      </div>
                    </td>

                    {/* Status Kasus */}
                    <td className="py-3.5 px-4">
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
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveLaporan(item)}
                        className="btn-primary text-xs px-3 py-1.5"
                      >
                        Kelola Kasus <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-400 text-xs">
                      Tidak ada laporan yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Detail & Manajemen Kasus BK */}
      {activeLaporan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200 animate-pop-in">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-amber-400 font-bold uppercase">
                  Detail Laporan • {activeLaporan.kode_pelacak}
                </div>
                <h3 className="text-lg font-black text-white">
                  Bullying {activeLaporan.kategori} di {activeLaporan.lokasi}
                </h3>
              </div>
              <button
                onClick={() => setActiveLaporan(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              {/* Box Info Identitas & Status */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <div>
                  <span className="text-stone-400 block text-[11px]">Pelapor</span>
                  <strong className="text-stone-800">
                    {activeLaporan.is_anonim ? "Anonim (Privasi Terjaga)" : activeLaporan.nama_pelapor}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Peran</span>
                  <strong className="text-stone-800 capitalize">
                    {activeLaporan.peran_pelapor}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Tanggal Kejadian</span>
                  <strong className="text-stone-800">
                    {formatTanggal(activeLaporan.tanggal_kejadian)}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Terduga Pelaku</span>
                  <strong className="text-stone-800">
                    {activeLaporan.nama_pelaku || "-"}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Kontak Privat Pelapor</span>
                  <strong className="text-amber-800">
                    {activeLaporan.kontak_opsional || "(Tidak disertakan)"}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Status Saat Ini</span>
                  <span className="font-extrabold text-stone-800 uppercase">
                    {activeLaporan.status}
                  </span>
                </div>
              </div>

              {/* Deskripsi Lengkap */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Kronologi / Cerita Kejadian:
                </label>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 whitespace-pre-wrap leading-relaxed">
                  {activeLaporan.deskripsi}
                </div>
              </div>

              {/* Bukti Lampiran */}
              {activeLaporan.bukti && activeLaporan.bukti.length > 0 && (
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Bukti File ({activeLaporan.bukti.length}):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {activeLaporan.bukti.map((b) => (
                      <div key={b.id} className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                        <span className="truncate text-xs text-stone-700 font-medium">{b.nama_file}</span>
                        {b.url && (
                          <a
                            href={b.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-amber-600 font-bold text-xs hover:underline shrink-0 ml-2"
                          >
                            Buka Bukti
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ubah Status Laporan */}
              <div className="pt-3 border-t border-stone-100">
                <label className="font-bold text-stone-800 block mb-2">
                  Update Tahap Status Laporan:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["baru", "diverifikasi", "diproses", "selesai"] as StatusLaporan[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleChangeStatus(activeLaporan.id, st)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                        activeLaporan.status === st
                          ? "bg-amber-400 text-stone-950 shadow-sm"
                          : "bg-stone-100 hover:bg-stone-200 text-stone-600"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed Tindak Lanjut & Form Kirim Balasan */}
              <div className="pt-3 border-t border-stone-100 space-y-3">
                <label className="font-bold text-stone-800 block">
                  Riwayat Balasan & Pendampingan BK:
                </label>

                {activeLaporan.tindak_lanjut && activeLaporan.tindak_lanjut.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {activeLaporan.tindak_lanjut.map((tl) => (
                      <div key={tl.id} className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                        <div className="flex items-center justify-between text-stone-400 text-[10px] mb-1">
                          <strong className="text-amber-800">{tl.oleh_nama}</strong>
                          <span>{formatTanggalWaktu(tl.created_at)}</span>
                        </div>
                        <p className="text-stone-700">{tl.pesan}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic">Belum ada catatan tindak lanjut.</p>
                )}

                {/* Form Kirim Balasan Baru */}
                <form onSubmit={handleKirimBalasan} className="space-y-2">
                  <textarea
                    rows={3}
                    placeholder="Tulis balasan / catatan penanganan kasus untuk pelapor (bisa dilihat oleh pelapor menggunakan kode tiket)..."
                    value={balasanPesan}
                    onChange={(e) => setBalasanPesan(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSendingBalasan || !balasanPesan.trim()}
                      className="btn-primary text-xs px-4 py-2 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" /> Kirim Balasan ke Siswa
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveLaporan(null)}
                className="btn-secondary text-xs px-4 py-2"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
