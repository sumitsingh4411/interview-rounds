# InterviewRounds — Design Spec (v1)

**Date:** 2026-07-09
**Status:** Approved (structure) — building v1

## 1. What it is

A web app where people preparing for tech interviews browse **companies**, filter by
**role** (Frontend / Backend / Full-stack) and **level**, and see real interview
questions **grouped by the round they were asked in**. Signed-in users bookmark
questions, track practice progress, and submit their own interview experiences
(moderated before publishing).

**Goal:** a real, launchable product. Solo-maintainable.

## 2. Content strategy (hybrid)

Content enters three ways, all with `source_type` + attribution:

1. **AI-generated baseline** — a seed script uses the Claude API to generate the most
   likely questions per company/role/round. Labeled `ai`. Instant day-one coverage.
2. **Curated GitHub repos** — an importer parses well-known open-source interview
   repos, storing question + `source_url` back to the repo. Labeled `github`.
3. **Community submissions** — users submit experiences via a form; a moderator
   approves them into published questions. Labeled `community`.

Every AI-generated item is visibly labeled "AI-generated (likely question)" so users
know it isn't a verified real experience.

## 3. Content taxonomy

- **Roles:** `frontend` · `backend` · `fullstack`
- **Levels:** `intern` · `junior` · `mid` · `senior` · `staff`
- **Rounds** (a question is tagged to exactly one; companies use a subset):
  1. `oa` — Online Assessment
  2. `dsa` — DSA / Coding
  3. `machine_coding` — Machine Coding / Practical
  4. `lld` — Low-Level Design / OOP
  5. `system_design` — System Design (HLD)
  6. `tech_deep_dive` — Domain deep-dive (FE: JS/React/CSS/browser · BE: DB/API/concurrency)
  7. `hiring_manager` — Hiring Manager
  8. `behavioral` — Behavioral / HR
- **Difficulty:** `easy` · `medium` · `hard`

## 4. Data model (Neon Postgres + Drizzle ORM)

- **companies**: id, name, slug, logo_url, description, industry, hq, created_at
- **questions**: id, company_id (fk), title, body (markdown), role, level, round,
  difficulty, tags (text[]), source_type (`ai`|`github`|`community`), source_url,
  source_author, is_verified (bool), status (`draft`|`published`), upvotes,
  created_at, updated_at
- **users**: id, email, name, image, provider, role (`user`|`moderator`|`admin`),
  created_at (managed by Auth.js)
- **submissions**: id, user_id (fk), company_name, company_id (nullable fk), role,
  level, rounds_json (array of {round, questions[], notes}), raw_text, status
  (`pending`|`approved`|`rejected`), moderator_note, created_at
- **bookmarks**: user_id (fk), question_id (fk), created_at — PK (user_id, question_id)
- **progress**: user_id (fk), question_id (fk), status (`todo`|`practicing`|`done`),
  updated_at — PK (user_id, question_id)

Indexes: questions(company_id, role, level, round, status); companies(slug);
full-text index on questions(title, body) for search.

## 5. Architecture

- **Framework:** Next.js (App Router, TypeScript) on Vercel.
- **DB:** Neon serverless Postgres via Drizzle ORM + `@neondatabase/serverless` driver.
- **Auth:** Auth.js (NextAuth) with Google provider; Drizzle adapter.
- **Search:** Postgres full-text search (`websearch_to_tsquery`) for v1.
- **Seed pipeline:** standalone `scripts/` — `generate-ai.ts` (Claude API) and
  `import-github.ts` (fetch + parse repos). Run offline, write to DB. Idempotent.
- **Moderation:** `/admin/submissions` route gated to `moderator`/`admin` roles.

## 6. Key pages / routes

- `/` — Home: hero + search, popular companies grid, browse-by-role entry points.
- `/companies` — All companies, searchable/filterable grid.
- `/companies/[slug]` — Company page: role + level + round filters; questions grouped
  by round (collapsible sections / timeline). The core screen.
- `/questions/[id]` — Single question detail (body, source attribution, bookmark,
  progress, related).
- `/submit` — Submission form (auth required).
- `/me` — Bookmarks + progress dashboard (auth required).
- `/admin/submissions` — Moderation queue (moderator/admin only).
- API via Next.js route handlers / server actions.

## 7. UI / design direction

Dark-first, developer-focused, fast and legible. Strong typography, generous spacing,
card-based company grid, round sections rendered as a clear vertical
timeline/accordion so "each round" is visually obvious. Role tracks color-coded
(FE / BE / FS). Accessible in light + dark. Details refined during build via the
frontend-design skill.

## 8. v1 scope (in / out)

**In:** browse companies; company page with role/level/round filtering + grouped
questions; full-text search; Google auth; bookmarks; progress; community submission
form + moderation; AI + GitHub seed pipeline; source attribution + AI labeling.

**Out (later):** Reddit/RSS aggregation, upvoting/comments, email digests,
personalized recommendations, mock-interview mode, payments.

## 9. Success criteria

- Day one: a visitor can find a company and see role/level/round-grouped questions
  with real, useful content already loaded.
- A signed-in user can submit an experience, bookmark, and track progress.
- A moderator can approve a submission and see it appear live.
- Deployed and reachable on the public internet.
