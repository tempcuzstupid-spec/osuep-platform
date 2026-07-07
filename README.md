# OSUEP — One Stop Uniforms Enterprise Platform

A B2B procurement platform for uniforms and branded apparel. Built from an 8-volume master specification covering foundation, customer experience, administration, supplier integration, embroidery production, technical architecture, growth strategy, and AI directives.

## Stack

- **Frontend** — Next.js 14 (App Router) · TypeScript · Tailwind CSS · React Server Components
- **Backend** — Fastify · TypeScript · Drizzle ORM · Lucia auth
- **Database** — Neon Postgres
- **Object storage** — GitHub repo (P0) → Cloudflare R3 (P3+)
- **Email** — Resend
- **AI** — Anthropic Claude (P5)
- **Hosting** — Render (split stack: `osuep-web` + `osuep-api`)
- **CI/CD** — GitHub Actions

## Repo Layout

```
osuep-platform/
├── apps/
│   ├── web/             # Next.js customer/admin portal + public site
│   └── api/             # Fastify REST API
├── packages/
│   ├── db/              # Drizzle schema, migrations, seed
│   ├── ui/              # Shared React components + design system
│   └── types/           # Shared TypeScript types
├── storage/
│   ├── artwork/         # Master artwork files (git)
│   ├── brand/           # Brand assets (git)
│   └── proofs/          # Production proofs (git, until P3)
└── infra/               # Render blueprints, env templates
```

## Quick Start

```bash
# Install
pnpm install

# Copy env templates
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Edit each with real values (DATABASE_URL, RESEND_API_KEY, etc.)

# Run DB migrations
pnpm db:migrate

# Start dev (web + api concurrently)
pnpm dev
```

## Phases

| Phase | Status | Description |
|---|---|---|
| **P0** | in progress | Foundation: monorepo, auth, RBAC, orgs/locations, audit log, healthz |
| P1 | pending | Catalog: products, supplier feed ingest, public product pages, search |
| P2 | pending | Customer experience: portal, carts, quotes, approval workflow, order history |
| P3 | pending | Admin/operations: dashboards, customer admin, order mgmt, reporting, R3 storage |
| P4 | pending | Production: embroidery config, artwork library, production queue, QA, decorator dashboard |
| P5 | pending | AI: search, recommendations, quote assist, analytics, marketing |
| P6 | pending | Mobile & polish: PWA, notifications, voice, accessibility, performance |

## Services (Render)

- `osuep-web` — Next.js web app
- `osuep-api` — Fastify API

## Spec

The 8-volume master specification is documented at https://osuep-website.onrender.com (a companion spec-publishing site, also in this org).

## Storage

Static brand assets and master artwork live in `storage/` and are committed to the repo:

- `storage/brand/` — logos, fonts, color tokens (JSON, SVG, PNG)
- `storage/artwork/` — master artwork files (per customer/version)
- `storage/proofs/` — production proofs (small PNGs, JPEGs)

In P3 we'll move dynamic uploads (customer-supplied artwork, large production files) to **Cloudflare R2** via a `Storage` interface in the API. For P0 the GitHub-backed approach is intentional — it keeps every committed asset versioned alongside the code that references it.
