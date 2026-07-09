'use client';

import Link from 'next/link';
import { useProgressStats } from './useProgressStats';

/** Compact strip for the home page. The full breakdown lives at /progress. */
export function ProgressSummary() {
  const { stats } = useProgressStats();

  if (!stats) {
    return <div className="glass h-24 animate-pulse rounded-2xl" aria-hidden />;
  }

  return (
    <Link
      href="/progress"
      className="glass-card group flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-6"
    >
      <div className="shrink-0">
        <p className="eyebrow">Your progress</p>
        <p className="mt-1.5 font-display text-2xl font-bold text-fg">
          {stats.solved.toLocaleString()}
          <span className="text-faint"> / {stats.total.toLocaleString()}</span>
          <span className="ml-2.5 text-base font-medium text-brand">
            {stats.pct}%
          </span>
        </p>
      </div>

      <div className="min-w-0 flex-1">
        <div className="h-2 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{
              width: `${stats.pct}%`,
              backgroundImage:
                'linear-gradient(90deg, #22d3ee, #818cf8 55%, #c084fc)',
            }}
          />
        </div>
        <p className="mt-2 text-sm text-muted">
          {stats.solved === 0
            ? 'Tick any question to start tracking — saved in your browser, no account.'
            : `${stats.byCompany.filter((c) => c.solved > 0).length} companies started.`}
        </p>
      </div>

      <span
        aria-hidden
        className="shrink-0 text-sm text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
      >
        Full breakdown →
      </span>
    </Link>
  );
}
