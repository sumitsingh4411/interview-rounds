import 'server-only';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { parseRounds } from './parse-rounds';
import {
  LEVELS,
  ROUND_ORDER,
  type Role,
  type Level,
  type Round,
  type SourceType,
  type Outcome,
} from '@/lib/constants';
import type {
  Bank,
  Company,
  Interview,
  Question,
  CompanyWithStats,
  InterviewWithCounts,
  InterviewDetail,
  QuestionWithCompany,
} from './types';

const CONTENT = join(process.cwd(), 'content');
const COMPANIES_DIR = join(CONTENT, 'companies');
const INTERVIEWS_DIR = join(CONTENT, 'interviews');
const BANKS_DIR = join(CONTENT, 'banks');

type Dataset = {
  companies: Company[];
  companyBySlug: Map<string, Company>;
  interviews: Interview[];
  interviewById: Map<string, Interview>;
  questions: Question[];
  questionById: Map<string, Question>;
  questionsByInterview: Map<string, Question[]>;
  companyStats: Map<string, { interviewCount: number; questionCount: number }>;
};

let cache: Dataset | null = null;

function mdFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.md'));
}

function build(): Dataset {
  const companies: Company[] = [];
  const companyBySlug = new Map<string, Company>();
  for (const file of mdFiles(COMPANIES_DIR)) {
    const { data } = matter(readFileSync(join(COMPANIES_DIR, file), 'utf8'));
    const company: Company = {
      id: data.slug,
      slug: data.slug,
      name: data.name,
      description: data.description ?? null,
      industry: data.industry ?? null,
      hq: data.hq ?? null,
      featured: data.featured === true,
    };
    companies.push(company);
    companyBySlug.set(company.slug, company);
  }

  const interviews: Interview[] = [];
  const interviewById = new Map<string, Interview>();
  const questions: Question[] = [];
  const questionById = new Map<string, Question>();
  const questionsByInterview = new Map<string, Question[]>();

  for (const file of mdFiles(INTERVIEWS_DIR)) {
    const { data, content } = matter(
      readFileSync(join(INTERVIEWS_DIR, file), 'utf8'),
    );
    const interview: Interview = {
      id: data.id,
      companyId: data.company,
      role: data.role as Role,
      level: data.level as Level,
      outcome: data.outcome as Outcome,
      title: data.title ?? null,
      summary: data.summary ?? null,
      year: data.year ?? null,
      sourceType: (data.source ?? 'curated') as SourceType,
      sourceUrl: data.sourceUrl ?? null,
      sourceAuthor: data.sourceAuthor ?? null,
    };
    interviews.push(interview);
    interviewById.set(interview.id, interview);

    const rounds = parseRounds(content);
    const list: Question[] = [];
    let qi = 0;
    for (const r of rounds) {
      for (const q of r.questions) {
        const question: Question = {
          id: `${interview.id}-q${qi}`,
          companyId: interview.companyId,
          interviewId: interview.id,
          title: q.title,
          body: null,
          role: interview.role,
          level: interview.level,
          round: r.round,
          difficulty: q.difficulty ?? null,
          tags: q.tags ?? [],
          sourceType: interview.sourceType,
          sourceUrl: null,
          sourceAuthor: null,
        };
        qi += 1;
        questions.push(question);
        questionById.set(question.id, question);
        list.push(question);
      }
    }
    questionsByInterview.set(interview.id, list);
  }

  const companyStats = new Map<
    string,
    { interviewCount: number; questionCount: number }
  >();
  for (const c of companies) {
    companyStats.set(c.slug, { interviewCount: 0, questionCount: 0 });
  }
  for (const iv of interviews) {
    const s = companyStats.get(iv.companyId);
    if (s) s.interviewCount += 1;
  }
  for (const q of questions) {
    const s = companyStats.get(q.companyId);
    if (s) s.questionCount += 1;
  }

  return {
    companies,
    companyBySlug,
    interviews,
    interviewById,
    questions,
    questionById,
    questionsByInterview,
    companyStats,
  };
}

function data(): Dataset {
  if (!cache) cache = build();
  return cache;
}

const levelRank = (l: Level) => LEVELS.indexOf(l);
const roundRank = (r: Round) => ROUND_ORDER.indexOf(r);

function withStats(company: Company): CompanyWithStats {
  const s = data().companyStats.get(company.slug) ?? {
    interviewCount: 0,
    questionCount: 0,
  };
  return { ...company, ...s };
}

// -------------------------------------------------------------- Query API
export function getCompaniesWithStats(search?: string): CompanyWithStats[] {
  const q = search?.trim().toLowerCase();
  return data()
    .companies.filter((c) => !q || c.name.toLowerCase().includes(q))
    .map(withStats)
    .sort(
      (a, b) =>
        b.interviewCount - a.interviewCount || a.name.localeCompare(b.name),
    );
}

/** Featured companies first (marquee names), then the rest by volume. */
export function getPopularCompanies(limit = 8): CompanyWithStats[] {
  return getCompaniesWithStats()
    .slice()
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.interviewCount - a.interviewCount || a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

export function getCompanyBySlug(slug: string): Company | undefined {
  return data().companyBySlug.get(slug);
}

/**
 * Companies in the same industry, most-documented first, for internal linking.
 * Falls back to popular companies so a page never dead-ends with too few links
 * (which is exactly what leaves pages orphaned and uncrawled).
 */
export function getRelatedCompanies(
  slug: string,
  limit = 6,
): CompanyWithStats[] {
  const self = data().companyBySlug.get(slug);
  if (!self) return [];
  const all = getCompaniesWithStats();
  const sameIndustry = all
    .filter((c) => c.slug !== slug && c.industry === self.industry)
    .sort((a, b) => b.interviewCount - a.interviewCount || a.name.localeCompare(b.name));

  if (sameIndustry.length >= limit) return sameIndustry.slice(0, limit);

  const chosen = new Set(sameIndustry.map((c) => c.slug));
  chosen.add(slug);
  const filler = getPopularCompanies(limit + all.length)
    .filter((c) => !chosen.has(c.slug))
    .slice(0, limit - sameIndustry.length);
  return [...sameIndustry, ...filler];
}

export function getAllCompanySlugs(): string[] {
  return data().companies.map((c) => c.slug);
}

export function getAllInterviewIds(): string[] {
  return data().interviews.map((i) => i.id);
}

export function getInterviewsForCompany(
  companySlug: string,
): InterviewWithCounts[] {
  return data()
    .interviews.filter((i) => i.companyId === companySlug)
    .map((interview) => {
      const qs = data().questionsByInterview.get(interview.id) ?? [];
      const rounds = new Set(qs.map((q) => q.round));
      return {
        ...interview,
        questionCount: qs.length,
        roundCount: rounds.size,
      };
    })
    .sort(
      (a, b) =>
        levelRank(a.level) - levelRank(b.level) || a.role.localeCompare(b.role),
    );
}

export function getInterviewById(id: string): InterviewDetail | undefined {
  const interview = data().interviewById.get(id);
  if (!interview) return undefined;
  const company = data().companyBySlug.get(interview.companyId);
  if (!company) return undefined;
  const questions = data().questionsByInterview.get(id) ?? [];
  return { interview, company, questions };
}

export function getQuestionById(id: string): QuestionWithCompany | undefined {
  const question = data().questionById.get(id);
  if (!question) return undefined;
  const company = data().companyBySlug.get(question.companyId);
  if (!company) return undefined;
  return { question, company };
}

export function getRelatedQuestions(
  companySlug: string,
  round: Round,
  excludeId: string,
  limit = 5,
): Question[] {
  return data()
    .questions.filter(
      (q) =>
        q.companyId === companySlug && q.round === round && q.id !== excludeId,
    )
    .slice(0, limit);
}

export function getQuestionsByRound(
  round: Round,
  limit = 60,
): QuestionWithCompany[] {
  const out: QuestionWithCompany[] = [];
  for (const question of data().questions) {
    if (question.round !== round) continue;
    const company = data().companyBySlug.get(question.companyId);
    if (company) out.push({ question, company });
    if (out.length >= limit) break;
  }
  return out;
}

export function getTotals(): {
  companies: number;
  interviews: number;
  questions: number;
} {
  const d = data();
  return {
    companies: d.companies.length,
    interviews: d.interviews.length,
    questions: d.questions.length,
  };
}

/** Open-source topic banks, loaded once. */
let bankCache: Bank[] | null = null;

function banks(): Bank[] {
  if (bankCache) return bankCache;
  bankCache = mdFiles(BANKS_DIR).map((file) => {
    const { data, content } = matter(readFileSync(join(BANKS_DIR, file), 'utf8'));
    const parsed = parseRounds(content);
    const questions = (parsed[0]?.questions ?? []).map((q, i) => ({
      id: `${data.id}-q${i}`,
      title: q.title,
      round: data.round as Round,
    }));
    return {
      id: data.id,
      title: data.title,
      round: data.round as Round,
      role: data.role as Role,
      sourceRepo: data.sourceRepo,
      sourceUrl: data.sourceUrl,
      license: data.license,
      questions,
    };
  });
  return bankCache;
}

/** Topic banks that practise a given round. */
export function getBanksForRound(round: Round): Bank[] {
  return banks()
    .filter((b) => b.round === round)
    .sort((a, b) => b.questions.length - a.questions.length);
}

export function getRoundCounts(): Partial<Record<Round, number>> {
  const map: Partial<Record<Round, number>> = {};
  for (const q of data().questions) {
    map[q.round] = (map[q.round] ?? 0) + 1;
  }
  return map;
}

export { roundRank };
