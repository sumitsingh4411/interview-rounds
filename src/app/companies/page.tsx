import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { CompanyCard } from '@/components/CompanyCard';
import { getCompaniesWithStats } from '@/db/queries';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Companies',
  description: 'Browse interview questions by company, mapped to each round.',
};

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const companies = await getCompaniesWithStats(q);

  return (
    <Container className="py-12">
      <p className="eyebrow">Browse</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-fg">Companies</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Pick a company to see its questions grouped by interview round.
      </p>

      <form action="/companies" className="mt-6 max-w-md">
        <div className="flex items-center gap-2 rounded-xl border border-line-2 bg-surface px-3.5 py-2.5 focus-within:border-brand">
          <span aria-hidden className="font-mono text-brand">
            /
          </span>
          <input
            type="search"
            name="q"
            defaultValue={q ?? ''}
            placeholder="Filter companies…"
            aria-label="Filter companies by name"
            className="min-w-0 flex-1 bg-transparent font-mono text-sm text-fg placeholder:text-faint focus:outline-none"
          />
        </div>
      </form>

      {companies.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-xl border border-line bg-surface p-6 text-muted">
          {q
            ? `No companies match “${q}”.`
            : 'No companies yet. Run the seed script to load starter content.'}
        </p>
      )}
    </Container>
  );
}
