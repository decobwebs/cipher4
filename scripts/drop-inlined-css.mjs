/**
 * Phase 8 (speed). With `features.inlineStyles`, Nuxt writes each page's CSS
 * into the HTML but still links the same component stylesheets as separate
 * files, and the browser waits for every one of them before the first
 * paint. This prerender hook removes a stylesheet link only when that file's
 * whole content is already inline on the same page. Anything not inline
 * keeps its link, so nothing can go missing.
 *
 * Used from nuxt.config.ts: nitro.hooks['prerender:generate'].
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const cache = new Map()

function cssFile(nitro, href) {
  if (cache.has(href)) return cache.get(href)
  let found = null
  for (const asset of nitro.options.publicAssets) {
    const base = (asset.baseURL || '/').replace(/\/?$/, '/')
    if (!href.startsWith(base)) continue
    const file = join(asset.dir, href.slice(base.length))
    if (existsSync(file)) { found = readFileSync(file, 'utf8').trim(); break }
  }
  cache.set(href, found)
  return found
}

export function dropInlinedStylesheets(route, nitro) {
  if (typeof route.contents !== 'string' || !route.fileName?.endsWith('.html')) return
  const html = route.contents
  const head = html.slice(0, html.indexOf('</head>'))
  if (!head) return
  const inline = [...head.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n')
  route.contents = html.replace(/<link rel="stylesheet" href="([^"]+\.css)"[^>]*>/g, (tag, href) => {
    const css = cssFile(nitro, href)
    return css && inline.includes(css) ? '' : tag
  })
}
