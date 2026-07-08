import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Container } from '@/components/ui/Container';
import { RoundRail } from '@/components/RoundRail';
import {
  RoleBadge,
  LevelBadge,
  OutcomeBadge,
  SourceBadge,
} from '@/components/ui/badges';
import { getInterviewById } from '@/db/queries';
import { groupQuestionsByRound } from '@/lib/questions';
import {
  ROLE_LABELS,
  LEVEL_LABELS,
  type Role,
  type Level,
  type Outcome,
} from '@/lib/constants';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

function interviewTitle(
  title: string | null,
  role: Role,
  level: Level,
  companyName: string,
): string {
  return title ?? `${LEVEL_LABELS[level]} ${ROLE_LABELS[role]} at ${companyName}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const detail = await getInterviewById(Number(id));
  if (!detail) return { title: 'Interview not found' };
  const { interview, company } = detail;
  return {
    title: interviewTitle(
      interview.title,
      interview.role as Role,
      interview.level as Level,
      company.name,
    ),
    description: `A ${LEVEL_LABELS[interview.level as Level]} ${ROLE_LABELS[interview.role as Role]} interview experience at ${company.name}, round by round.`,
  };
}

export default async function InterviewPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const detail = await getInterviewById(numericId);
  if (!detail) notFound();

  const { interview, company, questions } = detail;
  const groups = groupQuestionsByRound(questions);
  const role = interview.role as Role;
  const level = interview.level as Level;

  return (
    <Container className="max-w-3xl py-12">
      <nav className="mb-6 text-sm">
        <Link
          href={`/companies/${company.slug}`}
          className="text-brand hover:underline"
        >
          ← {company.name}
        </Link>
      </nav>

      <h1 className="text-balance font-display text-2xl font-bold text-fg sm:text-3xl">
        {interviewTitle(interview.title, role, level, company.name)}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <RoleBadge role={role} />
        <LevelBadge level={level} />
        <OutcomeBadge outcome={interview.outcome as Outcome} />
        <SourceBadge
          sourceType={interview.sourceType}
          sourceUrl={interview.sourceUrl}
        />
        {interview.year ? (
          <span className="font-mono text-xs text-faint">· {interview.year}</span>
        ) : null}
      </div>

      {interview.summary ? (
        <div className="prose-loop mt-6">
          <ReactMarkdown>{interview.summary}</ReactMarkdown>
        </div>
      ) : null}

      <div className="mt-10">
        <p className="eyebrow mb-6">The loop · {groups.length} rounds</p>
        {groups.length > 0 ? (
          <RoundRail groups={groups} />
        ) : (
          <p className="rounded-xl border border-line bg-surface p-6 text-muted">
            No questions recorded for this interview yet.
          </p>
        )}
      </div>

      {interview.sourceType === 'curated' ? (
        <p className="mt-10 rounded-lg border border-line bg-surface-2 p-3 font-mono text-xs text-faint">
          ◆ This experience is composed from commonly reported questions for this
          role and level. Real, individually-shared interviews will be layered in
          over time.
        </p>
      ) : null}
    </Container>
  );
}
