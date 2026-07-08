import { Container } from '@/components/ui/Container';

export default function Loading() {
  return (
    <Container className="py-16">
      <div className="h-4 w-40 animate-pulse rounded bg-surface-2" />
      <div className="mt-4 h-10 w-2/3 max-w-lg animate-pulse rounded bg-surface-2" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-2xl border border-line bg-surface"
          />
        ))}
      </div>
    </Container>
  );
}
