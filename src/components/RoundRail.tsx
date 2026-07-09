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
              {/*
                Questions branch off the round: a sub-spine with a dot per
                question, and a short tick connecting each dot to its card.
              */}
              <ul className="relative mt-4 space-y-3 pl-7">
                <span
                  aria-hidden
                  className="absolute top-3 bottom-6 left-[3px] w-px"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgb(${c.rgb} / 0.55), var(--line))`,
                  }}
                />
                {group.questions.map((q) => (
                  <li key={q.id} className="relative">
                    {/* dot on the sub-spine, aligned with the question title */}
                    <span
                      aria-hidden
                      className="absolute top-[23px] -left-7 h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: c.from,
                        boxShadow: `0 0 0 3px rgb(${c.rgb} / 0.14)`,
                      }}
                    />
                    {/* tick from the dot across to the card */}
                    <span
                      aria-hidden
                      className="absolute top-[26px] -left-[22px] h-px w-[22px]"
                      style={{
                        backgroundImage: `linear-gradient(to right, rgb(${c.rgb} / 0.5), var(--line))`,
                      }}
                    />
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
