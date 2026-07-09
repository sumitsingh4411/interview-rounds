/**
 * The path prefix the app is served under.
 *
 * The site is hosted at https://nextjoblist.com/interview-rounds, so everything
 * lives under /interview-rounds. Next's `basePath` handles <Link>, the router,
 * and bundled `_next` assets automatically — but NOT strings you build by hand
 * (a `fetch` to a file in /public, a favicon href). Use `withBasePath()` for
 * those.
 *
 * MUST stay in sync with `basePath` in next.config.ts.
 */
export const BASE_PATH = '/interview-rounds';

/** Prefix a root-absolute path (e.g. a /public asset) with the base path. */
export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
