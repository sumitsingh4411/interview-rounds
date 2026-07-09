import type { Bank } from '@/content/types';
import { ROUND_COLORS, type Round } from '@/lib/constants';

/**
 * Open-source topic questions. Deliberately separated from the company
 * interviews above: these are practice material, not something anyone reported
 * being asked at a specific company.
 */
export function BankSection({ banks, round }: { banks: Bank[]; round: Round }) {
  if (banks.length === 0) return null;

  const color = ROUND_COLORS[round];
  const total = banks.reduce((n, b) => n + b.questions.length, 0);

  return (
    <section className="mt-16 border-t border-line pt-10">
      <p className="eyebrow">More practice · open source</p>
      <h2 className="mt-2 font-display text-2xl font-bold text-fg">
        Topic banks
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        {total} extra questions on this round&apos;s topics, imported from
        MIT-licensed open-source repositories. These are{' '}
        <strong className="text-fg">topic questions</strong> — they are not
        attributed to any company.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {banks.map((bank) => (
          <details key={bank.id} className="glass-card group rounded-2xl p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: color.from }}
                />
                <span className="font-display text-base font-semibold text-fg">
                  {bank.title}
                </span>
              </span>
              <span className="font-mono text-xs text-faint">
                {bank.questions.length} questions
                <span
                  aria-hidden
                  className="ml-2 inline-block transition-transform group-open:rotate-90"
                >
                  ›
                </span>
              </span>
            </summary>

            <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
              {bank.questions.map((q) => (
                <li
                  key={q.id}
                  className="flex gap-2 text-sm leading-relaxed text-muted"
                >
                  <span aria-hidden className="text-faint">
                    ·
                  </span>
                  {q.title}
                </li>
              ))}
            </ul>

            <a
              href={bank.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-faint transition-colors hover:text-brand"
            >
              ⎇ {bank.sourceRepo} · {bank.license} ↗
            </a>
          </details>
        ))}
      </div>
    </section>
  );
}
