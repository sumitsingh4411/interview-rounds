import type { Round } from './constants';
import { leetcodeSlug } from './leetcode';

export type PracticePlatform = 'leetcode' | 'gfg' | 'search';

export type PracticeLink = {
  label: string;
  short: string;
  href: string;
  /** Drives the chip's brand colour (see .practice-* in globals.css). */
  platform: PracticePlatform;
};

/** Nothing to practise — linking these anywhere would be noise. */
const NO_PRACTICE: readonly Round[] = ['behavioral', 'hiring_manager'];

/** Trailing punctuation hurts search relevance. */
function query(title: string): string {
  return encodeURIComponent(title.replace(/[.?!]+\s*$/, '').trim());
}

/**
 * Where to actually practise a question.
 *
 * - LeetCode only when the question maps to a real problem (slug verified by
 *   `npm run verify:leetcode`). A search link that finds nothing is worse than
 *   no link, and "Aptitude and logical-reasoning section" is not on LeetCode.
 * - NeetCode is deliberately absent: it is a client-rendered SPA that returns
 *   the same page for every slug, and its slugs differ from LeetCode's
 *   ("two-integer-sum" for Two Sum), so a per-question link cannot be verified.
 * - GeeksforGeeks has a real search endpoint, so it works for topics too.
 */
export function practiceLinks(title: string, round: Round): PracticeLink[] {
  if (NO_PRACTICE.includes(round)) return [];

  const links: PracticeLink[] = [];
  const slug = leetcodeSlug(title);

  if (slug) {
    links.push({
      label: 'LeetCode',
      short: 'LC',
      href: `https://leetcode.com/problems/${slug}/`,
      platform: 'leetcode',
    });
  }

  links.push({
    label: 'GeeksforGeeks',
    short: 'GfG',
    href: `https://www.geeksforgeeks.org/search/?gq=${query(title)}`,
    platform: 'gfg',
  });

  // Without a known problem page, a plain web search is the honest fallback.
  if (!slug) {
    links.push({
      label: 'Search',
      short: 'Search',
      href: `https://www.google.com/search?q=${query(title)}`,
      platform: 'search',
    });
  }

  return links;
}
