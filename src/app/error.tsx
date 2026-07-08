'use client';

import { Container } from '@/components/ui/Container';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Something broke</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-fg">
        That didn&apos;t load.
      </h1>
      <p className="mt-3 max-w-md text-muted">
        We hit an error fetching this page. Try again — if it keeps happening,
        the database connection may be down.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-7 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-on-brand hover:opacity-90"
      >
        Try again
      </button>
    </Container>
  );
}
