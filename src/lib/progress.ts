import {
  ROUND_ORDER,
  ROLES,
  LEVELS,
  DIFFICULTIES,
  type Round,
  type Role,
  type Level,
  type Difficulty,
} from './constants';

/** One row of public/search-index.json. */
export type IndexEntry = {
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

export type Bucket<T extends string> = { key: T; solved: number; total: number };

export type CompanyBucket = {
  slug: string;
  name: string;
  solved: number;
  total: number;
};

export type ProgressStats = {
  total: number;
  solved: number;
  pct: number;
  byDifficulty: Bucket<Difficulty>[];
  byRound: Bucket<Round>[];
  byRole: Bucket<Role>[];
  byLevel: Bucket<Level>[];
  byCompany: CompanyBucket[];
  solvedEntries: IndexEntry[];
};

function bucket<T extends string>(
  keys: readonly T[],
  entries: IndexEntry[],
  solved: Set<string>,
  of: (e: IndexEntry) => T | null,
): Bucket<T>[] {
  return keys.map((key) => {
    const matching = entries.filter((e) => of(e) === key);
    return {
      key,
      total: matching.length,
      solved: matching.filter((e) => solved.has(e.id)).length,
    };
  });
}

/** Percentage complete, rounded. 0 when there is nothing to solve. */
export function percent(solved: number, total: number): number {
  return total > 0 ? Math.round((solved / total) * 100) : 0;
}

export function computeStats(
  entries: IndexEntry[],
  solved: Set<string>,
): ProgressStats {
  const solvedEntries = entries.filter((e) => solved.has(e.id));

  const companies = new Map<string, CompanyBucket>();
  for (const e of entries) {
    const c = companies.get(e.companySlug) ?? {
      slug: e.companySlug,
      name: e.company,
      solved: 0,
      total: 0,
    };
    c.total += 1;
    if (solved.has(e.id)) c.solved += 1;
    companies.set(e.companySlug, c);
  }

  return {
    total: entries.length,
    solved: solvedEntries.length,
    pct: percent(solvedEntries.length, entries.length),
    byDifficulty: bucket(DIFFICULTIES, entries, solved, (e) => e.difficulty),
    byRound: bucket(ROUND_ORDER, entries, solved, (e) => e.round),
    byRole: bucket(ROLES, entries, solved, (e) => e.role),
    byLevel: bucket(LEVELS, entries, solved, (e) => e.level),
    byCompany: [...companies.values()].sort(
      (a, b) => b.solved - a.solved || a.name.localeCompare(b.name),
    ),
    solvedEntries,
  };
}
