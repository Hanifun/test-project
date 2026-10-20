import {
  createSessionSignature,
  generateSecureToken,
  RateLimiter,
  sanitizeFileName,
  sanitizeInput,
  validateUploadedFile,
  verifySessionSignature,
} from "./security";
// =====================================================
// SafeReport — Data & Service Layer (Storage Lokal)
// =====================================================

import {
  AdminAccount,
  BuktiFile,
  FormLaporanData,
  Laporan,
  Profile,
  SessionData,
  StatusLaporan,
  StudentAccount,
  TindakLanjut,
} from "@/types";
import { generateKodePelacak } from "./utils";

// Kunci penyimpanan LocalStorage
const LAPORAN_STORAGE_KEY = "safereport_real_laporan";
const ADMINS_STORAGE_KEY = "safereport_real_admins";
const STUDENTS_STORAGE_KEY = "safereport_real_students";
const SESSION_KEY = "safereport_real_user";

// Default Initial Admin (agar pengguna pertama kali bisa langsung masuk)
const DEFAULT_INITIAL_ADMIN: AdminAccount = {
  id: "admin-utama",
  nama: "Admin Sekolah",
  email: "admin@sekolah.id",
  password: "admin",
  nip_jabatan: "Administrator Sekolah",
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
    // 1. Cek Honeypot (Anti-Bot Trap)
    if (data._hp_trap && data._hp_trap.trim().length > 0) {
      throw new Error("Pengiriman tidak valid terdeteksi (bot protection).");
    }

    // 2. Cek Rate Limiting (Maks 5 pengaduan per 10 menit, jeda 15 detik)
    const rateCheck = RateLimiter.check("kirim_laporan", 5, 10 * 60 * 1000, 15 * 1000);
    if (!rateCheck.allowed) {
      throw new Error(rateCheck.error || "Batas pengiriman laporan tercapai.");
    }

    // 3. Sanitasi Input XSS dan Validasi Panjang Teks
    const cleanLokasi = sanitizeInput(data.lokasi);
    const cleanDeskripsi = sanitizeInput(data.deskripsi);
    const cleanNamaPelaku = data.nama_pelaku ? sanitizeInput(data.nama_pelaku) : null;
    const cleanKontak = data.kontak_opsional ? sanitizeInput(data.kontak_opsional) : null;

    if (!cleanLokasi || cleanLokasi.length < 3 || cleanLokasi.length > 150) {
      throw new Error("Lokasi kejadian harus antara 3 hingga 150 karakter.");
    }
    if (!cleanDeskripsi || cleanDeskripsi.length < 15 || cleanDeskripsi.length > 3000) {
      throw new Error("Kronologi kejadian harus antara 15 hingga 3000 karakter.");
    }

    // 4. Validasi Keamanan Berkas Bukti (Ukuran, MIME, Ekstensi, Sanitasi Nama)
    const buktiList: BuktiFile[] = [];
    if (data.bukti_files && data.bukti_files.length > 0) {
      if (data.bukti_files.length > 3) {
        throw new Error("Maksimal lampiran bukti adalah 3 berkas.");
      }
      for (const file of data.bukti_files) {
        const fileCheck = validateUploadedFile(file);
        if (!fileCheck.valid) {
          throw new Error(fileCheck.error || "Berkas lampiran tidak valid.");
        }

        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve("");
          reader.readAsDataURL(file);
        });

        buktiList.push({
          id: `bukti-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          nama_file: sanitizeFileName(file.name),
          url: dataUrl,
          tipe_file: file.type,
          ukuran_byte: file.size,
        });
      }
    }

    const isSiswaIdentity = data.mode_identitas === "siswa" && Boolean(user);
    const isAnonim = !isSiswaIdentity;
    const kode = generateKodePelacak("SF");

    const now = new Date().toISOString();
    const laporan: Laporan = {
      id: `lap-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      kode_pelacak: kode,
      is_anonim: isAnonim,
      pelapor_id: user?.id ?? null,
      nama_pelapor: isSiswaIdentity && user ? `${user.nama} (${user.nisn_kelas ?? "Siswa"})` : null,
      kontak_opsional: cleanKontak || null,
      peran_pelapor: data.peran_pelapor,
      kategori: data.kategori,
      nama_pelaku: cleanNamaPelaku || null,
      lokasi: cleanLokasi,
      tanggal_kejadian: data.tanggal_kejadian,
      deskripsi: cleanDeskripsi,
      bukti: buktiList,
      status: "baru",
      tindak_lanjut: [
        {
          id: `tl-${Date.now()}`,
          laporan_id: "",
          pesan: "Laporan telah diterima oleh sistem dan menunggu peninjauan tim Admin.",
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

    // Catat ke RateLimiter setelah berhasil kirim
    RateLimiter.record("kirim_laporan");

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

// ==========================================
// 2. SERVICE: KELOLA AKUN ADMIN
// ==========================================
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
      nip_jabatan: admin.nip_jabatan?.trim() || "Staf Admin",
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

// ==========================================
// 3. SERVICE: KELOLA AKUN SISWA (DIBUAT OLEH ADMIN)
// ==========================================
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

// ==========================================
// =====================================================
// 4. SERVICE: SESI PENGGUNA (AUTH SESSION KEAMANAN TINGGI)
// - Masa berlaku sesi otomatis (TTL: Admin 4 jam, Siswa 12 jam)
// - Tanda tangan kriptografis integritas sesi (Anti-Tampering localStorage)
// - Verifikasi eksistensi akun asli secara otomatis
// =====================================================
const SECURE_SESSION_KEY = "safereport_real_session";
const ADMIN_SESSION_TTL = 4 * 60 * 60 * 1000;    // 4 Jam
const STUDENT_SESSION_TTL = 12 * 60 * 60 * 1000; // 12 Jam

export const AuthService = {
  getUser(): Profile | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(SECURE_SESSION_KEY);
      if (!raw) return null;

      const session: SessionData = JSON.parse(raw);
      const now = Date.now();

      // 1. Cek Masa Berlaku Sesi (Expiration Check)
      if (now > session.expiresAt) {
        console.warn("Sesi pengguna telah kadaluarsa demi keamanan.");
        this.logout();
        return null;
      }

      // 2. Cek Integritas Tanda Tangan Sesi (Anti-Tampering)
      const isValidSignature = verifySessionSignature(
        session.user,
        session.expiresAt,
        session.token,
        session.signature
      );
      if (!isValidSignature) {
        console.warn("Manipulasi sesi lokal terdeteksi! Sesi dibatalkan demi keamanan.");
        this.logout();
        return null;
      }

      // 3. Verifikasi Keberadaan Akun Asli di Database
      if (session.user.role === "admin") {
        const admins = AdminService.getAll();
        const exists = admins.some((a) => a.id === session.user.id);
        if (!exists) {
          this.logout();
          return null;
        }
      } else if (session.user.role === "siswa") {
        const students = StudentService.getAll();
        const exists = students.some((s) => s.id === session.user.id);
        if (!exists) {
          this.logout();
          return null;
        }
      }

      return session.user;
    } catch {
      this.logout();
      return null;
    }
  },

  setUser(user: Profile): void {
    if (typeof window === "undefined") return;
    const token = generateSecureToken(32);
    const ttl = user.role === "admin" ? ADMIN_SESSION_TTL : STUDENT_SESSION_TTL;
    const expiresAt = Date.now() + ttl;
    const signature = createSessionSignature(user, expiresAt, token);

    const session: SessionData = {
      token,
      user,
      expiresAt,
      createdAt: Date.now(),
      signature,
    };

    localStorage.setItem(SECURE_SESSION_KEY, JSON.stringify(session));
    // Bersihkan legacy key
    localStorage.removeItem(SESSION_KEY);
  },

  logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SECURE_SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  },
};
// =====================================================
// 5. SERVICE: KELOLA DATA KELAS (DIBUAT OLEH ADMIN)
// =====================================================
const KELAS_STORAGE_KEY = "safereport_real_kelas";
const DEFAULT_INITIAL_KELAS = [
  "X MIPA 1",
  "X MIPA 2",
  "X IPS 1",
  "XI MIPA 1",
  "XI IPS 1",
  "XII MIPA 1",
  "XII IPS 1",
];

export const KelasService = {
  getAll(): string[] {
    return readStorage<string[]>(KELAS_STORAGE_KEY, DEFAULT_INITIAL_KELAS);
  },

  add(nama: string): boolean {
    const clean = nama.trim();
    if (!clean) return false;
    const list = this.getAll();
    if (list.map(k => k.toLowerCase()).includes(clean.toLowerCase())) {
      return false; // sudah ada
    }
    const updated = [...list, clean];
    writeStorage(KELAS_STORAGE_KEY, updated);
    return true;
  },

  delete(nama: string): boolean {
    const list = this.getAll();
    const updated = list.filter((k) => k !== nama);
    if (updated.length === list.length) return false;
    writeStorage(KELAS_STORAGE_KEY, updated);
    return true;
  },
};
