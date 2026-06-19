export type ProgramStatus = "verified" | "in_progress" | "pending_review";

export interface AidProgram {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  targetFund: number;
  fundReceived: number;
  fundSpent: number;
  targetBeneficiary: number;
  aidType: string;
  status: ProgramStatus;
  aiScore: number;
  startDate: string;
  endDate?: string;
  coverImage?: string;
  organizer: string;
}

export const mockPrograms: AidProgram[] = [
  {
    id: "flood-relief-demak-2026",
    title: "Bantuan Banjir Demak 2026",
    category: "Bencana Alam",
    location: "Demak, Jawa Tengah",
    description:
      "Penyaluran paket makanan, air bersih, dan obat-obatan untuk 500 keluarga terdampak banjir di 3 kecamatan Kabupaten Demak.",
    targetFund: 10_000_000,
    fundReceived: 10_000_000,
    fundSpent: 8_700_000,
    targetBeneficiary: 500,
    aidType: "Paket Makanan + Air Bersih",
    status: "verified",
    aiScore: 94,
    startDate: "2026-01-15",
    endDate: "2026-02-28",
    organizer: "Yayasan Tangguh Bencana",
  },
  {
    id: "stunting-prevention-semarang",
    title: "Pencegahan Stunting Semarang",
    category: "Kesehatan",
    location: "Semarang, Jawa Tengah",
    description:
      "Program pemberian makanan tambahan & edukasi gizi untuk 200 balita di 5 posyandu Kota Semarang selama 6 bulan.",
    targetFund: 25_000_000,
    fundReceived: 18_500_000,
    fundSpent: 12_300_000,
    targetBeneficiary: 200,
    aidType: "Paket Gizi + Edukasi",
    status: "in_progress",
    aiScore: 87,
    startDate: "2026-02-01",
    organizer: "Komunitas Gizi Bunda",
  },
  {
    id: "umkm-recovery-pati",
    title: "Pemulihan UMKM Pati",
    category: "Pemberdayaan Ekonomi",
    location: "Pati, Jawa Tengah",
    description:
      "Bantuan modal & pelatihan digital marketing untuk 50 UMKM terdampak pandemi di Kabupaten Pati.",
    targetFund: 15_000_000,
    fundReceived: 15_000_000,
    fundSpent: 14_200_000,
    targetBeneficiary: 50,
    aidType: "Modal + Pelatihan",
    status: "verified",
    aiScore: 91,
    startDate: "2025-11-01",
    endDate: "2026-01-31",
    organizer: "Koperasi Mitra Pati",
  },
  {
    id: "beasiswa-anak-banten",
    title: "Beasiswa Anak Banten",
    category: "Pendidikan",
    location: "Serang, Banten",
    description:
      "Beasiswa SPP & buku untuk 100 siswa SD-SMP dari keluarga kurang mampu di Kota Serang selama 1 tahun ajaran.",
    targetFund: 30_000_000,
    fundReceived: 22_000_000,
    fundSpent: 8_500_000,
    targetBeneficiary: 100,
    aidType: "Beasiswa + Buku",
    status: "in_progress",
    aiScore: 89,
    startDate: "2026-01-10",
    organizer: "Yayasan Cahaya Pendidikan",
  },
  {
    id: "air-bersih-gunung-kidul",
    title: "Air Bersih Gunung Kidul",
    category: "Infrastruktur",
    location: "Gunung Kidul, DIY",
    description:
      "Pembangunan 5 sumur bor & instalasi water filter untuk 300 KK di 2 desa kekeringan Gunung Kidul.",
    targetFund: 50_000_000,
    fundReceived: 35_000_000,
    fundSpent: 5_000_000,
    targetBeneficiary: 300,
    aidType: "Infrastruktur Air",
    status: "pending_review",
    aiScore: 78,
    startDate: "2026-03-01",
    organizer: "Forum Air Bersih Nusantara",
  },
  {
    id: "rumah-singgah-yogyakarta",
    title: "Rumah Singgah Pasien Yogyakarta",
    category: "Kesehatan",
    location: "Yogyakarta, DIY",
    description:
      "Penyediaan tempat tinggal sementara gratis untuk pasien rujukan & pendamping dari luar kota yang berobat di RS Sardjito.",
    targetFund: 8_000_000,
    fundReceived: 8_000_000,
    fundSpent: 7_200_000,
    targetBeneficiary: 120,
    aidType: "Akomodasi + Logistik",
    status: "verified",
    aiScore: 96,
    startDate: "2025-10-01",
    endDate: "2026-04-30",
    organizer: "Sahabat Pasien Indonesia",
  },
];

export const categories = [
  "Semua",
  "Bencana Alam",
  "Kesehatan",
  "Pendidikan",
  "Pemberdayaan Ekonomi",
  "Infrastruktur",
];

export const statusLabel: Record<ProgramStatus, string> = {
  verified: "Terverifikasi",
  in_progress: "Berjalan",
  pending_review: "Review AI",
};

export const statusColor: Record<ProgramStatus, string> = {
  verified: "bg-green-50 text-success",
  in_progress: "bg-blue-50 text-blue-600",
  pending_review: "bg-amber-50 text-warning",
};

export function formatRupiah(amount: number): string {
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)}K`;
  }
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function getProgress(fundSpent: number, targetFund: number): number {
  return Math.min(100, Math.round((fundSpent / targetFund) * 100));
}
