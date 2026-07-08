import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Filters } from '@/components/Filters';
import { InterviewCard } from '@/components/InterviewCard';
import { getCompanyBySlug, getInterviewsForCompany } from '@/db/queries';
import { asRole, asLevel, ROLES, LEVELS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ role?: string; level?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) return { title: 'Company not found' };
  return {
    title: `${company.name} interview questions`,
    description: `Real ${company.name} interview experiences, grouped by round, across roles and levels.`,
  };
}

export default async function CompanyPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) notFound();

  const interviews = await getInterviewsForCompany(company.id);
  const facets = {
    roles: ROLES.filter((r) => interviews.some((i) => i.role === r)),
    levels: LEVELS.filter((l) => interviews.some((i) => i.level === l)),
    rounds: [],
  };

  const sp = await searchParams;
  const active = {
    role: asRole(sp.role),
    level: asLevel(sp.level),
    round: undefined,
  };

  const filtered = interviews.filter(
    (i) =>
      (!active.role || i.role === active.role) &&
      (!active.level || i.level === active.level),
  );

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
          <p className="mt-3 font-mono text-xs text-faint">
            {interviews.length} interview
            {interviews.length === 1 ? '' : 's'} shared — read how each round went.
          </p>
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[15rem_1fr]">
        {/* Filters */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-4 font-mono text-xs text-faint">
            {filtered.length} of {interviews.length} shown
          </p>
          <Filters facets={facets} active={active} />
        </aside>

        {/* Interviews */}
        <div>
          {filtered.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((interview) => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-line bg-surface p-8 text-center">
              <p className="text-fg">No interviews match these filters.</p>
              <p className="mt-1 text-sm text-muted">
                Try clearing a filter to see more experiences.
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
