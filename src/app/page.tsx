import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SearchInput } from '@/components/SearchInput';
import { RoundRailPreview } from '@/components/RoundRailPreview';
import { CompanyCard } from '@/components/CompanyCard';
import { ProgressSummary } from '@/components/progress/ProgressSummary';
import {
  getPopularCompanies,
  getRoundCounts,
  getTotals,
} from '@/content/loader';
import { ROUND_ORDER } from '@/lib/constants';

function compact(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

const VALUE_PROPS = [
  {
    k: 'round',
    title: 'Mapped to the round',
    body: 'Every question is tagged to the exact stage it shows up in — OA, DSA, machine coding, system design, behavioral.',
    color: { from: '#22d3ee', rgb: '34 211 238' },
  },
  {
    k: 'role',
    title: 'Filtered to you',
    body: 'Narrow to frontend, backend, or full-stack and your target level, from intern to staff.',
    color: { from: '#818cf8', rgb: '129 140 248' },
  },
  {
    k: 'source',
    title: 'Sourced honestly',
    body: 'Every question carries its source. Curated, community-shared, or AI-generated — always labeled, never guessed.',
    color: { from: '#c084fc', rgb: '192 132 252' },
  },
];

export default function HomePage() {
  const companies = getPopularCompanies(9);
  const roundCounts = getRoundCounts();
  const totals = getTotals();
  const stats = [
    { n: String(totals.companies), label: 'companies' },
    { n: String(totals.interviews), label: 'interviews' },
    { n: compact(totals.questions), label: 'questions' },
    { n: String(ROUND_ORDER.length), label: 'round types' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="grid-bg relative overflow-hidden">
        <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-20">
          <div>
            <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_2px_rgb(var(--glow)/0.6)]"
              />
              <span className="eyebrow !text-muted">
                Interview prep, by the round
              </span>
            </span>

            <h1 className="text-gradient mt-5 text-balance font-display text-[2.75rem] leading-[1.02] font-bold tracking-[-0.035em] sm:text-6xl">
              Know every round
              <br />
              before you walk in.
            </h1>

            <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-muted">
              Real interview questions from top companies, mapped to the exact
              round, role, and level they show up in — so you prep for what you
              will actually face.
            </p>

            <div className="mt-7 max-w-lg">
              <SearchInput placeholder="Try “system design” or “react”…" />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-faint">
              <Link
                href="/questions"
                className="font-medium text-brand hover:underline"
              >
                Browse all {compact(totals.questions)} questions →
              </Link>
              <span aria-hidden>·</span>
              <Link
                href="/companies"
                className="font-medium text-muted hover:text-fg"
              >
                All companies →
              </Link>
            </div>

            {/* Stats strip */}
            <dl className="mt-10 grid max-w-lg grid-cols-2 gap-2.5 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="glass-card rounded-xl px-3.5 py-3"
                >
                  <dt className="font-display text-[1.6rem] leading-none font-bold text-fg">
                    {s.n}
                  </dt>
                  <dd className="mt-1.5 font-mono text-[0.68rem] tracking-wide text-faint">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative lg:pl-4">
            {/* soft glow behind the rail so the glass has something to sit on */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-90 blur-3xl"
              style={{
                background:
                  'radial-gradient(closest-side, rgb(var(--glow) / 0.3), transparent 72%)',
              }}
            />
            <RoundRailPreview counts={roundCounts} />
          </div>
        </Container>
      </section>

      {/* Your progress — localStorage only, no account. Full page at /progress. */}
      <Container className="py-6">
        <ProgressSummary />
      </Container>

      {/* Popular companies */}
      <Container className="py-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Start here</p>
            <h2 className="mt-1 text-2xl text-fg">Popular companies</h2>
          </div>
          <Link href="/companies" className="text-sm text-muted hover:text-fg">
            View all →
          </Link>
        </div>
        {companies.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-line bg-surface p-6 text-muted">
            No companies yet. Run the seed script to load starter content.
          </p>
        )}
      </Container>

      {/* Value props */}
      <Container className="py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {VALUE_PROPS.map((v, i) => (
            <div
              key={v.k}
              className="glass-card group relative overflow-hidden rounded-2xl p-5"
              style={{ ['--glow']: v.color.rgb } as React.CSSProperties}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25"
                style={{ backgroundColor: v.color.from }}
              />
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-full font-mono text-xs font-medium"
                style={{
                  color: '#0b0e14',
                  backgroundImage: `linear-gradient(135deg, ${v.color.from}, rgb(${v.color.rgb} / 0.75))`,
                  boxShadow: `0 6px 18px -8px rgb(${v.color.rgb} / 0.7)`,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-fg">
                {v.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
