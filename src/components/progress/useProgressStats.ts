'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSolved } from '@/lib/solved';
import { computeStats, type IndexEntry, type ProgressStats } from '@/lib/progress';
import { withBasePath } from '@/lib/base-path';

/**
 * Loads the static search index once and derives progress from localStorage.
 * `stats` is null until the index arrives (the site is static — there is no
 * server to compute this).
 */
export function useProgressStats(): { stats: ProgressStats | null } {
  const solved = useSolved();
  const [entries, setEntries] = useState<IndexEntry[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(withBasePath('/search-index.json'))
      .then((r) => r.json())
      .then((d: IndexEntry[]) => {
        if (alive) setEntries(d);
      })
      .catch(() => setEntries([]));
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(
    () => (entries ? computeStats(entries, solved) : null),
    [entries, solved],
  );

  return { stats };
}
