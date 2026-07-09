import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SearchInput } from '@/components/SearchInput';
import { RoundRailPreview } from '@/components/RoundRailPreview';
import { CompanyCard } from '@/components/CompanyCard';
import {
  getPopularCompanies,
  getRoundCounts,
  getTotals,
} from '@/content/loader';
import { ROLE_LABELS, ROUND_ORDER } from '@/lib/constants';

function compact(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

const VALUE_PROPS = [
  {
    k: 'round',
    title: 'Mapped to the round',
    body: 'Every question is tagged to the exact stage it shows up in — OA, DSA, machine coding, system design, behavioral.',
  },
  {
    k: 'role',
    title: 'Filtered to you',
    body: 'Narrow to frontend, backend, or full-stack and your target level, from intern to staff.',
  },
  {
    k: 'source',
    title: 'Sourced honestly',
    body: 'Community-shared experiences and curated repos, with AI-generated likely questions always labeled as such.',
  },
];

export default function HomePage() {
  const companies = getPopularCompanies(6);
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
      <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="eyebrow">Interview prep, by the round</p>
          <h1 className="mt-4 text-balance font-display text-4xl leading-[1.05] font-bold text-fg sm:text-6xl">
            Know every round
            <br />
            before you walk in.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Real interview questions from top companies, mapped to the exact
            round, role, and level they show up in — so you prep for what you
            will actually face.
          </p>
          <div className="mt-7 max-w-xl">
            <SearchInput placeholder="Try “system design” or “react”…" />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-faint">
            <Link href="/companies" className="text-brand hover:underline">
              Browse all companies →
            </Link>
            <span aria-hidden>·</span>
            <span className="font-mono text-xs">
              {ROLE_LABELS.frontend} · {ROLE_LABELS.backend} ·{' '}
              {ROLE_LABELS.fullstack}
            </span>
          </div>

          {/* Stats strip */}
          <dl className="mt-9 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl px-4 py-3">
                <dt className="font-display text-2xl font-bold text-fg">
                  {s.n}
                </dt>
                <dd className="mt-0.5 font-mono text-[0.7rem] tracking-wide text-faint">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:pl-6">
          <RoundRailPreview counts={roundCounts} />
        </div>
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
      <Container className="py-16">
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {VALUE_PROPS.map((v, i) => (
            <div key={v.k} className="flex gap-3">
              <span className="rail-node" data-active={i === 0} aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="pt-1">
                <h3 className="text-base text-fg">{v.title}</h3>
                <p className="mt-1 text-sm text-muted">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
