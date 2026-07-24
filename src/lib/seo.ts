import { SITE } from './site';

export type Crumb = { name: string; path: string };

const abs = (path: string) => `${SITE.url}${path}`;

/**
 * Stable @id references to the Organization and WebSite nodes defined once in
 * the root layout. Pointing every page's structured data back at these — rather
 * than redeclaring them — consolidates the whole site into a single entity
 * graph, which is a much stronger signal than isolated per-page snippets.
 */
export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;
const OG_IMAGE = `${SITE.url}/opengraph-image`;

/**
 * schema.org BreadcrumbList. Lets search engines render a breadcrumb trail
 * instead of a bare URL in results.
 */
export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/**
 * Article schema for a single interview-experience page. Authored and published
 * by the site Organization, part of the WebSite, and about the company — so the
 * page is understood as a distinct editorial entity, not a near-duplicate of its
 * siblings.
 */
export function interviewLd(opts: {
  path: string;
  headline: string;
  description: string;
  companyName: string;
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${abs(opts.path)}#article`,
    headline: opts.headline,
    description: opts.description,
    url: abs(opts.path),
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    isAccessibleForFree: true,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    about: { '@type': 'Organization', name: opts.companyName },
    image: OG_IMAGE,
    ...(opts.keywords && opts.keywords.length
      ? { keywords: opts.keywords.join(', ') }
      : {}),
  };
}

/**
 * CollectionPage wrapping an ItemList — the honest type for an index-style page
 * (a company's interviews, a round's questions). The ItemList gives crawlers an
 * explicit, ordered map of the child URLs worth following.
 */
export function collectionLd(opts: {
  path: string;
  name: string;
  description: string;
  items: { name: string; path: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${abs(opts.path)}#collection`,
    name: opts.name,
    description: opts.description,
    url: abs(opts.path),
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    isAccessibleForFree: true,
    publisher: { '@id': ORG_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: abs(it.path),
      })),
    },
  };
}
