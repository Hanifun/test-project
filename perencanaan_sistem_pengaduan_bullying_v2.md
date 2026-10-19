# 📋 Perencanaan Sistem Pengaduan Bullying (Revisi V2)

> **Konsep Utama**: *Zero-Friction Anonymous First* — Halaman utama langsung menampilkan form pengaduan anonim. Opsi login tersedia untuk siswa yang ingin melacak laporan, dan portal admin dipisah ke jalur khusus.

---

## 🔄 Ringkasan Perubahan (V1 ➔ V2)

| Aspek | Perencanaan Awal (V1) | Perencanaan Baru (V2) |
|---|---|---|
| **Halaman Utama (`/`)** | Landing page umum (hero, statistik, alur pelaporan) | **Langsung Form Pengaduan Anonim** (tanpa landing page, siap lapor seketika) |
| **Akses Siswa** | Harus memilih alur dari landing page | Tombol **"Masuk sebagai Siswa"** di navbar/header form (opsional bagi yang ingin melacak laporan) |
| **Akses Admin / Guru BK** | Dicantumkan bersama dalam alur navigasi umum | **Jalur Terpisah (Dedicated Route)** — tidak diekspos di navigasi siswa/umum, dikerjakan pada tahap berikutnya |
| **Desain & Warna** | Palet indigo/ungu siap pakai | **Ditangguhkan sementara** — fokus terlebih dahulu pada struktur form, flow anonim/siswa, dan logika data |

---

## 🎯 Mengapa Pendekatan "Langsung Form" Lebih Efektif?

1. **Menghilangkan Keraguan Korban/Saksi (Zero Friction)**:
   Siswa yang sedang takut atau panik tidak perlu membaca brosur/marketing di landing page. Mereka bisa langsung menuangkan apa yang dialami.
2. **Privasi Maksimal Sejak Detik Pertama**:
   Pengguna langsung disambut dengan status *"Mode Anonim Aktif"*, menjamin tidak ada jejak nama/akun sebelum mereka memutuskan sendiri.
3. **Fleksibel**:
   Bagi siswa yang ingin laporannya resmi tercatat di profil mereka, tombol login tetap tersedia dengan jelas di bagian atas form.

---

## 🗺️ Arsitektur Halaman & Routing (Next.js)

```
[Pengunjung Membuka Web: /]
          │
          ▼
┌────────────────────────────────────────────────────────┐
│  Halaman Utama (/) = Form Pengaduan Anonim Langsung    │
│  - Info: "Mode Anonim — Identitasmu Aman"               │
│  - Tombol di Navbar: [Masuk sebagai Siswa]             │
│  - Link footer: [Cek Status Laporan dengan Kode Tiket] │
└───────────────────────┬────────────────────────────────┘
                        │
       ┌────────────────┴────────────────┐
       ▼                                 ▼
[Submit sebagai Anonim]       [Klik "Masuk sebagai Siswa"]
       │                                 │
       ▼                                 ▼
Dapat KODE TIKET UNIK           Halaman Login Siswa (/login)
(Contoh: SF-8Z2K)                        │
       │                                 ▼
Bisa cek berkala di             Form Lapor dengan Akun Siswa
/status via kode tiket          + Dashboard Riwayat (/dashboard)
```

### Jalur Khusus Admin (Beda Jalur):
```
/admin/login ────▶ /admin/dashboard (Khusus Guru BK / Pengelola)
(Jalur terisolasi, tidak ada link menuju admin di halaman publik siswa)
```

---

## 📄 Spesifikasi Halaman

### 1. Halaman Utama (`/`) — Form Laporan Anonim Langsung
- **Badge Status**: *"🎭 Mode Anonim Aktif — Identitasmu tidak direkam"*.
- **Tombol Navigasi**: *"Masuk sebagai Siswa"* di sudut kanan atas untuk yang ingin login.
- **Form Input**:
  1. **Peran Pelapor**: Korban (`Saya yang mengalami`) atau Saksi (`Saya melihat kejadian`).
  2. **Kategori Bullying**: Fisik, Verbal, Cyberbullying, Psikologis, Sosial, dll.
  3. **Identitas Pelaku (Opsional)**: Nama, inisial, kelas, atau ciri-ciri pelaku.
  4. **Lokasi & Waktu**: Pilihan lokasi (kelas, kantin, online, toilet, dll.) dan tanggal kejadian.
  5. **Kronologi Kejadian**: Area teks detail kejadian.
  6. **Upload Bukti (Opsional)**: File foto/video/tangkapan layar chat (maks. 10MB).
  7. **Kontak Balik (Opsional)**: No. WA / email opsional bagi yang bersedia dikontak Guru BK secara privat tanpa membocorkan identitas ke siswa lain.
- **Aksi Submit**:
  - Validasi form secara instan.
  - Setelah kirim, muncul **Modal Kode Pelacak Tiket** (misal: `SF-8K9P`).
  - Diberikan peringatan: *"Screenshot atau catat kode ini untuk mengecek balasan dari Guru BK"*.

### 2. Login Siswa (`/login`)
- Ditujukan bagi siswa yang ingin laporannya terhubung ke akun sekolah.
- Form login via Email Sekolah/NISN atau Google Workspace Sekolah.
- Setelah login, diarahkan ke:
  - Form lapor (yang otomatis melampirkan profil siswa).
  - Atau `/dashboard` (melihat riwayat dan status laporan yang pernah dibuat).

### 3. Cek Status Anonim (`/status` atau Modal Terpadu)
- Input: Kode Tiket Laporan (8 karakter).
- Output:
  - Status laporan: `Diterima` ➔ `Diverifikasi` ➔ `Diproses Guru BK` ➔ `Selesai`.
  - Pesan/tanggapan dari Guru BK (jika ada tindak lanjut).
  - Tanpa memerlukan akun login.

### 4. Jalur Khusus Admin (`/admin`) — *Dikerjakan Nanti*
- Dipisahkan secara routing dan middleware:
  - URL terpisah (`/admin/login`).
  - Auth guard berbasis role `admin` / `guru_bk`.
  - Dashboard statistik, tabel laporan masuk, filter kategori/prioritas, dan form tindak lanjut/balas ke pelapor.

---

## 🗄️ Rancangan Database (Supabase PostgreSQL)

```sql
-- 1. Profiles (Hanya untuk Siswa yang Login & Admin)
CREATE TABLE profiles (
  id          UUID REFERENCES auth.users PRIMARY KEY,
  nama        TEXT NOT NULL,
  nisn_kelas  TEXT,
  role        TEXT DEFAULT 'siswa', -- 'siswa' | 'admin_bk'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Laporan (Mendukung Anonim & Siswa Terdaftar)
CREATE TABLE laporan (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kode_pelacak     TEXT UNIQUE NOT NULL, -- Kode tiket (misal: SF-9X2A)
  is_anonim        BOOLEAN DEFAULT TRUE,
  pelapor_id       UUID REFERENCES profiles(id) NULL, -- NULL jika anonim
  kontak_opsional  TEXT NULL, -- No WA/email jika pelapor anonim ingin dihubungi
  peran_pelapor    TEXT NOT NULL, -- 'korban' | 'saksi'
  kategori         TEXT NOT NULL, -- 'fisik'|'verbal'|'cyber'|'psikologis'|'sosial'|'lainnya'
  nama_pelaku      TEXT,
  lokasi           TEXT NOT NULL,
  tanggal_kejadian DATE NOT NULL,
  deskripsi        TEXT NOT NULL,
  status           TEXT DEFAULT 'baru', -- 'baru'|'diverifikasi'|'diproses'|'selesai'
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bukti Laporan (File Upload)
CREATE TABLE bukti_laporan (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  laporan_id  UUID REFERENCES laporan(id) ON DELETE CASCADE,
  file_url    TEXT NOT NULL,
  file_type   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tindak Lanjut / Respon Guru BK
CREATE TABLE tindak_lanjut (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  laporan_id  UUID REFERENCES laporan(id) ON DELETE CASCADE,
  pesan       TEXT NOT NULL,
  dibuat_oleh UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔒 Kebijakan Keamanan & Privasi

1. **Tanpa Pelacakan Identitas untuk Anonim**:
   - Sistem tidak mencatat IP pelapor atau metadata browser di tabel laporan.
2. **Row Level Security (RLS)**:
   - Pelapor anonim hanya bisa membaca status laporan menggunakan `kode_pelacak` yang tepat.
   - Siswa terdaftar hanya bisa membaca laporan yang memiliki `pelapor_id` miliknya.
   - Admin/Guru BK memiliki akses penuh untuk membaca dan merespons.
3. **Pemisahan Jalur Admin**:
   - URL admin tidak terhubung di navbar umum, meminimalkan upaya brute force atau akses coba-coba dari siswa biasa.
