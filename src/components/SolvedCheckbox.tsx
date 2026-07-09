'use client';

import { useSolved, toggleSolved } from '@/lib/solved';

export function SolvedCheckbox({ questionId }: { questionId: string }) {
  const solved = useSolved();
  const isSolved = solved.has(questionId);

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isSolved}
      aria-label={isSolved ? 'Mark as not solved' : 'Mark as solved'}
      title={isSolved ? 'Solved — click to undo' : 'Mark as solved'}
      onClick={() => toggleSolved(questionId)}
      className={
        'relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-all ' +
        (isSolved
          ? 'border-transparent bg-easy text-canvas shadow-[0_0_0_3px_rgb(52_211_153_/_0.18)]'
          : 'border-line-2 text-transparent hover:border-easy/60 hover:text-easy/40')
      }
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M3 8.5 6.2 11.5 13 4.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
