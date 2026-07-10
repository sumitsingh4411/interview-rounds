import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { QuestionCard } from '@/components/QuestionCard';
import {
  getQuestionsByRound,
  getBanksForRound,
  getRoundCounts,
} from '@/content/loader';
import { BankSection } from '@/components/BankSection';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbLd } from '@/lib/seo';
import {
  asRound,
  ROUND_ORDER,
  ROUND_LABELS,
  ROUND_DESCRIPTIONS,
} from '@/lib/constants';

type PageProps = { params: Promise<{ round: string }> };

export function generateStaticParams() {
  return ROUND_ORDER.map((round) => ({ round }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { round } = await params;
  const valid = asRound(round);
  if (!valid) return { title: 'Round not found' };

  const total = getRoundCounts()[valid] ?? 0;

  return {
    title: `${ROUND_LABELS[valid]} interview questions`,
    description: `${total.toLocaleString()} ${ROUND_LABELS[valid]} interview questions asked at top tech companies. ${ROUND_DESCRIPTIONS[valid]} Filter by role and level — free, no signup.`,
    alternates: { canonical: `/rounds/${valid}` },
    openGraph: {
      title: `${ROUND_LABELS[valid]} interview questions`,
      description: `${total.toLocaleString()} ${ROUND_LABELS[valid]} questions from top tech companies.`,
      type: 'article',
      // See companies/[slug]: an openGraph override drops the root's image.
      images: ['/opengraph-image'],
    },
  };
}

export default async function RoundPage({ params }: PageProps) {
  const { round } = await params;
  const valid = asRound(round);
  if (!valid) notFound();

  const stage = ROUND_ORDER.indexOf(valid) + 1;
  const results = getQuestionsByRound(valid);
  const banks = getBanksForRound(valid);

  return (
    <Container className="py-12">
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', path: '/' },
          { name: ROUND_LABELS[valid], path: `/rounds/${valid}` },
        ])}
      />
      <div className="mb-8 flex flex-wrap gap-1.5">
        {ROUND_ORDER.map((r) => (
          <Link
            key={r}
            href={`/rounds/${r}`}
            className={
              'rounded-lg border px-2.5 py-1 font-mono text-xs transition-colors ' +
              (r === valid
                ? 'border-brand bg-brand/10 text-brand'
                : 'border-line text-muted hover:border-line-2 hover:text-fg')
            }
          >
            {ROUND_LABELS[r]}
          </Link>
        ))}
      </div>

      <header className="max-w-2xl">
        <p className="eyebrow">
          Round {String(stage).padStart(2, '0')} · {results.length} question
          {results.length === 1 ? '' : 's'}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-fg sm:text-4xl">
          {ROUND_LABELS[valid]}
        </h1>
        <p className="mt-3 text-lg text-muted">{ROUND_DESCRIPTIONS[valid]}</p>
      </header>

      {results.length > 0 ? (
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {results.map(({ question, company }) => (
            <li key={question.id}>
              <Link
                href={`/companies/${company.slug}`}
                className="mb-1.5 inline-block font-mono text-xs text-faint hover:text-fg"
              >
                {company.name}
              </Link>
              <QuestionCard
                question={question}
                href={`/interviews/${question.interviewId}#${question.id}`}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-xl border border-line bg-surface p-6 text-muted">
          No questions recorded for this round yet.
        </p>
      )}

      <BankSection banks={banks} round={valid} />
    </Container>
  );
}
