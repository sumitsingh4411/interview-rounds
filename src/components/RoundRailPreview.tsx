'use client';

import Link from 'next/link';
import { useState, type CSSProperties } from 'react';
import {
  ROUND_ORDER,
  ROUND_LABELS,
  ROUND_DESCRIPTIONS,
  ROUND_COLORS,
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
  const color = ROUND_COLORS[activeRound];

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
          {/* progress spine — intensifies toward the active round */}
          <span
            aria-hidden
            className="absolute top-6 w-px transition-all duration-700 ease-out"
            style={{
              left: '30px',
              height: `calc((100% - 48px) * ${active / (n - 1)})`,
              backgroundImage: `linear-gradient(to bottom, rgb(${color.rgb} / 0.25), ${color.from})`,
            }}
          />

          <ol className="relative space-y-0.5">
            {ROUND_ORDER.map((round, i) => {
              const isActive = i === active;
              const c = ROUND_COLORS[round];
              return (
                <li key={round}>
                  <Link
                    href={`/rounds/${round}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex items-center gap-4 rounded-xl px-3 py-1.5 transition-colors"
                    style={
                      isActive
                        ? { backgroundColor: `rgb(${c.rgb} / 0.07)` }
                        : undefined
                    }
                  >
                    <span
                      aria-hidden
                      className={
                        'relative grid h-9 w-9 shrink-0 place-items-center rounded-full border bg-surface font-mono text-xs transition-colors duration-300 ' +
                        (isActive
                          ? 'rail-node-glow border-transparent'
                          : 'border-line-2 text-faint')
                      }
                      // Drive the pulse keyframe with this round's colour.
                      style={
                        isActive
                          ? ({ ['--glow']: c.rgb } as CSSProperties)
                          : undefined
                      }
                    >
                      {/* gradient fill fades in only for the active node */}
                      <span
                        className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-500 ease-out"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${c.from}, ${c.to})`,
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
                        className="font-mono text-xs transition-colors duration-300"
                        style={{
                          color: isActive ? c.from : 'var(--faint)',
                        }}
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

        {/*
          Fixed height, and every child is width-stable:
            - title truncates to one line
            - description is clamped to two lines (space always reserved)
            - the CTA text is constant, so it can never wrap
          Any growth here would resize the hero grid and shove the left column
          around as you scrub the rail. Locked so that can't happen.
        */}
        <div
          className="mt-5 h-[8.5rem] overflow-hidden rounded-2xl border bg-canvas/40 p-4 transition-colors duration-300"
          style={{ borderColor: `rgb(${color.rgb} / 0.28)` }}
        >
          <div key={activeRound} className="animate-fade-in">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="flex min-w-0 items-center gap-2 font-display text-sm font-semibold text-fg">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: color.from,
                    boxShadow: `0 0 8px 1px rgb(${color.rgb} / 0.7)`,
                  }}
                />
                <span className="truncate">{ROUND_LABELS[activeRound]}</span>
              </h3>
              {activeCount !== undefined ? (
                <span className="shrink-0 font-mono text-[0.65rem] text-faint">
                  {activeCount} questions
                </span>
              ) : null}
            </div>

            <p className="mt-1.5 line-clamp-2 h-10 text-sm text-muted">
              {ROUND_DESCRIPTIONS[activeRound]}
            </p>

            <Link
              href={`/rounds/${activeRound}`}
              aria-label={`Explore ${ROUND_LABELS[activeRound]} questions`}
              className="mt-3 inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium transition-all hover:gap-2 hover:underline"
              style={{ color: color.from }}
            >
              Explore questions
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
