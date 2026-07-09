import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { getAllCompanySlugs, getAllInterviewIds } from '@/content/loader';
import { ROUND_ORDER } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/companies`, priority: 0.9 },
    { url: `${base}/questions`, priority: 0.9 },
    { url: `${base}/progress`, priority: 0.4 },
    { url: `${base}/search`, priority: 0.5 },
  ];

  return [
    ...staticRoutes,
    ...ROUND_ORDER.map((r) => ({ url: `${base}/rounds/${r}`, priority: 0.7 })),
    ...getAllCompanySlugs().map((slug) => ({
      url: `${base}/companies/${slug}`,
      priority: 0.8,
    })),
    ...getAllInterviewIds().map((id) => ({
      url: `${base}/interviews/${id}`,
      priority: 0.6,
    })),
  ];
}
