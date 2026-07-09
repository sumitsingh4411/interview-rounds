import type { Round } from './constants';

export type PracticeLink = { label: string; short: string; href: string };

/** Rounds where a question maps to a practiceable coding problem. */
const CODING_ROUNDS: readonly Round[] = ['oa', 'dsa'];

/** Rounds where a question is a topic to study rather than a problem to solve. */
const STUDY_ROUNDS: readonly Round[] = [
  'machine_coding',
  'lld',
  'system_design',
  'tech_deep_dive',
];

/** Trailing punctuation hurts search relevance. */
function query(title: string): string {
  return encodeURIComponent(title.replace(/[.?!]+\s*$/, '').trim());
}

/**
 * Where to go to actually learn/practise a question.
 *
 * Behavioural and hiring-manager rounds get nothing — there is no problem to
 * solve, and linking them to LeetCode would be noise.
 */
export function practiceLinks(title: string, round: Round): PracticeLink[] {
  const q = query(title);

  if (CODING_ROUNDS.includes(round)) {
    return [
      {
        label: 'LeetCode',
        short: 'LC',
        href: `https://leetcode.com/problemset/?search=${q}`,
      },
      { label: 'NeetCode', short: 'NC', href: 'https://neetcode.io/practice' },
      {
        label: 'GeeksforGeeks',
        short: 'GfG',
        href: `https://www.geeksforgeeks.org/search/?gq=${q}`,
      },
    ];
  }

  if (STUDY_ROUNDS.includes(round)) {
    return [
      {
        label: 'GeeksforGeeks',
        short: 'GfG',
        href: `https://www.geeksforgeeks.org/search/?gq=${q}`,
      },
      {
        label: 'Search',
        short: 'Search',
        href: `https://www.google.com/search?q=${q}`,
      },
    ];
  }

  return [];
}
