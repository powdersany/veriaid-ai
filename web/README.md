# VeriAid AI — Frontend

> Platform akuntabilitas bantuan kemanusiaan berbasis AI + Blockchain.
> Hackathon MVP v1.0 · Stack: Next.js 16 + React 19 + Tailwind v4 + TypeScript

## Quick Start

```bash
# Install
npm install

# Copy env
cp .env.example .env.local

# Dev server
npm run dev          # http://localhost:3000

# Build
npm run build

# Production
npm start
```

## Project Structure

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # Landing
│   │   ├── programs/             # Programs listing
│   │   ├── program/[id]/         # Program detail
│   │   ├── proof/[id]/           # Blockchain certificate
│   │   ├── login/                # Auth: login
│   │   └── register/             # Auth: register
│   ├── dashboard/
│   │   ├── page.tsx              # Overview (stat + program table)
│   │   ├── create/               # Multi-step create program
│   │   └── program/[id]/
│   │       ├── finance/          # Budget & expense tracking
│   │       └── evidence/         # Upload + AI analysis
│   ├── analysis/[id]/            # AI result page
│   ├── sitemap.ts                # SEO sitemap
│   ├── robots.ts                 # SEO robots
│   ├── not-found.tsx             # 404
│   ├── loading.tsx               # Loading state
│   ├── global-error.tsx          # Error boundary
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Design system tokens
├── components/                   # Reusable UI
│   ├── Logo.tsx
│   ├── Nav.tsx
│   ├── Hero.tsx, HeroMocks.tsx
│   ├── ProblemSection.tsx
│   ├── SolutionSection.tsx
│   ├── HowItWorks.tsx
│   ├── TechSection.tsx
│   ├── CTASection.tsx
│   ├── Footer.tsx
│   ├── ProgramCard.tsx
│   ├── ProgramsList.tsx
│   ├── VerifyButton.tsx
│   ├── DashboardShell.tsx
│   └── Providers.tsx             # Auth provider wrapper
└── lib/
    ├── mock-data.ts              # 6 aid programs
    ├── auth.tsx                  # Auth context (localStorage)
    └── hash.ts                   # SHA-256 hash chain (Web Crypto)
```

## Available Pages (10/10 PRD)

| Route | Purpose | Auth |
|:---|:---|:---|
| `/` | Landing | Public |
| `/programs` | Browse programs | Public |
| `/program/[id]` | Program detail | Public |
| `/proof/[id]` | Blockchain certificate | Public |
| `/login` | Sign in | Public |
| `/register` | Sign up | Public |
| `/dashboard` | Org overview | Required |
| `/dashboard/create` | Create program | Required |
| `/dashboard/program/[id]/finance` | Fund & expense | Required |
| `/dashboard/program/[id]/evidence` | Upload evidence | Required |
| `/analysis/[id]` | AI result | Required |

## Tech Decisions

- **Next.js 16 App Router** — file-based routing, Server Components default
- **Tailwind v4** — `@theme` inline tokens di `globals.css` (no `tailwind.config.ts`)
- **TypeScript** — full type safety
- **Mock data** — 6 aid programs in `lib/mock-data.ts`, swap to API later
- **Auth (mock)** — localStorage session, swap to Sanctum/JWT later
- **SHA-256** — Web Crypto API in browser (no external lib)

## Mobile Responsive

Default Tailwind mobile-first. Tested at 375px / 768px / 1280px.

## Deploy to Vercel

1. Push repo ke GitHub
2. Connect Vercel → import repo
3. Set environment variables (`.env.example` for reference)
4. Deploy. Auto-URL: `https://veriaid-ai.vercel.app`

## Riva (Backend) Integration

When backend ready:
1. Replace `lib/mock-data.ts` with `fetch()` to API
2. Set `NEXT_PUBLIC_MOCK_MODE=false` in `.env.local`
3. Update `lib/auth.tsx` to call backend `/api/auth/*` endpoints
4. Update `lib/hash.ts` to use server-computed hashes

API contract format: see `PROMPT-FOR-RIVA.md` in parent directory.

## Performance Notes

- All public pages: SSG (prerendered HTML)
- Dashboard pages: dynamic (per-session data)
- Images: use `next/image` for optimization (TBD)
- Fonts: Inter + Plus Jakarta Sans via `next/font/google` (auto-preload)

## License

MIT — Hackathon MVP, all rights reserved to Tuan Muda
