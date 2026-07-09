'use client';

import Link from 'next/link';
import type { Question } from '@/content/types';
import type { Role, Level, Difficulty, Round } from '@/lib/constants';
import { practiceLinks } from '@/lib/practice';
import { useSolved } from '@/lib/solved';
import { SolvedCheckbox } from './SolvedCheckbox';
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
  showRole = true,
}: {
  question: Question;
  href?: string;
  /** Hide the role when the surrounding context already states it. */
  showRole?: boolean;
}) {
  const links = practiceLinks(question.title, question.round as Round);
  const isSolved = useSolved().has(question.id);

  return (
    <article
      id={question.id}
      data-solved={isSolved}
      className={
        'glass-card group relative scroll-mt-24 rounded-xl p-4 ' +
        (isSolved ? 'border-easy/40' : '')
      }
    >
      <div className="flex items-start justify-between gap-3">
        {href ? (
          <Link
            href={href}
            className={
              'font-medium leading-snug after:absolute after:inset-0 ' +
              (isSolved ? 'text-muted' : 'text-fg')
            }
          >
            {question.title}
          </Link>
        ) : (
          <span
            className={
              'font-medium leading-snug ' + (isSolved ? 'text-muted' : 'text-fg')
            }
          >
            {question.title}
          </span>
        )}
        <SolvedCheckbox questionId={question.id} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {showRole ? <RoleBadge role={question.role as Role} /> : null}
        {/* Level always shows, so a reader can gauge who the question is aimed at. */}
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

      {links.length > 0 ? (
        <div className="relative z-10 mt-3 flex flex-wrap items-center gap-1.5 border-t border-line pt-2.5">
          <span className="eyebrow mr-0.5">Practice</span>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-0.5 font-mono text-xs text-muted transition-colors hover:border-brand/50 hover:text-brand"
            >
              {l.label}
              <span aria-hidden className="text-[0.6rem]">
                ↗
              </span>
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
