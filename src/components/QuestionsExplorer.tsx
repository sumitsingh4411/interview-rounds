'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ROLES,
  LEVELS,
  ROUNDS,
  DIFFICULTIES,
  ROLE_LABELS,
  LEVEL_LABELS,
  ROUND_LABELS,
  DIFFICULTY_LABELS,
  type Role,
  type Level,
  type Round,
  type Difficulty,
} from '@/lib/constants';
import { useSolved } from '@/lib/solved';
import { withBasePath } from '@/lib/base-path';
import { SolvedCheckbox } from './SolvedCheckbox';
import { RoundBadge, LevelBadge, DifficultyBadge } from './ui/badges';

type Entry = {
  id: string;
  title: string;
  company: string;
  companySlug: string;
  interviewId: string;
  role: Role;
  level: Level;
  round: Round;
  difficulty: Difficulty | null;
  tags: string[];
};

type SolvedView = 'all' | 'unsolved' | 'solved';
type Sort = 'default' | 'az' | 'difficulty';

type Facets = {
  round: Round[];
  role: Role[];
  level: Level[];
  difficulty: Difficulty[];
};

const EMPTY_FACETS: Facets = { round: [], role: [], level: [], difficulty: [] };
const PAGE = 60;

// Both the header and every row share this template so the columns line up.
const COLS =
  'grid grid-cols-[1.75rem_minmax(0,1fr)] md:grid-cols-[1.75rem_minmax(0,1fr)_6.5rem_9rem_5.5rem_6rem] items-center gap-x-3';

const DIFF_ORDER: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };

// The full level labels ("New Grad / Junior") are too wide for a table column;
// the compact form keeps rows aligned. The full badge still shows on mobile.
const SHORT_LEVEL: Record<Level, string> = {
  intern: 'Intern',
  junior: 'Junior',
  mid: 'Mid',
  senior: 'Senior',
  staff: 'Staff+',
};

function FunnelIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 5h18l-7 8.2V20l-4 1.5v-8.3z" />
    </svg>
  );
}

export function QuestionsExplorer() {
  const solved = useSolved();
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [query, setQuery] = useState('');
  const [facets, setFacets] = useState<Facets>(EMPTY_FACETS);
  const [solvedView, setSolvedView] = useState<SolvedView>('all');
  const [sort, setSort] = useState<Sort>('default');
  const [visible, setVisible] = useState(PAGE);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(withBasePath('/search-index.json'))
      .then((r) => r.json())
      .then((d: Entry[]) => {
        if (alive) setEntries(d);
      })
      .catch(() => setEntries([]));
    return () => {
      alive = false;
    };
  }, []);

  // While the filter modal is open, close it on Escape and lock body scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const companyCount = useMemo(
    () => (entries ? new Set(entries.map((e) => e.companySlug)).size : 0),
    [entries],
  );

  // Filters (everything except the solved view — see below) narrow the list.
  const preSolved = useMemo(() => {
    if (!entries) return [];
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let list = entries.filter((e) => {
      if (facets.round.length && !facets.round.includes(e.round)) return false;
      if (facets.role.length && !facets.role.includes(e.role)) return false;
      if (facets.level.length && !facets.level.includes(e.level)) return false;
      if (facets.difficulty.length) {
        if (!e.difficulty || !facets.difficulty.includes(e.difficulty)) return false;
      }
      if (tokens.length) {
        const hay = `${e.title} ${e.company} ${e.round} ${e.tags.join(' ')}`.toLowerCase();
        if (!tokens.every((t) => hay.includes(t))) return false;
      }
      return true;
    });
    if (sort === 'az') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'difficulty') {
      list = [...list].sort(
        (a, b) =>
          (a.difficulty ? DIFF_ORDER[a.difficulty] : 99) -
          (b.difficulty ? DIFF_ORDER[b.difficulty] : 99),
      );
    }
    return list;
  }, [entries, facets, query, sort]);

  // The solved view is applied last so the "X of Y solved" tally reflects the
  // active filters, and toggling a row while on "Unsolved" removes it live.
  const filtered = useMemo(() => {
    if (solvedView === 'all') return preSolved;
    return preSolved.filter((e) =>
      solvedView === 'solved' ? solved.has(e.id) : !solved.has(e.id),
    );
  }, [preSolved, solvedView, solved]);

  const solvedInView = useMemo(
    () => preSolved.reduce((n, e) => n + (solved.has(e.id) ? 1 : 0), 0),
    [preSolved, solved],
  );

  const shown = filtered.slice(0, visible);
  const facetCount =
    facets.round.length +
    facets.role.length +
    facets.level.length +
    facets.difficulty.length;
  const activeFilters = facetCount + (query.trim() ? 1 : 0);

  function toggle<K extends keyof Facets>(key: K, value: Facets[K][number]) {
    setVisible(PAGE);
    setFacets((prev) => {
      const set = prev[key] as (typeof value)[];
      const next = set.includes(value)
        ? set.filter((v) => v !== value)
        : [...set, value];
      return { ...prev, [key]: next };
    });
  }

  function reset() {
    setVisible(PAGE);
    setFacets(EMPTY_FACETS);
    setQuery('');
    setSolvedView('all');
  }

  return (
    <div>
      {/* ── Toolbar ───────────────────────────────────────────────── */}
      <div className="glass flex flex-wrap items-center gap-2.5 rounded-2xl p-3 sm:p-3.5">
        <div className="flex min-w-[12rem] flex-1 items-center gap-2 rounded-xl border border-line-2 bg-surface px-3.5 py-2.5 focus-within:border-brand">
          <span aria-hidden className="font-mono text-brand">
            /
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setVisible(PAGE);
              setQuery(e.target.value);
            }}
            placeholder="Filter questions…"
            aria-label="Filter questions"
            className="min-w-0 flex-1 bg-transparent font-mono text-sm text-fg placeholder:text-faint focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className={
            'inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ' +
            (facetCount > 0
              ? 'border-brand bg-brand/10 text-brand'
              : 'border-line-2 bg-surface text-muted hover:border-brand hover:text-fg')
          }
        >
          <FunnelIcon />
          Filters
          {facetCount > 0 ? (
            <span className="grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-brand px-1 font-mono text-[0.65rem] text-canvas">
              {facetCount}
            </span>
          ) : null}
        </button>

        <Segmented
          options={[
            { value: 'all', label: 'All' },
            { value: 'unsolved', label: 'Unsolved' },
            { value: 'solved', label: 'Solved' },
          ]}
          value={solvedView}
          onChange={(v) => {
            setVisible(PAGE);
            setSolvedView(v as SolvedView);
          }}
        />
        <div className="flex items-center gap-2">
          <span className="eyebrow hidden lg:inline">Sort</span>
          <Segmented
            options={[
              { value: 'default', label: 'Default' },
              { value: 'az', label: 'A–Z' },
              { value: 'difficulty', label: 'Difficulty' },
            ]}
            value={sort}
            onChange={(v) => {
              setVisible(PAGE);
              setSort(v as Sort);
            }}
          />
        </div>
      </div>

      {/* ── Filters modal ─────────────────────────────────────────── */}
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter questions"
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
        >
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
          />
          <div className="relative flex max-h-[88vh] w-full flex-col rounded-t-2xl border border-line-2 bg-canvas/95 shadow-2xl backdrop-blur-xl sm:max-w-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2 text-fg">
                <FunnelIcon />
                <h2 className="font-display text-lg font-semibold">Filters</h2>
                {facetCount > 0 ? (
                  <span className="font-mono text-xs text-faint">
                    ({facetCount} active)
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-line-2 hover:text-fg"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-5 overflow-y-auto px-5 py-5 sm:grid-cols-2">
              <FacetGroup
                label="Round"
                options={ROUNDS.map((r) => ({ value: r, label: ROUND_LABELS[r] }))}
                active={facets.round}
                onToggle={(v) => toggle('round', v as Round)}
              />
              <FacetGroup
                label="Difficulty"
                options={DIFFICULTIES.map((d) => ({
                  value: d,
                  label: DIFFICULTY_LABELS[d],
                }))}
                active={facets.difficulty}
                onToggle={(v) => toggle('difficulty', v as Difficulty)}
              />
              <FacetGroup
                label="Role"
                options={ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
                active={facets.role}
                onToggle={(v) => toggle('role', v as Role)}
              />
              <FacetGroup
                label="Level"
                options={LEVELS.map((l) => ({ value: l, label: LEVEL_LABELS[l] }))}
                active={facets.level}
                onToggle={(v) => toggle('level', v as Level)}
              />
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  setVisible(PAGE);
                  setFacets(EMPTY_FACETS);
                }}
                disabled={facetCount === 0}
                className="font-mono text-xs text-faint transition-colors hover:text-fg disabled:opacity-40"
              >
                × Clear all
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-canvas transition-opacity hover:opacity-90"
              >
                Show {filtered.length.toLocaleString()} result
                {filtered.length === 1 ? '' : 's'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Tally ─────────────────────────────────────────────────── */}
      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm text-muted">
          <span className="font-mono text-fg">{filtered.length.toLocaleString()}</span>{' '}
          {activeFilters > 0 || solvedView !== 'all' ? 'matching' : 'total'} question
          {filtered.length === 1 ? '' : 's'}
          {entries ? (
            <span className="text-faint">
              {' '}
              · <span className="text-easy">{solvedInView.toLocaleString()}</span> solved
            </span>
          ) : null}
        </p>
        {activeFilters > 0 || solvedView !== 'all' ? (
          <button
            type="button"
            onClick={reset}
            className="font-mono text-xs text-brand hover:underline"
          >
            × Clear filters
          </button>
        ) : (
          <p className="font-mono text-xs text-faint">
            {companyCount > 0 ? `across ${companyCount} companies` : ''}
          </p>
        )}
      </div>

      {/* ── Table ─────────────────────────────────────────────────── */}
      {/* No overflow-hidden here: it would make the sticky header stick to the
          card instead of the viewport. Corners are rounded per-row instead. */}
      <div className="mt-3 rounded-2xl border border-line">
        <div
          className={`${COLS} eyebrow sticky top-16 z-20 rounded-t-2xl border-b border-line-2 bg-canvas/95 px-3 py-2.5 backdrop-blur`}
        >
          <span aria-hidden />
          <span>Question</span>
          <span className="hidden md:block">Company</span>
          <span className="hidden md:block">Round</span>
          <span className="hidden md:block">Level</span>
          <span className="hidden md:block">Difficulty</span>
        </div>

        {entries === null ? (
          <div className="space-y-px">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse bg-surface-2/40" />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <p className="px-4 py-16 text-center text-muted">
            No questions match these filters.{' '}
            <button
              type="button"
              onClick={reset}
              className="text-brand hover:underline"
            >
              Clear them
            </button>
            .
          </p>
        ) : (
          <ul>
            {shown.map((e) => {
              const isSolved = solved.has(e.id);
              return (
                <li
                  key={e.id}
                  className={`${COLS} border-b border-line px-3 py-2.5 transition-colors last:rounded-b-2xl last:border-b-0 hover:bg-surface-2/40 ${
                    isSolved ? 'bg-easy/[0.035]' : ''
                  }`}
                >
                  <SolvedCheckbox questionId={e.id} />

                  <div className="min-w-0">
                    <Link
                      href={`/interviews/${e.interviewId}#${e.id}`}
                      className={`block leading-snug md:truncate ${
                        isSolved ? 'text-muted' : 'text-fg hover:text-brand'
                      }`}
                    >
                      {e.title}
                    </Link>
                    {/* On narrow screens the columns collapse into badges here. */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 md:hidden">
                      <Link
                        href={`/companies/${e.companySlug}`}
                        className="font-mono text-xs text-faint hover:text-fg"
                      >
                        {e.company}
                      </Link>
                      <RoundBadge round={e.round} />
                      <LevelBadge level={e.level} />
                      {e.difficulty ? (
                        <DifficultyBadge difficulty={e.difficulty} />
                      ) : null}
                    </div>
                  </div>

                  <Link
                    href={`/companies/${e.companySlug}`}
                    className="hidden truncate text-sm text-muted hover:text-fg md:block"
                  >
                    {e.company}
                  </Link>
                  <span className="hidden md:block">
                    <RoundBadge round={e.round} />
                  </span>
                  <span className="hidden whitespace-nowrap font-mono text-xs text-muted md:block">
                    {SHORT_LEVEL[e.level]}
                  </span>
                  <span className="hidden md:block">
                    {e.difficulty ? (
                      <DifficultyBadge difficulty={e.difficulty} />
                    ) : (
                      <span className="font-mono text-xs text-faint">—</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {shown.length < filtered.length ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE)}
            className="rounded-xl border border-line-2 bg-surface px-5 py-2.5 text-sm text-muted transition-colors hover:border-brand hover:text-fg"
          >
            Show more{' '}
            <span className="font-mono text-xs text-faint">
              ({(filtered.length - shown.length).toLocaleString()} left)
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function FacetGroup({
  label,
  options,
  active,
  onToggle,
}: {
  label: string;
  options: { value: string; label: string }[];
  active: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="eyebrow mb-1.5">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = active.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              role="checkbox"
              aria-checked={on}
              onClick={() => onToggle(o.value)}
              className={
                'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-sm transition-colors ' +
                (on
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-line text-muted hover:border-line-2 hover:text-fg')
              }
            >
              <span
                aria-hidden
                className={
                  'grid h-3.5 w-3.5 place-items-center rounded-[4px] border text-[9px] ' +
                  (on
                    ? 'border-brand bg-brand text-canvas'
                    : 'border-line-2 text-transparent')
                }
              >
                ✓
              </span>
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-line p-0.5">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors ' +
              (on ? 'bg-brand/15 text-brand' : 'text-muted hover:text-fg')
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
