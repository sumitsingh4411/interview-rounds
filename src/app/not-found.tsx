import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">404 · off the loop</p>
      <h1 className="mt-3 font-display text-4xl font-bold text-fg">
        This round doesn&apos;t exist.
      </h1>
      <p className="mt-3 max-w-md text-muted">
        The page you are looking for isn&apos;t here. Head back and pick a
        company to see its interview rounds.
      </p>
      <div className="mt-7 flex gap-3">
        <Link
          href="/companies"
          className="btn-brand rounded-xl px-4 py-2.5 text-sm font-medium"
        >
          Browse companies
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-muted hover:border-line-2 hover:text-fg"
        >
          Home
        </Link>
      </div>
    </Container>
  );
}
