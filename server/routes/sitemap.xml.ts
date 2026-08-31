import { solutions } from '../../app/data/solutions'
import { industries } from '../../app/data/industries'

/**
 * sitemap.xml, generated from the same data the pages are built from, so a
 * new solution or sector cannot be added without appearing here.
 */

interface Entry {
  loc: string
  priority: string
  changefreq: string
}

export default defineEventHandler(async (event) => {
  const siteUrl =
    useRuntimeConfig().public.siteUrl?.replace(/\/$/, '') ||
    'https://cipherfourai.com'

  const staticPages: Entry[] = [
    { loc: '/', priority: '1.0', changefreq: 'monthly' },
    { loc: '/solutions', priority: '0.9', changefreq: 'monthly' },
    { loc: '/industries', priority: '0.9', changefreq: 'monthly' },
    { loc: '/projects', priority: '0.8', changefreq: 'monthly' },
    { loc: '/about', priority: '0.8', changefreq: 'monthly' },
    { loc: '/credentials', priority: '0.8', changefreq: 'monthly' },
    { loc: '/insights', priority: '0.7', changefreq: 'weekly' },
    { loc: '/contact', priority: '0.9', changefreq: 'yearly' },
    { loc: '/careers', priority: '0.5', changefreq: 'monthly' },
    { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
  ]

  const solutionPages: Entry[] = solutions.map((s) => ({
    loc: `/solutions/${s.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
  }))

  const industryPages: Entry[] = industries.map((i) => ({
    loc: `/industries/${i.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
  }))

  // Insights come from the content collection so new articles appear
  // automatically on the next build.
  let insightPages: Entry[] = []
  try {
    const articles = await queryCollection(event, 'insights')
      .where('draft', '=', false)
      .all()
    insightPages = articles.map((a: { path: string }) => ({
      loc: a.path,
      priority: '0.6',
      changefreq: 'yearly',
    }))
  }
  catch {
    // Content not available at this point in the build — skip rather than fail.
  }

  const all = [
    ...staticPages,
    ...solutionPages,
    ...industryPages,
    ...insightPages,
  ]

  const lastmod = new Date().toISOString().split('T')[0]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (entry) => `  <url>
    <loc>${siteUrl}${entry.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
