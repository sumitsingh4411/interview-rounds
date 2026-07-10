import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { CompanyInterviews } from '@/components/CompanyInterviews';
import {
  getCompanyBySlug,
  getInterviewsForCompany,
  getAllCompanySlugs,
} from '@/content/loader';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbLd } from '@/lib/seo';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllCompanySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) return { title: 'Company not found' };

  const interviews = getInterviewsForCompany(company.id);
  const questions = interviews.reduce((n, i) => n + i.questionCount, 0);

  return {
    title: `${company.name} interview questions by round`,
    description: `${questions} real ${company.name} interview questions from ${interviews.length} experiences, mapped round by round — online assessment, DSA, machine coding, system design, hiring manager and behavioral. Filter by role and level. Free, no signup.`,
    alternates: { canonical: `/companies/${slug}` },
    openGraph: {
      title: `${company.name} interview questions by round`,
      description: `${questions} ${company.name} interview questions across ${interviews.length} experiences, mapped to every round.`,
      type: 'article',
      // Defining `openGraph` replaces the root's object outright, which drops
      // the image injected by app/opengraph-image.tsx. Re-attach it.
      images: ['/opengraph-image'],
    },
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();

  const interviews = getInterviewsForCompany(company.id);

  return (
    <Container className="py-12">
      <JsonLd
        data={breadcrumbLd([
          { name: 'Home', path: '/' },
          { name: 'Companies', path: '/companies' },
          { name: company.name, path: `/companies/${slug}` },
        ])}
      />
      <nav className="mb-6">
        <Link
          href="/companies"
          className="glass-card group inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted hover:text-fg"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          All companies
        </Link>
      </nav>

      <header className="flex items-start gap-4">
        <span
          aria-hidden
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-line-2 bg-elevated font-display text-2xl font-semibold text-brand"
        >
          {company.name.charAt(0)}
        </span>
        <div>
          <p className="eyebrow">
            {company.industry ?? 'Company'}
            {company.hq ? ` · ${company.hq}` : ''}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-fg">
            {company.name}
          </h1>
          {company.description ? (
            <p className="mt-2 max-w-2xl text-muted">{company.description}</p>
          ) : null}
          <p className="mt-3 font-mono text-xs text-faint">
            {interviews.length} interview{interviews.length === 1 ? '' : 's'}{' '}
            shared — read how each round went.
          </p>
        </div>
      </header>

      <div className="mt-10">
        <CompanyInterviews interviews={interviews} />
      </div>
    </Container>
  );
}
