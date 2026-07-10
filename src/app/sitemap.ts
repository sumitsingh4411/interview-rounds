import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { getAllCompanySlugs, getAllInterviewIds } from '@/content/loader';
import { ROUND_ORDER } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  // The content is rebuilt with the site, so "now" is an honest last-modified.
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1, changeFrequency: 'weekly' },
    { url: `${base}/companies`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${base}/rounds`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${base}/questions`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${base}/progress`, priority: 0.4, changeFrequency: 'monthly' },
    { url: `${base}/search`, priority: 0.5, changeFrequency: 'monthly' },
  ];

  return [
    ...staticRoutes,
    ...ROUND_ORDER.map((r) => ({
      url: `${base}/rounds/${r}`,
      priority: 0.7,
      changeFrequency: 'weekly' as const,
    })),
    ...getAllCompanySlugs().map((slug) => ({
      url: `${base}/companies/${slug}`,
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    })),
    ...getAllInterviewIds().map((id) => ({
      url: `${base}/interviews/${id}`,
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    })),
  ].map((e) => ({ ...e, lastModified }));
}
