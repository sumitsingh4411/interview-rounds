import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { QuestionsExplorer } from '@/components/QuestionsExplorer';
import { getTotals } from '@/content/loader';

export function generateMetadata(): Metadata {
  const t = getTotals();
  return {
    title: 'All interview questions',
    description: `All ${t.questions.toLocaleString()} interview questions from ${t.companies} top tech companies in one filterable list — filter by round, role, level and difficulty, practice on LeetCode, and tick off what you have solved. Free, no signup.`,
    alternates: { canonical: '/questions' },
  };
}

export default function QuestionsPage() {
  const totals = getTotals();

  return (
    <Container className="py-12">
      <p className="eyebrow">Question bank</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-fg sm:text-4xl">
        All questions
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        {totals.questions.toLocaleString()} questions from {totals.companies}{' '}
        companies in one place. Filter by round, role, level and difficulty, then
        tick off what you have solved — it syncs with your{' '}
        <Link href="/progress" className="text-brand hover:underline">
          progress dashboard
        </Link>
        .
      </p>

      <div className="mt-8">
        <QuestionsExplorer />
      </div>
    </Container>
  );
}
