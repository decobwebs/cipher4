/**
 * sitemap.xml (plan, Phase 7). Every public page, built from the same data
 * files the pages use, so a new service, sector or case study appears here
 * on the next build. Articles come from content/insights (published only).
 *
 * Left out on purpose: the old addresses (they redirect), the 404 page,
 * and the internal pages (/_styleguide, /_roads, /_og), which robots.txt
 * also blocks.
 */
import { services } from '../../app/data/services'
import { sectors } from '../../app/data/sectors'
import { cases } from '../../app/data/work'

type Entry = { loc: string, priority: string, changefreq: string }

const page = (loc: string, priority: string, changefreq = 'monthly'): Entry => ({ loc, priority, changefreq })

export default defineEventHandler(async (event) => {
  const siteUrl = (useRuntimeConfig().public.siteUrl || 'https://cipherfourai.com').replace(/\/$/, '')

  const pages: Entry[] = [
    page('/', '1.0', 'weekly'),
    page('/services', '0.9'),
    ...services.map((s) => page(`/services/${s.slug}`, '0.8')),
    page('/sectors', '0.9'),
    ...sectors.map((s) => page(`/sectors/${s.slug}`, '0.8')),
    page('/work', '0.9'),
    ...cases.map((c) => page(c.path, '0.8')),
    page('/about', '0.7'),
    page('/technologies', '0.6'),
    page('/credentials', '0.7'),
    page('/careers', '0.6'),
    page('/youth', '0.7'),
    page('/youth/launchpad', '0.6'),
    page('/youth/scholarships', '0.6'),
    page('/insights', '0.6', 'weekly'),
    page('/contact', '0.8'),
    page('/privacy', '0.3', 'yearly'),
    page('/terms', '0.3', 'yearly'),
  ]

  try {
    const articles = await queryCollection(event, 'insights').where('draft', '=', false).all()
    for (const a of articles as { path: string }[]) pages.push(page(a.path, '0.6', 'yearly'))
  }
  catch {
    // Content not ready at this point in the build: skip the articles
    // rather than fail the whole sitemap.
  }

  const lastmod = new Date().toISOString().split('T')[0]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((e) => `  <url>
    <loc>${siteUrl}${e.loc === '/' ? '/' : e.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
