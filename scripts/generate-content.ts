import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { COMPANIES } from './data/companies';
import { composeInterviews } from './data/bank';

const ROOT = process.cwd();
const CONTENT = join(ROOT, 'content');
const COMPANIES_DIR = join(CONTENT, 'companies');
const INTERVIEWS_DIR = join(CONTENT, 'interviews');
const SEARCH_INDEX = join(ROOT, 'public', 'search-index.json');

const INTERVIEWS_PER_COMPANY = 4;

type SearchEntry = {
  id: string;
  title: string;
  company: string;
  companySlug: string;
  interviewId: string;
  role: string;
  level: string;
  round: string;
  difficulty: string | null;
  tags: string[];
};

function reset() {
  if (existsSync(CONTENT)) rmSync(CONTENT, { recursive: true, force: true });
  mkdirSync(COMPANIES_DIR, { recursive: true });
  mkdirSync(INTERVIEWS_DIR, { recursive: true });
}

function main() {
  reset();
  const searchIndex: SearchEntry[] = [];
  let interviewCount = 0;
  let questionCount = 0;

  for (const company of COMPANIES) {
    // Company file — frontmatter + description as body.
    const companyMd = matter.stringify(company.description ?? '', {
      name: company.name,
      slug: company.slug,
      ...(company.featured ? { featured: true } : {}),
      industry: company.industry ?? null,
      hq: company.hq ?? null,
    });
    writeFileSync(join(COMPANIES_DIR, `${company.slug}.md`), companyMd);

    const composed = composeInterviews(company.slug, INTERVIEWS_PER_COMPANY);
    composed.forEach((iv, idx) => {
      const interviewId = `${company.slug}-${idx + 1}`;
      interviewCount += 1;

      // Structured rounds in frontmatter; summary as the markdown body.
      const rounds = iv.rounds.map((r) => ({
        round: r.round,
        questions: r.questions.map((q) => ({
          title: q.title,
          difficulty: q.difficulty ?? null,
          tags: q.tags ?? [],
        })),
      }));

      const interviewMd = matter.stringify(iv.summary ?? '', {
        id: interviewId,
        company: company.slug,
        role: iv.role,
        level: iv.level,
        outcome: iv.outcome,
        year: iv.year,
        source: 'curated',
        rounds,
      });
      writeFileSync(join(INTERVIEWS_DIR, `${interviewId}.md`), interviewMd);

      let qi = 0;
      for (const r of rounds) {
        for (const q of r.questions) {
          const id = `${interviewId}-q${qi}`;
          qi += 1;
          questionCount += 1;
          searchIndex.push({
            id,
            title: q.title,
            company: company.name,
            companySlug: company.slug,
            interviewId,
            role: iv.role,
            level: iv.level,
            round: r.round,
            difficulty: q.difficulty ?? null,
            tags: q.tags ?? [],
          });
        }
      }
    });
  }

  mkdirSync(join(ROOT, 'public'), { recursive: true });
  writeFileSync(SEARCH_INDEX, JSON.stringify(searchIndex));

  console.log(
    `\n✔ Generated content: ${COMPANIES.length} companies, ${interviewCount} interviews, ${questionCount} questions.`,
  );
  console.log(`  → content/companies, content/interviews, public/search-index.json\n`);
}

main();
