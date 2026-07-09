import { SITE } from './site';

export type Crumb = { name: string; path: string };

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
      item: `${SITE.url}${c.path}`,
    })),
  };
}
