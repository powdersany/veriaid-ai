import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VeriAid AI — Transparansi untuk Setiap Kebaikan",
  description:
    "Platform akuntabilitas bantuan kemanusiaan berbasis AI dan Blockchain. Membuktikan setiap rupiah bantuan digunakan secara transparan, terverifikasi, dan tahan manipulasi.",
  keywords: [
    "akuntabilitas bantuan",
    "transparansi donasi",
    "AI humanitarian",
    "blockchain NGO",
    "VeriAid",
  ],
  openGraph: {
    title: "VeriAid AI — Transparansi untuk Setiap Kebaikan",
    description:
      "Buktikan setiap rupiah bantuan digunakan secara transparan dengan AI + Blockchain.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F4C5C",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jakarta.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-white text-ink-800">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
