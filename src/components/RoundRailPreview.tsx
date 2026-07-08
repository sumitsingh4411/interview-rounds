import { ROUND_ORDER, ROUND_LABELS } from '@/lib/constants';

/**
 * A compact, static rendering of the full round pipeline for the home hero —
 * communicates the core idea ("we map every round") at a glance.
 */
export function RoundRailPreview() {
  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-5 backdrop-blur-sm">
      <p className="eyebrow mb-4">A typical loop</p>
      <ol className="rail space-y-3.5">
        {ROUND_ORDER.map((round, i) => (
          <li key={round} className="flex items-center gap-3.5">
            <span
              className="rail-node !h-8 !w-8 !text-xs"
              data-active={i === 0}
              aria-hidden
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-sm text-muted">{ROUND_LABELS[round]}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
