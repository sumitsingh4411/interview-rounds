# InterviewRounds v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a launchable web app where users browse companies and see interview questions grouped by round, filtered by role/level, with auth, bookmarks, progress, and community submissions.

**Architecture:** Next.js App Router (TS) full-stack on Vercel. Neon serverless Postgres via Drizzle ORM. Auth.js (Google). Server Components for reads; server actions for writes. A standalone seed pipeline (Claude API + GitHub importer) populates content offline.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Drizzle ORM, `@neondatabase/serverless`, Auth.js (next-auth v5), Zod, Vitest.

## Global Constraints

- Language: TypeScript, `strict: true`.
- DB: Neon Postgres only, accessed via Drizzle. No raw SQL except full-text search.
- Roles enum: `frontend | backend | fullstack`. Levels: `intern | junior | mid | senior | staff`. Rounds: `oa | dsa | machine_coding | lld | system_design | tech_deep_dive | hiring_manager | behavioral`. Difficulty: `easy | medium | hard`.
- Every question shows `source_type` + attribution; `ai` items visibly labeled "AI-generated (likely question)".
- Dark-first, accessible (WCAG AA) UI in both themes.
- Commit after each task.

---

### Task 0: Project scaffold

**Files:** Create Next.js app, `tailwind`, `.env.example`, `drizzle.config.ts`, `.gitignore`.

- [ ] Init `git`, scaffold Next.js (App Router, TS, Tailwind, ESLint, src dir, `@/*` alias).
- [ ] Install: `drizzle-orm @neondatabase/serverless drizzle-kit zod`, dev: `vitest`.
- [ ] Create `.env.example` with `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `ANTHROPIC_API_KEY`.
- [ ] Verify: `npm run build` succeeds. Commit.

### Task 1: DB schema + connection

**Files:** Create `src/db/schema.ts`, `src/db/index.ts`, `drizzle.config.ts`.

- [ ] Define Drizzle tables per spec §4 (companies, questions, users, submissions, bookmarks, progress) with pgEnums for role/level/round/difficulty/source_type/status/user_role/progress_status.
- [ ] Export typed `db` client using `drizzle(neon(process.env.DATABASE_URL))`.
- [ ] `drizzle-kit generate` + `push` against Neon.
- [ ] Verify: tables exist in Neon (drizzle studio or query). Commit.

### Task 2: Query layer + tests

**Files:** Create `src/db/queries.ts`, `src/db/queries.test.ts`.

**Produces:** `getCompanies(filter)`, `getCompanyBySlug(slug)`, `getQuestionsForCompany(companyId, {role, level, round})`, `groupQuestionsByRound(questions)`, `searchQuestions(q, filters)`, `getQuestionById(id)`.

- [ ] Write Vitest tests for `groupQuestionsByRound` (pure fn) covering empty, single round, multi-round ordering by canonical round order.
- [ ] Implement pure `groupQuestionsByRound`; make tests pass.
- [ ] Implement DB query fns (published-only by default). Commit.

### Task 3: Seed sample data (dev fixture)

**Files:** Create `scripts/seed-sample.ts`.

- [ ] Insert ~8 well-known companies + ~40 published questions spanning roles/levels/rounds/source_types so the UI has real content immediately.
- [ ] Run it; verify rows in Neon. Commit.

### Task 4: Layout + design system

**Files:** `src/app/layout.tsx`, `src/app/globals.css`, `src/components/ui/*`, theme setup.

- [ ] Use frontend-design skill for direction. Dark-first tokens, typography, color-coded role badges, container, header/nav, footer.
- [ ] Reusable `Badge`, `Card`, `Select`, `SearchInput`, `RoundSection` primitives.
- [ ] Verify: `/` renders shell in light + dark. Commit.

### Task 5: Home + companies list

**Files:** `src/app/page.tsx`, `src/app/companies/page.tsx`, `src/components/CompanyGrid.tsx`.

- [ ] Home: hero + search box + popular companies grid + browse-by-role links.
- [ ] `/companies`: searchable/filterable company grid (server component reading `getCompanies`).
- [ ] Verify: both pages list seeded companies. Commit.

### Task 6: Company page (core screen)

**Files:** `src/app/companies/[slug]/page.tsx`, `src/components/RoundTimeline.tsx`, `src/components/QuestionCard.tsx`, filter controls.

- [ ] Role + level + round filters (URL search params, server-rendered).
- [ ] Questions grouped by round in a vertical timeline/accordion; each `QuestionCard` shows difficulty, tags, source attribution, AI label.
- [ ] Verify: filtering changes results; rounds display in canonical order. Commit.

### Task 7: Question detail + full-text search

**Files:** `src/app/questions/[id]/page.tsx`, `src/app/search/page.tsx`, extend `queries.ts`.

- [ ] Question detail page with body (markdown), attribution, related questions.
- [ ] `/search` using Postgres `websearch_to_tsquery` + role/level/round filters.
- [ ] Verify: search returns expected hits. Commit.

### Task 8: Auth (Auth.js + Google)

**Files:** `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, Drizzle adapter tables, sign-in UI.

- [ ] Configure next-auth v5 with Google provider + Drizzle adapter; default user role `user`.
- [ ] Header shows sign-in/out + avatar.
- [ ] Verify: sign in with Google locally; user row created. Commit.

### Task 9: Bookmarks + progress

**Files:** `src/app/actions/user.ts` (server actions), `src/app/me/page.tsx`, buttons on QuestionCard/detail.

- [ ] Server actions: `toggleBookmark(questionId)`, `setProgress(questionId, status)` (auth-guarded).
- [ ] `/me` dashboard lists bookmarks + progress grouped by status.
- [ ] Verify: bookmark + progress persist across reload. Commit.

### Task 10: Community submissions + moderation

**Files:** `src/app/submit/page.tsx`, `src/app/actions/submissions.ts`, `src/app/admin/submissions/page.tsx`.

- [ ] Auth-required submission form (company, role, level, per-round questions, notes), Zod-validated → `submissions` (pending).
- [ ] `/admin/submissions` (moderator/admin only): approve → creates published `questions` with `source_type=community`; reject with note.
- [ ] Verify: submit → appears in queue → approve → shows on company page. Commit.

### Task 11: Seed pipeline (AI + GitHub)

**Files:** `scripts/generate-ai.ts`, `scripts/import-github.ts`.

- [ ] `generate-ai.ts`: for a list of companies × roles × rounds, call Claude API to produce likely questions; upsert as `source_type=ai`, `status=published`. Idempotent (skip existing by hash).
- [ ] `import-github.ts`: fetch 1–2 known open-source interview repos (raw markdown), parse into questions with `source_url`; upsert `source_type=github`.
- [ ] Verify: dry-run prints; real run inserts. Commit.

### Task 12: Polish + deploy

**Files:** SEO metadata, `robots.ts`, `sitemap.ts`, loading/empty/error states, README.

- [ ] Empty/loading/error states, 404, metadata + OG, sitemap.
- [ ] Deploy to Vercel with Neon + Google + Anthropic env vars.
- [ ] Verify: production URL loads, core flow works. Commit.

## Self-Review

- **Spec coverage:** browse (T5/T6), grouped rounds (T6), search (T7), auth (T8), bookmarks/progress (T9), submissions+moderation (T10), hybrid seed AI+GitHub (T11), attribution+AI labeling (T4/T6), deploy (T12). All spec §8 "In" items covered. §8 "Out" items excluded.
- **Types:** role/level/round/difficulty enums centralized in schema (T1), reused everywhere.
- **No placeholders:** each task has concrete files + verification.
