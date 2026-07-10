import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbLd } from '@/lib/seo';
import { SITE } from '@/lib/site';
import { getRoundCounts, getTotals } from '@/content/loader';
import {
  ROUND_ORDER,
  ROUND_LABELS,
  ROUND_DESCRIPTIONS,
  ROUND_COLORS,
} from '@/lib/constants';

export function generateMetadata(): Metadata {
  const t = getTotals();
  return {
    title: 'Interview rounds',
    description: `The 8 interview rounds explained — online assessment, DSA, machine coding, low-level & system design, tech deep-dive, hiring manager and behavioral — with ${t.questions.toLocaleString()} real questions from ${t.companies} companies mapped to each.`,
    alternates: { canonical: '/rounds' },
    openGraph: {
      title: 'Interview rounds, explained',
      description: `The 8 rounds every tech loop is built from, with real questions mapped to each.`,
      type: 'article',
      images: ['/opengraph-image'],
    },
  };
}

export default function RoundsIndexPage() {
  const counts = getRoundCounts();
  const totals = getTotals();

  return (
    <Container className="py-12">
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', path: '/' },
          { name: 'Rounds', path: '/rounds' },
        ])}
      />
      {/* An ItemList helps search engines understand this as the round index. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Tech interview rounds',
          itemListElement: ROUND_ORDER.map((r, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: ROUND_LABELS[r],
            url: `${SITE.url}/rounds/${r}`,
          })),
        }}
      />

      <header className="max-w-2xl">
        <p className="eyebrow">The loop</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-fg sm:text-4xl">
          The 8 interview rounds
        </h1>
        <p className="mt-3 text-lg text-muted">
          A real interview isn&apos;t a pile of problems — it&apos;s a sequence of
          rounds, and each one tests something different. Here&apos;s every stage,
          with {totals.questions.toLocaleString()} real questions from{' '}
          {totals.companies} companies mapped to it.
        </p>
      </header>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2">
        {ROUND_ORDER.map((r, i) => {
          const color = ROUND_COLORS[r];
          const count = counts[r] ?? 0;
          return (
            <li key={r}>
              <Link
                href={`/rounds/${r}`}
                className="glass-card group relative flex h-full flex-col overflow-hidden rounded-2xl p-5"
                style={{ ['--glow' as string]: color.rgb }}
              >
                {/* accent glow on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
                  style={{ backgroundColor: color.from }}
                />
                <div className="flex items-center justify-between gap-3">
                  <span
                    aria-hidden
                    className="grid h-9 w-9 place-items-center rounded-full font-mono text-xs font-semibold"
                    style={{
                      color: '#0b0e14',
                      backgroundImage: `linear-gradient(135deg, ${color.from}, ${color.to})`,
                      boxShadow: `0 6px 18px -8px rgb(${color.rgb} / 0.7)`,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-xs text-faint">
                    <span className="text-fg">{count.toLocaleString()}</span>{' '}
                    question{count === 1 ? '' : 's'}
                  </span>
                </div>

                <h2 className="mt-4 font-display text-lg font-semibold text-fg">
                  {ROUND_LABELS[r]}
                </h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
                  {ROUND_DESCRIPTIONS[r]}
                </p>

                <span
                  className="mt-4 inline-flex items-center gap-1 font-mono text-xs"
                  style={{ color: color.from }}
                >
                  Explore questions
                  <span
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <Link href="/questions" className="text-brand hover:underline">
          Browse all {totals.questions.toLocaleString()} questions →
        </Link>
        <Link href="/companies" className="text-muted hover:text-fg">
          Browse {totals.companies} companies →
        </Link>
      </div>
    </Container>
  );
}
