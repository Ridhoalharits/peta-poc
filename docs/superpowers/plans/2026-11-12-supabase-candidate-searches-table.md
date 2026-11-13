# Supabase `candidate_searches` Table Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create one Supabase table that stores every Candidate Search (TR-02/TR-03 form), plus a slim view that returns only what the Talent Recommendation dashboard (TR-01) shows.

**Architecture:** One table, `public.candidate_searches`, has a column for every form field (flat columns, not JSONB, so HR/BI can filter and query them directly). Allowed values are enforced with `CHECK` constraints on `text` columns rather than Postgres enums, which makes adding a value later a one-line change. A `security_invoker` view, `public.candidate_search_list`, exposes only the dashboard columns. Migrations are saved as SQL files in the repo and applied with the Supabase MCP `apply_migration` tool. The Supabase CLI isn't installed.

**Tech Stack:** Supabase Postgres 15+, SQL migrations, Supabase MCP (`list_projects`, `apply_migration`, `execute_sql`, `get_advisors`, `generate_typescript_types`).

**Spec:** `src/lib/types.ts` (`SearchCriteria`, `CandidateSearch`), `src/lib/constants.ts` (allowed values + defaults), `src/lib/weights.ts` (weight/include rule), `../docs/mockups/TR-01_talent-recommendation.png`, `../docs/mockups/TR-03_advanced-mode-edit-criteria.png`, `../docs/backlog/B11-page-tr02-new-search.md` (Save Draft skips validation).

## Global Constraints

- Table name `candidate_searches`, view name `candidate_search_list`, schema `public`. Column names are snake_case versions of the `SearchCriteria` keys.
- `status` ∈ `'draft' | 'searching' | 'completed' | 'failed'`, default `'draft'`.
- `management_level` ∈ `'Officer','Supervisor','Manager','Senior Manager','General Manager'`.
- `education_level` ∈ `'Diploma (D3)','Bachelor (S1)','Master (S2)','Doctorate (S3)'`.
- `employee_type` ∈ `'Permanent','Fixed Term','Internship'`.
- `gender_preference` ∈ `'none','male','female'`.
- Defaults copy `DEFAULT_CRITERIA`: S1, majors `{Accounting}`, related majors true, GPA 3.00, service 1, Fixed Term, Officer, gender none, age 25–30, advanced off, all include flags true.
- Default weights: job_family 30, length_of_service 20, education_level 20, management_level 15, age 7.5, local_proximity 7.5 (one decimal place).
- Drafts may have an empty title and description. Any non-draft row needs a non-blank `job_title` and `job_description`.
- In advanced mode and outside drafts, the **effective** weights must add up to exactly 100. A weight doesn't count when its linked include flag is false (length_of_service→include_length_of_service, education_level→include_education, management_level→include_management_level, age→include_age). Job family and local proximity always count.
- The dashboard shows a blank title as `Untitled search`.
- RLS is on. Only the `authenticated` role gets access, and `anon` gets nothing.
- This plan doesn't touch the Next.js app. Per the PoC CLAUDE.md, the app stays mock-only: no fetch calls, no env vars.

## Review Focus

1. **Draft with an empty title** (Save Draft before typing anything): the insert succeeds, and the list view shows `Untitled search`. → Task 1 test `draft_allows_blank_title`, Task 2 test `view_untitled_fallback`.
2. **Advanced mode with an excluded requirement** (Age unticked, so its weight doesn't count): it must be accepted when the effective total is 100 and rejected when an excluded weight is needed to reach 100. → Task 1 tests `weights_ignore_excluded`, `weights_reject_bad_total`.
3. **Empty numeric inputs** (`toCriteria` turns "" into NaN, and JSON turns NaN into null): nullable numeric columns accept null without breaking any check. → Task 1 test `null_numbers_allowed`.
4. **Age range reversed** (min 30, max 25): rejected. → Task 1 test `age_range_reversed_rejected`.
5. **`result_count` on a non-completed search**: rejected, so the detail page never sees "found" on a failed search. → Task 1 test `result_count_only_when_completed`.

---

### Task 0: Pick the Supabase project

- [ ] **Step 1:** Load the Supabase MCP tools (`ToolSearch "+supabase"`), run `list_projects`, and ask the user which project to use. Record the `project_id` for every later step.
- [ ] **Step 2:** Run `list_tables` (schemas `["public"]`) and confirm there's no `candidate_searches` table yet. If one exists, stop and ask.

### Task 1: `candidate_searches` table + constraints

**Files:**
- Create: `supabase/migrations/20261112000001_create_candidate_searches.sql`
- Test: `supabase/tests/candidate_searches.test.sql`

**Interfaces:**
- Produces: table `public.candidate_searches` with the columns below. Tasks 2–3 rely on these exact names.

| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | uuid PK | no | `gen_random_uuid()` | |
| `status` | text | no | `'draft'` | check list above; shown on dashboard |
| `job_title` | text | no | `''` | shown on dashboard as "Vacant Position" |
| `job_description` | text | no | `''` | |
| `responsibilities` | text | no | `''` | one bullet per line |
| `include_education`, `include_major`, `include_gpa`, `include_length_of_service`, `include_employee_type`, `include_management_level`, `include_gender`, `include_age` | boolean | no | `true` | the 8 requirement checkboxes |
| `education_level` | text | no | `'Bachelor (S1)'` | check |
| `majors` | text[] | no | `'{Accounting}'` | |
| `accept_related_majors` | boolean | no | `true` | |
| `min_gpa` | numeric(3,2) | yes | `3.00` | check 0–4 |
| `min_length_of_service_years` | smallint | yes | `1` | check ≥ 0 |
| `employee_type` | text | no | `'Fixed Term'` | check |
| `management_level` | text | no | `'Officer'` | check; shown on dashboard |
| `gender_preference` | text | no | `'none'` | check |
| `age_min`, `age_max` | smallint | yes | `25`, `30` | check > 0, and min ≤ max when both are set |
| `advanced_mode` | boolean | no | `false` | |
| `weight_job_family`, `weight_length_of_service`, `weight_education_level`, `weight_management_level`, `weight_age`, `weight_local_proximity` | numeric(4,1) | yes | 30, 20, 20, 15, 7.5, 7.5 | each check 0–100 |
| `result_count` | integer | yes | null | check ≥ 0; non-null only when `status='completed'` |
| `created_by` | uuid → `auth.users(id)` on delete set null | yes | `auth.uid()` | |
| `created_at` | timestamptz | no | `now()` | shown on dashboard as "Created" |
| `updated_at` | timestamptz | no | `now()` | kept current by trigger |

Named table-level checks: `candidate_searches_required_unless_draft`, `candidate_searches_age_range`, `candidate_searches_result_count_completed`, `candidate_searches_weights_total` (effective-weight sum = 100 when `advanced_mode and status <> 'draft'`, with nulls counted as 0).

- [ ] **Step 1: Write the failing test** `supabase/tests/candidate_searches.test.sql`. It's one `begin; … rollback;` script of `DO` blocks. Each block inserts a row and either passes or raises `'FAIL: <name>'`. Expected-failure cases catch `check_violation` and raise FAIL only when no error was thrown. Cases:
  - `draft_allows_blank_title`: `insert (status) values ('draft')` succeeds.
  - `searching_requires_title`: `status='searching', job_title='  ', job_description='x'` → check_violation.
  - `bad_status_rejected`: `status='done'` → check_violation.
  - `bad_level_rejected`: `management_level='Director'` → check_violation.
  - `weights_ignore_excluded`: `status='searching'`, title/desc set, `advanced_mode=true, include_age=false`, weights job_family 30 / length_of_service 20 / education_level 20 / management_level 15 / age 50 / local_proximity 15 (effective total = 100, since age doesn't count) → succeeds.
  - `weights_reject_bad_total`: same row but `include_age=true` (total 150) → check_violation.
  - `null_numbers_allowed`: `min_gpa`, `min_length_of_service_years`, `age_min` and `age_max` all null on a searching row → succeeds.
  - `age_range_reversed_rejected`: `age_min=30, age_max=25` → check_violation.
  - `result_count_only_when_completed`: `status='failed', result_count=0` → check_violation. `status='completed', result_count=0` succeeds.
  - `updated_at_bumps`: insert a row with `updated_at = now() - interval '1 day'`, run `update … set job_title='y'`, and assert `updated_at > now() - interval '1 minute'`.
- [ ] **Step 2: Run the test to verify it fails.** `execute_sql` with the test file contents. Expected: `relation "public.candidate_searches" does not exist`.
- [ ] **Step 3: Write the migration** `supabase/migrations/20261112000001_create_candidate_searches.sql`: the table above, the 4 named checks, and a `public.set_updated_at()` trigger function (`security invoker`, `set search_path = ''`) with a `before update` trigger. Apply it with `apply_migration` (name `create_candidate_searches`).
- [ ] **Step 4: Run the test to verify it passes.** `execute_sql` with the test file. Expected: no `FAIL:` error. The script ends in `rollback`, so no rows remain.
- [ ] **Step 5: Commit**
```bash
git add supabase/migrations/20261112000001_create_candidate_searches.sql supabase/tests/candidate_searches.test.sql
git commit -m "feat(db): add candidate_searches table"
```

### Task 2: Dashboard view, indexes, RLS

**Files:**
- Create: `supabase/migrations/20261112000002_candidate_search_list_and_rls.sql`
- Test: `supabase/tests/candidate_search_list.test.sql`

**Interfaces:**
- Consumes: `public.candidate_searches` (Task 1).
- Produces: view `public.candidate_search_list(id uuid, position text, management_level text, created_at timestamptz, status text, result_count integer)`, ordered by `created_at desc`. `position = coalesce(nullif(btrim(job_title), ''), 'Untitled search')`. Those are the 4 TR-01 columns plus `id` (row link) and `result_count` (found vs not-found on the detail page). Every other form field stays in the table and is read only by the Edit / detail pages.

- [ ] **Step 1: Write the failing test** (`begin; … rollback;`, same DO-block style):
  - `view_untitled_fallback`: insert a draft with `job_title=''`. Its view row has `position = 'Untitled search'`.
  - `view_columns_only`: `select array_agg(column_name::text order by ordinal_position) from information_schema.columns where table_schema='public' and table_name='candidate_search_list'` = `{id,position,management_level,created_at,status,result_count}`.
  - `rls_enabled`: `select relrowsecurity from pg_class where oid='public.candidate_searches'::regclass` = true.
  - `anon_sees_nothing`: `set local role anon;` then select from `public.candidate_search_list`. Either 0 rows or `insufficient_privilege` passes. Then `reset role`.
- [ ] **Step 2: Run it.** Expected: `relation "public.candidate_search_list" does not exist`.
- [ ] **Step 3: Write the migration:**
  - `create view … with (security_invoker = true)`.
  - Indexes on `(created_at desc)`, `(status)` and `(management_level)`, backing the dashboard's default sort and its two filters.
  - `alter table … enable row level security`.
  - Four policies (select / insert / update / delete) `to authenticated using (true) with check (true)`. All of HR shares one list.
  - `revoke all on public.candidate_searches, public.candidate_search_list from anon`.

  Apply it with `apply_migration` (name `candidate_search_list_and_rls`).
- [ ] **Step 4: Run the test.** Expected: no `FAIL:`. Then run `get_advisors` (type `security`). Expected: no advisory for `candidate_searches` / `candidate_search_list`.
- [ ] **Step 5: Commit**
```bash
git add supabase/migrations/20261112000002_candidate_search_list_and_rls.sql supabase/tests/candidate_search_list.test.sql
git commit -m "feat(db): add candidate_search_list view, indexes and RLS"
```

### Task 3: Seed the 9 mock searches + generated types

**Files:**
- Create: `supabase/seed.sql`
- Create: `src/lib/database.types.ts` (generated; never hand-edit)

**Interfaces:**
- Consumes: Task 1 columns, Task 2 view.
- Produces: 9 rows that mirror `src/mocks/searches.ts` (position → `job_title`, level → `management_level`, createdAt → `created_at`, status → `status`, resultCount → `result_count`), and the `Database` TS type for the later app hookup.

- [ ] **Step 1:** Write `supabase/seed.sql` as a single `insert … values` of the 9 rows. Non-draft rows get `job_description = 'Seeded from PoC mock data.'` so they pass `required_unless_draft`. Run it with `execute_sql`.
- [ ] **Step 2: Verify.** `select position, management_level, status, result_count from public.candidate_search_list` returns 9 rows. The first is `Accounting Officer / Officer / searching / null` and the last is `Head of Supply Chain / General Manager / completed / 0`.
- [ ] **Step 3:** Run `generate_typescript_types` and write the output to `src/lib/database.types.ts`. Then, in `web/`, run `pnpm lint && pnpm build`. Expected: both pass. The file isn't imported anywhere yet.
- [ ] **Step 4: Commit**
```bash
git add supabase/seed.sql src/lib/database.types.ts
git commit -m "chore(db): seed mock candidate searches and generate types"
```

## Out of scope (follow-up plans)

- A `candidate_search_results` table (rank, talent_id, score, justification → TR-05).
- Wiring `src/lib/data.ts` to Supabase (needs env vars and a client, which the PoC rules forbid today).
- Trigram index for the "Search vacant position…" box. Add it once the table has enough rows to make `ilike` slow.
