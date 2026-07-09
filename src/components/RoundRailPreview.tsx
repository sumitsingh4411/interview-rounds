'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ROUND_ORDER,
  ROUND_LABELS,
  ROUND_DESCRIPTIONS,
  type Round,
} from '@/lib/constants';

// Eye-catching, cohesive accent gradient for the active round.
const ACTIVE_GRADIENT = 'linear-gradient(135deg, #22d3ee, #818cf8 55%, #c084fc)';

export function RoundRailPreview({
  counts,
}: {
  counts?: Partial<Record<Round, number>>;
}) {
  const [active, setActive] = useState(0);
  const n = ROUND_ORDER.length;
  const activeRound = ROUND_ORDER[active];
  const activeCount = counts?.[activeRound];

  return (
    <div className="glass rounded-[1.75rem] p-6">
      <div>
        <div className="mb-5 flex items-center justify-between">
          <p className="eyebrow">A typical loop</p>
          <span className="hidden font-mono text-[0.65rem] text-faint sm:inline">
            hover a round ↓
          </span>
        </div>

        {/* The rail */}
        <div className="relative">
          {/* base spine */}
          <span
            aria-hidden
            className="absolute top-6 bottom-6 w-px bg-line"
            style={{ left: '30px' }}
          />
          {/* progress spine — single smooth element, no popping */}
          <span
            aria-hidden
            className="absolute top-6 w-px transition-[height] duration-700 ease-out"
            style={{
              left: '30px',
              height: `calc((100% - 48px) * ${active / (n - 1)})`,
              backgroundImage: ACTIVE_GRADIENT,
            }}
          />

          <ol className="relative space-y-0.5">
            {ROUND_ORDER.map((round, i) => {
              const isActive = i === active;
              return (
                <li key={round}>
                  <Link
                    href={`/rounds/${round}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex items-center gap-4 rounded-xl px-3 py-1.5 transition-colors hover:bg-surface-2/60"
                  >
                    <span
                      aria-hidden
                      className={
                        'relative grid h-9 w-9 shrink-0 place-items-center rounded-full border bg-surface font-mono text-xs transition-colors duration-300 ' +
                        (isActive
                          ? 'rail-node-glow border-transparent'
                          : 'border-line-2 text-faint group-hover:border-brand/50')
                      }
                    >
                      {/* gradient fill fades in only for the active node */}
                      <span
                        className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-500 ease-out"
                        style={{
                          backgroundImage: ACTIVE_GRADIENT,
                          opacity: isActive ? 1 : 0,
                        }}
                      />
                      <span
                        className="relative z-10"
                        style={isActive ? { color: '#0b0e14' } : undefined}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </span>
                    <span
                      className={
                        'flex-1 text-[0.95rem] transition-colors duration-300 ' +
                        (isActive
                          ? 'font-medium text-fg'
                          : 'text-muted group-hover:text-fg')
                      }
                    >
                      {ROUND_LABELS[round]}
                    </span>
                    {counts?.[round] !== undefined ? (
                      <span
                        className={
                          'font-mono text-xs transition-colors duration-300 ' +
                          (isActive ? 'text-brand' : 'text-faint')
                        }
                      >
                        {counts[round]}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Detail panel — fixed min-height so scrubbing never shifts layout */}
        <div className="mt-5 min-h-[7rem] rounded-2xl border border-line bg-canvas/40 p-4">
          <div key={activeRound} className="animate-fade-in">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-sm font-semibold text-fg">
                {ROUND_LABELS[activeRound]}
              </h3>
              {activeCount !== undefined ? (
                <span className="shrink-0 font-mono text-[0.65rem] text-faint">
                  {activeCount} questions
                </span>
              ) : null}
            </div>
            <p className="mt-1.5 text-sm text-muted">
              {ROUND_DESCRIPTIONS[activeRound]}
            </p>
            <Link
              href={`/rounds/${activeRound}`}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand transition-all hover:gap-2 hover:underline"
            >
              Explore {ROUND_LABELS[activeRound]} questions
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
