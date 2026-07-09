import { describe, it, expect } from 'vitest';
import { practiceLinks } from './practice';
import { leetcodeSlug, normalizeTitle } from './leetcode';

describe('leetcodeSlug', () => {
  it('resolves a known problem regardless of trailing punctuation', () => {
    expect(leetcodeSlug('Trapping rain water.')).toBe('trapping-rain-water');
    expect(leetcodeSlug('Trapping rain water')).toBe('trapping-rain-water');
  });

  it('resolves titles that carry an em-dash explanation', () => {
    expect(leetcodeSlug('Two Sum — return indices of numbers adding to a target.')).toBe(
      'two-sum',
    );
  });

  it('returns null for anything with no LeetCode equivalent', () => {
    expect(leetcodeSlug('Aptitude and logical-reasoning section.')).toBeNull();
    expect(leetcodeSlug('Build a kanban board with drag and drop.')).toBeNull();
    expect(leetcodeSlug('Design a URL shortener like TinyURL.')).toBeNull();
  });

  it('normalizes case and whitespace', () => {
    expect(normalizeTitle('  Edit   Distance.  ')).toBe('edit distance');
  });
});

describe('practiceLinks', () => {
  it('links a real problem straight to its LeetCode page', () => {
    const links = practiceLinks('Trapping rain water.', 'dsa');
    const lc = links.find((l) => l.short === 'LC')!;
    expect(lc.href).toBe('https://leetcode.com/problems/trapping-rain-water/');
  });

  it('never links a non-problem to LeetCode', () => {
    const links = practiceLinks('Aptitude and logical-reasoning section.', 'oa');
    expect(links.some((l) => l.short === 'LC')).toBe(false);
  });

  it('falls back to a web search when there is no problem page', () => {
    const links = practiceLinks('Explain the CSS box model.', 'tech_deep_dive');
    expect(links.map((l) => l.short)).toEqual(['GfG', 'Search']);
  });

  it('omits the search fallback when a problem page exists', () => {
    const links = practiceLinks('Climbing stairs.', 'dsa');
    expect(links.map((l) => l.short)).toEqual(['LC', 'GfG']);
  });

  it('offers nothing to practise for behavioural and hiring-manager rounds', () => {
    expect(practiceLinks('Tell me about a failure.', 'behavioral')).toEqual([]);
    expect(practiceLinks('How do you scope a project?', 'hiring_manager')).toEqual([]);
  });

  it('never emits a NeetCode link (its slugs cannot be verified)', () => {
    const all = [
      ...practiceLinks('Trapping rain water.', 'dsa'),
      ...practiceLinks('Explain CORS.', 'tech_deep_dive'),
    ];
    expect(all.some((l) => l.href.includes('neetcode'))).toBe(false);
  });
});
