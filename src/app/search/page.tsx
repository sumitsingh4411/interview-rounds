import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/ui/Container';
import { SearchResults } from '@/components/SearchResults';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search interview questions across companies and rounds.',
};

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
