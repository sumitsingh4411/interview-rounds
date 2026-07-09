import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { CompanyBrowser } from '@/components/CompanyBrowser';
import { getCompaniesWithStats } from '@/content/loader';

export const metadata: Metadata = {
  title: 'All companies',
  description:
    'Browse interview questions and experiences from 85 top tech companies — Google, Meta, Amazon, Stripe, Netflix and more — mapped to each round, role and level.',
  alternates: { canonical: '/companies' },
};

export default function CompaniesPage() {
  const companies = getCompaniesWithStats();

  return (
    <Container className="py-12">
      <p className="eyebrow">Browse</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-fg">Companies</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Pick a company to read its interview experiences, round by round.
      </p>

      <CompanyBrowser companies={companies} />
    </Container>
  );
}
