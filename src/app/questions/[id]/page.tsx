import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Container } from '@/components/ui/Container';
import { QuestionCard } from '@/components/QuestionCard';
import {
  RoleBadge,
  LevelBadge,
  DifficultyBadge,
  SourceBadge,
  Tag,
} from '@/components/ui/badges';
import { getQuestionById, getRelatedQuestions } from '@/db/queries';
import { ROUND_LABELS, type Role, type Level, type Difficulty } from '@/lib/constants';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const row = await getQuestionById(Number(id));
  if (!row) return { title: 'Question not found' };
  return {
    title: row.question.title,
    description: `${ROUND_LABELS[row.question.round]} question asked at ${row.company.name}.`,
  };
}

export default async function QuestionPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const row = await getQuestionById(numericId);
  if (!row) notFound();

  const { question, company } = row;
  const related = await getRelatedQuestions(
    company.id,
    question.round,
    question.id,
  );

  return (
    <Container className="max-w-3xl py-12">
      <nav className="mb-6 text-sm">
        <Link href={`/companies/${company.slug}`} className="text-brand hover:underline">
          ← {company.name}
        </Link>
        <span className="mx-2 text-faint">/</span>
        <span className="font-mono text-xs text-faint">
          {ROUND_LABELS[question.round]}
        </span>
      </nav>

      <h1 className="text-balance font-display text-2xl font-bold text-fg sm:text-3xl">
        {question.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <RoleBadge role={question.role as Role} />
        <LevelBadge level={question.level as Level} />
        {question.difficulty ? (
          <DifficultyBadge difficulty={question.difficulty as Difficulty} />
        ) : null}
        <SourceBadge
          sourceType={question.sourceType}
          sourceUrl={question.sourceUrl}
        />
      </div>

      {question.interviewId ? (
        <Link
          href={`/interviews/${question.interviewId}`}
          className="mt-4 inline-block text-sm text-brand hover:underline"
        >
          View the full interview →
        </Link>
      ) : null}

      {question.body ? (
        <div className="prose-loop mt-8">
          <ReactMarkdown>{question.body}</ReactMarkdown>
        </div>
      ) : (
        <p className="mt-8 rounded-xl border border-line bg-surface p-5 text-muted">
          No write-up yet for this one — the question itself is what came up in
          this round.
        </p>
      )}

      {question.tags.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {question.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      ) : null}

      {question.sourceType === 'ai' ? (
        <p className="mt-8 rounded-lg border border-line bg-surface-2 p-3 font-mono text-xs text-faint">
          ✦ This is an AI-generated question likely to appear in this round. It
          reflects patterns, not a verified individual experience.
        </p>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-14">
          <p className="eyebrow">More {ROUND_LABELS[question.round]} at {company.name}</p>
          <ul className="mt-4 space-y-3">
            {related.map((q) => (
              <li key={q.id}>
                <QuestionCard question={q} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Container>
  );
}
