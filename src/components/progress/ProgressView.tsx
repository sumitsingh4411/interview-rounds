'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { clearSolved, getSolvedIds, importSolved } from '@/lib/solved';
import { percent } from '@/lib/progress';
import {
  ROUND_LABELS,
  ROUND_COLORS,
  ROLE_LABELS,
  LEVEL_LABELS,
  DIFFICULTY_LABELS,
  type Difficulty,
  type Round,
  type Role,
} from '@/lib/constants';
import { ProgressRing } from './ProgressRing';
import { useProgressStats } from './useProgressStats';
import { Donut, Columns, StackedBar, type Segment, type Column } from './charts';

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  easy: 'var(--easy)',
  medium: 'var(--medium)',
  hard: 'var(--hard)',
};

const ROLE_COLOR: Record<Role, string> = {
  frontend: 'var(--frontend)',
  backend: 'var(--backend)',
  fullstack: 'var(--brand)',
};

const SHORT_ROUND: Record<Round, string> = {
  oa: 'OA',
  dsa: 'DSA',
  machine_coding: 'M.Code',
  lld: 'LLD',
  system_design: 'Sys',
  tech_deep_dive: 'Tech',
  hiring_manager: 'HM',
  behavioral: 'Behav',
};

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function LegendRow({
  label,
  solved,
  total,
  color,
}: {
  label: string;
  solved: number;
  total: number;
  color: string;
}) {
  return (
    <li>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 text-muted">
          <span
            aria-hidden
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          {label}
        </span>
        <span className="font-mono text-xs text-faint">
          <span className="text-fg">{solved}</span> / {total}
        </span>
      </div>
      <Bar pct={percent(solved, total)} color={color} />
    </li>
  );
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-card rounded-xl px-3.5 py-3">
      <div className="font-display text-xl leading-none font-bold text-fg">
        {value}
      </div>
      <div className="mt-1.5 font-mono text-[0.62rem] tracking-wide text-faint">
        {label}
      </div>
    </div>
  );
}

export function ProgressView() {
  const { stats } = useProgressStats();
  const fileInput = useRef<HTMLInputElement>(null);

  if (!stats) {
    return <div className="glass h-72 animate-pulse rounded-2xl" aria-hidden />;
  }

  const empty = stats.solved === 0;
  const remaining = stats.total - stats.solved;

  const rated = stats.byDifficulty.reduce((n, b) => n + b.total, 0);
  const ratedSolved = stats.byDifficulty.reduce((n, b) => n + b.solved, 0);

  const companiesStarted = stats.byCompany.filter((c) => c.solved > 0);
  const companiesDone = stats.byCompany.filter(
    (c) => c.total > 0 && c.solved === c.total,
  ).length;

  // Strongest round = highest completion % among rounds that have questions.
  const strongest = stats.byRound
    .filter((b) => b.total > 0 && b.solved > 0)
    .sort(
      (a, b) => percent(b.solved, b.total) - percent(a.solved, a.total) || b.solved - a.solved,
    )[0];

  const difficultySegments: Segment[] = stats.byDifficulty.map((b) => ({
    label: DIFFICULTY_LABELS[b.key],
    value: b.total,
    color: DIFFICULTY_COLOR[b.key],
  }));

  const roundColumns: Column[] = stats.byRound.map((b) => ({
    key: b.key,
    label: SHORT_ROUND[b.key],
    full: ROUND_LABELS[b.key],
    total: b.total,
    solved: b.solved,
    color: ROUND_COLORS[b.key].from,
  }));

  const roleSegments: Segment[] = stats.byRole.map((b) => ({
    label: ROLE_LABELS[b.key],
    value: b.total,
    color: ROLE_COLOR[b.key],
  }));

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
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="glass relative overflow-hidden rounded-2xl p-6 sm:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-60 blur-3xl"
          style={{
            background:
              'radial-gradient(closest-side, rgb(var(--glow) / 0.35), transparent 70%)',
          }}
        />
        <div className="relative flex flex-col items-center gap-7 sm:flex-row sm:items-center">
          <ProgressRing pct={stats.pct} />
          <div className="min-w-0 flex-1">
            <p className="eyebrow">Overall progress</p>
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
                : `${remaining.toLocaleString()} to go · ${companiesStarted.length} of ${stats.byCompany.length} companies started.`}
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <StatTile value={stats.solved.toLocaleString()} label="solved" />
              <StatTile value={remaining.toLocaleString()} label="remaining" />
              <StatTile
                value={`${companiesStarted.length}/${stats.byCompany.length}`}
                label="companies"
              />
              <StatTile
                value={companiesDone > 0 ? String(companiesDone) : '—'}
                label="completed"
              />
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-2">
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

      {/* ── Difficulty (donut) + Rounds (columns) ─────────────────── */}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section className="glass rounded-2xl p-6">
          <p className="eyebrow">By difficulty</p>
          <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:gap-7">
            <Donut segments={difficultySegments}>
              <div>
                <div className="font-display text-2xl font-bold text-fg">
                  {ratedSolved.toLocaleString()}
                </div>
                <div className="mt-0.5 font-mono text-[0.6rem] text-faint">
                  of {rated.toLocaleString()}
                </div>
              </div>
            </Donut>
            <ul className="w-full flex-1 space-y-3.5">
              {stats.byDifficulty.map((b) => (
                <LegendRow
                  key={b.key}
                  label={DIFFICULTY_LABELS[b.key]}
                  solved={b.solved}
                  total={b.total}
                  color={DIFFICULTY_COLOR[b.key]}
                />
              ))}
            </ul>
          </div>
          <p className="mt-5 text-xs text-faint">
            The donut shows how the {rated.toLocaleString()} difficulty-rated
            questions split. {(stats.total - rated).toLocaleString()} behavioural
            & hiring-manager questions carry no difficulty.
          </p>
        </section>

        <section className="glass rounded-2xl p-6">
          <div className="flex items-baseline justify-between gap-3">
            <p className="eyebrow">By round</p>
            {strongest ? (
              <p className="font-mono text-xs text-faint">
                strongest ·{' '}
                <span className="text-fg">{ROUND_LABELS[strongest.key]}</span>
              </p>
            ) : null}
          </div>
          <div className="mt-6">
            <Columns data={roundColumns} />
          </div>
          <p className="mt-4 text-xs text-faint">
            Bar height = questions available · fill = solved. Hover a bar for
            counts.
          </p>
        </section>
      </div>

      {/* ── Role (stacked) + Level (bars) ─────────────────────────── */}
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section className="glass rounded-2xl p-6">
          <p className="eyebrow">By role</p>
          <div className="mt-5">
            <StackedBar segments={roleSegments} />
          </div>
          <ul className="mt-5 space-y-3.5">
            {stats.byRole.map((b) => (
              <LegendRow
                key={b.key}
                label={ROLE_LABELS[b.key]}
                solved={b.solved}
                total={b.total}
                color={ROLE_COLOR[b.key]}
              />
            ))}
          </ul>
        </section>

        <section className="glass rounded-2xl p-6">
          <p className="eyebrow">By level</p>
          <ul className="mt-5 space-y-3.5">
            {stats.byLevel
              .filter((b) => b.total > 0)
              .map((b) => (
                <LegendRow
                  key={b.key}
                  label={LEVEL_LABELS[b.key]}
                  solved={b.solved}
                  total={b.total}
                  color="var(--brand)"
                />
              ))}
          </ul>
        </section>
      </div>

      {/* ── Companies ─────────────────────────────────────────────── */}
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
            up here — with a badge when you finish one.
          </p>
        ) : (
          <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {companiesStarted.slice(0, 12).map((c) => {
              const done = c.solved === c.total;
              return (
                <li key={c.slug} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <Link
                      href={`/companies/${c.slug}`}
                      className="flex items-center gap-1.5 text-muted hover:text-fg"
                    >
                      {c.name}
                      {done ? (
                        <span
                          className="rounded-full bg-easy/15 px-1.5 py-px font-mono text-[0.6rem] text-easy"
                          title="Completed"
                        >
                          ✓ done
                        </span>
                      ) : null}
                    </Link>
                    <span className="font-mono text-xs text-faint">
                      <span className="text-fg">{c.solved}</span> / {c.total}
                    </span>
                  </div>
                  <Bar
                    pct={percent(c.solved, c.total)}
                    color={done ? 'var(--easy)' : 'var(--brand)'}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Solved list ───────────────────────────────────────────── */}
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
                    href={`/interviews/${e.interviewId}#${e.id}`}
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
