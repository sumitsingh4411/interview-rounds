import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SearchInput } from '@/components/SearchInput';
import { QuestionCard } from '@/components/QuestionCard';
import { searchQuestions } from '@/db/queries';
import { asRole, asLevel, asRound } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search interview questions across companies and rounds.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    role?: string;
    level?: string;
    round?: string;
  }>;
}) {
  const sp = await searchParams;
  const query = (sp.q ?? '').trim();
  const filter = {
    role: asRole(sp.role),
    level: asLevel(sp.level),
    round: asRound(sp.round),
  };

  const results = query ? await searchQuestions(query, filter) : [];

  return (
    <Container className="max-w-3xl py-12">
      <p className="eyebrow">Search</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-fg">
        Find a question
      </h1>

      <div className="mt-6">
        <SearchInput
          initialValue={query}
          autoFocus={!query}
          placeholder="Try “system design” or “react”…"
        />
      </div>

      {query ? (
        <p className="mt-6 font-mono text-xs text-faint">
          {results.length} result{results.length === 1 ? '' : 's'} for “{query}”
        </p>
      ) : null}

      {query && results.length === 0 ? (
        <p className="mt-4 rounded-xl border border-line bg-surface p-6 text-muted">
          Nothing matched “{query}”. Try a broader term, or{' '}
          <Link href="/companies" className="text-brand hover:underline">
            browse companies
          </Link>
          .
        </p>
      ) : null}

      <ul className="mt-4 space-y-3">
        {results.map(({ question, company }) => (
          <li key={question.id}>
            <Link
              href={`/companies/${company.slug}`}
              className="mb-1.5 inline-block font-mono text-xs text-faint hover:text-fg"
            >
              {company.name}
            </Link>
            <QuestionCard question={question} />
          </li>
        ))}
      </ul>

      {!query ? (
        <p className="mt-4 text-muted">
          Search across every company and round. Looking for a place to start?{' '}
          <Link href="/companies" className="text-brand hover:underline">
            Browse companies →
          </Link>
        </p>
      ) : null}
    </Container>
  );
}
