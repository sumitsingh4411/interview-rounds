import Link from 'next/link';
import type { InterviewWithCounts } from '@/db/queries';
import {
  ROLE_LABELS,
  LEVEL_LABELS,
  type Role,
  type Level,
  type Outcome,
} from '@/lib/constants';
import { RoleBadge, LevelBadge, OutcomeBadge } from './ui/badges';

export function InterviewCard({
  interview,
}: {
  interview: InterviewWithCounts;
}) {
  const role = interview.role as Role;
  const level = interview.level as Level;
  const title =
    interview.title ?? `${LEVEL_LABELS[level]} · ${ROLE_LABELS[role]}`;

  return (
    <Link
      href={`/interviews/${interview.id}`}
      className="surface-card group flex flex-col rounded-2xl border border-line bg-surface p-5 hover:-translate-y-0.5 hover:border-line-2 hover:bg-surface-2"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <RoleBadge role={role} />
        <LevelBadge level={level} />
        <OutcomeBadge outcome={interview.outcome as Outcome} />
      </div>

      <h3 className="mt-3 font-display text-lg font-semibold text-fg">
        {title}
      </h3>
      {interview.summary ? (
        <p className="mt-1 line-clamp-2 text-sm text-muted">
          {interview.summary}
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <span className="eyebrow">
          {interview.roundCount} round{interview.roundCount === 1 ? '' : 's'} ·{' '}
          {interview.questionCount} question
          {interview.questionCount === 1 ? '' : 's'}
          {interview.year ? ` · ${interview.year}` : ''}
        </span>
        <span
          aria-hidden
          className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
        >
          →
        </span>
      </div>
    </Link>
  );
}
