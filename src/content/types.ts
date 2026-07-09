import type {
  Role,
  Level,
  Round,
  Difficulty,
  SourceType,
  Outcome,
} from '@/lib/constants';

export type Company = {
  id: string; // same as slug
  slug: string;
  name: string;
  description: string | null;
  industry: string | null;
  hq: string | null;
  /** Surfaced first on the home page. Set `featured: true` in frontmatter. */
  featured: boolean;
};

export type Question = {
  id: string;
  companyId: string; // company slug
  interviewId: string;
  title: string;
  body: string | null;
  role: Role;
  level: Level;
  round: Round;
  difficulty: Difficulty | null;
  tags: string[];
  sourceType: SourceType;
  sourceUrl: string | null;
  sourceAuthor: string | null;
};

export type Interview = {
  id: string;
  companyId: string; // company slug
  role: Role;
  level: Level;
  outcome: Outcome;
  title: string | null;
  summary: string | null;
  year: number | null;
  sourceType: SourceType;
  sourceUrl: string | null;
  sourceAuthor: string | null;
};

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
