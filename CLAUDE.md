# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Express + Vite middleware) at http://localhost:5000
npm run build     # Build client (vite build → dist/public) and bundle server (esbuild → dist/index.js)
npm start         # Run the production build (dist/index.js) — used by Render
npm run check     # TypeScript type-check (tsc --noEmit)
npm run db:push   # Push shared/schema.ts changes to the database via drizzle-kit
```

No test suite or linter is configured. Note: port 5000 is often taken by macOS's AirPlay Receiver (Control Center) locally — override with `PORT=5050 npm run dev` if `EADDRINUSE`/`ENOTSUP` occurs.

## Environment

Requires a `.env` file (see `.env.example`) with:
```
DATABASE_URL=postgresql://...
```

This is a Postgres connection string for a Supabase project. `server/db.ts` throws at import time if `DATABASE_URL` is unset. Two important gotchas when setting this value anywhere (`.env`, Render, Vercel):
- **Use Supabase's connection pooler**, not the direct `db.<ref>.supabase.co` host — the direct host is IPv6-only and will hang indefinitely on networks without IPv6 routing (common on many ISPs). Use the pooler host (`aws-0-<region>.pooler.supabase.com`) instead.
- **Percent-encode special characters in the password** (e.g. a literal `%` must become `%25`) — an unencoded connection string causes `URIError: URI malformed` at runtime, not a clear startup error.

## Architecture

Full-stack TypeScript app: React 18 (Vite, wouter routing) + Express + Drizzle ORM over Postgres (Supabase), with a shared schema between client and server.

**Data flow:** `client/src/pages/*` → TanStack Query (`client/src/lib/queryClient.ts`, `apiRequest`) → Express routes (`server/routes.ts`) → storage layer (`server/storage.ts`, implements `IStorage`) → Drizzle ORM (`server/db.ts`) → Postgres. Request/response schemas are Zod, generated from the Drizzle table defs in `shared/schema.ts` via `drizzle-zod` (`insertItemSchema`, `insertSaleSchema`, etc.) and shared by both client and server through the `@shared/*` path alias.

**Data model** (`shared/schema.ts`):
- `items` — inventory items with `quantity`, `flow` (m³/h, required), optional `power`/`weight`/`speed`, and a `displayOrder` used for manual drag-to-reorder (falls back to `id` for ties).
- `sales` — sale records that **snapshot** the item's attributes (`itemName`, `flow`, `power`, etc.) at time of sale, so historical sales stay accurate even if the item is later edited or deleted.
- `users` — table exists in the schema but is not wired up to any auth; `getUser`/`createUser` in `storage.ts` are stubs.

**Concurrency-sensitive operations** in `storage.ts` use `db.transaction()`:
- `recordSale` does an atomic `UPDATE items SET quantity = quantity - ? WHERE quantity >= ?` to prevent overselling under concurrent requests, then inserts the sale snapshot.
- `returnSale` restores the item's quantity and deletes the sale record; it errors if the associated item was since deleted (surfaced client-side as a 409).

**Client structure:** pages live in `client/src/pages/` (inventory overview, add item, edit item, record sale, sold items), reusable pieces in `client/src/components/` (shadcn/ui primitives under `components/ui/`, example/demo components under `components/examples/` — the latter have some pre-existing TS type errors in their mock data, unrelated to app code). Sidebar nav items are defined as a single array in `client/src/components/app-sidebar.tsx`. Drag-and-drop reordering (`inventory-table.tsx`) uses `@dnd-kit`; reordering sends the whole reordered item list to `POST /api/items/reorder`, which the backend re-numbers into sequential `displayOrder` values. Design language follows `design_guidelines.md` (Linear/Notion-style productivity tool; Inter for UI text, JetBrains Mono for numeric/tabular values).

## Deployment

The app can run two different ways depending on host, and the repo carries config for both simultaneously:

**Render / any persistent Node host** (`render.yaml`): runs unchanged via `npm run build && npm start`, with `server/index.ts` calling `app.listen()` directly. This is the "normal" path.

**Vercel** (`vercel.json`, serverless): Vercel doesn't run a persistent `app.listen()` server, so the Express app is invoked per-request as a serverless function instead. This required non-obvious changes, worth knowing before touching deployment config:
- The function source lives at `server/vercel-handler.ts` (same Express setup as `server/index.ts`, minus `app.listen()`), but the **deployed function is a pre-bundled, committed file at `api/index.js`** — Vercel decides which serverless functions exist by scanning `/api` in the repository *before* running any build command, so generating that file only during the build is too late for it to be detected. `vercel.json`'s `buildCommand` still regenerates it (`esbuild server/vercel-handler.ts --bundle --platform=node --format=cjs --outfile=api/index.js`) so it stays in sync — but if you edit `server/routes.ts`, `server/storage.ts`, or `server/vercel-handler.ts`, you must **regenerate and commit `api/index.js` yourself** before pushing, or Vercel will deploy stale server code.
- The bundle must be **CommonJS**, not ESM (`--format=cjs`) — esbuild's ESM output can't statically resolve a dynamic `require()` buried in a dependency, which crashes every request with `Dynamic require of "fs" is not supported`.
- `api/package.json` (`{"type": "commonjs"}`) scopes CJS module resolution to just the `api/` directory, overriding the root `package.json`'s `"type": "module"` — needed because Node resolves module type from the nearest `package.json`, and the bundle's `.js` extension would otherwise be parsed as ESM.
- `vercel.json` rewrites route `/api/*` to the single `api/index` function and everything else to `/index.html` (SPA fallback) — the client build output directory is `dist/public` (set via `vite.config.ts`'s `build.outDir`).
