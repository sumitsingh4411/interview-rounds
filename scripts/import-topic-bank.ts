/**
 * Imports open-source, permissively-licensed practice questions into
 * content/banks/.
 *
 * These are TOPIC questions, not company interview questions — they are never
 * attributed to a company. Every file records the upstream repo, the exact
 * source file, and its licence.
 *
 * ── Sourcing rule ────────────────────────────────────────────────────────
 * A repo is only imported if it carries a permissive licence (MIT / CC / etc.)
 * that GitHub detects. "Public" is NOT the same as "reusable": a repo with no
 * LICENSE file is all-rights-reserved and is deliberately left out. We also
 * skip sources whose questions don't stand alone as titles (e.g. a list of
 * "What's the output?" headings) — a bank of non-descriptive rows is noise.
 *
 * Verify a repo's licence before adding it here:
 *   curl -s https://api.github.com/repos/OWNER/REPO/license | grep spdx_id
 *
 * Sources currently imported:
 *   - FAQGURU/FAQGURU (MIT)                    — https://github.com/FAQGURU/FAQGURU
 *   - sudheerj/reactjs-interview-questions (MIT) — https://github.com/sudheerj/reactjs-interview-questions
 */
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import type { Round, Role } from '../src/lib/constants';

const ROOT = process.cwd();
const BANKS_DIR = join(ROOT, 'content', 'banks');

/** How a source's markdown lists its questions. */
type Parser = 'toc' | 'table';

type FileSpec = {
  /** filename without extension, relative to the source's `path` */
  file: string;
  /** unique bank id suffix */
  id: string;
  title: string;
  round: Round;
  role: Role;
};

type Source = {
  repo: string;
  branch: string;
  license: string;
  /** path under the repo where the markdown lives ('' = repo root) */
  path: string;
  parser: Parser;
  /** max questions to keep per file */
  max: number;
  files: FileSpec[];
};

const SOURCES: Source[] = [
  {
    repo: 'FAQGURU/FAQGURU',
    branch: 'master',
    license: 'MIT',
    path: 'topics/en',
    parser: 'toc',
    max: 50,
    files: [
      { file: 'javascript', id: 'faqguru-javascript', title: 'JavaScript', round: 'tech_deep_dive', role: 'frontend' },
      { file: 'css', id: 'faqguru-css', title: 'CSS', round: 'tech_deep_dive', role: 'frontend' },
      { file: 'html5', id: 'faqguru-html5', title: 'HTML', round: 'tech_deep_dive', role: 'frontend' },
      { file: 'react', id: 'faqguru-react', title: 'React', round: 'tech_deep_dive', role: 'frontend' },
      { file: 'redux', id: 'faqguru-redux', title: 'Redux', round: 'tech_deep_dive', role: 'frontend' },
      { file: 'data-structures', id: 'faqguru-data-structures', title: 'Data Structures', round: 'dsa', role: 'fullstack' },
      { file: 'code-problems', id: 'faqguru-code-problems', title: 'Code Problems', round: 'dsa', role: 'fullstack' },
      { file: 'design-patterns', id: 'faqguru-design-patterns', title: 'Design Patterns', round: 'lld', role: 'backend' },
      { file: 'mongodb', id: 'faqguru-mongodb', title: 'MongoDB', round: 'tech_deep_dive', role: 'backend' },
      { file: 'sql', id: 'faqguru-sql', title: 'SQL', round: 'tech_deep_dive', role: 'backend' },
      { file: 'nodejs', id: 'faqguru-nodejs', title: 'Node.js', round: 'tech_deep_dive', role: 'backend' },
      { file: 'graphql', id: 'faqguru-graphql', title: 'GraphQL', round: 'tech_deep_dive', role: 'backend' },
      { file: 'aws', id: 'faqguru-aws', title: 'AWS', round: 'tech_deep_dive', role: 'backend' },
    ],
  },
  {
    repo: 'sudheerj/reactjs-interview-questions',
    branch: 'master',
    license: 'MIT',
    path: '',
    parser: 'table',
    max: 60,
    files: [
      { file: 'README', id: 'sudheerj-react', title: 'React (in depth)', round: 'tech_deep_dive', role: 'frontend' },
    ],
  },
];

/** FAQGURU-style TOC: `[Question](#anchor)` one per line. */
const TOC_LINE = /^\[(.+?)\]\(#.+?\)$/;
/** sudheerj-style table row: `| 12 | [Question](#anchor) |`. */
const TABLE_LINE = /^\|\s*\d+\s*\|\s*\[(.+?)\]\(#[^)]*\)\s*\|/;

function extractQuestions(markdown: string, parser: Parser, max: number): string[] {
  const re = parser === 'toc' ? TOC_LINE : TABLE_LINE;
  const seen = new Set<string>();
  const out: string[] = [];

  for (const raw of markdown.split('\n')) {
    const m = raw.trim().match(re);
    if (!m) continue;

    const title = m[1].replace(/\s+/g, ' ').trim();
    // A pipe would break the table; over-long or empty titles are noise.
    if (!title || title.includes('|') || title.length > 160) continue;
    if (seen.has(title)) continue;

    seen.add(title);
    out.push(title);
    if (out.length >= max) break;
  }
  return out;
}

async function fetchRaw(url: string): Promise<string | null> {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.text();
}

async function main() {
  if (existsSync(BANKS_DIR)) rmSync(BANKS_DIR, { recursive: true, force: true });
  mkdirSync(BANKS_DIR, { recursive: true });

  let banks = 0;
  let questions = 0;

  for (const src of SOURCES) {
    const seg = src.path ? `${src.path}/` : '';
    const raw = `https://raw.githubusercontent.com/${src.repo}/${src.branch}/${seg}`;
    const blob = `https://github.com/${src.repo}/blob/${src.branch}/${seg}`;

    for (const spec of src.files) {
      const md = await fetchRaw(`${raw}${spec.file}.md`);
      if (!md) {
        console.warn(`  ⚠ skipped ${src.repo}/${spec.file} (not found upstream)`);
        continue;
      }

      const titles = extractQuestions(md, src.parser, src.max);
      if (titles.length === 0) {
        console.warn(`  ⚠ skipped ${src.repo}/${spec.file} (no questions parsed)`);
        continue;
      }

      const sourceUrl = `${blob}${spec.file}.md`;
      const body = [
        `# ${spec.title} — practice bank`,
        '',
        `${titles.length} questions imported from [${src.repo}](https://github.com/${src.repo}) (${src.license} licence).`,
        '',
        `> These are **topic** questions, not questions attributed to any company.`,
        '',
        `Source: [${spec.file}.md](${sourceUrl})`,
        '',
        '---',
        '',
        `## Questions`,
        `<!-- round: ${spec.round} -->`,
        '',
        '| Question | Difficulty | Tags |',
        '| --- | --- | --- |',
        ...titles.map((t) => `| ${t} | — | — |`),
        '',
      ].join('\n');

      const file = matter.stringify(body, {
        id: spec.id,
        title: spec.title,
        round: spec.round,
        role: spec.role,
        source: 'github',
        sourceRepo: src.repo,
        sourceUrl,
        license: src.license,
      });

      writeFileSync(join(BANKS_DIR, `${spec.id}.md`), file);
      banks += 1;
      questions += titles.length;
      console.log(`  ✓ ${spec.title.padEnd(18)} ${String(titles.length).padStart(3)}  (${src.repo})`);
    }
  }

  console.log(
    `\n✔ Imported ${questions} questions across ${banks} banks from ${SOURCES.length} licensed sources.\n`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
