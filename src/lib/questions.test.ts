import { describe, it, expect } from 'vitest';
import { groupQuestionsByRound, filterQuestions, facetsOf } from './questions';
import type { Question } from '@/db/schema';

// Minimal question factory — only the fields the pure helpers read.
function q(partial: Partial<Question>): Question {
  return {
    id: 1,
    companyId: 1,
    title: 'Q',
    body: null,
    role: 'frontend',
    level: 'mid',
    round: 'dsa',
    difficulty: null,
    tags: [],
    sourceType: 'ai',
    sourceUrl: null,
    sourceAuthor: null,
    isVerified: false,
    status: 'published',
    upvotes: 0,
    contentHash: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...partial,
  } as Question;
}

describe('groupQuestionsByRound', () => {
  it('returns empty array for no questions', () => {
    expect(groupQuestionsByRound([])).toEqual([]);
  });

  it('groups a single round', () => {
    const groups = groupQuestionsByRound([q({ id: 1, round: 'dsa' })]);
    expect(groups).toHaveLength(1);
    expect(groups[0].round).toBe('dsa');
    expect(groups[0].questions).toHaveLength(1);
  });

  it('orders rounds by canonical stage order regardless of input order', () => {
    const groups = groupQuestionsByRound([
      q({ id: 1, round: 'behavioral' }),
      q({ id: 2, round: 'oa' }),
      q({ id: 3, round: 'system_design' }),
    ]);
    expect(groups.map((g) => g.round)).toEqual([
      'oa',
      'system_design',
      'behavioral',
    ]);
  });

  it('collects multiple questions into the same round bucket', () => {
    const groups = groupQuestionsByRound([
      q({ id: 1, round: 'dsa' }),
      q({ id: 2, round: 'dsa' }),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].questions.map((x) => x.id)).toEqual([1, 2]);
  });
});

describe('filterQuestions', () => {
  const data = [
    q({ id: 1, role: 'frontend', level: 'junior', round: 'dsa' }),
    q({ id: 2, role: 'backend', level: 'senior', round: 'system_design' }),
    q({ id: 3, role: 'frontend', level: 'senior', round: 'machine_coding' }),
  ];

  it('returns all when no filter set', () => {
    expect(filterQuestions(data, {})).toHaveLength(3);
  });

  it('filters by role', () => {
    expect(filterQuestions(data, { role: 'frontend' }).map((x) => x.id)).toEqual([
      1, 3,
    ]);
  });

  it('combines filters with AND semantics', () => {
    expect(
      filterQuestions(data, { role: 'frontend', level: 'senior' }).map(
        (x) => x.id,
      ),
    ).toEqual([3]);
  });
});

describe('facetsOf', () => {
  it('returns distinct values in canonical order', () => {
    const facets = facetsOf([
      q({ round: 'behavioral', role: 'backend', level: 'senior' }),
      q({ round: 'oa', role: 'frontend', level: 'junior' }),
    ]);
    expect(facets.rounds).toEqual(['oa', 'behavioral']);
    expect(facets.roles).toEqual(['frontend', 'backend']);
    expect(facets.levels).toEqual(['junior', 'senior']);
  });
});
