import { describe, it, expect } from 'vitest';
import { computeStats, percent, type IndexEntry } from './progress';

function e(partial: Partial<IndexEntry>): IndexEntry {
  return {
    id: 'x',
    title: 'Q',
    company: 'Google',
    companySlug: 'google',
    interviewId: 'google-1',
    role: 'backend',
    level: 'senior',
    round: 'dsa',
    difficulty: 'medium',
    tags: [],
    ...partial,
  };
}

const ENTRIES: IndexEntry[] = [
  e({ id: 'a', difficulty: 'easy', round: 'dsa', role: 'backend', level: 'senior' }),
  e({ id: 'b', difficulty: 'hard', round: 'dsa', role: 'frontend', level: 'mid' }),
  e({ id: 'c', difficulty: null, round: 'behavioral', role: 'backend', level: 'senior' }),
  e({ id: 'd', difficulty: 'easy', round: 'oa', company: 'Meta', companySlug: 'meta', role: 'frontend', level: 'mid' }),
];

describe('percent', () => {
  it('is 0 when there is nothing to solve', () => {
    expect(percent(0, 0)).toBe(0);
  });
  it('rounds to the nearest integer', () => {
    expect(percent(1, 3)).toBe(33);
    expect(percent(2, 3)).toBe(67);
  });
});

describe('computeStats', () => {
  it('reports zero progress with an empty solved set', () => {
    const s = computeStats(ENTRIES, new Set());
    expect(s.total).toBe(4);
    expect(s.solved).toBe(0);
    expect(s.pct).toBe(0);
    expect(s.solvedEntries).toEqual([]);
  });

  it('counts solved overall and as a percentage', () => {
    const s = computeStats(ENTRIES, new Set(['a', 'b']));
    expect(s.solved).toBe(2);
    expect(s.pct).toBe(50);
  });

  it('buckets by difficulty and ignores null difficulty', () => {
    const s = computeStats(ENTRIES, new Set(['a']));
    const easy = s.byDifficulty.find((b) => b.key === 'easy')!;
    const hard = s.byDifficulty.find((b) => b.key === 'hard')!;
    expect(easy).toMatchObject({ solved: 1, total: 2 });
    expect(hard).toMatchObject({ solved: 0, total: 1 });
    // the null-difficulty behavioural question is in no difficulty bucket
    const summed = s.byDifficulty.reduce((n, b) => n + b.total, 0);
    expect(summed).toBe(3);
  });

  it('buckets by round in canonical order', () => {
    const s = computeStats(ENTRIES, new Set(['b']));
    expect(s.byRound[0].key).toBe('oa');
    expect(s.byRound.find((b) => b.key === 'dsa')).toMatchObject({
      solved: 1,
      total: 2,
    });
  });

  it('buckets by role and level', () => {
    const s = computeStats(ENTRIES, new Set(['d']));
    expect(s.byRole.find((b) => b.key === 'frontend')).toMatchObject({
      solved: 1,
      total: 2,
    });
    expect(s.byLevel.find((b) => b.key === 'mid')).toMatchObject({
      solved: 1,
      total: 2,
    });
  });

  it('groups companies and sorts by solved count', () => {
    const s = computeStats(ENTRIES, new Set(['d']));
    expect(s.byCompany[0]).toMatchObject({ slug: 'meta', solved: 1, total: 1 });
    expect(s.byCompany[1]).toMatchObject({ slug: 'google', solved: 0, total: 3 });
  });

  it('ignores solved ids that are not in the index', () => {
    const s = computeStats(ENTRIES, new Set(['ghost']));
    expect(s.solved).toBe(0);
  });
});
