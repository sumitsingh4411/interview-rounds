import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { getAllCompanySlugs, getAllInterviewIds } from '@/db/queries';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;

  let slugs: string[] = [];
  let interviewIds: number[] = [];
  try {
    [slugs, interviewIds] = await Promise.all([
      getAllCompanySlugs(),
      getAllInterviewIds(),
    ]);
  } catch {
    // Sitemap should still render if the DB is briefly unavailable.
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/companies`, priority: 0.9 },
    { url: `${base}/search`, priority: 0.5 },
  ];

  return [
    ...staticRoutes,
    ...slugs.map((slug) => ({ url: `${base}/companies/${slug}`, priority: 0.8 })),
    ...interviewIds.map((id) => ({
      url: `${base}/interviews/${id}`,
      priority: 0.6,
    })),
  ];
}
