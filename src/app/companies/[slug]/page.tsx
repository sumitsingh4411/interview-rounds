import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Filters } from '@/components/Filters';
import { RoundRail } from '@/components/RoundRail';
import { getCompanyBySlug, getQuestionsForCompany } from '@/db/queries';
import {
  filterQuestions,
  groupQuestionsByRound,
  facetsOf,
} from '@/lib/questions';
import { asRole, asLevel, asRound } from '@/lib/constants';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ role?: string; level?: string; round?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) return { title: 'Company not found' };
  return {
    title: `${company.name} interview questions`,
    description: `Interview questions asked at ${company.name}, grouped by round, role, and level.`,
  };
}

export default async function CompanyPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) notFound();

  const allQuestions = await getQuestionsForCompany(company.id);
  const facets = facetsOf(allQuestions);

  const sp = await searchParams;
  const active = {
    role: asRole(sp.role),
    level: asLevel(sp.level),
    round: asRound(sp.round),
  };

  const filtered = filterQuestions(allQuestions, active);
  const groups = groupQuestionsByRound(filtered);

  return (
    <Container className="py-12">
      {/* Company header */}
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
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[15rem_1fr]">
        {/* Filters */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-4 font-mono text-xs text-faint">
            {filtered.length} of {allQuestions.length} shown
          </p>
          <Filters facets={facets} active={active} />
        </aside>

        {/* Rounds */}
        <div>
          {groups.length > 0 ? (
            <RoundRail groups={groups} />
          ) : (
            <div className="rounded-xl border border-line bg-surface p-8 text-center">
              <p className="text-fg">No questions match these filters.</p>
              <p className="mt-1 text-sm text-muted">
                Try clearing a filter, or{' '}
                <a href="/submit" className="text-brand hover:underline">
                  share a question you were asked
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
