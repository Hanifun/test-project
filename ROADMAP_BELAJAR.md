# 📚 SafeReport — Panduan Lengkap & Petunjuk Penggunaan Proyek Nyata
> **Sistem Pengaduan Bullying Sekolah & Kelas — Aman, 100% Anonim, Simpel & Bebas Hambatan**  
> *Identitas Visual:* **Kuning Hangat / Amber (#f59e0b & #fbbf24)**  
> *Arsitektur:* **Direct Anonymous Form (Tanpa Landing Page Berbelit, Langsung Formulir Aduan)**

---

## 🎯 Panduan Lengkap Cara Memakai Aplikasi

### 1. Masuk ke Portal Admin Sekolah (Langkah Pertama)
1. Buka browser dan kunjungi: **`http://localhost:3000/admin/login`** (jalur akses langsung admin).
2. Terdapat 2 opsi:
   - **Gunakan Akun Bawaan Awal:**
     - **Email:** `admin@sekolah.id`
     - **Kata Sandi:** `admin`
   - **Atau Buat Akun Admin Baru:**
     - Klik tab **"Buat Akun Admin"**, isi Nama Admin (contoh: *Ibu Ratna, S.Pd*), Email, Jabatan, dan Kata Sandi, lalu klik **Daftarkan**.
3. Klik **"Masuk Dashboard Admin"**. Kamu sekarang berada di panel kendali Admin.

---

### 2. Mendaftarkan Akun Siswa (Dibuat oleh Admin)
1. Di Dashboard Admin, klik tab **"Kelola Akun Siswa"**.
2. Pada formulir **"Tambah Akun Siswa Baru"**, masukkan:
   - **Nama Lengkap Siswa:** contoh *Budi Pratama*
   - **NISN:** contoh *007234901*
   - **Kelas:** contoh *XI IPA 2*
   - **PIN / Kata Sandi Awal:** contoh *123456* (atau sesuai keinginan)
3. Klik **"Daftarkan"**.
4. Akun siswa langsung aktif dan tercatat pada tabel siswa terdaftar.

---

### 3. Mengirimkan Pengaduan Bullying (Oleh Siswa / Pelapor)
Aplikasi ini menerapkan prinsip **Zero-Friction Anonymous First**:
1. Buka halaman utama: **`http://localhost:3000`**.
2. Halaman langsung menampilkan **Formulir Pengaduan** tanpa perlu login terlebih dahulu!
3. Siswa mengisi:
   - **Peran:** Korban atau Saksi.
   - **Kategori Bullying:** Verbal, Fisik, Cyberbullying, Psikologis, Sosial, atau Lainnya.
   - **Inisial Pelaku:** *(opsional)*.
   - **Lokasi & Tanggal Kejadian:** tempat dan waktu kejadian.
   - **Kronologi:** ceritakan apa yang dialami/dilihat.
   - **Lampiran Bukti:** *(opsional, foto/tangkapan layar)*.
   - **Kontak Privat:** *(opsional, no WhatsApp jika siswa ingin dihubungi privat oleh Admin)*.
4. Klik **"Kirim Pengaduan Sekarang"**.
5. Muncul popup **Modal Tiket Sukses** dengan **Kode Tiket Pelacak** (contoh: `SF-8K9P`).
6. Siswa mengklik tombol **"Salin"** dan screenshot kode tersebut.

---

### 4. Admin Meninjau & Menindaklanjuti Laporan
1. Buka kembali **Dashboard Admin** (`http://localhost:3000/admin/dashboard`).
2. Di tab **"Daftar Pengaduan"**, laporan yang baru saja dikirim siswa akan langsung muncul dengan status **`baru`**.
3. Klik tombol **"Kelola Kasus"** pada laporan tersebut.
4. Admin dapat:
   - Membaca detail kronologi, bukti foto, dan info pelaku.
   - Mengubah status penanganan: **`diverifikasi`** ➔ **`diproses`** ➔ **`selesai`**.
   - Mengetik pesan perkembangan kasus di kolom **"Tulis balasan atau tindak lanjut"** (contoh: *"Laporan sudah kami terima. Sedang dijadwalkan mediasi tertutup bersama wali kelas."*), lalu klik **"Kirim Balasan ke Siswa"**.

---

### 5. Siswa Memantau Perkembangan Kasus
1. Siswa membuka menu **"Lacak Tiket"** di halaman web (`http://localhost:3000/status`).
2. Masukkan Kode Tiket pelacak miliknya (misal: `SF-8K9P`).
3. Siswa dapat melihat:
   - Status terbaru penanganan kasusnya secara transparan.
   - Alur timeline proses penanganan.
   - Pesan balasan resmi dari Admin.

---

### 6. Opsi Masuk Siswa Terdaftar (Bila Siswa Memiliki Akun dari Admin)
- Jika siswa ingin melihat riwayat seluruh laporan yang pernah ia buat dengan akunnya:
  1. Masuk ke `http://localhost:3000/login`.
  2. Masukkan **NISN** dan **PIN** yang telah dibuatkan Admin sebelumnya.
  3. Siswa akan masuk ke **Dashboard Siswa** (`/dashboard`) dan melihat daftar laporan akunnya.

---

## 🚀 Publikasi Online ke Vercel (Gratis & Cepat)
1. Buka [https://vercel.com](https://vercel.com) dan login dengan akun GitHub kamu (**Hanifun**).
2. Klik tombol **"Add New..."** ➔ **"Project"**.
3. Pilih repositori **`test-project`**.
4. Klik tombol **"Deploy"**.
5. Selesai! Dalam 1-2 menit, aplikasimu sudah online dan memiliki link publik (misal: `https://test-project-hanifun.vercel.app`) yang siap dibagikan ke klien kelas dan sekolah!
