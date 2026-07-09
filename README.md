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
- 📖 **Readable straight from GitHub** — [browse all 200 interviews as Markdown](#-read-it-right-here-on-github), no need to run the site.
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
featured: true            # optional — surfaces the company on the home page
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

## 📖 Read it right here on GitHub

You don't need to run the site. Every interview is a Markdown file you can read
directly in the browser — click any link below.

<!-- CONTENT_INDEX:START -->

**50 companies · 200 interview experiences.** Every link below opens the raw Markdown — no website needed.

| Company | Industry | Interview experiences |
|---|---|---|
| **[Amazon](content/companies/amazon.md)** ⭐ | Big Tech | [Junior · Frontend](content/interviews/amazon-4.md) · [Junior · Full-stack](content/interviews/amazon-1.md) · [Mid · Frontend](content/interviews/amazon-3.md) · [Senior · Backend](content/interviews/amazon-2.md) |
| **[Apple](content/companies/apple.md)** ⭐ | Big Tech | [Junior · Full-stack](content/interviews/apple-2.md) · [Mid · Frontend](content/interviews/apple-4.md) · [Senior · Backend](content/interviews/apple-3.md) · [Staff · Backend](content/interviews/apple-1.md) |
| **[Google](content/companies/google.md)** ⭐ | Big Tech | [Junior · Frontend](content/interviews/google-3.md) · [Mid · Backend](content/interviews/google-4.md) · [Mid · Frontend](content/interviews/google-2.md) · [Senior · Backend](content/interviews/google-1.md) |
| **[Meta](content/companies/meta.md)** ⭐ | Big Tech | [Junior · Frontend](content/interviews/meta-3.md) · [Mid · Backend](content/interviews/meta-4.md) · [Mid · Frontend](content/interviews/meta-2.md) · [Senior · Backend](content/interviews/meta-1.md) |
| **[Netflix](content/companies/netflix.md)** ⭐ | Streaming | [Junior · Frontend](content/interviews/netflix-2.md) · [Mid · Backend](content/interviews/netflix-3.md) · [Mid · Frontend](content/interviews/netflix-1.md) · [Senior · Full-stack](content/interviews/netflix-4.md) |
| **[Stripe](content/companies/stripe.md)** ⭐ | Fintech | [Mid · Backend](content/interviews/stripe-1.md) · [Senior · Frontend](content/interviews/stripe-3.md) · [Senior · Full-stack](content/interviews/stripe-2.md) · [Staff · Backend](content/interviews/stripe-4.md) |
| **[Adobe](content/companies/adobe.md)** | Creative Software | [Junior · Frontend](content/interviews/adobe-1.md) · [Mid · Backend](content/interviews/adobe-2.md) · [Senior · Frontend](content/interviews/adobe-4.md) · [Senior · Full-stack](content/interviews/adobe-3.md) |
| **[Airbnb](content/companies/airbnb.md)** | Marketplace | [Junior · Frontend](content/interviews/airbnb-3.md) · [Mid · Backend](content/interviews/airbnb-4.md) · [Mid · Frontend](content/interviews/airbnb-2.md) · [Senior · Backend](content/interviews/airbnb-1.md) |
| **[Anthropic](content/companies/anthropic.md)** | AI | [Junior · Frontend](content/interviews/anthropic-1.md) · [Mid · Backend](content/interviews/anthropic-2.md) · [Senior · Frontend](content/interviews/anthropic-4.md) · [Senior · Full-stack](content/interviews/anthropic-3.md) |
| **[Asana](content/companies/asana.md)** | Productivity | [Junior · Full-stack](content/interviews/asana-2.md) · [Mid · Frontend](content/interviews/asana-4.md) · [Senior · Backend](content/interviews/asana-3.md) · [Staff · Backend](content/interviews/asana-1.md) |
| **[Atlassian](content/companies/atlassian.md)** | SaaS | [Junior · Full-stack](content/interviews/atlassian-4.md) · [Senior · Frontend](content/interviews/atlassian-2.md) · [Senior · Full-stack](content/interviews/atlassian-1.md) · [Staff · Backend](content/interviews/atlassian-3.md) |
| **[Block](content/companies/block.md)** | Fintech | [Junior · Frontend](content/interviews/block-4.md) · [Junior · Full-stack](content/interviews/block-1.md) · [Mid · Frontend](content/interviews/block-3.md) · [Senior · Backend](content/interviews/block-2.md) |
| **[Brex](content/companies/brex.md)** | Fintech | [Junior · Frontend](content/interviews/brex-4.md) · [Junior · Full-stack](content/interviews/brex-1.md) · [Mid · Frontend](content/interviews/brex-3.md) · [Senior · Backend](content/interviews/brex-2.md) |
| **[ByteDance](content/companies/bytedance.md)** | Consumer Internet | [Mid · Backend](content/interviews/bytedance-1.md) · [Senior · Frontend](content/interviews/bytedance-3.md) · [Senior · Full-stack](content/interviews/bytedance-2.md) · [Staff · Backend](content/interviews/bytedance-4.md) |
| **[Coinbase](content/companies/coinbase.md)** | Fintech | [Junior · Frontend](content/interviews/coinbase-3.md) · [Mid · Backend](content/interviews/coinbase-4.md) · [Mid · Frontend](content/interviews/coinbase-2.md) · [Senior · Backend](content/interviews/coinbase-1.md) |
| **[Confluent](content/companies/confluent.md)** | Data Streaming | [Junior · Frontend](content/interviews/confluent-1.md) · [Mid · Backend](content/interviews/confluent-2.md) · [Senior · Frontend](content/interviews/confluent-4.md) · [Senior · Full-stack](content/interviews/confluent-3.md) |
| **[Databricks](content/companies/databricks.md)** | Data & AI | [Junior · Full-stack](content/interviews/databricks-3.md) · [Senior · Backend](content/interviews/databricks-4.md) · [Senior · Frontend](content/interviews/databricks-1.md) · [Staff · Backend](content/interviews/databricks-2.md) |
| **[Datadog](content/companies/datadog.md)** | Observability | [Junior · Full-stack](content/interviews/datadog-2.md) · [Mid · Frontend](content/interviews/datadog-4.md) · [Senior · Backend](content/interviews/datadog-3.md) · [Staff · Backend](content/interviews/datadog-1.md) |
| **[DoorDash](content/companies/doordash.md)** | Marketplace | [Junior · Frontend](content/interviews/doordash-3.md) · [Mid · Backend](content/interviews/doordash-4.md) · [Mid · Frontend](content/interviews/doordash-2.md) · [Senior · Backend](content/interviews/doordash-1.md) |
| **[Dropbox](content/companies/dropbox.md)** | Cloud Storage | [Junior · Full-stack](content/interviews/dropbox-2.md) · [Mid · Frontend](content/interviews/dropbox-4.md) · [Senior · Backend](content/interviews/dropbox-3.md) · [Staff · Backend](content/interviews/dropbox-1.md) |
| **[Figma](content/companies/figma.md)** | Design Software | [Junior · Full-stack](content/interviews/figma-2.md) · [Mid · Frontend](content/interviews/figma-4.md) · [Senior · Backend](content/interviews/figma-3.md) · [Staff · Backend](content/interviews/figma-1.md) |
| **[GitHub](content/companies/github.md)** | Developer Platform | [Junior · Full-stack](content/interviews/github-3.md) · [Senior · Backend](content/interviews/github-4.md) · [Senior · Frontend](content/interviews/github-1.md) · [Staff · Backend](content/interviews/github-2.md) |
| **[GitLab](content/companies/gitlab.md)** | Developer Platform | [Junior · Frontend](content/interviews/gitlab-1.md) · [Mid · Backend](content/interviews/gitlab-2.md) · [Senior · Frontend](content/interviews/gitlab-4.md) · [Senior · Full-stack](content/interviews/gitlab-3.md) |
| **[HashiCorp](content/companies/hashicorp.md)** | Infrastructure | [Junior · Frontend](content/interviews/hashicorp-3.md) · [Mid · Backend](content/interviews/hashicorp-4.md) · [Mid · Frontend](content/interviews/hashicorp-2.md) · [Senior · Backend](content/interviews/hashicorp-1.md) |
| **[Instacart](content/companies/instacart.md)** | Marketplace | [Junior · Frontend](content/interviews/instacart-4.md) · [Junior · Full-stack](content/interviews/instacart-1.md) · [Mid · Frontend](content/interviews/instacart-3.md) · [Senior · Backend](content/interviews/instacart-2.md) |
| **[Lyft](content/companies/lyft.md)** | Marketplace | [Junior · Full-stack](content/interviews/lyft-2.md) · [Mid · Frontend](content/interviews/lyft-4.md) · [Senior · Backend](content/interviews/lyft-3.md) · [Staff · Backend](content/interviews/lyft-1.md) |
| **[Microsoft](content/companies/microsoft.md)** | Big Tech | [Junior · Full-stack](content/interviews/microsoft-4.md) · [Senior · Frontend](content/interviews/microsoft-2.md) · [Senior · Full-stack](content/interviews/microsoft-1.md) · [Staff · Backend](content/interviews/microsoft-3.md) |
| **[MongoDB](content/companies/mongodb.md)** | Databases | [Junior · Frontend](content/interviews/mongodb-2.md) · [Mid · Backend](content/interviews/mongodb-3.md) · [Mid · Frontend](content/interviews/mongodb-1.md) · [Senior · Full-stack](content/interviews/mongodb-4.md) |
| **[Notion](content/companies/notion.md)** | Productivity | [Junior · Full-stack](content/interviews/notion-3.md) · [Senior · Backend](content/interviews/notion-4.md) · [Senior · Frontend](content/interviews/notion-1.md) · [Staff · Backend](content/interviews/notion-2.md) |
| **[Nvidia](content/companies/nvidia.md)** | Semiconductors | [Junior · Frontend](content/interviews/nvidia-2.md) · [Mid · Backend](content/interviews/nvidia-3.md) · [Mid · Frontend](content/interviews/nvidia-1.md) · [Senior · Full-stack](content/interviews/nvidia-4.md) |
| **[OpenAI](content/companies/openai.md)** | AI | [Junior · Full-stack](content/interviews/openai-3.md) · [Senior · Backend](content/interviews/openai-4.md) · [Senior · Frontend](content/interviews/openai-1.md) · [Staff · Backend](content/interviews/openai-2.md) |
| **[Oracle](content/companies/oracle.md)** | Enterprise Software | [Junior · Frontend](content/interviews/oracle-4.md) · [Junior · Full-stack](content/interviews/oracle-1.md) · [Mid · Frontend](content/interviews/oracle-3.md) · [Senior · Backend](content/interviews/oracle-2.md) |
| **[Palantir](content/companies/palantir.md)** | Enterprise Software | [Junior · Frontend](content/interviews/palantir-3.md) · [Mid · Backend](content/interviews/palantir-4.md) · [Mid · Frontend](content/interviews/palantir-2.md) · [Senior · Backend](content/interviews/palantir-1.md) |
| **[PayPal](content/companies/paypal.md)** | Fintech | [Junior · Frontend](content/interviews/paypal-1.md) · [Mid · Backend](content/interviews/paypal-2.md) · [Senior · Frontend](content/interviews/paypal-4.md) · [Senior · Full-stack](content/interviews/paypal-3.md) |
| **[Pinterest](content/companies/pinterest.md)** | Consumer Internet | [Junior · Frontend](content/interviews/pinterest-2.md) · [Mid · Backend](content/interviews/pinterest-3.md) · [Mid · Frontend](content/interviews/pinterest-1.md) · [Senior · Full-stack](content/interviews/pinterest-4.md) |
| **[Plaid](content/companies/plaid.md)** | Fintech | [Mid · Backend](content/interviews/plaid-1.md) · [Senior · Frontend](content/interviews/plaid-3.md) · [Senior · Full-stack](content/interviews/plaid-2.md) · [Staff · Backend](content/interviews/plaid-4.md) |
| **[Ramp](content/companies/ramp.md)** | Fintech | [Junior · Frontend](content/interviews/ramp-4.md) · [Junior · Full-stack](content/interviews/ramp-1.md) · [Mid · Frontend](content/interviews/ramp-3.md) · [Senior · Backend](content/interviews/ramp-2.md) |
| **[Reddit](content/companies/reddit.md)** | Consumer Internet | [Junior · Frontend](content/interviews/reddit-2.md) · [Mid · Backend](content/interviews/reddit-3.md) · [Mid · Frontend](content/interviews/reddit-1.md) · [Senior · Full-stack](content/interviews/reddit-4.md) |
| **[Robinhood](content/companies/robinhood.md)** | Fintech | [Junior · Full-stack](content/interviews/robinhood-4.md) · [Senior · Frontend](content/interviews/robinhood-2.md) · [Senior · Full-stack](content/interviews/robinhood-1.md) · [Staff · Backend](content/interviews/robinhood-3.md) |
| **[Roblox](content/companies/roblox.md)** | Gaming | [Junior · Frontend](content/interviews/roblox-3.md) · [Mid · Backend](content/interviews/roblox-4.md) · [Mid · Frontend](content/interviews/roblox-2.md) · [Senior · Backend](content/interviews/roblox-1.md) |
| **[Salesforce](content/companies/salesforce.md)** | Enterprise SaaS | [Junior · Full-stack](content/interviews/salesforce-4.md) · [Senior · Frontend](content/interviews/salesforce-2.md) · [Senior · Full-stack](content/interviews/salesforce-1.md) · [Staff · Backend](content/interviews/salesforce-3.md) |
| **[Shopify](content/companies/shopify.md)** | E-commerce | [Junior · Full-stack](content/interviews/shopify-2.md) · [Mid · Frontend](content/interviews/shopify-4.md) · [Senior · Backend](content/interviews/shopify-3.md) · [Staff · Backend](content/interviews/shopify-1.md) |
| **[Slack](content/companies/slack.md)** | SaaS | [Junior · Full-stack](content/interviews/slack-3.md) · [Senior · Backend](content/interviews/slack-4.md) · [Senior · Frontend](content/interviews/slack-1.md) · [Staff · Backend](content/interviews/slack-2.md) |
| **[Snap](content/companies/snap.md)** | Consumer Internet | [Junior · Frontend](content/interviews/snap-3.md) · [Mid · Backend](content/interviews/snap-4.md) · [Mid · Frontend](content/interviews/snap-2.md) · [Senior · Backend](content/interviews/snap-1.md) |
| **[Snowflake](content/companies/snowflake.md)** | Data | [Junior · Frontend](content/interviews/snowflake-4.md) · [Junior · Full-stack](content/interviews/snowflake-1.md) · [Mid · Frontend](content/interviews/snowflake-3.md) · [Senior · Backend](content/interviews/snowflake-2.md) |
| **[Spotify](content/companies/spotify.md)** | Streaming | [Mid · Backend](content/interviews/spotify-1.md) · [Senior · Frontend](content/interviews/spotify-3.md) · [Senior · Full-stack](content/interviews/spotify-2.md) · [Staff · Backend](content/interviews/spotify-4.md) |
| **[Twilio](content/companies/twilio.md)** | Developer Platform | [Junior · Full-stack](content/interviews/twilio-4.md) · [Senior · Frontend](content/interviews/twilio-2.md) · [Senior · Full-stack](content/interviews/twilio-1.md) · [Staff · Backend](content/interviews/twilio-3.md) |
| **[Uber](content/companies/uber.md)** | Marketplace | [Junior · Full-stack](content/interviews/uber-4.md) · [Senior · Frontend](content/interviews/uber-2.md) · [Senior · Full-stack](content/interviews/uber-1.md) · [Staff · Backend](content/interviews/uber-3.md) |
| **[Unity](content/companies/unity.md)** | Gaming | [Junior · Frontend](content/interviews/unity-4.md) · [Junior · Full-stack](content/interviews/unity-1.md) · [Mid · Frontend](content/interviews/unity-3.md) · [Senior · Backend](content/interviews/unity-2.md) |
| **[Zoom](content/companies/zoom.md)** | SaaS | [Junior · Frontend](content/interviews/zoom-1.md) · [Mid · Backend](content/interviews/zoom-2.md) · [Senior · Frontend](content/interviews/zoom-4.md) · [Senior · Full-stack](content/interviews/zoom-3.md) |

⭐ = featured on the home page.

<!-- CONTENT_INDEX:END -->

---

## ✍️ Add your own interview

Sharing an experience takes one file and a pull request.

1. Make sure the company exists in `content/companies/`. If not, add it (see the format above).
2. Create `content/interviews/<company-slug>-<n>.md` — bump `<n>` past the highest existing one for that company.
3. Set `id` to match the filename, and use `source: community`.
4. Run `npm run readme-index` so the index above picks up your file.
5. Run `npm run dev` to see it live, then open a PR.

That's it — no schema migration, no admin panel. Your interview shows up on the company page, in the round pages, and in search automatically.

> **Please keep it honest.** Only share questions you were actually asked, and never post anything covered by an NDA or any interviewer's personal details.

---

## 🧱 Project structure

```
content/                 Markdown source of truth (companies + interviews)
public/search-index.json Generated search index (rebuilt on every build)
scripts/
├── build-search-index.ts  Reads content/ → writes the search index   (safe)
├── build-content-index.ts Reads content/ → rewrites the index above  (safe)
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
| `npm run readme-index` | Rebuild the company/interview index in this README from `content/` |
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
