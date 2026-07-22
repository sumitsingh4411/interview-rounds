// Regenerates the browsable company/interview index inside README.md, between
// the CONTENT_INDEX markers. Reads content/*.md — safe, never writes content.
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { parseRounds, countQuestions } from '../src/content/parse-rounds';
import { leetcodeSlug } from '../src/lib/leetcode';
import { ROUND_ORDER, ROUND_LABELS, type Round } from '../src/lib/constants';

const ROOT = process.cwd();
const COMPANIES_DIR = join(ROOT, 'content', 'companies');
const INTERVIEWS_DIR = join(ROOT, 'content', 'interviews');
const README = join(ROOT, 'README.md');

const START = '<!-- CONTENT_INDEX:START -->';
const Q_START = '<!-- QUESTIONS_BY_ROUND:START -->';
const Q_END = '<!-- QUESTIONS_BY_ROUND:END -->';

/** Emoji WITHOUT a variation selector, so a heading anchor stays clean. */
const ROUND_EMOJI: Record<Round, string> = {
  oa: '🧪',
  dsa: '🧩',
  machine_coding: '🔧',
  lld: '🧱',
  system_design: '🌐',
  tech_deep_dive: '🔬',
  hiring_manager: '👔',
  behavioral: '💬',
};

const DIFF_BADGE: Record<string, string> = {
  easy: '🟢 Easy',
  medium: '🟡 Medium',
  hard: '🔴 Hard',
};

/** How many representative questions to show per round in the README. */
const SAMPLE_PER_ROUND = 15;

/** A one-line "🟢 x · 🟡 y · 🔴 z" mix, omitting any tier with no questions. */
function difficultyMix(qs: QAgg[]): string {
  const n = { easy: 0, medium: 0, hard: 0 };
  for (const q of qs) if (q.difficulty && q.difficulty in n) n[q.difficulty as keyof typeof n] += 1;
  const parts: string[] = [];
  if (n.easy) parts.push(`🟢 ${n.easy} easy`);
  if (n.medium) parts.push(`🟡 ${n.medium} medium`);
  if (n.hard) parts.push(`🔴 ${n.hard} hard`);
  return parts.join(' · ');
}

type QAgg = { title: string; difficulty: string | null; count: number };

/** Escape a question title for a Markdown table cell. */
function cell(s: string): string {
  return s.replace(/\|/g, '\\|');
}
const END = '<!-- CONTENT_INDEX:END -->';

const LEVEL_SHORT: Record<string, string> = {
  intern: 'Intern',
  junior: 'Junior',
  mid: 'Mid',
  senior: 'Senior',
  staff: 'Staff',
};
/** Short enough that a whole loop fits on one line without wrapping. */
const ROLE_ABBR: Record<string, string> = {
  frontend: 'FE',
  backend: 'BE',
  fullstack: 'FS',
};
const LEVEL_RANK = ['intern', 'junior', 'mid', 'senior', 'staff'];

/**
 * 119 companies in one table is a wall. Grouping them into a handful of
 * sections keeps every company visible while staying scannable.
 * Any industry missing from this map lands in "More" — nothing is ever dropped.
 */
const CATEGORIES: { name: string; emoji: string; industries: string[] }[] = [
  { name: 'Big Tech', emoji: '🏢', industries: ['Big Tech'] },
  { name: 'AI', emoji: '🤖', industries: ['AI', 'Data & AI'] },
  { name: 'Fintech', emoji: '💳', industries: ['Fintech'] },
  { name: 'Finance and Trading', emoji: '💹', industries: ['Finance', 'Trading'] },
  {
    name: 'IT Services and Consulting',
    emoji: '🤝',
    industries: ['IT Services', 'Consulting'],
  },
  {
    name: 'Developer Tools',
    emoji: '🧰',
    industries: ['Developer Platform', 'Infrastructure', 'Databases', 'Data Streaming', 'Observability', 'Networking', 'Automation'],
  },
  {
    name: 'Consumer and Marketplace',
    emoji: '🛒',
    industries: ['Consumer Internet', 'Marketplace', 'E-commerce', 'Streaming', 'Gaming', 'EdTech', 'Telecom'],
  },
  {
    name: 'Enterprise and SaaS',
    emoji: '💼',
    industries: ['Enterprise Software', 'Enterprise SaaS', 'SaaS', 'Productivity', 'Design Software', 'Creative Software', 'Cloud Storage', 'HR Tech'],
  },
  { name: 'Data and Analytics', emoji: '📊', industries: ['Data', 'Analytics'] },
  { name: 'Health Tech', emoji: '🏥', industries: ['Health Tech'] },
  { name: 'Security', emoji: '🔐', industries: ['Security'] },
  {
    name: 'Hardware and Frontier',
    emoji: '🚀',
    industries: ['Semiconductors', 'Automotive', 'Autonomous Vehicles', 'Aerospace', 'Defense Tech', 'IoT', 'Logistics'],
  },
];

/**
 * Reproduces GitHub's heading-slug rule, derived by reading the ids off the
 * rendered README: the emoji's base character is stripped, but a trailing
 * VARIATION SELECTOR (U+FE0F) is not — "## ▶️ Try it live" becomes
 * "️-try-it-live", not "-try-it-live". Category emoji are therefore chosen
 * without a variation selector (see the guard below) so anchors stay clean.
 */
function anchorFor(heading: string): string {
  return (
    '#' +
    heading
      .toLowerCase()
      .replace(/[^\w\- ️]/g, '')
      .replace(/\s/g, '-')
  );
}

/** An emoji with U+FE0F would leave an invisible character in every jump link. */
function assertNoVariationSelectors() {
  const bad = CATEGORIES.filter((c) => /️/.test(c.emoji)).map((c) => c.name);
  if (bad.length > 0) {
    console.error(
      `✖ Category emoji contain a variation selector (U+FE0F), which corrupts the anchor: ${bad.join(', ')}. Pick an emoji without one.`,
    );
    process.exit(1);
  }
}

type Company = {
  name: string;
  slug: string;
  industry: string;
  featured: boolean;
};
type Interview = {
  id: string;
  company: string;
  role: string;
  level: string;
  questionCount: number;
};

function mdFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.md'));
}

function main() {
  const companies: Company[] = mdFiles(COMPANIES_DIR).map((f) => {
    const { data } = matter(readFileSync(join(COMPANIES_DIR, f), 'utf8'));
    return {
      name: data.name,
      slug: data.slug,
      industry: data.industry ?? '—',
      featured: data.featured === true,
    };
  });

  // Aggregate questions per round across every interview, deduped by title.
  // `count` = how many interviews asked it, so the sample surfaces the most
  // commonly reported questions first.
  const roundQuestions = new Map<Round, Map<string, QAgg>>();

  const interviews: Interview[] = mdFiles(INTERVIEWS_DIR).map((f) => {
    const { data, content } = matter(readFileSync(join(INTERVIEWS_DIR, f), 'utf8'));
    const rounds = parseRounds(content);

    for (const r of rounds) {
      const round = r.round as Round;
      const bucket = roundQuestions.get(round) ?? new Map<string, QAgg>();
      for (const q of r.questions) {
        const title = q.title.trim();
        const key = title.toLowerCase();
        const cur = bucket.get(key);
        if (cur) cur.count += 1;
        else bucket.set(key, { title, difficulty: q.difficulty ?? null, count: 1 });
      }
      roundQuestions.set(round, bucket);
    }

    return {
      id: data.id,
      company: data.company,
      role: data.role,
      level: data.level,
      questionCount: countQuestions(rounds),
    };
  });

  const questionTotal = interviews.reduce((n, iv) => n + iv.questionCount, 0);

  const byCompany = new Map<string, Interview[]>();
  for (const iv of interviews) {
    const list = byCompany.get(iv.company) ?? [];
    list.push(iv);
    byCompany.set(iv.company, list);
  }
  for (const list of byCompany.values()) {
    list.sort(
      (a, b) =>
        LEVEL_RANK.indexOf(a.level) - LEVEL_RANK.indexOf(b.level) ||
        a.role.localeCompare(b.role),
    );
  }

  companies.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  const questionsFor = (slug: string) =>
    (byCompany.get(slug) ?? []).reduce((n, iv) => n + iv.questionCount, 0);

  const TABLE_HEAD = [
    '| Company | Industry | Qs | Interview experiences |',
    '|---|---|---:|---|',
  ];

  /**
   * Link labels use "Junior FE", never "Junior · Frontend": the separator
   * BETWEEN links is also " · ", so a dot inside the label makes the whole row
   * read as one run-on blob.
   */
  function rowsFor(list: Company[]): string[] {
    return list.map((c) => {
      const links = (byCompany.get(c.slug) ?? [])
        .map(
          (iv) =>
            `[${LEVEL_SHORT[iv.level] ?? iv.level} ${ROLE_ABBR[iv.role] ?? iv.role}](content/interviews/${iv.id}.md)`,
        )
        .join(' · ');
      const star = c.featured ? ' ⭐' : '';
      return `| **[${c.name}](content/companies/${c.slug}.md)**${star} | ${c.industry} | ${questionsFor(c.slug)} | ${links || '—'} |`;
    });
  }

  // Bucket every company into exactly one category (featured first, then A–Z).
  const industryToCategory = new Map<string, string>();
  for (const c of CATEGORIES) {
    for (const ind of c.industries) industryToCategory.set(ind, c.name);
  }

  const buckets = new Map<string, Company[]>();
  const unmapped = new Set<string>();
  for (const co of companies) {
    const cat = industryToCategory.get(co.industry);
    if (!cat) unmapped.add(co.industry);
    const key = cat ?? 'More';
    (buckets.get(key) ?? buckets.set(key, []).get(key)!).push(co);
  }
  if (unmapped.size > 0) {
    console.warn(`  ⚠ industries not in CATEGORIES (grouped under "More"): ${[...unmapped].join(', ')}`);
  }

  const sections = [
    ...CATEGORIES.map((c) => ({ ...c, list: buckets.get(c.name) ?? [] })),
    { name: 'More', emoji: '📦', industries: [], list: buckets.get('More') ?? [] },
  ].filter((s) => s.list.length > 0);

  // Nothing may be silently dropped.
  const grouped = sections.reduce((n, s) => n + s.list.length, 0);
  if (grouped !== companies.length) {
    console.error(`✖ Grouped ${grouped} companies but have ${companies.length}.`);
    process.exit(1);
  }

  const lines: string[] = [];
  lines.push(
    `**${companies.length} companies · ${interviews.length} interview experiences · ${questionTotal.toLocaleString('en-US')} questions.**`,
  );
  lines.push('');
  lines.push(
    'Every link opens the raw Markdown — no website needed. ⭐ = featured · **`FE`** frontend · **`BE`** backend · **`FS`** full-stack.',
  );
  lines.push('');
  assertNoVariationSelectors();
  lines.push(
    `**Jump to:** ${sections.map((s) => `[${s.emoji} ${s.name}](${anchorFor(`${s.emoji} ${s.name}`)}) <sup>${s.list.length}</sup>`).join(' · ')}`,
  );

  for (const s of sections) {
    lines.push('');
    lines.push(`### ${s.emoji} ${s.name}`);
    lines.push('');
    lines.push(...TABLE_HEAD, ...rowsFor(s.list));
  }

  const block = `${START}\n\n${lines.join('\n')}\n\n${END}`;

  // ── Sample questions by round ──────────────────────────────────────────────
  const qLines: string[] = [];
  qLines.push(
    'Real questions pulled straight from the interviews above, most-reported first. Coding questions link to LeetCode where an exact problem exists.',
  );
  qLines.push('');
  qLines.push(
    `**Jump to:** ${ROUND_ORDER.map((r) => `[${ROUND_EMOJI[r]} ${ROUND_LABELS[r]}](${anchorFor(`${ROUND_EMOJI[r]} ${ROUND_LABELS[r]}`)})`).join(' · ')}`,
  );

  for (const round of ROUND_ORDER) {
    const bucket = roundQuestions.get(round);
    const all = [...(bucket?.values() ?? [])].sort(
      (a, b) => b.count - a.count || a.title.localeCompare(b.title),
    );
    const sample = all.slice(0, SAMPLE_PER_ROUND);

    qLines.push('');
    qLines.push(`### ${ROUND_EMOJI[round]} ${ROUND_LABELS[round]}`);
    qLines.push('');
    const mix = difficultyMix(all);
    qLines.push(
      `_${all.length} distinct questions in this round${all.length > SAMPLE_PER_ROUND ? ` — top ${SAMPLE_PER_ROUND}` : ''}${mix ? ` · ${mix}` : ''}:_`,
    );
    qLines.push('');
    qLines.push('| Question | Difficulty |');
    qLines.push('|---|---|');
    for (const q of sample) {
      const slug = leetcodeSlug(q.title);
      const title = slug
        ? `[${cell(q.title)}](https://leetcode.com/problems/${slug}/)`
        : cell(q.title);
      const diff = q.difficulty ? (DIFF_BADGE[q.difficulty] ?? q.difficulty) : '—';
      qLines.push(`| ${title} | ${diff} |`);
    }
  }
  const qBlock = `${Q_START}\n\n${qLines.join('\n')}\n\n${Q_END}`;

  const readme = readFileSync(README, 'utf8');
  const startIdx = readme.indexOf(START);
  const endIdx = readme.indexOf(END);
  if (startIdx === -1 || endIdx === -1) {
    console.error(
      `✖ Could not find ${START} / ${END} markers in README.md. Add them and re-run.`,
    );
    process.exit(1);
  }

  let next =
    readme.slice(0, startIdx) + block + readme.slice(endIdx + END.length);

  // Fill the "sample questions by round" block.
  const qStartIdx = next.indexOf(Q_START);
  const qEndIdx = next.indexOf(Q_END);
  if (qStartIdx === -1 || qEndIdx === -1) {
    console.error(
      `✖ Could not find ${Q_START} / ${Q_END} markers in README.md. Add them and re-run.`,
    );
    process.exit(1);
  }
  next =
    next.slice(0, qStartIdx) + qBlock + next.slice(qEndIdx + Q_END.length);

  // Keep the count badges in sync so they can never drift from the content.
  next = next
    .replace(/badge\/interviews-\d+-/, `badge/interviews-${interviews.length}-`)
    .replace(/badge\/companies-\d+-/, `badge/companies-${companies.length}-`)
    .replace(
      /badge\/questions-[\d%C,]+-/,
      `badge/questions-${questionTotal.toLocaleString('en-US').replace(/,/g, '%2C')}-`,
    );

  // ...and the counts written into the prose, for the same reason.
  const questionsPretty = questionTotal.toLocaleString('en-US');
  // company + interview + round + a handful of static routes, floored to a
  // round number so the claim stays true as content grows.
  const pages = Math.floor((companies.length + interviews.length + 14) / 100) * 100;
  next = next
    .replace(/\*\*\d+ top tech companies\*\*/g, `**${companies.length} top tech companies**`)
    .replace(/All \d+ companies, filterable/g, `All ${companies.length} companies, filterable`)
    .replace(/all [\d,]+ questions/g, `all ${questionsPretty} questions`)
    .replace(/\d+\+ static pages/g, `${pages}+ static pages`)
    .replace(/prerenders \d+\+ pages/g, `prerenders ${pages}+ pages`);

  writeFileSync(README, next);
  console.log(
    `✔ README rebuilt: ${companies.length} companies, ${interviews.length} interviews, ${questionTotal} questions.`,
  );
}

main();
