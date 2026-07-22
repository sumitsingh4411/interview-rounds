/**
 * ONE-TIME BOOTSTRAP. Regenerates every file in content/ from scripts/data/.
 * This OVERWRITES content/ — do not run it unless you mean to.
 */
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { COMPANIES } from './data/companies';
import { composeInterviews } from './data/bank';
import {
  renderInterview,
  renderCompany,
  type CompanyInterviewRow,
} from './lib/render';
import type { ParsedRound } from '../src/content/parse-rounds';

const ROOT = process.cwd();
const CONTENT = join(ROOT, 'content');
const COMPANIES_DIR = join(CONTENT, 'companies');
const INTERVIEWS_DIR = join(CONTENT, 'interviews');

const INTERVIEWS_PER_COMPANY = 5;

/**
 * Wipes ONLY the directories this script generates. `content/banks/` is imported
 * separately by `npm run import:bank` — deleting the whole content/ tree here
 * would silently destroy it.
 */
function reset() {
  for (const dir of [COMPANIES_DIR, INTERVIEWS_DIR]) {
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });
  }
}

function main() {
  reset();
  let interviewCount = 0;
  let questionCount = 0;

  for (const company of COMPANIES) {
    const composed = composeInterviews(
      company.slug,
      INTERVIEWS_PER_COMPANY,
      company.archetype,
    );
    const rows: CompanyInterviewRow[] = [];

    composed.forEach((iv, idx) => {
      const id = `${company.slug}-${idx + 1}`;
      const rounds: ParsedRound[] = iv.rounds.map((r) => ({
        round: r.round,
        questions: r.questions.map((q) => ({
          title: q.title,
          difficulty: q.difficulty ?? null,
          tags: q.tags ?? [],
        })),
      }));

      const md = renderInterview(
        {
          id,
          company: company.slug,
          role: iv.role,
          level: iv.level,
          outcome: iv.outcome,
          year: iv.year,
          source: 'curated',
          summary: iv.summary,
        },
        company.name,
        rounds,
      );
      writeFileSync(join(INTERVIEWS_DIR, `${id}.md`), md);

      const qCount = rounds.reduce((n, r) => n + r.questions.length, 0);
      interviewCount += 1;
      questionCount += qCount;

      rows.push({
        id,
        role: iv.role,
        level: iv.level,
        outcome: iv.outcome,
        roundCount: rounds.length,
        questionCount: qCount,
      });
    });

    const companyMd = renderCompany(
      {
        name: company.name,
        slug: company.slug,
        featured: company.featured,
        industry: company.industry ?? null,
        hq: company.hq ?? null,
        description: company.description ?? '',
      },
      rows,
    );
    writeFileSync(join(COMPANIES_DIR, `${company.slug}.md`), companyMd);
  }

  console.log(
    `\n✔ Generated content: ${COMPANIES.length} companies, ${interviewCount} interviews, ${questionCount} questions.\n`,
  );
}

main();
