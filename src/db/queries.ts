import 'server-only';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { db } from './index';
import {
  companies,
  interviews,
  questions,
  type Company,
  type Interview,
  type Question,
} from './schema';
import type { Role, Level, Round } from '@/lib/constants';

export type CompanyWithStats = Company & {
  interviewCount: number;
  questionCount: number;
};
export type InterviewWithCounts = Interview & {
  questionCount: number;
  roundCount: number;
};
export type InterviewDetail = {
  interview: Interview;
  company: Company;
  questions: Question[];
};
export type QuestionWithCompany = { question: Question; company: Company };

const publishedInterviewCount = sql<number>`(select count(*)::int from ${interviews} where ${interviews.companyId} = ${companies.id} and ${interviews.status} = 'published')`;

/** All companies (optionally name-searched) with interview + question counts. */
export async function getCompaniesWithStats(
  search?: string,
): Promise<CompanyWithStats[]> {
  return db
    .select({
      id: companies.id,
      name: companies.name,
      slug: companies.slug,
      logoUrl: companies.logoUrl,
      description: companies.description,
      industry: companies.industry,
      hq: companies.hq,
      createdAt: companies.createdAt,
      interviewCount: publishedInterviewCount,
      questionCount: sql<number>`count(${questions.id})::int`,
    })
    .from(companies)
    .leftJoin(
      questions,
      and(eq(questions.companyId, companies.id), eq(questions.status, 'published')),
    )
    .where(search ? ilike(companies.name, `%${search}%`) : undefined)
    .groupBy(companies.id)
    .orderBy(desc(publishedInterviewCount), companies.name);
}

export async function getPopularCompanies(limit = 8): Promise<CompanyWithStats[]> {
  const rows = await getCompaniesWithStats();
  return rows.slice(0, limit);
}

export async function getAllCompanySlugs(): Promise<string[]> {
  const rows = await db.select({ slug: companies.slug }).from(companies);
  return rows.map((r) => r.slug);
}

export async function getAllInterviewIds(): Promise<number[]> {
  const rows = await db
    .select({ id: interviews.id })
    .from(interviews)
    .where(eq(interviews.status, 'published'));
  return rows.map((r) => r.id);
}

export async function getCompanyBySlug(slug: string): Promise<Company | undefined> {
  const rows = await db
    .select()
    .from(companies)
    .where(eq(companies.slug, slug))
    .limit(1);
  return rows[0];
}

/** Interview experiences at a company, with round + question counts. */
export async function getInterviewsForCompany(
  companyId: number,
): Promise<InterviewWithCounts[]> {
  return db
    .select({
      id: interviews.id,
      companyId: interviews.companyId,
      role: interviews.role,
      level: interviews.level,
      outcome: interviews.outcome,
      title: interviews.title,
      summary: interviews.summary,
      year: interviews.year,
      sourceType: interviews.sourceType,
      sourceUrl: interviews.sourceUrl,
      sourceAuthor: interviews.sourceAuthor,
      status: interviews.status,
      contentHash: interviews.contentHash,
      createdAt: interviews.createdAt,
      questionCount: sql<number>`count(${questions.id})::int`,
      roundCount: sql<number>`count(distinct ${questions.round})::int`,
    })
    .from(interviews)
    .leftJoin(
      questions,
      and(
        eq(questions.interviewId, interviews.id),
        eq(questions.status, 'published'),
      ),
    )
    .where(
      and(eq(interviews.companyId, companyId), eq(interviews.status, 'published')),
    )
    .groupBy(interviews.id)
    .orderBy(interviews.level, interviews.role);
}

export async function getInterviewById(
  id: number,
): Promise<InterviewDetail | undefined> {
  const rows = await db
    .select({ interview: interviews, company: companies })
    .from(interviews)
    .innerJoin(companies, eq(interviews.companyId, companies.id))
    .where(eq(interviews.id, id))
    .limit(1);
  if (!rows[0]) return undefined;

  const qs = await db
    .select()
    .from(questions)
    .where(
      and(eq(questions.interviewId, id), eq(questions.status, 'published')),
    )
    .orderBy(desc(questions.upvotes), desc(questions.createdAt));

  return { interview: rows[0].interview, company: rows[0].company, questions: qs };
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
