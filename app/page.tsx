"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormLaporan from "@/components/FormLaporan";
import ModalTiket from "@/components/ModalTiket";
import { AuthService } from "@/lib/data";
import { Profile } from "@/types";

export default function HomePage() {
  const [user, setUser] = useState<Profile | null>(null);
  const [submittedKode, setSubmittedKode] = useState<string | null>(null);

  useEffect(() => {
    setUser(AuthService.getUser());
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/50">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 sm:py-10">
        {/* Kontainer Formulir Pengaduan */}
        <div className="card p-6 sm:p-8 border border-amber-200/90 shadow-sm">
          <FormLaporan
            user={user}
            onSuccess={(kode) => setSubmittedKode(kode)}
          />
        </div>
      </main>

      {/* Modal Tiket Sukses Setelah Laporan Terkirim */}
      {submittedKode && (
        <ModalTiket
          kode={submittedKode}
          onClose={() => setSubmittedKode(null)}
        />
      )}

      <Footer />
    </div>
  );
}
