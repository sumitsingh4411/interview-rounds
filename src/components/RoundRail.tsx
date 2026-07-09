import type { CSSProperties } from 'react';
import { ROUND_LABELS, ROUND_DESCRIPTIONS, ROUND_COLORS } from '@/lib/constants';
import type { RoundGroup } from '@/lib/questions';
import { QuestionCard } from './QuestionCard';

/**
 * The signature element: this interview's rounds as a connected vertical
 * pipeline. Rounds are numbered in the order they happened in this loop.
 *
 * Each section scopes `--glow` to its round's colour, so the node, the title
 * on hover, and every question card's hover glow all pick it up.
 */
export function RoundRail({ groups }: { groups: RoundGroup[] }) {
  return (
    <div className="rail space-y-10">
      {groups.map((group, i) => {
        const step = String(i + 1).padStart(2, '0');
        const c = ROUND_COLORS[group.round];
        return (
          <section
            key={group.round}
            className="round-section flex gap-4 sm:gap-5"
            style={
              {
                ['--glow']: c.rgb,
                ['--round-color']: c.from,
              } as CSSProperties
            }
          >
            <div
              className="rail-node"
              data-active="true"
              aria-hidden
              style={{
                backgroundImage: `linear-gradient(135deg, ${c.from}, ${c.to})`,
                color: '#0b0e14',
              }}
            >
              {step}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <header>
                <p className="eyebrow">
                  Round {step} · {group.questions.length} question
                  {group.questions.length === 1 ? '' : 's'}
                </p>
                <h3 className="round-title mt-1 text-lg text-fg transition-colors duration-300">
                  {ROUND_LABELS[group.round]}
                </h3>
                <p className="mt-0.5 text-sm text-muted">
                  {ROUND_DESCRIPTIONS[group.round]}
                </p>
              </header>
              <ul className="mt-4 space-y-3">
                {group.questions.map((q) => (
                  <li key={q.id}>
                    {/* Role is stated in the page title; level stays visible. */}
                    <QuestionCard question={q} showRole={false} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
  );
}
