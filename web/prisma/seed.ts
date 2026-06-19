// Prisma seed — loads 6 demo programs + 3 demo users.
// Run: npx prisma db push && npx tsx prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";

const prisma = new PrismaClient();

const GENESIS = "0".repeat(64);

function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

function computeHash(eventType: string, timestamp: string, data: unknown, prev: string) {
  return sha256(JSON.stringify({ event: eventType, timestamp, data, previousHash: prev }));
}

const DEMO_USERS = [
  {
    id: "user_demo_owner",
    email: "demo@veriaid.ai",
    name: "Syahnahl (Demo Owner)",
    password: "veriaid2026",
    role: "organization",
    organization: "Yayasan Tangguh Bencana",
  },
  {
    id: "user_demo_volunteer",
    email: "volunteer@veriaid.ai",
    name: "Rina (Demo Volunteer)",
    password: "veriaid2026",
    role: "volunteer",
  },
  {
    id: "user_demo_admin",
    email: "admin@veriaid.ai",
    name: "Admin VeriAid",
    password: "veriaid2026",
    role: "organization",
    organization: "VeriAid Platform",
  },
];

interface SeedProgram {
  slug: string;
  title: string;
  category: string;
  location: string;
  description: string;
  targetFund: number;
  fundReceived: number;
  fundSpent: number;
  targetBeneficiary: number;
  aidType: string;
  status: "verified" | "in_progress" | "pending_review";
  aiScore: number;
  startDate: string;
  endDate?: string;
  organizer: string;
  expenses?: Array<{ item: string; amount: number; category: string; date: string; note?: string }>;
  evidence?: Array<{ name: string; type: string; size: string; status: string; aiNote?: string; date: string }>;
}

const PROGRAMS: SeedProgram[] = [
  {
    slug: "flood-relief-demak-2026",
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
    expenses: [
      { item: "500 paket makanan", amount: 4_785_000, category: "Paket Bantuan", date: "2026-02-15", note: "Distribusi ke 3 kecamatan" },
      { item: "Sewa truk distribusi", amount: 2_436_000, category: "Logistik", date: "2026-02-14" },
      { item: "Koordinator lapangan (3 org × 1 bulan)", amount: 1_500_000, category: "SDM", date: "2026-02-01" },
    ],
    evidence: [
      { name: "Distribusi_Demak_3kec.jpg", type: "foto", size: "2.4 MB", status: "analyzed", aiNote: "Cocok dengan data penerima", date: "2026-02-22" },
      { name: "Nota_pembelian_paket.pdf", type: "nota", size: "184 KB", status: "analyzed", aiNote: "OCR: Rp 4.785.000 terdeteksi", date: "2026-02-20" },
      { name: "Invoice_logistik_2.pdf", type: "invoice", size: "92 KB", status: "flagged", aiNote: "Nomor invoice duplikat terdeteksi", date: "2026-02-19" },
      { name: "Foto_sebelum_distribusi.jpg", type: "foto", size: "1.8 MB", status: "analyzed", date: "2026-02-18" },
      { name: "Laporan_koordinator.docx", type: "laporan", size: "78 KB", status: "pending", date: "2026-02-15" },
    ],
  },
  {
    slug: "stunting-prevention-semarang",
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
    expenses: [
      { item: "200 paket Gizi Bunda", amount: 8_500_000, category: "Paket Bantuan", date: "2026-02-20" },
      { item: "Konsultan gizi (2 org × 2 bulan)", amount: 3_800_000, category: "SDM", date: "2026-02-05" },
    ],
  },
  {
    slug: "umkm-recovery-pati",
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
    slug: "beasiswa-anak-banten",
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
    slug: "air-bersih-gunung-kidul",
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
    slug: "rumah-singgah-yogyakarta",
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

async function buildChain(programId: string, ownerId: string) {
  // Build a synthetic but real chain so /proof pages have data immediately.
  const program = await prisma.aidProgram.findUnique({
    where: { id: programId },
    include: { funds: true, expenses: true, evidence: true },
  });
  if (!program) return;

  const events: Array<{ eventType: string; data: Record<string, unknown>; ts: string }> = [];
  events.push({
    eventType: "PROGRAM_CREATED",
    data: {
      programId: program.slug,
      title: program.title,
      targetFund: program.targetFund,
      organizer: program.organizer,
      ownerId,
    },
    ts: new Date(program.startDate).toISOString(),
  });
  // Add a synthetic fund received event for verified/in_progress programs
  if (program.fundReceived > 0) {
    events.push({
      eventType: "FUND_RECEIVED",
      data: { amount: program.fundReceived, source: "donor_qris" },
      ts: new Date(program.startDate).toISOString(),
    });
  }
  // Each expense = an EXPENSE_RECORDED
  for (const e of program.expenses) {
    events.push({
      eventType: "EXPENSE_RECORDED",
      data: { expenseId: e.id, item: e.item, amount: e.amount, category: e.category },
      ts: new Date(e.date).toISOString(),
    });
  }
  // Each evidence = EVIDENCE_UPLOADED
  for (const ev of program.evidence) {
    events.push({
      eventType: "EVIDENCE_UPLOADED",
      data: { evidenceId: ev.id, name: ev.name, type: ev.type, status: ev.status },
      ts: new Date(ev.date).toISOString(),
    });
  }
  // AI reviewed
  if (program.aiScore > 0) {
    events.push({
      eventType: "AI_REVIEWED",
      data: { aiScore: program.aiScore },
      ts: new Date().toISOString(),
    });
  }
  // Report published if verified
  if (program.status === "verified") {
    events.push({
      eventType: "REPORT_PUBLISHED",
      data: { status: "verified" },
      ts: new Date().toISOString(),
    });
  }

  let prev = GENESIS;
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    const current = computeHash(ev.eventType, ev.ts, ev.data, prev);
    await prisma.proofLedger.create({
      data: {
        programId: program.id,
        eventType: ev.eventType,
        data: JSON.stringify(ev.data),
        previousHash: prev,
        currentHash: current,
        sequence: i,
        timestamp: new Date(ev.ts),
      },
    });
    prev = current;
  }
}

async function main() {
  console.log("🌱 Seeding VeriAid AI database...");

  // Wipe existing data
  await prisma.proofLedger.deleteMany();
  await prisma.analysis.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.fundRecord.deleteMany();
  await prisma.aidProgram.deleteMany();
  await prisma.user.deleteMany();

  // Users
  for (const u of DEMO_USERS) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await prisma.user.create({
      data: {
        id: u.id,
        email: u.email,
        name: u.name,
        passwordHash,
        role: u.role,
        organization: u.organization,
      },
    });
    console.log(`  👤 user: ${u.email} (${u.role})`);
  }

  // Programs (assign to demo owner)
  for (const p of PROGRAMS) {
    const program = await prisma.aidProgram.create({
      data: {
        slug: p.slug,
        title: p.title,
        category: p.category,
        location: p.location,
        description: p.description,
        targetFund: p.targetFund,
        fundReceived: p.fundReceived,
        fundSpent: p.fundSpent,
        targetBeneficiary: p.targetBeneficiary,
        aidType: p.aidType,
        status: p.status,
        aiScore: p.aiScore,
        startDate: new Date(p.startDate),
        endDate: p.endDate ? new Date(p.endDate) : null,
        organizer: p.organizer,
        ownerId: "user_demo_owner",
      },
    });

    if (p.expenses) {
      for (const e of p.expenses) {
        await prisma.expense.create({
          data: {
            programId: program.id,
            item: e.item,
            amount: e.amount,
            category: e.category,
            date: new Date(e.date),
            note: e.note,
          },
        });
      }
    }
    if (p.evidence) {
      for (const ev of p.evidence) {
        await prisma.evidence.create({
          data: {
            programId: program.id,
            name: ev.name,
            type: ev.type,
            size: ev.size,
            status: ev.status,
            aiNote: ev.aiNote,
            date: new Date(ev.date),
          },
        });
      }
    }

    // Build the proof chain
    await buildChain(program.id, "user_demo_owner");
    console.log(`  📦 program: ${p.title} (${p.status}, aiScore=${p.aiScore})`);
  }

  console.log("✅ Seed complete: 3 users, 6 programs, with proof chains.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
