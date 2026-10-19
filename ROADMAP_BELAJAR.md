# 📚 ROADMAP & PANDUAN LENGKAP PROYEK SAFEREPORT
> **Sistem Pengaduan Bullying Sekolah & Kelas — Aman, Anonim, Ceria & Terpercaya**  
> *Warna Identitas:* **Kuning Hangat / Amber (#f59e0b)**  
> *Prinsip Utama:* **Zero-Friction Anonymous First** (Siswa bisa melapor tanpa hambatan login)

---

## 📌 Status Pengerjaan (Semua Tahap Selesai!)

- [x] **Tahap 1: Setup Dasar & Git Version Control**
  - [x] Inisialisasi Git lokal (`git init`) dan remote GitHub (`https://github.com/Hanifun/test-project`)
  - [x] File `.gitignore` aman (mengabaikan `node_modules`, `.next`, `.env*.local`)
  - [x] Pengaturan proyek Next.js 15 + TypeScript + Tailwind CSS

- [x] **Tahap 2: Sistem Desain & Konfigurasi Tema**
  - [x] Palet warna Kuning Hangat / Amber (`brand-50` s.d. `brand-900`) di `tailwind.config.ts`
  - [x] Styling global komponen kartu (`card`), tombol utama (`btn-primary`), tombol sekunder (`btn-secondary`), badge status di `app/globals.css`
  - [x] Tipografi modern Google Font Inter & Nunito

- [x] **Tahap 3: Arsitektur Data & Tipe Data (Dual Engine)**
  - [x] Definisi tipe data lengkap di `types/index.ts` (`Laporan`, `Profile`, `StatusLaporan`, `TindakLanjut`, dll.)
  - [x] Generator kode tiket unik (contoh: `SF-7K2X`) di `lib/utils.ts`
  - [x] Service penyimpanan data (`lib/data.ts`) dengan engine **localStorage** dan data demo interaktif siap pakai
  - [x] Skema database cloud PostgreSQL untuk Supabase di `supabase_schema.sql`

- [x] **Tahap 4: Halaman Publik Siswa**
  - [x] **Beranda (`app/page.tsx`):** Hero section ceria, statistik pengaduan, kartu fitur keunggulan, alur cara pakai, tombol aksi cepat
  - [x] **Formulir Pengaduan (`app/lapor/page.tsx`):** Pilihan peran (korban/saksi), kategori perundungan, deskripsi kronologi, upload bukti lampiran, kontak opsional
  - [x] **Modal Tiket Sukses (`components/ModalTiket.tsx`):** Menampilkan kode pelacak unik dengan tombol 1-klik salin dan pengingat screenshot
  - [x] **Lacak Status (`app/status/page.tsx`):** Cek progres laporan via kode tiket pelacak, visual timeline tahapan, dan pesan balasan dari Guru BK

- [x] **Tahap 5: Portal Akun Siswa**
  - [x] **Login Siswa (`app/login/page.tsx`):** Tombol 1-klik demo masuk sebagai Budi Santoso (XI IPA 2) atau login manual
  - [x] **Dashboard Siswa (`app/dashboard/page.tsx`):** Melihat riwayat laporan yang pernah dikirim, status terkini, dan akses buat laporan baru

- [x] **Tahap 6: Portal Guru BK & Satgas Kesiswaan**
  - [x] **Login Guru BK (`app/admin/login/page.tsx`):** Tombol 1-klik demo masuk sebagai Ibu Ratna, S.Pd (Koordinator BK)
  - [x] **Dashboard Manajemen BK (`app/admin/dashboard/page.tsx`):**
    - Ringkasan metrik (Total Kasus, Perlu Ditinjau, Sedang Diproses, Selesai)
    - Filter berdasarkan status kasus dan kategori bullying
    - Kolom pencarian realtime (kode tiket, lokasi, pelaku, nama)
    - Modal kelola kasus: ubah status penanganan secara dinamis
    - Formulir kirim balasan/catatan perkembangan kasus langsung ke siswa

- [x] **Tahap 7: Kesiapan Publikasi Online**
  - [x] Template Environment Variables (`.env.example`)
  - [x] Panduan Deploy ke Vercel (Gratis & Cepat)
  - [x] Panduan Sambung ke Supabase (Database Cloud)

---

## 🧭 Struktur Berkas Proyek

```
safe-report/
├── app/
│   ├── admin/
│   │   ├── dashboard/page.tsx   # Dashboard Guru BK (Kelola laporan, ubah status, kirim balasan)
│   │   ├── login/page.tsx       # Login Portal Guru BK (Ada 1-klik demo)
│   │   └── page.tsx             # Pengalihan otomatis admin
│   ├── dashboard/page.tsx       # Dashboard Siswa (Riwayat laporan akun siswa)
│   ├── lapor/page.tsx           # Formulir Pembuatan Laporan Pengaduan
│   ├── login/page.tsx           # Login Siswa (Ada 1-klik demo)
│   ├── status/page.tsx          # Halaman Lacak Status via Kode Tiket (SF-XXXX)
│   ├── globals.css              # Desain visual, palet warna kuning amber & komponen UI
│   ├── layout.tsx               # Root layout & Metadata SEO
│   └── page.tsx                 # Halaman Beranda (Landing Page)
├── components/
│   ├── Footer.tsx               # Footer (Hotline darurat SAPPA 129 & privasi)
│   ├── FormLaporan.tsx          # Komponen formulir pengaduan interaktif
│   ├── ModalTiket.tsx           # Modal popup kode pelacak & tombol salin
│   ├── Navbar.tsx               # Navigasi atas + status mode anonim aktif
│   └── TimelineStatus.tsx       # Alur visual status: Baru -> Diverifikasi -> Diproses -> Selesai
├── lib/
│   ├── data.ts                  # Service penyimpanan data & demo mock
│   └── utils.ts                 # Generator kode tiket & pemformat tanggal Indonesia
├── types/
│   └── index.ts                 # Definisi tipe data TypeScript
├── supabase_schema.sql          # Skrip database cloud Supabase PostgreSQL + RLS
├── .env.example                 # Template konfigurasi environment Supabase
├── tailwind.config.ts           # Konfigurasi Tailwind & warna Amber ceria
└── package.json                 # Dependensi proyek
```

---

## 🧪 Cara Menjalankan & Menguji Secara Lokal

1. **Buka Terminal di direktori proyek:**
   ```bash
   npm run dev
   ```
2. **Buka di Browser:**
   Akses `http://localhost:3000`

### Skenario Uji Coba Lengkap:
1. **Mengirim Laporan Anonim (Siswa):**
   - Buka Beranda, klik **"Buat Laporan Sekarang"** (atau `/lapor`).
   - Pilih jenis bullying (misal: *Verbal*), isi lokasi (*Kantin*), tanggal, dan ceritakan kejadiannya.
   - Klik **"Kirim Laporan"**.
   - Simpan / salin **Kode Tiket** yang muncul (contoh: `SF-XXXX`).
2. **Memeriksa Status Laporan (Siswa):**
   - Buka menu **"Cek Status"** (atau `/status`).
   - Masukkan kode tiket yang tadi didapatkan (atau coba kode demo: `SF-7K2X`).
   - Lihat alur tahapan kasus dan pesan tanggapan dari Guru BK.
3. **Mengelola Laporan (Guru BK):**
   - Buka `/admin/login`.
   - Klik tombol **"1-Klik Masuk Demo: Ibu Ratna, S.Pd (Guru BK)"**.
   - Pada Dashboard BK, kamu bisa:
     - Memfilter laporan berdasarkan status/kategori.
     - Klik **"Kelola Kasus"** pada laporan yang masuk.
     - Mengubah status (misal dari *Baru* menjadi *Diproses* atau *Selesai*).
     - Mengetik dan mengirim balasan tindak lanjut.
4. **Verifikasi Balasan:**
   - Kembali ke halaman `/status` dengan kode tiket tadi, pesan dari Guru BK akan langsung muncul secara realtime!

---

## 🚀 Panduan Publikasi Online (Deployment)

### Langkah 1: Push Kode ke GitHub
Pastikan seluruh perubahan terkini sudah di-push ke repositori GitHub:
```bash
git add .
git commit -m "feat: complete SafeReport web application with playful amber theme"
git push origin main
```

### Langkah 2: Deploy ke Vercel (Gratis)
1. Buka [https://vercel.com](https://vercel.com) dan login menggunakan akun GitHub-mu.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Pilih repositori **`test-project`** (atau `safe-report`) dari daftar repositori GitHub.
4. Pada bagian *Framework Preset*, Vercel akan otomatis mendeteksi **Next.js**.
5. Klik tombol **"Deploy"**.
6. Dalam 1-2 menit, aplikasimu sudah aktif dan memiliki URL publik (misal: `safe-report-test.vercel.app`) yang bisa langsung dibuka oleh klien dan teman sekelas!

### Langkah 3: Menghubungkan ke Supabase (Opsional jika ingin Database Cloud)
1. Buka [https://supabase.com](https://supabase.com) dan buat proyek baru.
2. Buka menu **SQL Editor**, buka file `supabase_schema.sql` dari proyek ini, lalu klik **Run** untuk membuat semua tabel otomatis.
3. Masuk ke **Project Settings -> API**, salin `Project URL` dan `anon public key`.
4. Di dashboard Vercel, masuk ke **Settings -> Environment Variables**, lalu tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Lakukan *Redeploy* di Vercel. Selesai!
