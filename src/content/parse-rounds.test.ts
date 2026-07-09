import { describe, it, expect } from 'vitest';
import { parseRounds, countQuestions } from './parse-rounds';

const BODY = `
# Senior Backend — Google

> A senior backend loop.

## Round 1 · DSA / Coding
<!-- round: dsa -->

_Data structures & algorithms._

| Question | Difficulty | Tags |
| --- | --- | --- |
| Trapping rain water. | 🔴 Hard | \`two-pointers\` \`array\` |
| Number of islands in a 2D grid. | 🟡 Medium | \`bfs\` \`grid\` |

## Round 2 · Behavioral / HR
<!-- round: behavioral -->

| Question | Difficulty | Tags |
| --- | --- | --- |
| Tell me about a failure. | — | — |
`;

describe('parseRounds', () => {
  it('returns no rounds for a body without markers', () => {
    expect(parseRounds('# Just prose\n\nNothing here.')).toEqual([]);
  });

  it('parses rounds in document order', () => {
    expect(parseRounds(BODY).map((r) => r.round)).toEqual(['dsa', 'behavioral']);
  });

  it('parses question titles, skipping header and separator rows', () => {
    const [dsa] = parseRounds(BODY);
    expect(dsa.questions.map((q) => q.title)).toEqual([
      'Trapping rain water.',
      'Number of islands in a 2D grid.',
    ]);
  });

  it('parses difficulty regardless of emoji or case', () => {
    const [dsa] = parseRounds(BODY);
    expect(dsa.questions.map((q) => q.difficulty)).toEqual(['hard', 'medium']);
  });

  it('parses backticked tags', () => {
    const [dsa] = parseRounds(BODY);
    expect(dsa.questions[0].tags).toEqual(['two-pointers', 'array']);
  });

  it('treats an em-dash as no difficulty and no tags', () => {
    const behavioral = parseRounds(BODY)[1];
    expect(behavioral.questions[0].difficulty).toBeNull();
    expect(behavioral.questions[0].tags).toEqual([]);
  });

  it('counts questions across rounds', () => {
    expect(countQuestions(parseRounds(BODY))).toBe(3);
  });
});
