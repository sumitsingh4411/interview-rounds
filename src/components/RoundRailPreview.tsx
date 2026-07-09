'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ROUND_ORDER,
  ROUND_LABELS,
  ROUND_DESCRIPTIONS,
  type Round,
} from '@/lib/constants';

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
    <div className="rounded-[1.75rem] bg-gradient-to-b from-line-2/60 to-line/40 p-px shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)]">
      <div className="rounded-[calc(1.75rem-1px)] bg-gradient-to-b from-surface to-surface/70 p-6 backdrop-blur-xl">
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
          {/* progress spine */}
          <span
            aria-hidden
            className="absolute top-6 w-px bg-gradient-to-b from-brand to-brand-2 transition-[height] duration-500 ease-out"
            style={{
              left: '30px',
              height: `calc((100% - 48px) * ${active / (n - 1)})`,
            }}
          />

          <ol className="relative space-y-0.5">
            {ROUND_ORDER.map((round, i) => {
              const done = i <= active;
              const isActive = i === active;
              return (
                <li key={round}>
                  <Link
                    href={`/rounds/${round}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex items-center gap-4 rounded-xl px-3 py-1.5 transition-colors hover:bg-surface-2/70"
                  >
                    <span
                      aria-hidden
                      className={
                        'grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-xs transition-all duration-300 ' +
                        (done
                          ? 'bg-gradient-to-br from-brand to-brand-2 text-on-brand'
                          : 'border border-line-2 bg-surface text-faint group-hover:border-brand/50')
                      }
                      style={
                        isActive
                          ? { boxShadow: '0 0 0 5px rgb(var(--glow) / 0.18)' }
                          : undefined
                      }
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={
                        'flex-1 text-[0.95rem] transition-colors ' +
                        (isActive
                          ? 'font-medium text-fg'
                          : 'text-muted group-hover:text-fg')
                      }
                    >
                      {ROUND_LABELS[round]}
                    </span>
                    {counts?.[round] !== undefined ? (
                      <span className="font-mono text-xs text-faint">
                        {counts[round]}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Detail panel */}
        <div className="mt-5 rounded-2xl border border-line bg-canvas/40 p-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-sm font-semibold text-fg">
              {ROUND_LABELS[activeRound]}
            </h3>
            {activeCount !== undefined ? (
              <span className="font-mono text-[0.65rem] text-faint">
                {activeCount} questions
              </span>
            ) : null}
          </div>
          <p className="mt-1.5 text-sm text-muted">
            {ROUND_DESCRIPTIONS[activeRound]}
          </p>
          <Link
            href={`/rounds/${activeRound}`}
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand hover:gap-2 hover:underline"
          >
            Explore {ROUND_LABELS[activeRound]} questions
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
