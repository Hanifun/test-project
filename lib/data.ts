// =====================================================
// SafeReport — Data Store & Management Service
// Real Project: Clean Slate, Admin & Student Account Management
// =====================================================

import {
  Laporan,
  FormLaporanData,
  StatusLaporan,
  TindakLanjut,
  BuktiFile,
  Profile,
  StudentAccount,
  AdminAccount,
} from "@/types";
import { generateKodePelacak } from "./utils";

// Storage Keys
const LAPORAN_STORAGE_KEY = "safereport_real_laporan";
const STUDENTS_STORAGE_KEY = "safereport_real_students";
const ADMINS_STORAGE_KEY = "safereport_real_admins";
const SESSION_KEY = "safereport_real_user";

// Default Initial Admin (agar pengguna pertama kali bisa langsung masuk)
const DEFAULT_INITIAL_ADMIN: AdminAccount = {
  id: "admin-utama",
  nama: "Guru Bimbingan Konseling",
  email: "admin@sekolah.id",
  password: "admin",
  nip_jabatan: "Koordinator Bimbingan Konseling",
  created_at: new Date().toISOString(),
};

// =====================================================
// Helper Storage Functions
// =====================================================

function readStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function writeStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Gagal menyimpan ke localStorage:", err);
  }
}

// =====================================================
// 1. SERVICE: LAPORAN (PENGADUAN)
// =====================================================
export const LaporanService = {
  getAll(): Laporan[] {
    return readStorage<Laporan[]>(LAPORAN_STORAGE_KEY, []);
  },

  getByKode(kode: string): Laporan | null {
    const clean = kode.trim().toUpperCase();
    const list = this.getAll();
    return list.find((l) => l.kode_pelacak === clean) ?? null;
  },

  getByPelaporId(pelaporId: string): Laporan[] {
    return this.getAll().filter((l) => l.pelapor_id === pelaporId);
  },

  async create(data: FormLaporanData, user: Profile | null): Promise<Laporan> {
    const isAnonim = !user;
    const kode = generateKodePelacak("SF");

    // Simpan file bukti (data URL)
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
          id: `bukti-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          nama_file: file.name,
          url: dataUrl,
          tipe_file: file.type,
          ukuran_byte: file.size,
        });
      }
    }

    const now = new Date().toISOString();
    const laporan: Laporan = {
      id: `lap-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      kode_pelacak: kode,
      is_anonim: isAnonim,
      pelapor_id: user?.id ?? null,
      nama_pelapor: user ? `${user.nama} (${user.nisn_kelas ?? ""})` : null,
      kontak_opsional: data.kontak_opsional?.trim() || null,
      peran_pelapor: data.peran_pelapor,
      kategori: data.kategori,
      nama_pelaku: data.nama_pelaku?.trim() || null,
      lokasi: data.lokasi.trim(),
      tanggal_kejadian: data.tanggal_kejadian,
      deskripsi: data.deskripsi.trim(),
      bukti: buktiList,
      status: "baru",
      tindak_lanjut: [
        {
          id: `tl-${Date.now()}`,
          laporan_id: "",
          pesan: "Laporan telah diterima oleh sistem dan menunggu peninjauan tim Guru BK.",
          oleh_nama: "Sistem SafeReport",
          is_publik: true,
          created_at: now,
        },
      ],
      created_at: now,
      updated_at: now,
    };

    laporan.tindak_lanjut![0].laporan_id = laporan.id;

    const list = this.getAll();
    writeStorage(LAPORAN_STORAGE_KEY, [laporan, ...list]);
    return laporan;
  },

  updateStatus(id: string, status: StatusLaporan): boolean {
    const list = this.getAll();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) return false;
    list[idx].status = status;
    list[idx].updated_at = new Date().toISOString();
    writeStorage(LAPORAN_STORAGE_KEY, list);
    return true;
  },

  addTindakLanjut(laporanId: string, pesan: string, adminNama: string): TindakLanjut | null {
    const list = this.getAll();
    const idx = list.findIndex((l) => l.id === laporanId);
    if (idx === -1) return null;

    const tl: TindakLanjut = {
      id: `tl-${Date.now()}`,
      laporan_id: laporanId,
      pesan: pesan.trim(),
      oleh_nama: adminNama,
      is_publik: true,
      created_at: new Date().toISOString(),
    };

    if (!list[idx].tindak_lanjut) list[idx].tindak_lanjut = [];
    list[idx].tindak_lanjut!.push(tl);
    list[idx].updated_at = new Date().toISOString();
    writeStorage(LAPORAN_STORAGE_KEY, list);
    return tl;
  },

  delete(id: string): boolean {
    const list = this.getAll();
    const filtered = list.filter((l) => l.id !== id);
    if (filtered.length === list.length) return false;
    writeStorage(LAPORAN_STORAGE_KEY, filtered);
    return true;
  },
};

// =====================================================
// 2. SERVICE: KELOLA AKUN ADMIN (GURU BK)
// =====================================================
export const AdminService = {
  getAll(): AdminAccount[] {
    return readStorage<AdminAccount[]>(ADMINS_STORAGE_KEY, [DEFAULT_INITIAL_ADMIN]);
  },

  create(admin: Omit<AdminAccount, "id" | "created_at">): AdminAccount {
    const list = this.getAll();
    const newAdmin: AdminAccount = {
      id: `admin-${Date.now()}`,
      nama: admin.nama.trim(),
      email: admin.email.trim().toLowerCase(),
      password: admin.password || "admin",
      nip_jabatan: admin.nip_jabatan?.trim() || "Staf Guru BK",
      created_at: new Date().toISOString(),
    };
    writeStorage(ADMINS_STORAGE_KEY, [...list, newAdmin]);
    return newAdmin;
  },

  login(email: string, password?: string): AdminAccount | null {
    const list = this.getAll();
    const cleanEmail = email.trim().toLowerCase();
    const found = list.find((a) => a.email.toLowerCase() === cleanEmail);
    if (!found) return null;
    if (password && found.password && found.password !== password) {
      return null;
    }
    return found;
  },
};

// =====================================================
// 3. SERVICE: KELOLA AKUN SISWA (DIBUAT OLEH ADMIN)
// =====================================================
export const StudentService = {
  getAll(): StudentAccount[] {
    return readStorage<StudentAccount[]>(STUDENTS_STORAGE_KEY, []);
  },

  create(data: { nisn: string; nama: string; kelas: string; password?: string }): StudentAccount {
    const list = this.getAll();
    const newStudent: StudentAccount = {
      id: `siswa-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      nisn: data.nisn.trim(),
      nama: data.nama.trim(),
      kelas: data.kelas.trim(),
      password: data.password?.trim() || "123456",
      created_at: new Date().toISOString(),
    };
    writeStorage(STUDENTS_STORAGE_KEY, [newStudent, ...list]);
    return newStudent;
  },

  delete(id: string): boolean {
    const list = this.getAll();
    const filtered = list.filter((s) => s.id !== id);
    if (filtered.length === list.length) return false;
    writeStorage(STUDENTS_STORAGE_KEY, filtered);
    return true;
  },

  login(nisn: string, password?: string): StudentAccount | null {
    const list = this.getAll();
    const cleanNisn = nisn.trim();
    const found = list.find((s) => s.nisn === cleanNisn);
    if (!found) return null;
    if (password && found.password && found.password !== password) {
      return null;
    }
    return found;
  },
};

// =====================================================
// 4. SERVICE: SESI PENGGUNA (AUTH SESSION)
// =====================================================
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
};
