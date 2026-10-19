// =====================================================
// SafeReport — Data Store (Penyimpanan Data)
//
// Cara kerja "Dual Engine":
// 1. Kalau .env.local sudah diisi URL Supabase → data disimpan ke cloud
// 2. Kalau belum diisi → data disimpan di localStorage browser (buat demo/belajar)
//
// Ini artinya proyek bisa langsung dicoba TANPA setup database dulu!
// =====================================================

import { Laporan, FormLaporanData, StatusLaporan, TindakLanjut, BuktiFile, Profile } from "@/types";
import { generateKodePelacak } from "./utils";

// ---- KEY untuk localStorage ----
const STORAGE_KEY = "safereport_laporan";

// ---- Data demo bawaan (agar tidak kosong saat pertama dibuka) ----
const DEMO_DATA: Laporan[] = [
  {
    id: "demo-1",
    kode_pelacak: "SF-7K2X",
    is_anonim: true,
    pelapor_id: null,
    nama_pelapor: null,
    kontak_opsional: null,
    peran_pelapor: "korban",
    kategori: "verbal",
    nama_pelaku: "Siswa kelas XII (inisial R.A.)",
    lokasi: "Area Kantin",
    tanggal_kejadian: "2026-10-15",
    deskripsi:
      "Sering dipanggil dengan ejekan nama dan kata-kata kasar setiap jam istirahat di dekat kantin.",
    status: "diproses",
    tindak_lanjut: [
      {
        id: "tl-1",
        laporan_id: "demo-1",
        pesan:
          "Terima kasih sudah berani melapor. Laporan ini sudah kami verifikasi dan sedang dijadwalkan mediasi tertutup. Tetap semangat ya!",
        oleh_nama: "Ibu Ratna, S.Pd (Guru BK)",
        is_publik: true,
        created_at: "2026-10-16T11:00:00Z",
      },
    ],
    created_at: "2026-10-15T09:00:00Z",
    updated_at: "2026-10-16T11:00:00Z",
  },
  {
    id: "demo-2",
    kode_pelacak: "SF-9M3A",
    is_anonim: false,
    pelapor_id: "siswa-demo",
    nama_pelapor: "Budi Santoso (XI IPA 2)",
    kontak_opsional: null,
    peran_pelapor: "saksi",
    kategori: "cyber",
    nama_pelaku: "Akun anonim Instagram angkatan",
    lokasi: "Grup Chat & Instagram",
    tanggal_kejadian: "2026-10-17",
    deskripsi:
      "Ada foto teman sekelas yang diedit buruk dan disebarkan di grup angkatan. Korban terlihat sangat tertekan.",
    status: "diverifikasi",
    tindak_lanjut: [
      {
        id: "tl-2",
        laporan_id: "demo-2",
        pesan:
          "Laporan sudah diterima. Pihak kesiswaan sedang berkoordinasi dengan wali kelas untuk menangani kasus cyberbullying ini.",
        oleh_nama: "Pak Hendra (Kesiswaan)",
        is_publik: true,
        created_at: "2026-10-18T08:00:00Z",
      },
    ],
    created_at: "2026-10-17T14:00:00Z",
    updated_at: "2026-10-18T08:00:00Z",
  },
  {
    id: "demo-3",
    kode_pelacak: "SF-4P8Z",
    is_anonim: true,
    pelapor_id: null,
    nama_pelapor: null,
    kontak_opsional: "0812-xxxx-xxxx",
    peran_pelapor: "saksi",
    kategori: "fisik",
    nama_pelaku: "Geng 3 siswa kelas X",
    lokasi: "Belakang Musholla",
    tanggal_kejadian: "2026-10-12",
    deskripsi:
      "Melihat 3 siswa mendorong-dorong dan memaksa adik kelas X untuk menyerahkan uang jajannya.",
    status: "selesai",
    tindak_lanjut: [
      {
        id: "tl-3",
        laporan_id: "demo-3",
        pesan:
          "Pelaku telah dipanggil bersama orang tua masing-masing, menerima sanksi pendidikan, dan diwajibkan mengikuti bimbingan perilaku. Kasus dinyatakan selesai.",
        oleh_nama: "Ibu Ratna, S.Pd (Guru BK)",
        is_publik: true,
        created_at: "2026-10-14T15:00:00Z",
      },
    ],
    created_at: "2026-10-12T16:00:00Z",
    updated_at: "2026-10-14T15:00:00Z",
  },
];

// ---- Baca semua laporan dari localStorage ----
function readStorage(): Laporan[] {
  if (typeof window === "undefined") return DEMO_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Pertama kali: isi data demo
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_DATA));
      return DEMO_DATA;
    }
    return JSON.parse(raw) as Laporan[];
  } catch {
    return DEMO_DATA;
  }
}

// ---- Simpan semua laporan ke localStorage ----
function writeStorage(data: Laporan[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// =====================================================
// SERVICE: LAPORAN
// Kumpulan fungsi untuk CRUD data laporan
// =====================================================
export const LaporanService = {
  /** Ambil semua laporan (untuk dashboard admin) */
  getAll(): Laporan[] {
    return readStorage();
  },

  /** Cari laporan berdasarkan kode tiket (untuk halaman /status) */
  getByKode(kode: string): Laporan | null {
    const clean = kode.trim().toUpperCase();
    const list = readStorage();
    return list.find((l) => l.kode_pelacak === clean) ?? null;
  },

  /** Ambil laporan milik siswa tertentu (untuk dashboard siswa) */
  getByPelaporId(pelaporId: string): Laporan[] {
    return readStorage().filter((l) => l.pelapor_id === pelaporId);
  },

  /** Kirim laporan baru */
  async create(
    data: FormLaporanData,
    user: Profile | null
  ): Promise<Laporan> {
    const isAnonim = !user;
    const kode = generateKodePelacak("SF");

    // Proses file bukti → simpan sebagai data URL agar bisa ditampilkan offline
    const buktiList: BuktiFile[] = [];
    if (data.bukti_files && data.bukti_files.length > 0) {
      for (const file of data.bukti_files) {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve("");
          reader.readAsDataURL(file);
        });
        buktiList.push({
          id: `bukti-${Date.now()}-${Math.random()}`,
          nama_file: file.name,
          url: dataUrl,
          tipe_file: file.type,
          ukuran_byte: file.size,
        });
      }
    }

    const now = new Date().toISOString();
    const laporan: Laporan = {
      id: `lap-${Date.now()}`,
      kode_pelacak: kode,
      is_anonim: isAnonim,
      pelapor_id: user?.id ?? null,
      nama_pelapor: user ? `${user.nama} (${user.nisn_kelas ?? ""})` : null,
      kontak_opsional: data.kontak_opsional ?? null,
      peran_pelapor: data.peran_pelapor,
      kategori: data.kategori,
      nama_pelaku: data.nama_pelaku ?? null,
      lokasi: data.lokasi,
      tanggal_kejadian: data.tanggal_kejadian,
      deskripsi: data.deskripsi,
      bukti: buktiList,
      status: "baru",
      tindak_lanjut: [
        {
          id: `tl-auto-${Date.now()}`,
          laporan_id: `lap-${Date.now()}`,
          pesan:
            "Laporan berhasil masuk ke sistem. Tim Guru BK akan segera menindaklanjuti. Terima kasih sudah berani bersuara!",
          oleh_nama: "Sistem SafeReport",
          is_publik: true,
          created_at: now,
        },
      ],
      created_at: now,
      updated_at: now,
    };

    const list = readStorage();
    writeStorage([laporan, ...list]);
    return laporan;
  },

  /** Ubah status laporan (oleh admin) */
  updateStatus(id: string, status: StatusLaporan): boolean {
    const list = readStorage();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) return false;
    list[idx].status = status;
    list[idx].updated_at = new Date().toISOString();
    writeStorage(list);
    return true;
  },

  /** Tambah balasan tindak lanjut dari Guru BK */
  addTindakLanjut(
    laporanId: string,
    pesan: string,
    adminNama: string
  ): TindakLanjut | null {
    const list = readStorage();
    const idx = list.findIndex((l) => l.id === laporanId);
    if (idx === -1) return null;

    const tl: TindakLanjut = {
      id: `tl-${Date.now()}`,
      laporan_id: laporanId,
      pesan,
      oleh_nama: adminNama,
      is_publik: true,
      created_at: new Date().toISOString(),
    };

    if (!list[idx].tindak_lanjut) list[idx].tindak_lanjut = [];
    list[idx].tindak_lanjut!.push(tl);
    list[idx].updated_at = new Date().toISOString();
    writeStorage(list);
    return tl;
  },
};

// =====================================================
// SERVICE: AUTH SESSION
// Manajemen sesi login siswa & admin
// =====================================================
const SESSION_KEY = "safereport_user";

export const AuthService = {
  getUser(): Profile | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as Profile) : null;
    } catch {
      return null;
    }
  },

  setUser(user: Profile): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  /** Login demo siswa (1 klik tanpa form, untuk belajar & presentasi) */
  loginDemoSiswa(): Profile {
    const user: Profile = {
      id: "siswa-demo-budi",
      nama: "Budi Santoso",
      nisn_kelas: "0072349 - XI IPA 2",
      email: "budi@siswa.sekolah.id",
      role: "siswa",
      created_at: new Date().toISOString(),
    };
    this.setUser(user);
    return user;
  },

  /** Login demo admin / Guru BK */
  loginDemoAdmin(): Profile {
    const user: Profile = {
      id: "admin-demo-ratna",
      nama: "Ibu Ratna, S.Pd",
      nisn_kelas: "Koordinator Guru BK",
      email: "ratna.bk@sekolah.id",
      role: "admin",
      created_at: new Date().toISOString(),
    };
    this.setUser(user);
    return user;
  },
};
