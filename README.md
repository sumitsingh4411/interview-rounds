<div align="center">

# The Loop

**Know every round before you walk in.**

Real interview questions from top tech companies — mapped to the exact **round**, **role**, and **level** they show up in.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![No database](https://img.shields.io/badge/database-none-success)](#-how-the-content-works)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

</div>

<!-- Add a screenshot here once you have one: ![The Loop](docs/screenshots/home.png) -->

---

## What is this?

Most interview prep tells you *what* to study. It rarely tells you **what actually gets asked, in which round, at which company.**

The Loop fixes that. Pick a company, read through several real interview experiences at different levels, and see the questions laid out **round by round** — from the online assessment all the way to the behavioral.

**Currently: 50 companies · 200 interview experiences · 1,720 questions.**

### Highlights

- 🪜 **Round-by-round breakdown** — every question is tagged to the stage it was asked in.
- 🧑‍💻 **Role & level filters** — Frontend / Backend / Full-stack, from Intern to Staff+.
- 📄 **Multiple interviews per company** — compare how a junior loop differs from a staff loop.
- 🔎 **Instant client-side search** across every question.
- 🗂️ **No database. No API. No env vars.** All content is Markdown; the site builds to 267 static pages.
- 🌗 Sleek glass-dark UI with a full light theme, keyboard-accessible and reduced-motion friendly.

---

## 🚀 Quick start

No database, no API keys, no `.env` file. Clone and run:

```bash
git clone https://github.com/sumitsingh4411/company-interview.git
cd company-interview
npm install
npm run dev
```

Open <http://localhost:3000>.

To build the production (fully static) site:

```bash
npm run build && npm start
```

---

## 📚 How the content works

**Markdown files are the source of truth.** There is no database — `src/content/loader.ts` reads the files at build time and Next.js prerenders every page.

```
content/
├── companies/
│   ├── google.md
│   ├── stripe.md
│   └── …                  (one file per company)
└── interviews/
    ├── google-1.md
    ├── google-2.md
    └── …                  (one file per interview experience)
```

### A company file — `content/companies/google.md`

Frontmatter holds the metadata; the body is the company blurb.

```markdown
---
name: Google
slug: google
industry: Big Tech
hq: 'Mountain View, CA'
---
Search, Ads, Cloud, Android. A rigorous, algorithm-heavy loop with a high bar.
```

### An interview file — `content/interviews/google-1.md`

Frontmatter holds the structured rounds and questions; the body is a short summary.

```markdown
---
id: google-1
company: google          # must match a company slug
role: backend            # frontend | backend | fullstack
level: senior            # intern | junior | mid | senior | staff
outcome: offer           # offer | rejected | no_offer | withdrew | unknown
year: 2025
source: curated          # curated | community | github | ai
rounds:
  - round: dsa
    questions:
      - title: Trapping rain water.
        difficulty: hard          # easy | medium | hard
        tags: [two-pointers, array]
  - round: system_design
    questions:
      - title: Design a URL shortener like TinyURL.
        difficulty: medium
        tags: [hashing, cache, sharding]
---
A senior backend loop. Coding-heavy early, design and behavioral later.
```

### The eight rounds

| key | Round |
|---|---|
| `oa` | Online Assessment |
| `dsa` | DSA / Coding |
| `machine_coding` | Machine Coding |
| `lld` | Low-Level Design |
| `system_design` | System Design |
| `tech_deep_dive` | Tech Deep-Dive |
| `hiring_manager` | Hiring Manager |
| `behavioral` | Behavioral / HR |

---

## ✍️ Add your own interview

Sharing an experience takes one file and a pull request.

1. Make sure the company exists in `content/companies/`. If not, add it (see the format above).
2. Create `content/interviews/<company-slug>-<n>.md` — bump `<n>` past the highest existing one for that company.
3. Set `id` to match the filename, and use `source: community`.
4. Run `npm run dev` to see it live, then open a PR.

That's it — no schema migration, no admin panel. Your interview shows up on the company page, in the round pages, and in search automatically.

> **Please keep it honest.** Only share questions you were actually asked, and never post anything covered by an NDA or any interviewer's personal details.

---

## 🧱 Project structure

```
content/                 Markdown source of truth (companies + interviews)
public/search-index.json Generated search index (rebuilt on every build)
scripts/
├── build-search-index.ts  Reads content/ → writes the search index   (safe)
├── generate-content.ts    One-time bootstrap; OVERWRITES content/    (careful)
└── data/                  Seed data used only by the bootstrap
src/
├── app/                 Routes: /, /companies, /companies/[slug],
│                        /interviews/[id], /rounds/[round], /search
├── components/          UI (RoundRail, cards, filters, search)
├── content/             loader.ts (reads Markdown) + types.ts
└── lib/                 constants.ts (taxonomy) + questions.ts (pure logic)
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Rebuild the search index, then build the static site |
| `npm start` | Serve the production build |
| `npm test` | Run unit tests (Vitest) |
| `npm run lint` | Lint |
| `npm run search-index` | Rebuild `public/search-index.json` from `content/` |
| `npm run content:bootstrap` | ⚠️ Regenerate **all** content from `scripts/data/` — **overwrites `content/`** |

> `prebuild` runs the search-index step automatically, so `npm run build` is always in sync with your Markdown.

---

## ☁️ Deploy

The output is fully static — no server, no database, no environment variables.

**Vercel:** import the repo, keep the defaults, deploy.

**Anywhere else:** run `npm run build` and serve the result. It works on Netlify, Cloudflare Pages, GitHub Pages, or any static host.

---

## 🛠️ Tech

- **Next.js 16** (App Router) with full static generation — 267 prerendered pages
- **TypeScript** (strict) · **Tailwind CSS v4**
- **gray-matter** for Markdown frontmatter
- **Vitest** for the pure logic (round grouping, filtering, facets)
- Type: **Space Grotesk** (display) + **IBM Plex Sans / Mono**

Filtering and search run entirely in the browser, so no request ever hits a backend.

---

## 🗺️ Roadmap

- [ ] Community interview submissions via PR templates
- [ ] Per-question write-ups and approaches
- [ ] Bookmarks & practice progress (requires auth)
- [ ] More companies and verified, first-hand experiences

---

## 🤝 Contributing

Contributions are welcome — especially real interview experiences. Open an issue or a PR.

Please run `npm test` and `npm run build` before submitting.

---

## ⚠️ Disclaimer

The Loop is **not affiliated with any company listed here.** Content is either curated from commonly reported questions or shared by the community, and every item is labeled with its source. Questions marked *AI-generated* are likely questions, not verified individual experiences.

---

## 📄 License

[MIT](LICENSE) © Sumit Singh
