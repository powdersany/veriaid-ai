import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProgramsList } from "@/components/ProgramsList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Program Bantuan — VeriAid AI",
  description:
    "Telusuri semua program bantuan kemanusiaan yang aktif. Setiap program punya bukti transaksi, analisis AI, dan sertifikat blockchain publik.",
};

export default function ProgramsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <ProgramsList />
      </main>
      <Footer />
    </>
  );
}
