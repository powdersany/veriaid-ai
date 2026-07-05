# VeriAid AI — Transparansi Dana Bantuan dengan Blockchain & AI

![VeriAid AI](https://veriaid-ai.vercel.app/og-image.png)

**VeriAid AI** adalah platform transparansi dana bantuan kemanusiaan yang menggabungkan **SHA-256 hash chain** (blockchain) dan **AI analyzer** untuk memastikan akuntabilitas program. Setiap transaksi, bukti, dan laporan di-hash dan dicatat di immutable ledger publik.

## 🚀 Fitur
| Fitur | Deskripsi |
|-------|-----------|
| **Hash Chain** | Setiap mutasi (dana masuk, pengeluaran, bukti) di-hash dengan SHA-256 dan dirangkai. Modifikasi satu event membatalkan seluruh chain. |
| **AI Analyzer** | OCR Vision (Gemini 3.5 Flash) + 4 analyzer (consistency, anomaly, report) untuk mendeteksi fraud. |
| **Public Verify** | Siapa pun bisa verifikasi integritas laporan via `/proof/[id]`. |
| **Demo Accounts** | 1-click login dengan akun demo (`org1@demo.id`, `volunteer1@demo.id`). |

## 🛠️ Tech Stack
| Layer | Teknologi |
|-------|-----------|
| **Frontend** | Next.js 16 + React 19 + Tailwind v4 |
| **Backend** | Next.js API Routes + Prisma + PostgreSQL (Neon) |
| **AI** | 9Router (`google/gemini-3.5-flash:free`) |
| **Auth** | JWT + bcryptjs |
| **Deploy** | Vercel (auto-deploy) |

## 📦 Setup Lokal
### Prerequisites
- Node.js 20+
- PostgreSQL (Neon/Vercel Postgres)
- API key 9Router (gratis)

### Langkah Instalasi
```bash
# Clone repo
git clone https://github.com/powdersany/veriaid-ai.git
cd veriaid-ai/web

# Install dependencies
npm install

# Setup .env.local
cp .env.example .env.local
# Edit .env.local dengan DATABASE_URL dan NINE_ROUTER_API_KEY

# Push schema + seed data demo
npm run db:reset

# Jalankan dev server
npm run dev
```

### .env.local
```env
DATABASE_URL="postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/veriaid?sslmode=require"
NINE_ROUTER_API_KEY="your_9router_key"
NEXTAUTH_SECRET="random_secure_string"
```

## 🔧 API Contract
| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/programs` | GET | List program (filter: status, category, mine) |
| `/api/programs` | POST | Buat program baru |
| `/api/programs/[id]` | GET | Detail program |
| `/api/programs/[id]/fund` | POST | Catat dana masuk |
| `/api/programs/[id]/expense` | POST | Catat pengeluaran |
| `/api/programs/[id]/evidence` | POST | Upload bukti |
| `/api/evidence/[id]/ocr` | POST | OCR bukti (extract nominal) |
| `/api/programs/[id]/analyze` | POST | Trigger AI analyzer |
| `/api/programs/[id]/proof` | GET | Fetch hash chain |
| `/api/verify/[hash]` | POST | Public verify endpoint |

## 📸 Screenshots
![Dashboard](https://veriaid-ai.vercel.app/screenshots/dashboard.png)
![Proof Page](https://veriaid-ai.vercel.app/screenshots/proof.png)
![AI Analysis](https://veriaid-ai.vercel.app/screenshots/analysis.png)

## 🤝 Kontribusi
1. Fork repo ini.
2. Buat branch fitur (`git checkout -b feat/awesome-feature`).
3. Commit perubahan (`git commit -m 'feat: add awesome feature'`).
4. Push ke branch (`git push origin feat/awesome-feature`).
5. Buat Pull Request.

## 📄 Lisensi
MIT © 2026 VeriAid AI