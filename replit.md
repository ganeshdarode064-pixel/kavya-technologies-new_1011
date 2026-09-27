# Kavya Technologies

Premium public website and repair enquiry operations surface for Kavya Technologies in Kopargaon.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/kavya-repair-site/src/components/site.tsx` — public landing page and `/ops` operations surface
- `artifacts/kavya-repair-site/src/index.css` — shared visual system and responsive layout
- `lib/api-spec/openapi.yaml` — source of truth for public API contracts
- `artifacts/api-server/src/routes/` — Express route handlers for services, reviews, enquiries, and operations
- `lib/db/src/schema/` — PostgreSQL tables for repair requests and contact messages

## Architecture decisions

- The public page preserves the business facts from the original static site; it does not invent claims, reviews, certifications, or experience.
- Public service and review content is served through the API, while customer enquiries persist in the project PostgreSQL database.
- The `/ops` route is intentionally a lightweight operations surface for request triage; authentication should be added before exposing it publicly.
- The visual device diagnostic treatment is a lightweight procedural fallback so the first load remains fast on local and mobile devices.

## Product

Customers can learn about repair services, view factual reviews and hours, submit repair requests or contact messages, call, WhatsApp, and open directions. Staff can review request totals and update repair statuses at `/ops`.

## User preferences

No standing preferences recorded.

## Gotchas

The frontend production build requires `PORT` and `BASE_PATH` from its managed workflow. Use the workflow or provide both variables for a manual build.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
