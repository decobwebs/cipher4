/**
 * robots.txt, generated so the sitemap URL always matches the deployed host.
 */
export default defineEventHandler((event) => {
  const siteUrl =
    useRuntimeConfig().public.siteUrl?.replace(/\/$/, '') ||
    'https://cipherfourai.com'

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`
})
