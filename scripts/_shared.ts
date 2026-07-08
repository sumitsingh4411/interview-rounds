import './env';
import { createHash } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '../src/db';
import { companies, interviews, questions } from '../src/db/schema';
import type {
  Role,
  Level,
  Round,
  Difficulty,
  SourceType,
  Outcome,
} from '../src/lib/constants';

export { db, companies, interviews, questions };

export type SeedCompany = {
  name: string;
  slug: string;
  description?: string;
  industry?: string;
  hq?: string;
  logoUrl?: string;
};

export type SeedQuestion = {
  title: string;
  body?: string;
  role: Role;
  level: Level;
  round: Round;
  difficulty?: Difficulty;
  tags?: string[];
  sourceType: SourceType;
  sourceUrl?: string;
  sourceAuthor?: string;
};

/** Stable 32-char hash used as questions.content_hash for idempotent upserts. */
export function contentHash(companyId: number, q: SeedQuestion): string {
  return createHash('sha256')
    .update(
      [companyId, q.role, q.level, q.round, q.title]
        .map((p) => String(p).trim().toLowerCase())
        .join('||'),
    )
    .digest('hex')
    .slice(0, 32);
}

/** Insert or update a company by slug; returns its id. */
export async function upsertCompany(c: SeedCompany): Promise<number> {
  const existing = await withRetry(
    () =>
      db
        .select({ id: companies.id })
        .from(companies)
        .where(eq(companies.slug, c.slug))
        .limit(1),
    'select company',
  );

  const values = {
    name: c.name,
    slug: c.slug,
    description: c.description ?? null,
    industry: c.industry ?? null,
    hq: c.hq ?? null,
    logoUrl: c.logoUrl ?? null,
  };

  if (existing[0]) {
    await withRetry(
      () => db.update(companies).set(values).where(eq(companies.id, existing[0].id)),
      'update company',
    );
    return existing[0].id;
  }
  const inserted = await withRetry(
    () => db.insert(companies).values(values).returning({ id: companies.id }),
    'insert company',
  );
  return inserted[0].id;
}

/** Retry a DB op through transient neon-http/network hiccups. */
export async function withRetry<T>(fn: () => Promise<T>, label = 'db op'): Promise<T> {
  const delays = [200, 500, 1200, 2500];
  let lastErr: unknown;
  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < delays.length) {
        await new Promise((r) => setTimeout(r, delays[attempt]));
      }
    }
  }
  throw new Error(
    `${label} failed after retries: ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`,
  );
}

/** Delete all content (questions → interviews → companies) for a clean reseed. */
export async function resetContent(): Promise<void> {
  await withRetry(() => db.delete(questions), 'reset questions');
  await withRetry(() => db.delete(interviews), 'reset interviews');
  await withRetry(() => db.delete(companies), 'reset companies');
}

export async function insertInterview(row: {
  companyId: number;
  role: Role;
  level: Level;
  outcome: Outcome;
  title?: string | null;
  summary?: string | null;
  year?: number | null;
  sourceType: SourceType;
  sourceUrl?: string | null;
  sourceAuthor?: string | null;
}): Promise<number> {
  const res = await withRetry(
    () =>
      db
        .insert(interviews)
        .values({
          companyId: row.companyId,
          role: row.role,
          level: row.level,
          outcome: row.outcome,
          title: row.title ?? null,
          summary: row.summary ?? null,
          year: row.year ?? null,
          sourceType: row.sourceType,
          sourceUrl: row.sourceUrl ?? null,
          sourceAuthor: row.sourceAuthor ?? null,
          status: 'published',
        })
        .returning({ id: interviews.id }),
    'insert interview',
  );
  return res[0].id;
}

export type InterviewQuestionRow = {
  companyId: number;
  interviewId: number;
  round: Round;
  role: Role;
  level: Level;
  title: string;
  difficulty?: Difficulty | null;
  tags?: string[];
  sourceType: SourceType;
};

/** Batch-insert all questions for an interview in a single statement. */
export async function insertInterviewQuestions(
  rows: InterviewQuestionRow[],
): Promise<void> {
  if (rows.length === 0) return;
  await withRetry(
    () =>
      db.insert(questions).values(
        rows.map((row) => ({
          companyId: row.companyId,
          interviewId: row.interviewId,
          title: row.title,
          body: null,
          role: row.role,
          level: row.level,
          round: row.round,
          difficulty: row.difficulty ?? null,
          tags: row.tags ?? [],
          sourceType: row.sourceType,
          isVerified: false,
          status: 'published' as const,
          contentHash: null,
        })),
      ),
    'insert questions',
  );
}

/**
 * Insert a question if its content hash is new. Returns whether it was inserted.
 * Idempotent: re-running a seed never duplicates rows.
 */
export async function upsertQuestion(
  companyId: number,
  q: SeedQuestion,
): Promise<boolean> {
  const hash = contentHash(companyId, q);
  const res = await db
    .insert(questions)
    .values({
      companyId,
      title: q.title,
      body: q.body ?? null,
      role: q.role,
      level: q.level,
      round: q.round,
      difficulty: q.difficulty ?? null,
      tags: q.tags ?? [],
      sourceType: q.sourceType,
      sourceUrl: q.sourceUrl ?? null,
      sourceAuthor: q.sourceAuthor ?? null,
      isVerified: q.sourceType === 'community',
      status: 'published',
      contentHash: hash,
    })
    .onConflictDoNothing({ target: questions.contentHash })
    .returning({ id: questions.id });
  return res.length > 0;
}
