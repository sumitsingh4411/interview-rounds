# Development

Everything you need to run, build, and extend the site. If you only want to
*read* interviews, you don't need any of this — see the index in the
[README](../README.md).

---

## Quick start

No database, no API keys, no `.env` file.

```bash
git clone https://github.com/sumitsingh4411/company-interview.git
cd company-interview
npm install
npm run dev
```

Open <http://localhost:3000>.

Production (fully static) build:

```bash
npm run build && npm start
```

---

## How the content pipeline works

**Markdown files are the source of truth.** There is no database.
`src/content/loader.ts` reads `content/` at build time and Next.js prerenders
every page (267 of them).

```
content/
├── companies/            one file per company   → google.md
├── interviews/           one file per interview → google-1.md
└── banks/                open-source topic banks → faqguru-react.md
```

`content/banks/` holds **topic** questions imported from MIT-licensed repos.
They are never attributed to a company — they render in a separate "Topic banks"
section on each round page, with a link back to the upstream file and its licence.

Two derived artifacts are generated *from* `content/` and never edited by hand:

| Artifact | Built by | When |
|---|---|---|
| `public/search-index.json` | `scripts/build-search-index.ts` | automatically on `prebuild` |
| The index table in `README.md` | `scripts/build-content-index.ts` | `npm run readme-index` |

> ⚠️ `scripts/generate-content.ts` (`npm run content:bootstrap`) is a **one-time
> bootstrap** that regenerates `content/` from `scripts/data/`. It **overwrites**
> everything in `content/`. Don't run it unless you mean to.

---

## Frontmatter reference

### Company — `content/companies/google.md`

```markdown
---
name: Google
slug: google
featured: true            # optional — surfaces the company on the home page
industry: Big Tech
hq: 'Mountain View, CA'
---
Search, Ads, Cloud, Android. A rigorous, algorithm-heavy loop with a high bar.
```

### Interview — `content/interviews/google-1.md`

```markdown
---
id: google-1             # must match the filename
company: google          # must match a company slug
role: backend            # frontend | backend | fullstack
level: senior            # intern | junior | mid | senior | staff
outcome: offer           # offer | rejected | no_offer | withdrew | unknown
year: 2025
source: curated          # curated | community | github | ai
summary: A senior backend loop. Coding-heavy early, design later.
---
# Senior Backend — Google

> A senior backend loop. Coding-heavy early, design later.

## Round 1 · DSA / Coding
<!-- round: dsa -->

| Question | Difficulty | Tags | Practice |
| --- | --- | --- | --- |
| Trapping rain water. | 🔴 Hard | `two-pointers` `array` | [LC](...) |

## Round 2 · System Design
<!-- round: system_design -->

| Question | Difficulty | Tags | Practice |
| --- | --- | --- | --- |
| Design a URL shortener like TinyURL. | 🟡 Medium | `hashing` `cache` | [GfG](...) |
```

**Rounds live in the body, not the frontmatter.** Each round is anchored by an
invisible `<!-- round: KEY -->` marker followed by a table — that is what the
parser reads, so the file stays readable on GitHub. The heading text above the
marker is free-form.

Round keys: `oa`, `dsa`, `machine_coding`, `lld`, `system_design`,
`tech_deep_dive`, `hiring_manager`, `behavioral`.

---

## Project structure

```
content/                 Markdown source of truth (companies + interviews)
public/search-index.json Generated search index
scripts/
├── build-search-index.ts   Reads content/ → writes the search index   (safe)
├── build-content-index.ts  Reads content/ → rewrites the README index (safe)
├── generate-content.ts     One-time bootstrap; OVERWRITES content/    (careful)
└── data/                   Seed data used only by the bootstrap
src/
├── app/                 Routes: /, /companies, /companies/[slug],
│                        /interviews/[id], /rounds/[round], /search
├── components/          UI (RoundRail, cards, filters, search)
├── content/             loader.ts (reads Markdown) + types.ts
└── lib/                 constants.ts (taxonomy) + questions.ts (pure logic)
```

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Rebuild the search index, then build the static site |
| `npm start` | Serve the production build |
| `npm test` | Run unit tests (Vitest) |
| `npm run lint` | Lint |
| `npm run search-index` | Rebuild `public/search-index.json` from `content/` |
| `npm run readme-index` | Rebuild the interview index **and count badges** in `README.md` from `content/` |
| `npm run import:bank` | Re-import the open-source topic banks (overwrites `content/banks/`) |
| `npm run content:bootstrap` | ⚠️ Regenerate all content — **overwrites `content/`** |

---

## Deploy

The output is fully static — no server, no database, no environment variables.

- **Vercel:** import the repo, keep the defaults, deploy.
- **Anywhere else:** `npm run build`, then serve the result. Works on Netlify,
  Cloudflare Pages, GitHub Pages, or any static host.

---

## Tech

- **Next.js 16** (App Router), fully static — 267 prerendered pages
- **TypeScript** (strict) · **Tailwind CSS v4**
- **gray-matter** for Markdown frontmatter
- **Vitest** for the pure logic (round grouping, filtering, facets)
- Type: **Space Grotesk** (display) + **IBM Plex Sans / Mono**

Filtering and search run entirely in the browser, so no request ever hits a
backend.

---

## Before opening a PR

```bash
npm test
npm run lint
npm run build
```

If you added or edited an interview, also run `npm run readme-index`.
