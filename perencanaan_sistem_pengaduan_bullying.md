# 📋 Perencanaan Sistem Pengaduan Bullying — Lingkup Kelas

> **Stack**: Next.js 14 (App Router) · Tailwind CSS v3 · Supabase (PostgreSQL + Auth + Storage) · shadcn/ui
> **Hosting**: Vercel (gratis) · **Database/Auth/Storage**: Supabase (gratis) · **Domain**: `safe-report.vercel.app`
> **Folder Proyek**: `safe-report/`

---

## 🎯 Tujuan Sistem

Membangun platform pengaduan bullying berbasis web yang aman, mudah digunakan, dan dapat diakses oleh:
- **Siswa terautentikasi** — laporan dengan identitas (terlacak, lebih terpercaya)
- **Pengguna anonim** — laporan tanpa login (perlindungan privasi)
- **Admin / Guru BK** — menerima, mengelola, dan menindaklanjuti laporan

---

## 👥 Peran Pengguna (Roles)

| Role | Akses | Auth |
|------|-------|------|
| **Siswa** | Buat laporan (teridentifikasi), cek status laporan sendiri | Login wajib |
| **Anonim** | Buat laporan tanpa akun | Tanpa login |
| **Admin/Guru BK** | Lihat semua laporan, ubah status, balas/tindak lanjut, filter & cari | Login khusus admin |

---

## 🗄️ Struktur Database (Supabase PostgreSQL)

```sql
CREATE TABLE profiles (
  id          UUID REFERENCES auth.users PRIMARY KEY,
  nama        TEXT,
  kelas       TEXT,
  role        TEXT DEFAULT 'siswa',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE laporan (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kode_pelacak    TEXT UNIQUE NOT NULL,
  pelapor_id      UUID REFERENCES profiles(id) NULL,
  is_anonim       BOOLEAN DEFAULT FALSE,
  kategori        TEXT NOT NULL,
  nama_pelaku     TEXT,
  lokasi          TEXT NOT NULL,
  tanggal_kejadian DATE NOT NULL,
  deskripsi       TEXT NOT NULL,
  peran_pelapor   TEXT NOT NULL,
  status          TEXT DEFAULT 'baru',
  prioritas       TEXT DEFAULT 'normal',
  admin_id        UUID REFERENCES profiles(id) NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bukti_laporan (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  laporan_id  UUID REFERENCES laporan(id) ON DELETE CASCADE,
  nama_file   TEXT NOT NULL,
  url         TEXT NOT NULL,
  tipe_file   TEXT,
  ukuran_byte BIGINT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tindak_lanjut (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  laporan_id  UUID REFERENCES laporan(id) ON DELETE CASCADE,
  admin_id    UUID REFERENCES profiles(id),
  pesan       TEXT NOT NULL,
  is_publik   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```
