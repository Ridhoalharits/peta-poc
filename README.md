# PETA PoC — web

Front-end-only clickable prototype of **PETA**, a Kalbe web app for HR: Talent Recommendation, Talent Management, Audit Log and User Management. Next.js 16 (App Router, Cache Components), Tailwind CSS v4, shadcn/ui, pnpm. Project rules live in `../CLAUDE.md`; the build plan is in `../docs/backlog/`; the mockups are in `../docs/mockups/`.

## Run it

Use the Node version in `.nvmrc` (`nvm use`).

```bash
pnpm install   # install dependencies
pnpm dev       # dev server: http://localhost:3000/peta-poc
pnpm lint      # ESLint
pnpm build     # production build
pnpm start     # serve the production build (after pnpm build); add -p 3100 to pick another port
```

Every URL starts with the base path **`/peta-poc`** (`BASE_PATH` in `next.config.ts`). `http://localhost:3000/` redirects to `/peta-poc`, which opens Talent Recommendation.

**No sign-in:** the Authentication module (AU01–AU06) was skipped for this PoC, so there are no demo accounts. The app opens straight into Talent Recommendation, and the sidebar's Log out button shows an info toast.

## Routes and demo params

Demo params open a screen in a given state, so every mockup can be shown from a link. They're read once on load.

| Route | Screen | Demo params |
|---|---|---|
| `/talent-recommendation` | Candidate search list | `?state=empty\|loading`, `?toast=draft-saved&title=…` |
| `/talent-recommendation/new` | New Candidate Search (Advanced mode switch for the weights) | `?state=errors` |
| `/talent-recommendation/[id]` | Processing / Results / Not found / Failed, chosen by the mock search status. Drafts redirect to `/edit` | `?state=processing\|found\|not-found\|failed` |
| `/talent-recommendation/[id]/edit` | Edit criteria (pre-filled, Advanced mode on) | — |
| `/talent-management` | Talent table | `?state=empty\|loading`, `?open=filter\|columns\|add\|add-errors\|import\|import-review\|import-result\|delete`, `?select=3`, `?toast=added\|deleted\|imported`, `?hide={id}` |
| `/talent-management/[id]` | Talent profile | `?open=edit\|delete`, `?toast=saved` |
| `/audit-log` | Audit Log | `?open=filter` |
| `/user-management` | Users and Activation Requests tabs | `?tab=requests`, `?open=menu\|deactivate\|reactivate\|reject`, `?toast=deactivated\|reactivated\|approved\|rejected`, `?state=no-requests` |
| `/design-check` | Review page for tokens and shared components. Not linked; `noindex` | — |

Useful ids:
- **Searches:** `s-001` searching, `s-002` completed with results, `s-003` and `s-008` drafts, `s-004` failed, `s-009` completed with 0 results.
- **Talents:** `t-01` (Citra Wijaya) is the profile sample. `t-01` to `t-08` are the Talent Recommendation candidates, so a result name opens the same person's profile.

## What is mocked

- **Data:** typed static data in `src/mocks/` (9 searches and 8 results, 32 generated talents, 46 generated audit entries, 12 users), read only through `src/lib/data/<module>.ts`. Those synchronous functions are where real API calls go later.
- **Nothing persists:** deletes, edits, deactivations, approvals and rejections change the page's state for the session. Everything resets on refresh.
- **Start Search** sends nothing. The request the API would receive is logged to the browser console (DevTools → Console):
  - new search: `POST /v1/candidate-searches` → opens `s-001` (processing);
  - edit criteria: `PUT /v1/candidate-searches/{id}` → opens `/{id}?state=processing`.
- **No matching engine:** each search's status decides which view shows; the processing view never finishes.
- **Bulk Import is simulated:** no file is read; the review and result steps always show the sample file (28 imported, 3 skipped).
- **Not available in this preview** (an info toast stands in): sign out, PDF export, the import template download.

## Known differences

Deliberate differences from the mockups and backlog:

1. **No sign-in.** AU01–AU06 were skipped, so there's no sign-in page, route protection, demo accounts or "Account not activated" screen (and no IT Admin contact placeholder).
2. **Add Talent and Bulk Import don't add rows.** They show their toast; the table keeps its talents.
3. **Changes reset on refresh** (see What is mocked).
4. **Talent table names differ from the TM-01 PNG**, because talents t-01 to t-08 are renamed to match the Talent Recommendation results.
5. **TR-01d (draft saved):** the mockup also shows a new Draft row. Nothing is persisted, so only the toast appears.
6. **Console log on Start Search.** QA01 says "no `console.log`", but the API-request log above was requested explicitly, so it stays (`logApiRequest` in `src/lib/data/talent-recommendation.ts`).
7. **Talent profile service tag** reads "4 yrs 4 mos of service" (backlog TM08); the TM-09 PNG has a typo ("mosof").
8. **Header checkbox on the talent table** is ticked only when every row on the page is selected, and empty otherwise (as in TM-02); there's no "partly selected" look.
9. **Unenforced ranges:** only required fields and the 100 % weights total are validated. GPA, age, weight and filter ranges aren't checked for sensible values.
10. **Number fields** are text inputs with a decimal keyboard, so values like "3.00" aren't reformatted by the browser locale.
11. **`?state=found`** on a search without results shows the sample ranking, so the demo view is never empty.
12. **Status codes in production:** with Partial Prerendering, `pnpm start` answers 200 for a draft's detail URL and for unknown ids; the browser still redirects to `/edit` or shows the 404 page.
13. **Date inputs** show the browser's own date format (e.g. dd/mm/yyyy), which may differ from the mm/dd/yyyy in the PNGs.
14. **Dev only:** the round Next.js badge bottom-left appears only in `pnpm dev`.

## Run with Docker

The image uses Next.js standalone output on Node 24 Alpine and runs as a non-root user on container port 3000, published on host port **8016** (override with `HOST_PORT`).

```bash
# from web/
docker compose up -d --build                  # http://localhost:8016/peta-poc
HOST_PORT=3000 docker compose up -d           # if you want another host port

docker ps --filter name=peta-poc              # wait for "(healthy)"
docker logs -f peta-poc
docker compose down
```

**Deploying to the on-prem server:** follow [`DEPLOYMENT.md`](DEPLOYMENT.md), a step-by-step guide for a first deployment. Building needs internet access (npm and Google Fonts); running the container doesn't.
