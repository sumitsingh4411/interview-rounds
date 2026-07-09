import Link from 'next/link';
import type { Question } from '@/content/types';
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
  href,
  showRoleLevel = true,
}: {
  question: Question;
  href?: string;
  /** Hide role/level when the surrounding context already states them. */
  showRoleLevel?: boolean;
}) {
  return (
    <article className="glass-card group relative rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        {href ? (
          <Link
            href={href}
            className="font-medium leading-snug text-fg after:absolute after:inset-0"
          >
            {question.title}
          </Link>
        ) : (
          <span className="font-medium leading-snug text-fg">
            {question.title}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {showRoleLevel ? (
          <>
            <RoleBadge role={question.role as Role} />
            <LevelBadge level={question.level as Level} />
          </>
        ) : null}
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
