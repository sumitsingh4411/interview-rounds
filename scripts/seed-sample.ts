import {
  resetContent,
  upsertCompany,
  insertInterview,
  insertInterviewQuestions,
  type InterviewQuestionRow,
} from './_shared';
import { COMPANIES } from './data/companies';
import { composeInterviews } from './data/bank';

const INTERVIEWS_PER_COMPANY = 4;

async function main() {
  console.log('Resetting existing content…');
  await resetContent();

  let companyCount = 0;
  let interviewCount = 0;
  let questionCount = 0;

  for (const company of COMPANIES) {
    const companyId = await upsertCompany(company);
    companyCount += 1;

    const composed = composeInterviews(company.slug, INTERVIEWS_PER_COMPANY);
    for (const iv of composed) {
      const interviewId = await insertInterview({
        companyId,
        role: iv.role,
        level: iv.level,
        outcome: iv.outcome,
        summary: iv.summary,
        year: iv.year,
        sourceType: 'curated',
      });
      interviewCount += 1;

      const rows: InterviewQuestionRow[] = iv.rounds.flatMap((round) =>
        round.questions.map((q) => ({
          companyId,
          interviewId,
          round: round.round,
          role: iv.role,
          level: iv.level,
          title: q.title,
          difficulty: q.difficulty ?? null,
          tags: q.tags ?? [],
          sourceType: 'curated' as const,
        })),
      );
      await insertInterviewQuestions(rows);
      questionCount += rows.length;
    }
    console.log(`  ✓ ${company.name} (${composed.length} interviews)`);
  }

  console.log(
    `\n✔ Seed complete: ${companyCount} companies, ${interviewCount} interviews, ${questionCount} questions.`,
  );
  // Flush stdout before exiting (process.exit can truncate buffered writes).
  await new Promise((r) => setTimeout(r, 150));
  process.exit(0);
}

main().catch((err) => {
  console.error('SEED FAILED:', err);
  process.exit(1);
});
