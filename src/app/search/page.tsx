import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/ui/Container';
import { SearchResults } from '@/components/SearchResults';
import { getTotals } from '@/content/loader';

export function generateMetadata(): Metadata {
  const t = getTotals();
  return {
    title: 'Search interview questions',
    description: `Search ${t.questions.toLocaleString()} interview questions across ${t.companies} companies and every round — DSA, system design, machine coding, behavioral and more.`,
    alternates: { canonical: '/search' },
  };
}

export default function SearchPage() {
  return (
    <Container className="max-w-3xl py-12">
      <p className="eyebrow">Search</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-fg">
        Find a question
      </h1>

      <div className="mt-6">
        <Suspense fallback={<p className="text-muted">Loading…</p>}>
          <SearchResults />
        </Suspense>
      </div>
    </Container>
  );
}
