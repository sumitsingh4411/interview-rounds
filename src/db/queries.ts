import 'server-only';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { db } from './index';
import { companies, questions, type Company, type Question } from './schema';
import type { Role, Level, Round } from '@/lib/constants';

export type CompanyWithStats = Company & { questionCount: number };
export type QuestionWithCompany = { question: Question; company: Company };

/** All companies (optionally name-searched) with published-question counts. */
export async function getCompaniesWithStats(
  search?: string,
): Promise<CompanyWithStats[]> {
  const rows = await db
    .select({
      id: companies.id,
      name: companies.name,
      slug: companies.slug,
      logoUrl: companies.logoUrl,
      description: companies.description,
      industry: companies.industry,
      hq: companies.hq,
      createdAt: companies.createdAt,
      questionCount: sql<number>`count(${questions.id})::int`,
    })
    .from(companies)
    .leftJoin(
      questions,
      and(eq(questions.companyId, companies.id), eq(questions.status, 'published')),
    )
    .where(search ? ilike(companies.name, `%${search}%`) : undefined)
    .groupBy(companies.id)
    .orderBy(desc(sql`count(${questions.id})`), companies.name);
  return rows;
}

/** Top N companies by published-question count, for the home page. */
export async function getPopularCompanies(limit = 8): Promise<CompanyWithStats[]> {
  const rows = await getCompaniesWithStats();
  return rows.slice(0, limit);
}

export async function getCompanyBySlug(slug: string): Promise<Company | undefined> {
  const rows = await db
    .select()
    .from(companies)
    .where(eq(companies.slug, slug))
    .limit(1);
  return rows[0];
}

/** All published questions for a company; page filters/groups them in memory. */
export async function getQuestionsForCompany(
  companyId: number,
): Promise<Question[]> {
  return db
    .select()
    .from(questions)
    .where(
      and(eq(questions.companyId, companyId), eq(questions.status, 'published')),
    )
    .orderBy(desc(questions.upvotes), desc(questions.createdAt));
}

export async function getQuestionById(
  id: number,
): Promise<QuestionWithCompany | undefined> {
  const rows = await db
    .select({ question: questions, company: companies })
    .from(questions)
    .innerJoin(companies, eq(questions.companyId, companies.id))
    .where(eq(questions.id, id))
    .limit(1);
  return rows[0];
}

/** Other published questions in the same company + round (for "related"). */
export async function getRelatedQuestions(
  companyId: number,
  round: Round,
  excludeId: number,
  limit = 5,
): Promise<Question[]> {
  return db
    .select()
    .from(questions)
    .where(
      and(
        eq(questions.companyId, companyId),
        eq(questions.round, round),
        eq(questions.status, 'published'),
        sql`${questions.id} <> ${excludeId}`,
      ),
    )
    .orderBy(desc(questions.upvotes))
    .limit(limit);
}

export type SearchFilter = { role?: Role; level?: Level; round?: Round };

/** Full-text search across published questions using Postgres tsvector. */
export async function searchQuestions(
  query: string,
  filter: SearchFilter = {},
  limit = 50,
): Promise<QuestionWithCompany[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const tsQuery = sql`websearch_to_tsquery('english', ${trimmed})`;
  const document = sql`to_tsvector('english', ${questions.title} || ' ' || coalesce(${questions.body}, ''))`;

  const conds = [eq(questions.status, 'published'), sql`${document} @@ ${tsQuery}`];
  if (filter.role) conds.push(eq(questions.role, filter.role));
  if (filter.level) conds.push(eq(questions.level, filter.level));
  if (filter.round) conds.push(eq(questions.round, filter.round));

  return db
    .select({ question: questions, company: companies })
    .from(questions)
    .innerJoin(companies, eq(questions.companyId, companies.id))
    .where(and(...conds))
    .orderBy(desc(sql`ts_rank(${document}, ${tsQuery})`))
    .limit(limit);
}
