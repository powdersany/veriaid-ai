# VeriAid AI — Backend (Riva)

> Riva — 50% backend milestone (Day 1–5). Frontend by powdersany/team, backend by Riva (NoruAgent).

## What was built

Complete backend stack for VeriAid AI's humanitarian finance accountability platform:

- **Database** — 7 Prisma models (User, AidProgram, FundRecord, Expense, Evidence, Analysis, ProofLedger) + seed with 6 demo programs + 3 demo users
- **API** — 16 Next.js Route Handlers covering auth (4), programs CRUD (10), AI + verify (2)
- **Auth** — JWT (HS256 via `jose`) + bcrypt password hashing, HTTP-only cookies
- **AI** — 9Router / OpenAI-compatible client with OCR + 4-analyzer pipeline (consistency, evidence, anomaly, report) + heuristic fallback
- **Blockchain** — SHA-256 hash chain with `computeEventHash` + `verifyChain`, auto-appended on every mutation
- **Frontend integration** — 6 pages wired to real API: `/api/programs`, `/api/programs/[id]/{fund,expense,evidence,proof,analyze}`, `/api/auth/{login,signup,me,logout}`, `/api/verify/[hash]`, `/api/health`

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | Same repo as frontend, 1-click Vercel deploy |
| DB | SQLite (Prisma) | Zero-config local; migrate to Postgres in 5 min |
| ORM | Prisma 6 | Type-safe, single schema file |
| Auth | `jose` + `bcryptjs` | Pure JS, edge-compatible |
| AI | 9Router (OpenAI-compatible) | User already has key; fallback to OpenAI |
| Hash | Node `crypto` SHA-256 | Built-in, no dep, matches `web/src/lib/hash.ts` |
| Dev | `tsx` | Runs TS seed script without build step |

## Quick start

```bash
cd web
npm install
cp .env.example .env       # edit MINIMAX_API_KEY if you have one
npm run db:push            # creates SQLite + tables
npm run db:seed            # loads 6 demo programs + 3 demo users
npm run dev                # http://localhost:3000
```

## Demo accounts (after seed)

| Email | Password | Role |
|---|---|---|
| `demo@veriaid.ai` | `veriaid2026` | organization (Yayasan Tangguh Bencana) |
| `volunteer@veriaid.ai` | `veriaid2026` | volunteer |
| `auditor@veriaid.ai` | `veriaid2026` | auditor |

## API reference

### Public

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | DB + AI + auth status |
| GET | `/api/programs` | List programs (filter by `status`, `category`) |
| GET | `/api/programs/[slug]` | Program detail + expenses + evidence + funds + analyses + proof |
| GET | `/api/programs/[slug]/proof` | Hash chain for a program |
| POST | `/api/programs/[slug]/donations` | Record donation (public) |
| GET | `/api/verify/[hash]` | Verify a single hash is in a valid chain |

### Authenticated

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Create user, sets session cookie |
| POST | `/api/auth/login` | Login, sets session cookie |
| POST | `/api/auth/logout` | Clear cookie |
| GET | `/api/auth/me` | Current user (or null) |
| GET | `/api/programs/me` | My programs (dashboard) |
| POST | `/api/programs` | Create program |
| PATCH | `/api/programs/[id]` | Update program |
| POST | `/api/programs/[id]/fund` | Record funding received |
| POST | `/api/programs/[id]/expense` | Record expense + auto chain event |
| POST | `/api/programs/[id]/evidence` | Upload evidence + auto chain event |
| POST | `/api/programs/[id]/analyze` | Run AI pipeline (creates Analysis + AI_REVIEWED event) |
| POST | `/api/evidence/[id]/ocr` | OCR a single evidence file |

### Chain events auto-emitted

- `PROGRAM_CREATED` (seq 0, prev=0x000…)
- `PROGRAM_UPDATED`
- `FUND_RECEIVED`
- `EXPENSE_RECORDED`
- `EVIDENCE_UPLOADED`
- `AI_REVIEWED`
- `REPORT_PUBLISHED`

Each event: `currentHash = SHA256(prevHash + JSON({eventType, timestamp, data, sequence}))`.

## Migrating to Postgres (for production)

```bash
# 1. Edit prisma/schema.prisma
#    provider = "postgresql"
# 2. Get DATABASE_URL from Neon / Vercel Postgres / Supabase
# 3. Run:
npm run db:push
npm run db:seed
```

## Out-of-MVP (next sprint)

- GraphQL alternative
- Real file upload (currently metadata only)
- OAuth (Google/Apple)
- On-chain anchor (publish HEAD hash to L2)
- Multi-language
- WebSocket for live updates