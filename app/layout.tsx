import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafeReport — Pengaduan Bullying Aman & Rahasia",
  description:
    "Platform pelaporan perundungan (bullying) di sekolah & kelas. Privasi terjamin, anonim, transparan, dan ditangani oleh Guru BK.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-amber-50">{children}</body>
    </html>
  );
}
