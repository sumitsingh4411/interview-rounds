'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { clearSolved, getSolvedIds, importSolved } from '@/lib/solved';
import { percent, type Bucket } from '@/lib/progress';
import {
  ROUND_LABELS,
  ROUND_COLORS,
  ROLE_LABELS,
  LEVEL_LABELS,
  DIFFICULTY_LABELS,
  type Difficulty,
  type Round,
} from '@/lib/constants';
import { ProgressRing } from './ProgressRing';
import { useProgressStats } from './useProgressStats';

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy: 'var(--easy)',
  medium: 'var(--medium)',
  hard: 'var(--hard)',
};

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function BucketRow({
  label,
  b,
  color,
}: {
  label: string;
  b: Bucket<string>;
  color: string;
}) {
  const pct = percent(b.solved, b.total);
  return (
    <li className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 text-muted">
          <span
            aria-hidden
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          {label}
        </span>
        <span className="font-mono text-xs text-faint">
          <span className="text-fg">{b.solved}</span> / {b.total}
        </span>
      </div>
      <Bar pct={pct} color={color} />
    </li>
  );
}

export function ProgressView() {
  const { stats } = useProgressStats();
  const fileInput = useRef<HTMLInputElement>(null);

  if (!stats) {
    return <div className="glass h-72 animate-pulse rounded-2xl" aria-hidden />;
  }

  const empty = stats.solved === 0;
  const rated = stats.byDifficulty.reduce((n, b) => n + b.total, 0);
  const companiesStarted = stats.byCompany.filter((c) => c.solved > 0);

  // A bucket with no questions at all (e.g. no intern-level interviews yet) is
  // noise, not information.
  const nonEmpty = <T extends string>(bs: Bucket<T>[]) =>
    bs.filter((b) => b.total > 0);

  function onExport() {
    const blob = new Blob([JSON.stringify(getSolvedIds(), null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theloop-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onImport(file: File) {
    try {
      const ids: unknown = JSON.parse(await file.text());
      if (Array.isArray(ids)) importSolved(ids as string[]);
    } catch {
      /* a malformed file simply does nothing */
    }
  }

  return (
    <div className="space-y-6">
      {/* Headline */}
      <section className="glass rounded-2xl p-6">
        <div className="flex flex-col items-center gap-7 sm:flex-row sm:items-center">
          <ProgressRing pct={stats.pct} />
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="eyebrow">Overall</p>
            <p className="mt-2 font-display text-3xl font-bold text-fg">
              {stats.solved.toLocaleString()}
              <span className="text-faint">
                {' '}
                / {stats.total.toLocaleString()} solved
              </span>
            </p>
            <p className="mt-2 text-sm text-muted">
              {empty
                ? 'Tick the checkbox on any question to start tracking. Progress is saved in this browser only — no account, no server.'
                : `${companiesStarted.length} of ${stats.byCompany.length} companies started.`}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <button
                type="button"
                onClick={onExport}
                className="rounded-lg border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-line-2 hover:text-fg"
              >
                ↓ Export backup
              </button>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="rounded-lg border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-line-2 hover:text-fg"
              >
                ↑ Import
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(ev) => {
                  const f = ev.target.files?.[0];
                  if (f) onImport(f);
                  ev.target.value = '';
                }}
              />
              {!empty ? (
                <button
                  type="button"
                  onClick={clearSolved}
                  className="rounded-lg border border-line px-3 py-1.5 font-mono text-xs text-faint transition-colors hover:border-hard/50 hover:text-hard"
                >
                  × Reset
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        {/* Difficulty */}
        <section className="glass rounded-2xl p-6">
          <p className="eyebrow">By difficulty</p>
          <ul className="mt-4 space-y-4">
            {nonEmpty(stats.byDifficulty).map((b) => (
              <BucketRow
                key={b.key}
                label={DIFFICULTY_LABELS[b.key]}
                b={b}
                color={DIFFICULTY_COLOR[b.key]}
              />
            ))}
          </ul>
          <p className="mt-4 text-xs text-faint">
            {stats.total - rated} behavioural and hiring-manager questions carry
            no difficulty, so these three add up to {rated.toLocaleString()}, not{' '}
            {stats.total.toLocaleString()}.
          </p>
        </section>

        {/* Rounds */}
        <section className="glass rounded-2xl p-6">
          <p className="eyebrow">By round</p>
          <ul className="mt-4 space-y-3.5">
            {nonEmpty(stats.byRound).map((b) => (
              <BucketRow
                key={b.key}
                label={ROUND_LABELS[b.key as Round]}
                b={b}
                color={ROUND_COLORS[b.key as Round].from}
              />
            ))}
          </ul>
        </section>

        {/* Role */}
        <section className="glass rounded-2xl p-6">
          <p className="eyebrow">By role</p>
          <ul className="mt-4 space-y-4">
            {nonEmpty(stats.byRole).map((b) => (
              <BucketRow
                key={b.key}
                label={ROLE_LABELS[b.key]}
                b={b}
                color={
                  b.key === 'frontend'
                    ? 'var(--frontend)'
                    : b.key === 'backend'
                      ? 'var(--backend)'
                      : 'var(--brand)'
                }
              />
            ))}
          </ul>
        </section>

        {/* Level */}
        <section className="glass rounded-2xl p-6">
          <p className="eyebrow">By level</p>
          <ul className="mt-4 space-y-4">
            {nonEmpty(stats.byLevel).map((b) => (
              <BucketRow
                key={b.key}
                label={LEVEL_LABELS[b.key]}
                b={b}
                color="var(--brand)"
              />
            ))}
          </ul>
        </section>
      </div>

      {/* Companies */}
      <section className="glass rounded-2xl p-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="eyebrow">By company</p>
          <Link href="/companies" className="text-sm text-muted hover:text-fg">
            Browse all →
          </Link>
        </div>
        {empty ? (
          <p className="mt-4 text-sm text-muted">
            Once you solve a question, the companies you have started will show
            up here.
          </p>
        ) : (
          <ul className="mt-4 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
            {companiesStarted.slice(0, 12).map((c) => (
              <li key={c.slug} className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <Link
                    href={`/companies/${c.slug}`}
                    className="text-muted hover:text-fg"
                  >
                    {c.name}
                  </Link>
                  <span className="font-mono text-xs text-faint">
                    <span className="text-fg">{c.solved}</span> / {c.total}
                  </span>
                </div>
                <Bar pct={percent(c.solved, c.total)} color="var(--brand)" />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Solved list */}
      <section className="glass rounded-2xl p-6">
        <p className="eyebrow">Solved questions</p>
        {empty ? (
          <p className="mt-4 text-sm text-muted">Nothing yet.</p>
        ) : (
          <>
            <ul className="mt-4 space-y-1">
              {stats.solvedEntries.slice(0, 50).map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/interviews/${e.interviewId}`}
                    className="flex items-baseline gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-surface-2/60"
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
            {stats.solvedEntries.length > 50 ? (
              <p className="mt-3 px-2 font-mono text-xs text-faint">
                + {stats.solvedEntries.length - 50} more
              </p>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
