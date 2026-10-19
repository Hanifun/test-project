"use client";

import { useState, useRef } from "react";
import {
  Send, Upload, X, Loader2, User, UserX,
  AlertCircle
} from "lucide-react";
import { FormLaporanData, KategoriBullying, PeranPelapor } from "@/types";
import { Profile } from "@/types";

const KATEGORI_OPTIONS: { value: KategoriBullying; label: string; emoji: string }[] = [
  { value: "verbal",      label: "Verbal",       emoji: "💬" },
  { value: "fisik",       label: "Fisik",         emoji: "👊" },
  { value: "cyber",       label: "Cyberbullying", emoji: "📱" },
  { value: "psikologis",  label: "Psikologis",    emoji: "🧠" },
  { value: "sosial",      label: "Sosial / Pengucilan", emoji: "👥" },
  { value: "lainnya",     label: "Lainnya",       emoji: "🔹" },
];

interface Props {
  user: Profile | null;
  onSuccess: (kode: string) => void;
}

export default function FormLaporan({ user, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<FormLaporanData>>({
    peran_pelapor: "korban",
    kategori: "verbal",
    tanggal_kejadian: new Date().toISOString().slice(0, 10),
  });

  const set = <K extends keyof FormLaporanData>(k: K, v: FormLaporanData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter((f) => f.size <= 5 * 1024 * 1024); // max 5 MB
    setSelectedFiles((prev) => [...prev, ...valid].slice(0, 3)); // max 3 file
    e.target.value = ""; // reset input agar bisa upload file sama lagi
  };

  const removeFile = (idx: number) =>
    setSelectedFiles((f) => f.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.lokasi?.trim()) {
      setError("Lokasi kejadian wajib diisi.");
      return;
    }
    if (!form.tanggal_kejadian) {
      setError("Tanggal kejadian wajib diisi.");
      return;
    }
    if (!form.deskripsi?.trim() || form.deskripsi.length < 20) {
      setError("Deskripsi minimal 20 karakter agar Guru BK bisa memahami kasusnya.");
      return;
    }

    setIsLoading(true);
    try {
      // Import data service
      const { LaporanService } = await import("@/lib/data");
      const laporan = await LaporanService.create(
        { ...form, bukti_files: selectedFiles } as FormLaporanData,
        user
      );
      onSuccess(laporan.kode_pelacak);
    } catch {
      setError("Gagal mengirim laporan. Coba lagi dalam beberapa saat.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Info mode anonim vs siswa */}
      <div className={`flex items-start gap-3 p-4 rounded-2xl border text-sm ${
        user
          ? "bg-blue-50 border-blue-200 text-blue-800"
          : "bg-emerald-50 border-emerald-200 text-emerald-800"
      }`}>
        <div className="shrink-0 mt-0.5">
          {user ? <User className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
        </div>
        <div>
          {user ? (
            <>
              <strong>Masuk sebagai {user.nama}.</strong>{" "}
              Laporan ini akan tercatat di akunmu, sehingga kamu bisa pantau lewat dashboard siswa.
            </>
          ) : (
            <>
              <strong>Mode Anonim Aktif.</strong>{" "}
              Identitasmu tidak tersimpan. Gunakan <em>kode tiket</em> untuk cek status laporan.
            </>
          )}
        </div>
      </div>

      {/* Peran */}
      <div>
        <label className="form-label">Kamu sebagai…</label>
        <div className="flex gap-3">
          {(["korban", "saksi"] as PeranPelapor[]).map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => set("peran_pelapor", p)}
              className={`flex-1 py-2.5 rounded-2xl border-2 text-sm font-bold transition-all ${
                form.peran_pelapor === p
                  ? "border-amber-400 bg-amber-50 text-amber-800 shadow-sm"
                  : "border-stone-200 bg-white text-stone-500 hover:border-amber-300"
              }`}
            >
              {p === "korban" ? "😔 Korban" : "👁️ Saksi"}
            </button>
          ))}
        </div>
      </div>

      {/* Kategori */}
      <div>
        <label className="form-label">Jenis Perundungan</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {KATEGORI_OPTIONS.map((k) => (
            <button
              type="button"
              key={k.value}
              onClick={() => set("kategori", k.value)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border-2 text-sm font-semibold text-left transition-all ${
                form.kategori === k.value
                  ? "border-amber-400 bg-amber-50 text-amber-800 shadow-sm"
                  : "border-stone-200 bg-white text-stone-500 hover:border-amber-300"
              }`}
            >
              <span>{k.emoji}</span> {k.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pelaku (opsional) */}
      <div>
        <label className="form-label">
          Inisial / Deskripsi Pelaku{" "}
          <span className="font-normal text-stone-400">(opsional)</span>
        </label>
        <input
          className="input"
          type="text"
          placeholder='Contoh: "Siswa kelas X berinisial R.S."'
          value={form.nama_pelaku ?? ""}
          onChange={(e) => set("nama_pelaku", e.target.value as never)}
        />
      </div>

      {/* Lokasi + Tanggal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">
            Lokasi Kejadian <span className="text-rose-500">*</span>
          </label>
          <input
            className="input"
            type="text"
            placeholder='Contoh: "Kantin", "Grup WA Kelas"'
            required
            value={form.lokasi ?? ""}
            onChange={(e) => set("lokasi", e.target.value as never)}
          />
        </div>
        <div>
          <label className="form-label">
            Tanggal Kejadian <span className="text-rose-500">*</span>
          </label>
          <input
            className="input"
            type="date"
            required
            max={new Date().toISOString().slice(0, 10)}
            value={form.tanggal_kejadian ?? ""}
            onChange={(e) => set("tanggal_kejadian", e.target.value as never)}
          />
        </div>
      </div>

      {/* Deskripsi */}
      <div>
        <label className="form-label">
          Ceritakan Apa yang Terjadi <span className="text-rose-500">*</span>
        </label>
        <textarea
          className="input resize-none"
          rows={5}
          placeholder="Ceritakan kejadian sejelas mungkin. Semakin detail, semakin mudah Guru BK menanganinya. Minimal 20 karakter."
          required
          minLength={20}
          value={form.deskripsi ?? ""}
          onChange={(e) => set("deskripsi", e.target.value as never)}
        />
        <div className="text-right text-xs text-stone-400 mt-1">
          {form.deskripsi?.length ?? 0} karakter
        </div>
      </div>

      {/* Bukti (opsional) */}
      <div>
        <label className="form-label">
          Bukti (Foto/Screenshot){" "}
          <span className="font-normal text-stone-400">(opsional, maks 3 file × 5 MB)</span>
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-amber-200 rounded-2xl p-4 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all"
        >
          <Upload className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
          <p className="text-sm text-stone-500">Klik untuk pilih file</p>
          <p className="text-xs text-stone-400">JPG, PNG, GIF, PDF, MP4</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/mp4,application/pdf"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        {selectedFiles.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {selectedFiles.map((f, i) => (
              <li key={i} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-100 text-sm">
                <span className="truncate max-w-[220px] text-stone-700">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-stone-400 hover:text-rose-500 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Kontak privat (opsional) */}
      <div>
        <label className="form-label">
          Kontak Privat{" "}
          <span className="font-normal text-stone-400">(opsional — khusus bila ingin dihubungi langsung)</span>
        </label>
        <input
          className="input"
          type="text"
          placeholder="Nomor WA atau email aman (hanya Guru BK yang bisa lihat)"
          value={form.kontak_opsional ?? ""}
          onChange={(e) => set("kontak_opsional", e.target.value as never)}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim…</>
        ) : (
          <><Send className="w-4 h-4" /> Kirim Laporan</>
        )}
      </button>

      <p className="text-center text-xs text-stone-400">
        Dengan mengirim, kamu setuju bahwa laporan ini akan diproses secara rahasia oleh Guru BK.
      </p>
    </form>
  );
}
