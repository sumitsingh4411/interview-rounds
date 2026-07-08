import {
  ROUND_LABELS,
  ROUND_DESCRIPTIONS,
  ROUND_ORDER,
  type Round,
} from '@/lib/constants';
import type { RoundGroup } from '@/lib/questions';
import { QuestionCard } from './QuestionCard';

function stage(round: Round): string {
  return String(ROUND_ORDER.indexOf(round) + 1).padStart(2, '0');
}

/**
 * The signature element: interview rounds as a connected vertical pipeline.
 * Each round is a numbered node on a spine; its questions branch off it.
 */
export function RoundRail({ groups }: { groups: RoundGroup[] }) {
  return (
    <div className="rail space-y-10">
      {groups.map((group) => (
        <section key={group.round} className="flex gap-4 sm:gap-5">
          <div className="rail-node" data-active="true" aria-hidden>
            {stage(group.round)}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <header>
              <p className="eyebrow">
                Round {stage(group.round)} · {group.questions.length} question
                {group.questions.length === 1 ? '' : 's'}
              </p>
              <h3 className="mt-1 text-lg text-fg">
                {ROUND_LABELS[group.round]}
              </h3>
              <p className="mt-0.5 text-sm text-muted">
                {ROUND_DESCRIPTIONS[group.round]}
              </p>
            </header>
            <ul className="mt-4 space-y-3">
              {group.questions.map((q) => (
                <li key={q.id}>
                  <QuestionCard question={q} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}
