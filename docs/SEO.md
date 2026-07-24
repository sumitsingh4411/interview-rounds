# SEO playbook

Everything that makes The Loop discoverable — how it's built, how to get it
indexed, and what to do each month. Written for a static, content-heavy site
(~2,500 pages) on `interview-rounds.nextjoblist.com`.

> **The one thing that matters most right now:** content is not the bottleneck —
> **indexing is**. Google can't rank pages it hasn't crawled. Do the
> [Search Console setup](#1-google-search-console-10-minutes-highest-impact) first.

---

## 1. Google Search Console (10 minutes, highest impact)

Search Console is how Google tells you what it has indexed, what's broken, and
which queries you rank for. Nothing else on this list matters until this is done.

### Step 1 — Add the property

1. Go to <https://search.google.com/search-console> and sign in.
2. Click **Add property**. You have two choices:

   | Type | Covers | Verify by | Recommended when |
   |---|---|---|---|
   | **Domain** | `nextjoblist.com` **and every subdomain** | one DNS TXT record | you control the DNS (you do) — **use this** |
   | **URL prefix** | exactly `https://interview-rounds.nextjoblist.com` | HTML tag / file / DNS | quick, per-site |

   **Use the Domain property** — one record covers this subdomain and any future
   ones, and DNS verification never silently breaks.

### Step 2 — Verify (Domain property, via DNS)

1. Search Console shows a `TXT` record like
   `google-site-verification=abc123…`.
2. In your DNS provider for **nextjoblist.com**, add a TXT record:
   - **Name/Host:** `@` (the root)
   - **Value:** the full `google-site-verification=…` string
3. Back in Search Console, click **Verify**. (DNS can take a few minutes to an
   hour to propagate.)

**Alternative — HTML-tag verification (no DNS):** the code already supports this.
Set an environment variable in the Vercel project instead of touching DNS:

```
GOOGLE_SITE_VERIFICATION = <the token from the "HTML tag" method>
```

Redeploy, then click **Verify**. (See `src/app/layout.tsx` → `metadata.verification`.)

### Step 3 — Submit the sitemap

1. In Search Console, open **Sitemaps** (left nav).
2. Enter `sitemap.xml` and **Submit**.
3. It should read **Success** with ~2,500 discovered URLs. The sitemap is at
   <https://interview-rounds.nextjoblist.com/sitemap.xml> and regenerates on
   every deploy (`src/app/sitemap.ts`).

### Step 4 — Force-index your best pages

Indexing the full site is gradual. Jump the queue for the pages you most want
ranking:

1. Paste a URL into the **top search bar** (URL Inspection), e.g.
   `https://interview-rounds.nextjoblist.com/`.
2. Click **Request indexing**.
3. Repeat for your highest-value pages:
   - `/` (home)
   - `/rounds` and 2–3 top `/rounds/<round>` (e.g. `/rounds/dsa`, `/rounds/system_design`)
   - your 5–10 highest-search company pages (`/companies/google`, `/companies/amazon`, `/companies/tcs`, …)

You get a limited number of manual requests per day — spend them on hubs and
top companies; the long tail gets picked up from the sitemap + internal links.

---

## 2. Bing / others (5 minutes, free traffic)

Bing (and ChatGPT search, which uses Bing's index) is worth the 5 minutes:

1. Go to <https://www.bing.com/webmasters> → **Import from Google Search Console**
   (one click, pulls the property and sitemap across). Done.
2. Optional meta-tag verification instead: set `BING_SITE_VERIFICATION` in Vercel
   (wired the same way as Google above).

---

## 3. What's already built (the machine)

You don't need to touch these — they run on every deploy. Listed so you know the
levers exist.

| Lever | Where | What it does |
|---|---|---|
| **Per-page titles & descriptions** | every `generateMetadata` | Unique, keyword-led, count-rich (e.g. "62 real Stripe interview questions…"). |
| **Canonical URLs** | every page | Self-referencing `alternates.canonical` — kills duplicate-URL dilution. |
| **`robots.txt`** | `src/app/robots.ts` | Allows all, points to the sitemap. |
| **XML sitemap** | `src/app/sitemap.ts` | All companies, interviews, rounds + static pages, with priorities. |
| **Web app manifest** | `src/app/manifest.ts` | Installable/PWA signals, mobile branding. |
| **Open Graph image** | `src/app/opengraph-image.tsx` | Branded 1200×630 share card with live totals. |
| **Site entity graph** | `src/app/layout.tsx` | `WebSite` + `Organization` JSON-LD, with a `SearchAction` (sitelinks search box). |
| **Breadcrumbs** | all deep pages | `BreadcrumbList` JSON-LD → breadcrumb trail in results. |
| **Article schema** | interview pages | `Article` about the company, authored/published by the Org (`@id` refs). |
| **CollectionPage + ItemList** | company pages | Explicit machine-readable map of each company's interviews. |
| **Internal linking** | company + interview pages | "Related companies" (same industry) and per-round links — spreads crawl equity, no orphans. |

**Why the `@id` cross-references matter:** every page's structured data points
back at the single `Organization` and `WebSite` nodes (`…/#organization`,
`…/#website`) instead of redeclaring them. Google stitches these into one entity
graph for the whole site — a far stronger signal than isolated snippets.

### Verify structured data

After a deploy, paste any URL into:

- **Rich Results Test** — <https://search.google.com/test/rich-results>
- **Schema Markup Validator** — <https://validator.schema.org>

Expect: `BreadcrumbList` + `Article` (interview pages), `BreadcrumbList` +
`CollectionPage` (company pages), `WebSite` + `Organization` (every page).

---

## 4. The honest risk: templated content

The interview questions are composed from a curated bank, so many pages share
questions. Google's "scaled/duplicate content" systems can decline to index
near-duplicates. Mitigations already in place:

- Every page has **genuinely unique** titles, descriptions, H1s and counts.
- **Internal linking** makes every page reachable in ≤3 clicks (no orphans).
- **Company and round pages are the primary ranking targets** — they aggregate
  and are the most unique; interview pages are supporting long-tail.

**Do not** paste AI-written filler prose onto each page to look "unique" — that
trips the exact spam systems we're avoiding. The path to more ranking pages is
**more genuinely distinct content** (real shared interviews, per-company notes),
not more templated volume.

---

## 5. Monthly playbook

Once indexing is healthy, this is the whole job:

1. **Search Console → Performance.** Sort by Impressions. Find queries where you
   rank **8–20** (page 1–2 border) — those are the fastest wins. Strengthen the
   matching page's title/description and internal links.
2. **Search Console → Pages.** Watch **"Crawled – currently not indexed"** and
   **"Discovered – currently not indexed"**. A rising count here is the duplicate
   -content risk showing up — it means those pages need to be more distinct or
   better internally linked.
3. **Coverage/Indexing count** should trend up toward the sitemap total. If it
   stalls well below, that's the signal to invest in unique content, not volume.
4. After a big content push, **resubmit the sitemap** and request indexing on the
   new hub pages.
5. **Core Web Vitals** — static + Vercel keeps these green; glance monthly.

### Highest-leverage next investments (in order)

1. **Real, individually-shared interviews** — unique first-party content is the
   single biggest ranking unlock and defuses the duplicate-content risk.
2. **Backlinks** — share on the subreddits/newsletters your audience reads; each
   editorial link lifts the whole domain.
3. **Per-company OG cards** — better share CTR (currently one shared card).
4. **A short written intro per round page** — a few unique sentences on what each
   round tests turns thin list pages into genuine content.
