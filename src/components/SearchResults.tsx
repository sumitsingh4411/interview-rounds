'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ROUND_LABELS,
  ROUND_COLORS,
  ROUND_ORDER,
  type Role,
  type Level,
  type Difficulty,
  type Round,
} from '@/lib/constants';
import { RoleBadge, LevelBadge, DifficultyBadge } from './ui/badges';

const POPULAR = [
  'system design',
  'react',
  'two sum',
  'dynamic programming',
  'linked list',
  'sql',
  'behavioral',
  'rate limiter',
  'binary tree',
  'idempotency',
];

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

export function SearchResults() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [entries, setEntries] = useState<Entry[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch('/search-index.json')
      .then((r) => r.json())
      .then((data: Entry[]) => {
        if (alive) setEntries(data);
      })
      .catch(() => setEntries([]));
    return () => {
      alive = false;
    };
  }, []);

  const results = useMemo(() => {
    if (!entries) return [];
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];
    return entries
      .filter((e) => {
        const hay = `${e.title} ${e.company} ${e.round} ${e.tags.join(' ')}`.toLowerCase();
        return tokens.every((t) => hay.includes(t));
      })
      .slice(0, 80);
  }, [entries, query]);

  const roundCounts = useMemo(() => {
    const m = {} as Record<Round, number>;
    for (const e of entries ?? []) m[e.round] = (m[e.round] ?? 0) + 1;
    return m;
  }, [entries]);

  const trimmed = query.trim();

  return (
    <div>
      <div className="flex items-center gap-2 rounded-xl border border-line-2 bg-surface px-3.5 py-2.5 focus-within:border-brand">
        <span aria-hidden className="font-mono text-brand">
          $
        </span>
        <input
          type="search"
          value={query}
          autoFocus
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “system design” or “react”…"
          aria-label="Search questions"
          className="min-w-0 flex-1 bg-transparent font-mono text-sm text-fg placeholder:text-faint focus:outline-none"
        />
      </div>

      {entries === null ? (
        <p className="mt-6 font-mono text-xs text-faint">Loading index…</p>
      ) : trimmed ? (
        <p className="mt-6 font-mono text-xs text-faint">
          {results.length} result{results.length === 1 ? '' : 's'} for “{trimmed}”
        </p>
      ) : (
        <p className="mt-6 text-sm text-muted">
          Search across every company and round — or start from a suggestion
          below.
        </p>
      )}

      {!trimmed && entries ? (
        <div className="mt-8 space-y-8">
          <div>
            <p className="eyebrow mb-3">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuery(q)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-sm text-muted transition-colors hover:border-brand hover:text-fg"
                >
                  <span aria-hidden className="text-faint">
                    ↗
                  </span>
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow mb-3">Browse by round</p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {ROUND_ORDER.map((r) => (
                <Link
                  key={r}
                  href={`/rounds/${r}`}
                  className="glass-card group flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:border-line-2"
                >
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: ROUND_COLORS[r].from }}
                  />
                  <span className="flex-1 text-sm text-fg">
                    {ROUND_LABELS[r]}
                  </span>
                  <span className="font-mono text-xs text-faint">
                    {(roundCounts[r] ?? 0).toLocaleString()}
                  </span>
                  <span
                    aria-hidden
                    className="text-faint transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <ul className="mt-4 space-y-3">
        {results.map((e) => (
          <li key={e.id}>
            <Link
              href={`/interviews/${e.interviewId}#${e.id}`}
              className="glass-card block rounded-xl p-4"
            >
              <div className="mb-1.5 flex items-center gap-2 font-mono text-xs text-faint">
                {e.company}
                <span className="text-line-2">·</span>
                {ROUND_LABELS[e.round]}
              </div>
              <p className="font-medium leading-snug text-fg">{e.title}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <RoleBadge role={e.role} />
                <LevelBadge level={e.level} />
                {e.difficulty ? (
                  <DifficultyBadge difficulty={e.difficulty} />
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {trimmed && entries !== null && results.length === 0 ? (
        <p className="mt-4 rounded-xl border border-line bg-surface p-6 text-muted">
          Nothing matched “{trimmed}”. Try a broader term, or{' '}
          <Link href="/companies" className="text-brand hover:underline">
            browse companies
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
