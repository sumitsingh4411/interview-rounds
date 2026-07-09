/**
 * Imports open-source, MIT-licensed practice questions into content/banks/.
 *
 * These are TOPIC questions, not company interview questions — they are never
 * attributed to a company. Every file records the upstream repo, the exact
 * source file, and its licence.
 *
 * Source: FAQGURU/FAQGURU (MIT) — https://github.com/FAQGURU/FAQGURU
 */
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import type { Round, Role } from '../src/lib/constants';

const ROOT = process.cwd();
const BANKS_DIR = join(ROOT, 'content', 'banks');

const REPO = 'FAQGURU/FAQGURU';
const BRANCH = 'master';
const LICENSE = 'MIT';
const RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/topics/en`;
const BLOB = `https://github.com/${REPO}/blob/${BRANCH}/topics/en`;

const MAX_PER_TOPIC = 50;

type TopicSpec = { file: string; title: string; round: Round; role: Role };

const TOPICS: TopicSpec[] = [
  { file: 'javascript', title: 'JavaScript', round: 'tech_deep_dive', role: 'frontend' },
  { file: 'css', title: 'CSS', round: 'tech_deep_dive', role: 'frontend' },
  { file: 'html5', title: 'HTML', round: 'tech_deep_dive', role: 'frontend' },
  { file: 'react', title: 'React', round: 'tech_deep_dive', role: 'frontend' },
  { file: 'redux', title: 'Redux', round: 'tech_deep_dive', role: 'frontend' },
  { file: 'data-structures', title: 'Data Structures', round: 'dsa', role: 'fullstack' },
  { file: 'code-problems', title: 'Code Problems', round: 'dsa', role: 'fullstack' },
  { file: 'design-patterns', title: 'Design Patterns', round: 'lld', role: 'backend' },
  { file: 'mongodb', title: 'MongoDB', round: 'tech_deep_dive', role: 'backend' },
  { file: 'sql', title: 'SQL', round: 'tech_deep_dive', role: 'backend' },
  { file: 'nodejs', title: 'Node.js', round: 'tech_deep_dive', role: 'backend' },
  { file: 'graphql', title: 'GraphQL', round: 'tech_deep_dive', role: 'backend' },
  { file: 'aws', title: 'AWS', round: 'tech_deep_dive', role: 'backend' },
];

/** Each topic file opens with a table of contents of `[Question](#anchor)` links. */
const TOC_LINE = /^\[(.+?)\]\(#.+?\)$/;

function extractQuestions(markdown: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const raw of markdown.split('\n')) {
    const line = raw.trim();
    const m = line.match(TOC_LINE);
    if (!m) continue;

    // Markdown tables would break on a pipe; drop those rather than mangle them.
    const title = m[1].replace(/\s+/g, ' ').trim();
    if (!title || title.includes('|') || title.length > 160) continue;
    if (seen.has(title)) continue;

    seen.add(title);
    out.push(title);
    if (out.length >= MAX_PER_TOPIC) break;
  }
  return out;
}

async function fetchTopic(file: string): Promise<string | null> {
  const res = await fetch(`${RAW}/${file}.md`);
  if (!res.ok) return null;
  return res.text();
}

async function main() {
  if (existsSync(BANKS_DIR)) rmSync(BANKS_DIR, { recursive: true, force: true });
  mkdirSync(BANKS_DIR, { recursive: true });

  let topics = 0;
  let questions = 0;

  for (const spec of TOPICS) {
    const md = await fetchTopic(spec.file);
    if (!md) {
      console.warn(`  ⚠ skipped ${spec.file} (not found upstream)`);
      continue;
    }

    const titles = extractQuestions(md);
    if (titles.length === 0) {
      console.warn(`  ⚠ skipped ${spec.file} (no questions parsed)`);
      continue;
    }

    const sourceUrl = `${BLOB}/${spec.file}.md`;
    const body = [
      `# ${spec.title} — practice bank`,
      '',
      `${titles.length} questions imported from [${REPO}](https://github.com/${REPO}) (${LICENSE} licence).`,
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
      id: `faqguru-${spec.file}`,
      title: spec.title,
      round: spec.round,
      role: spec.role,
      source: 'github',
      sourceRepo: REPO,
      sourceUrl,
      license: LICENSE,
    });

    writeFileSync(join(BANKS_DIR, `faqguru-${spec.file}.md`), file);
    topics += 1;
    questions += titles.length;
    console.log(`  ✓ ${spec.title.padEnd(16)} ${titles.length} questions`);
  }

  console.log(
    `\n✔ Imported ${questions} questions across ${topics} topics from ${REPO} (${LICENSE}).\n`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
