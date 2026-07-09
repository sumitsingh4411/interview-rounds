// Regenerates the browsable company/interview index inside README.md, between
// the CONTENT_INDEX markers. Reads content/*.md — safe, never writes content.
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const COMPANIES_DIR = join(ROOT, 'content', 'companies');
const INTERVIEWS_DIR = join(ROOT, 'content', 'interviews');
const README = join(ROOT, 'README.md');

const START = '<!-- CONTENT_INDEX:START -->';
const END = '<!-- CONTENT_INDEX:END -->';

const LEVEL_SHORT: Record<string, string> = {
  intern: 'Intern',
  junior: 'Junior',
  mid: 'Mid',
  senior: 'Senior',
  staff: 'Staff',
};
const ROLE_SHORT: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  fullstack: 'Full-stack',
};
const LEVEL_RANK = ['intern', 'junior', 'mid', 'senior', 'staff'];

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

  const interviews: Interview[] = mdFiles(INTERVIEWS_DIR).map((f) => {
    const { data } = matter(readFileSync(join(INTERVIEWS_DIR, f), 'utf8'));
    const rounds: { questions: unknown[] }[] = data.rounds ?? [];
    return {
      id: data.id,
      company: data.company,
      role: data.role,
      level: data.level,
      questionCount: rounds.reduce((n, r) => n + (r.questions?.length ?? 0), 0),
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

  const lines: string[] = [];
  lines.push(
    `**${companies.length} companies · ${interviews.length} interview experiences.** Every link below opens the raw Markdown — no website needed.`,
  );
  lines.push('');
  lines.push('| Company | Industry | Interview experiences |');
  lines.push('|---|---|---|');

  for (const c of companies) {
    const list = byCompany.get(c.slug) ?? [];
    const links = list
      .map(
        (iv) =>
          `[${LEVEL_SHORT[iv.level] ?? iv.level} · ${ROLE_SHORT[iv.role] ?? iv.role}](content/interviews/${iv.id}.md)`,
      )
      .join(' · ');
    const star = c.featured ? ' ⭐' : '';
    lines.push(
      `| **[${c.name}](content/companies/${c.slug}.md)**${star} | ${c.industry} | ${links || '—'} |`,
    );
  }

  lines.push('');
  lines.push('⭐ = featured on the home page.');

  const block = `${START}\n\n${lines.join('\n')}\n\n${END}`;

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

  // Keep the count badges in sync so they can never drift from the content.
  next = next
    .replace(/badge\/interviews-\d+-/, `badge/interviews-${interviews.length}-`)
    .replace(/badge\/companies-\d+-/, `badge/companies-${companies.length}-`)
    .replace(
      /badge\/questions-[\d%C,]+-/,
      `badge/questions-${questionTotal.toLocaleString('en-US').replace(/,/g, '%2C')}-`,
    );

  writeFileSync(README, next);
  console.log(
    `✔ README rebuilt: ${companies.length} companies, ${interviews.length} interviews, ${questionTotal} questions.`,
  );
}

main();
