import './env';
import { createHash } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { db } from '../src/db';
import { companies, questions } from '../src/db/schema';
import type { Role, Level, Round, Difficulty, SourceType } from '../src/lib/constants';

export { db, companies, questions };

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
  const existing = await db
    .select({ id: companies.id })
    .from(companies)
    .where(eq(companies.slug, c.slug))
    .limit(1);

  const values = {
    name: c.name,
    slug: c.slug,
    description: c.description ?? null,
    industry: c.industry ?? null,
    hq: c.hq ?? null,
    logoUrl: c.logoUrl ?? null,
  };

  if (existing[0]) {
    await db.update(companies).set(values).where(eq(companies.id, existing[0].id));
    return existing[0].id;
  }
  const inserted = await db
    .insert(companies)
    .values(values)
    .returning({ id: companies.id });
  return inserted[0].id;
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
