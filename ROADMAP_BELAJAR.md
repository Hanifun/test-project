# 🎒 Roadmap Belajar & Pengerjaan: SafeReport
> **Pendekatan**: Belajar bertahap dari nol (Pair Programming), dibahas langkah demi langkah, desain minimalis & playful (sentuhan kuning hangat yang ramah siswa), hingga berhasil online di Vercel dengan database Supabase.

---

## 🗺️ Daftar Centang (Checklist) Tahapan Belajar & Koding

### 📦 TAHAP 1: Setup Git & Hubungkan ke GitHub
- [x] Inisialisasi Git lokal (`git init`).
- [x] Membuat file `.gitignore` agar file sampah dan rahasia tidak bocor.
- [x] Menentukan nama dan email pengguna di Git (`Hanifun <dakhilullah0@gmail.com>`).
- [x] Melakukan `commit` pertama (dokumen perencanaan & roadmap).
- [x] Menghubungkan repositori GitHub (`https://github.com/Hanifun/test-project.git`).
- [x] Melakukan `git push` pertama ke GitHub.

---

### ⚡ TAHAP 2: Membangun Fondasi Next.js (Langkah demi Langkah)
- [ ] Memahami apa itu **Next.js** dan mengapa kita menggunakannya (Frontend + Backend jadi satu).
- [ ] Membuat file konfigurasi `package.json`, `tsconfig.json`, dan `next.config.ts`.
- [ ] Memahami konsep **App Router**: apa fungsi `app/layout.tsx` dan `app/page.tsx`.
- [ ] Menjalankan server lokal pertama kali (`npm run dev`) dan memastikannya muncul di browser.

---

### 🎨 TAHAP 3: Pasang Tailwind CSS & Menentukan Gaya "Playful & Minimalis"
- [ ] Memasang **Tailwind CSS** dan memahami cara kerjanya (styling cepat via class).
- [ ] Menentukan konsep visual yang **ramah siswa, minimalis, dan playful**:
  - Warna preferensi: **Kuning hangat / Amber / Warm Sun** (memberikan rasa aman, ceria, dan tidak menakutkan bagi siswa yang sedang tertekan).
  - Tampilan kartu yang empuk (*rounded corners* besar, border lembut, bayangan halus).
  - Tipografi bersih dan mudah dibaca.
- [ ] Mengatur token warna terpusat di `app/globals.css` agar jika klien kelas ingin mengubah warna, kita tinggal ganti satu baris kode saja.

---

### 🗄️ TAHAP 4: Memahami & Merancang Database (Supabase PostgreSQL)
- [ ] Memahami apa itu **Supabase** (Database PostgreSQL di awan yang gratis dan sangat cepat).
- [ ] Membuat akun dan proyek baru di Supabase.
- [ ] Merancang tabel database satu per satu:
  - `laporan`: menyimpan pengaduan, peran (korban/saksi), kategori, kronologi, status, dan kode tiket.
  - `bukti_laporan`: menyimpan file/foto bukti.
  - `tindak_lanjut`: menyimpan pesan balasan resmi dari Guru BK.
- [ ] Memahami konsep **Row Level Security (RLS)**: bagaimana privasi korban tetap terlindungi 100%.
- [ ] Mengambil URL & API Key dari Supabase lalu menyimpannya di file `.env.local`.

---

### 🖥️ TAHAP 5: Koding Tampilan (UI) Tahap demi Tahap
Setiap tampilan kita koding bersama, dibahas baris demi baris:
- [ ] **5.1. Navigasi Atas (Navbar)**:
  - Logo SafeReport dengan maskot/ikon ramah.
  - Badge *🎭 Mode Anonim Aktif* (agar siswa langsung merasa aman).
  - Tombol cepat *Cek Status Tiket* & *Masuk Siswa*.
- [ ] **5.2. Form Pengaduan Anonim di Halaman Depan (`/`)** (Sesuai Konsep V2):
  - Kartu pilihan peran yang santai: "Saya Korban" vs "Saya Saksi".
  - Kartu pilihan kategori perundungan (Verbal, Fisik, Siber, Sosial, dll.) dengan emoji/ikon yang ramah.
  - Pilihan cepat lokasi (Kantin, Kelas, Lapangan, dll.).
  - Textarea kronologi dengan teks panduan yang menenangkan.
  - Opsi unggah bukti (foto/screenshot chat).
- [ ] **5.3. Modal Pop-up Kode Tiket Unik**:
  - Menampilkan kode tiket (misal: `SF-8K9P`) dengan gaya tiket lucu/playful.
  - Tombol "Salin Kode" dan tombol langsung ke halaman cek status.
- [ ] **5.4. Halaman Cek Status Laporan (`/status`)**:
  - Kotak pencarian tiket yang simpel dan bersih.
  - Timeline visual langkah penanganan: Diterima ➔ Diverifikasi ➔ Sedang Diproses ➔ Selesai.
  - Kotak respon balasan dari Guru BK.
- [ ] **5.5. Halaman Portal Guru BK (`/admin`)**:
  - Login khusus Guru BK (terpisah dari siswa).
  - Dashboard statistik kasus.
  - Tabel kelola pengaduan: ubah status kasus & kirim pesan balasan tindak lanjut ke siswa.

---

### 🔗 TAHAP 6: Menghubungkan Tampilan ke Database & Logika Bisnis
- [ ] Membuat fungsi pengiriman form: data dari halaman depan langsung tersimpan ke Supabase.
- [ ] Membuat generator kode tiket acak yang unik (`SF-XXXX`).
- [ ] Membuat fungsi pembacaan status berdasarkan kode tiket di halaman `/status`.
- [ ] Membuat fungsi Guru BK untuk meng-update status dan menulis tanggapan.

---

### 🔍 TAHAP 7: Uji Coba Bersama Klien Kelas & Siklus Revisi
- [ ] Menguji seluruh alur dari laptop Anda.
- [ ] Memperlihatkan hasil ke klien kelas:
  - Menanyakan apakah warna kuningnya sudah pas, atau ingin kombinasi lain.
  - Menanyakan apakah ada teks/pertanyaan form yang perlu diubah.
- [ ] Melakukan revisi bersama-sama (dijamin aman dan terstruktur).

---

### 🚀 TAHAP 8: Publikasi Online ke Vercel (Gratis Rp 0)
- [ ] Commit dan push kode final ke GitHub.
- [ ] Menghubungkan repositori GitHub ke **Vercel** (layanan hosting resmi Next.js yang gratis).
- [ ] Memasukkan variabel database Supabase di pengaturan Vercel.
- [ ] Klik **Deploy** dan menunggu proses rilis (~1 menit).
- [ ] Website resmi aktif secara online dan bisa dibuka oleh siapapun lewat link (contoh: `https://safe-report.vercel.app`)! 🎉
