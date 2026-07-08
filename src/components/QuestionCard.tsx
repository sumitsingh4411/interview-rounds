import Link from 'next/link';
import { type ReactNode } from 'react';
import type { Question } from '@/db/schema';
import type { Role, Level, Difficulty } from '@/lib/constants';
import {
  RoleBadge,
  LevelBadge,
  DifficultyBadge,
  SourceBadge,
  Tag,
} from './ui/badges';

export function QuestionCard({
  question,
  actions,
}: {
  question: Question;
  actions?: ReactNode;
}) {
  return (
    <article className="group relative rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-2 hover:bg-surface-2">
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/questions/${question.id}`}
          className="font-medium leading-snug text-fg after:absolute after:inset-0"
        >
          {question.title}
        </Link>
        {actions ? (
          <div className="relative z-10 shrink-0">{actions}</div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <RoleBadge role={question.role as Role} />
        <LevelBadge level={question.level as Level} />
        {question.difficulty ? (
          <DifficultyBadge difficulty={question.difficulty as Difficulty} />
        ) : null}
        <span className="relative z-10">
          <SourceBadge
            sourceType={question.sourceType}
            sourceUrl={question.sourceUrl}
          />
        </span>
      </div>

      {question.tags.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {question.tags.slice(0, 5).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      ) : null}
    </article>
  );
}
