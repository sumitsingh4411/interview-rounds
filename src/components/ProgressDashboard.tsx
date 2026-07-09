'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSolved, clearSolved } from '@/lib/solved';
import {
  ROUND_LABELS,
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  type Difficulty,
  type Round,
} from '@/lib/constants';

type Entry = {
  id: string;
  title: string;
  company: string;
  interviewId: string;
  round: Round;
  difficulty: Difficulty | null;
};

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy: 'var(--easy)',
  medium: 'var(--medium)',
  hard: 'var(--hard)',
};

export function ProgressDashboard() {
  const solved = useSolved();
  const [entries, setEntries] = useState<Entry[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch('/search-index.json')
      .then((r) => r.json())
      .then((d: Entry[]) => {
        if (alive) setEntries(d);
      })
      .catch(() => setEntries([]));
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => {
    if (!entries) return null;
    const total = entries.length;
    const solvedEntries = entries.filter((e) => solved.has(e.id));

    const byDifficulty = DIFFICULTIES.map((d) => ({
      difficulty: d,
      total: entries.filter((e) => e.difficulty === d).length,
      solved: solvedEntries.filter((e) => e.difficulty === d).length,
    }));

    return {
      total,
      solved: solvedEntries.length,
      pct: total ? Math.round((solvedEntries.length / total) * 100) : 0,
      byDifficulty,
      list: solvedEntries,
    };
  }, [entries, solved]);

  if (!stats) {
    return (
      <div className="glass h-44 animate-pulse rounded-2xl" aria-hidden />
    );
  }

  const empty = stats.solved === 0;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Your progress</p>
          <p className="mt-2 font-display text-3xl font-bold text-fg">
            {stats.solved}
            <span className="text-faint"> / {stats.total.toLocaleString()}</span>
            <span className="ml-3 text-lg font-medium text-brand">
              {stats.pct}%
            </span>
          </p>
        </div>
        {!empty ? (
          <button
            type="button"
            onClick={clearSolved}
            className="font-mono text-xs text-faint transition-colors hover:text-hard"
          >
            × Reset progress
          </button>
        ) : null}
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${stats.pct}%`,
            backgroundImage:
              'linear-gradient(90deg, #22d3ee, #818cf8 55%, #c084fc)',
          }}
        />
      </div>

      {/* Difficulty breakdown */}
      <dl className="mt-5 grid grid-cols-3 gap-3">
        {stats.byDifficulty.map((d) => (
          <div
            key={d.difficulty}
            className="rounded-xl border border-line bg-canvas/40 px-3 py-2.5"
          >
            <dt className="flex items-center gap-1.5 font-mono text-[0.68rem] text-faint">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: DIFFICULTY_COLOR[d.difficulty] }}
              />
              {DIFFICULTY_LABELS[d.difficulty]}
            </dt>
            <dd className="mt-1 font-display text-lg font-semibold text-fg">
              {d.solved}
              <span className="text-sm font-normal text-faint"> / {d.total}</span>
            </dd>
          </div>
        ))}
      </dl>

      {empty ? (
        <p className="mt-5 text-sm text-muted">
          Tick the checkbox on any question to track it. Progress is saved in
          your browser — no account needed.
        </p>
      ) : (
        <div className="mt-5">
          <p className="eyebrow mb-3">Solved questions</p>
          <ul className="space-y-1.5">
            {stats.list.slice(0, 8).map((e) => (
              <li key={e.id}>
                <Link
                  href={`/interviews/${e.interviewId}`}
                  className="flex items-baseline gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-surface-2/60"
                >
                  <span aria-hidden className="text-easy">
                    ✓
                  </span>
                  <span className="min-w-0 flex-1 truncate text-muted hover:text-fg">
                    {e.title}
                  </span>
                  <span className="shrink-0 font-mono text-[0.65rem] text-faint">
                    {e.company} · {ROUND_LABELS[e.round]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {stats.list.length > 8 ? (
            <p className="mt-2 px-2 font-mono text-xs text-faint">
              + {stats.list.length - 8} more
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
