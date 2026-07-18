# 2PUC Notes Store

A full-stack digital notes store for Karnataka 2nd PUC Science students. Students browse sections/cards, purchase resources via Razorpay, and download PDFs. Includes a complete password-protected admin panel.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Supabase PostgreSQL connection string (Settings → Database → URI in Supabase dashboard)
- Required env: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` — for payments
- Required env: `SUPABASE_URL` — Supabase project URL (e.g. `https://xxx.supabase.co`)
- Required env: `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (used server-side only, never exposed to browser)
- Optional env: `SUPABASE_ANON_KEY` — Supabase anon key (not currently used server-side)
- Optional env: `ADMIN_PASSWORD` — defaults to `admin123` (change in production!)
- Optional env: `SESSION_SECRET` — for session management

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, TailwindCSS, shadcn/ui, Wouter (routing), TanStack Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Payments: Razorpay
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/` — Drizzle ORM schema (sections, cards, orders tables)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contract)
- `lib/api-client-react/` — Generated React Query hooks + Zod schemas
- `artifacts/api-server/src/routes/` — Express route handlers (store, checkout, purchases, admin)
- `artifacts/api-server/uploads/` — Uploaded PDFs and images (pdfs/ and images/ subdirs)
- `artifacts/notes-store/src/pages/` — Public pages (home, section, card, checkout, payment-success, my-purchases)
- `artifacts/notes-store/src/pages/admin/` — Admin pages (login, dashboard, sections, cards, orders, card-new, card-edit)
- `artifacts/notes-store/src/lib/utils.ts` — formatRupees(), getAdminToken(), setAdminToken(), clearAdminToken()

## Architecture decisions

- **Admin auth via `x-admin-token` header**: Sessions are stored in an in-memory `Set<string>` on the server. Token is persisted to `localStorage` on the client and injected into all API calls via `setAdminTokenGetter` in `lib/api-client-react`.
- **Price stored in paise** (₹1 = 100 paise) throughout DB and API. `formatRupees()` converts for display.
- **File storage via Supabase Storage**: PDFs go to the `notes` bucket (private), images go to the `images` bucket (public). Upload endpoints are NOT in the OpenAPI spec (avoids Orval TS collision with multipart types). The Supabase client is initialised in `artifacts/api-server/src/supabase.ts` using `SUPABASE_SERVICE_ROLE_KEY`.
- **Download security**: PDF downloads require a valid `orderId` + `cardId` combination with `status=paid` in DB — the server generates a 1-hour Supabase signed URL and redirects the browser to it. No auth token needed on the client; the signed URL is time-limited and comes from the private `notes` bucket.
- **Free resources still create an order**: Free card downloads go through `POST /api/checkout/free-download` which creates a paid order record for tracking, then returns a download URL.

## Product

- **Public store**: Browse sections, view cards with metadata and preview images, search by subject/chapter/title, filter by price/type.
- **Checkout**: Enter name + phone (+ optional email), pay via Razorpay modal for paid resources or get direct download link for free ones.
- **My Purchases**: Enter phone number to retrieve all past purchases and re-download PDFs.
- **Admin panel** (password-protected): Dashboard with revenue/order stats, full CRUD for sections (with drag-to-reorder), full CRUD for cards (with PDF/image upload), paginated orders list.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- **Admin password defaults to `admin123`** — set `ADMIN_PASSWORD` env secret before going to production.
- **Admin sessions are in-memory** — they are lost on server restart. Users must log in again after a restart.
- **Upload routes outside OpenAPI spec** — `POST /api/admin/upload/pdf` and `POST /api/admin/upload/image` are not in `openapi.yaml` and have no generated hooks. Use direct `fetch()` with FormData and `x-admin-token` header. Both now stream the file into Supabase Storage (multer memoryStorage, never writes to disk).
- **Run codegen after any OpenAPI spec change**: `pnpm --filter @workspace/api-spec run codegen`
- **`res.status().json()` in Express routes** — use separate `res.status(...).json(...); return;` lines (not `return res.status(...).json(...)`) to satisfy TypeScript's "not all code paths return a value" check.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
