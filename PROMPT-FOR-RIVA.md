# Brief untuk Riva — Backend & AI & Blockchain

> Dari: Tuan Muda via Hermes
> Tanggal: 18 Juni 2026
> Project: VeriAid AI (Hackathon MVP)
> Role Riva: Backend Engineer + AI Integration + Blockchain

---

## Woi Riva, ini summary biar kamu gas

Tuan Muda udah mulai bangun VeriAid AI — platform akuntabilitas bantuan kemanusiaan pakai AI + Blockchain. Hackathon MVP v1.0. PRD lengkap udah ada, Tuan Muda share filenya (cek dari Tuan Muda ya).

**Yang udah Tuan Muda kerjain (frontend, gak perlu kamu sentuh):**
- Landing page (`/`) Bahasa Indonesia — 8 section (Hero, Problem, Solution, How It Works, Technology, CTA, Footer)
- Mobile responsive
- Design system (Tailwind tokens: teal-gold palette, Inter + Plus Jakarta Sans fonts)
- Stack: **Next.js 16 + React 19 + Tailwind v4 + TypeScript**
- Path lokal: `D:\hermes_home\sandboxes\veriaid-ai\web\`
- Dev server jalan di `localhost:3000` (`npm run dev`)
- Deploy target: **Vercel** (free tier, auto-deploy dari GitHub)

**Yang harus kamu handle:**
- API backend (Aid Program CRUD, Fund, Expense, Evidence, AI Analysis, Blockchain Proof)
- Database (sesuai PRD section 10 — User, AidProgram, FundRecord, BudgetAllocation, Evidence, dst)
- AI integration (OCR Vision, financial consistency analyzer, distribution anomaly detector, smart report generator)
- Blockchain proof (SHA-256 hash chain ledger — MVP cukup simulasi di DB, smart contract optional)

**Saran stack backend (pilih yang paling cepet buat kamu):**

| Opsi | Stack | Pros | Cons |
|:---|:---|:---|:---|
| **A. Next.js API Routes (monorepo)** | Tambah di repo Next.js yang udah ada | Cepet, gak perlu setup infra baru, deploy bareng Vercel | Kurang scalable, coupling ketat |
| **B. Node.js Express + Postgres** | Terpisah dari frontend | Clean separation, scalable | Setup 2 repo, 2 deploy, 2 port |
| **C. FastAPI (Python) + Postgres** | Terpisah, fokus AI | Python cocok AI/ML, async native | Setup 2 repo, deploy ke Railway/Render bukan Vercel |

**Rekomendasi: Opsi A (Next.js API Routes).** Alasannya:
- Repo udah ada, Tambah folder `src/app/api/` di Next.js
- AI bisa panggil OpenAI/9Router langsung dari API route
- Deploy 1 klik di Vercel, gak perlu Railway/Render
- Cuma butuh Postgres — Vercel Postgres (free tier 256MB cukup untuk demo) atau Neon (free tier)

**File structure yang bakal jadi (kalau pilih Opsi A):**
```
D:\hermes_home\sandboxes\veriaid-ai\web\
  src/
    app/
      api/                    ← KAMU KERJAIN SINI
        programs/
          route.ts            ← GET (list), POST (create)
          [id]/
            route.ts          ← GET, PATCH, DELETE
        programs/[id]/
          fund/route.ts       ← POST (add fund received)
          expense/route.ts    ← POST (record expense)
          evidence/route.ts   ← POST (upload + AI analyze)
        analysis/[id]/route.ts ← GET AI result
        proof/[id]/route.ts    ← GET blockchain proof, POST (generate)
        verify/[hash]/route.ts ← POST (verify hash valid)
      page.tsx               ← Tuan Muda yang punya
      layout.tsx
      globals.css
    components/              ← Tuan Muda yang punya
    lib/                     ← Tambah folder ini, utility kamu
      db.ts                  ← Prisma client / Drizzle
      ai.ts                  ← OpenAI/9Router wrapper
      blockchain.ts          ← SHA-256 hash chain logic
      auth.ts                ← Simple session
```

**AI Integration notes:**
- OCR: pake OpenAI Vision API (gpt-4o) atau 9Router (`google/gemini-3.5-flash:free`)
- Text analysis: GPT-4o atau 9Router model
- Riva cek credentials di `credentials/9router.env` atau pake Tuan Muda kasih OpenAI key

**Blockchain MVP scope:**
- Cukup SHA-256 hash chain di DB (append-only `proof_ledger` table)
- Field: `id`, `program_id`, `event_type` (PROGRAM_CREATED, FUND_RECEIVED, dll), `data_hash`, `previous_hash`, `current_hash`, `timestamp`
- Setiap event baru: `current_hash = SHA256(previous_hash + JSON.stringify(event))`
- Verify: re-compute hash chain dari awal, bandingin dengan stored
- Optional: smart contract di testnet (Polygon/Base) kalau masih ada waktu

**Yang Riva perlu deliver ke Tuan Muda (gak lama-lama, simple aja):**
1. **API contract** — list endpoint + request/response schema, format Markdown. Misal taruh di `D:\hermes_home\sandboxes\veriaid-ai\API-CONTRACT.md`. Tuan Muda share ke gue biar frontend tinggal fetch.
2. **Seed data** — 3-5 program contoh (Bantuan Banjir Demak dari PRD section 7.1, dll) untuk demo. Format JSON atau SQL insert.
3. **Mock mode** (kalau backend belum 100%): kasih flag `MOCK=true` di `.env.local`, API return dummy data biar frontend bisa develop paralel.

**Communication:**
- Chat sama Tuan Muda langsung via Telegram
- Share progress di group atau thread yang Tuan Muda invite kamu
- Code repo: Tuan Muda invite kamu ke GitHub repo (segera dibuat), atau kamu bikin branch dari project yang udah ada
- Kalau ada pertanyaan teknis, langsung tanya Tuan Muda

**Timeline (priority biar gak molor):**
| Hari | Target |
|:---|:---|
| H+1 | API contract + DB schema + Next.js API routes setup |
| H+2 | CRUD Aid Program + Fund + Expense jalan |
| H+3 | Evidence upload + AI OCR integration |
| H+4 | AI analysis pipeline (consistency + anomaly) |
| H+5 | Blockchain hash chain + proof generation + verify endpoint |
| H+6 | Seed data + integration test sama frontend Tuan Muda |
| H+7 | Polish + deploy bareng Vercel |

**Deadline hackathon:** Tanya Tuan Muda ya, dia yang tau persis. Asumsi 1-2 minggu.

**Yuk gas Riva, kalau ada apa-apa langsung samber Tuan Muda. Thanks!**
