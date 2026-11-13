# PETA PoC — web

Front-end-only clickable prototype of PETA's **Talent Recommendation** feature for Kalbe HR. Next.js 16 (App Router, Cache Components), Tailwind CSS v4, shadcn/ui, pnpm. Project rules live in `../CLAUDE.md`; the build plan is in `../docs/backlog/`; the mockups are in `../docs/mockups/`.

## Run it

Use the Node version in `.nvmrc` (`nvm use`).

```bash
pnpm install   # install dependencies
pnpm dev       # dev server at http://localhost:3000
pnpm lint      # ESLint
pnpm build     # production build
pnpm start     # serve the production build (after pnpm build); add -p 3100 to pick another port
```

## Routes

| Route | Screen | Demo query params |
|---|---|---|
| `/` | Redirects to `/talent-recommendation` | |
| `/talent-recommendation` | TR-01 candidate search list | `?state=empty` (TR-01a), `?state=loading` (TR-01c), `?toast=draft-saved&title=…` (TR-01d) |
| `/talent-recommendation/new` | TR-02 New Candidate Search; switch Advanced mode on for TR-03 weights | `?state=errors` (TR-02a) |
| `/talent-recommendation/[id]` | TR-04 / 05 / 06 / 07, chosen by the mock search status. Drafts redirect to `/edit` | `?state=processing\|found\|not-found\|failed` |
| `/talent-recommendation/[id]/edit` | TR-03 Edit criteria (pre-filled, Advanced mode on) | |
| `/talent-management`, `/talent-management/[...slug]`, `/audit-log`, `/user-management` | UNAV-01 Page unavailable | |
| `/design-check` | Design review page for tokens and shared components. Not linked; `noindex` | |

Mock searches to try: `s-001` searching (TR-04), `s-002` completed with results (TR-05), `s-003` and `s-008` drafts (edit form), `s-004` failed (TR-07), `s-009` completed with 0 results (TR-06).

## What is mocked

- **Data:** all data comes from `src/mocks/` (9 searches, 8 ranked results) through `src/lib/data.ts`, the only data access layer. Its functions are synchronous and are where real API calls go later.
- **Nothing is saved:** Save Draft returns to the list with a toast; refreshing resets every form.
- **Start Search:** nothing is sent. The request the API would receive is logged to the browser console (DevTools → Console):
  - new search: `POST /v1/candidate-searches` → opens `s-001` (processing);
  - edit criteria: `PUT /v1/candidate-searches/{id}` → opens `/{id}?state=processing`.
  - The body is the `SearchCriteria` shape from `src/lib/types.ts`.
- **No polling:** the processing view never finishes; Try Again only shows the processing view.
- **Not available in this preview:** sign out, PDF export, and the Talent Management, Audit Log and User Management modules (they show the unavailable page or an info toast).

## Known differences

Deliberate differences from the mockups and backlog:

1. **Console log on Start Search.** B17 says "no `console.log`", but the API-request log above was requested explicitly, so it stays (one call, in `logApiRequest` in `src/lib/data.ts`).
2. **TR-01d (draft saved):** the mockup also shows the saved search as a new Draft row. Nothing is persisted, so the list keeps its 9 searches and only the toast appears.
3. **TR-03 on `/edit`:** the breadcrumb reads "Talent Recommendation › {position}" (per B16) instead of the mockup's "New Candidate Search".
4. **Unenforced ranges:** only Job Title, Job Description and (with Advanced mode on) the 100% weights total are validated. GPA 0–4, age 17–65 and weight 0–100 ranges aren't enforced.
5. **Number fields** are text inputs with a decimal keyboard, so values like "3.00" aren't reformatted by the browser locale (e.g. "3,00").
6. **`?state=found`** on a search without results (e.g. `s-001`) shows the sample ranking, so the demo view is never empty.
7. **Status codes in production:** with Partial Prerendering, `pnpm start` answers 200 for a draft's detail URL and for unknown ids; the browser still redirects to `/edit` and shows the 404 page. In `pnpm dev` they are a 307 and a 404.
8. **Unused shadcn primitives:** `dialog` and `dropdown-menu` (installed in B02) aren't used yet; they're kept for the next modules (the foundations sheet uses both).
9. **Dev only:** the round Next.js badge bottom-left appears only in `pnpm dev`, not in the production build.

## Run with Docker

The app is served under the base path **`/peta-poc`** (`BASE_PATH` in `next.config.ts`), so every URL starts with it, also in `pnpm dev` (`http://localhost:3000/peta-poc`). The image uses Next.js standalone output on Node 24 Alpine and runs as a non-root user on container port 3000, published on server port **8016**.

```bash
# from web/
docker compose up -d --build                  # http://localhost:8016/peta-poc
HOST_PORT=8017 docker compose up -d           # if port 8016 is taken

docker ps --filter name=peta-poc              # wait for "(healthy)"
docker logs -f peta-poc
docker compose down
```

**Deploying to the on-prem server:** follow [`DEPLOYMENT.md`](DEPLOYMENT.md), a step-by-step guide for a first deployment. Building needs internet access (npm and Google Fonts); running the container doesn't.
