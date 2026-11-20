/**
 * Serves a built site for local measuring, the way the live host does:
 * text files compressed (brotli, or gzip), hashed /_nuxt/ files cached for
 * a year, pages revalidated. Without compression, speed measurements here
 * would be worse than the real site for no real reason.
 *
 *   ROOT=.output/public PORT=3200 node scripts/static-server.mjs
 *
 * With TLS_KEY and TLS_CERT (paths to a local test certificate) it speaks
 * HTTP/2 over https, as the live host does. Speed tools model HTTP/1.1 as
 * six downloads at a time, which makes a local test look slower than the
 * real site for no real reason.
 */
import { createServer } from 'node:http'
import { createSecureServer } from 'node:http2'
import { readFile, stat } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { join, extname } from 'node:path'
import { brotliCompressSync, gzipSync, constants } from 'node:zlib'

const ROOT = process.env.ROOT || '.output/public'
const PORT = Number(process.env.PORT || 3200)
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.webm': 'video/webm', '.mp4': 'video/mp4',
}
const COMPRESS = new Set(['.html', '.css', '.js', '.mjs', '.json', '.svg', '.xml', '.txt'])
const cache = new Map()

function compressed(path, mtime, body, enc) {
  // Keyed by the file's modified time too, so a rebuild is never served stale.
  const key = `${path}:${mtime}:${enc}`
  if (!cache.has(key)) {
    cache.set(key, enc === 'br'
      ? brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } })
      : gzipSync(body, { level: 9 }))
  }
  return cache.get(key)
}

function send(req, res, status, path, body, mtime = 0) {
  const ext = extname(path)
  const headers = {
    'content-type': TYPES[ext] || 'application/octet-stream',
    'cache-control': path.includes('_nuxt') || path.includes('_fonts') || path.includes('_ipx')
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=0, must-revalidate',
  }
  const accept = String(req.headers['accept-encoding'] || '')
  if (COMPRESS.has(ext) && body.length > 512) {
    const enc = /\bbr\b/.test(accept) ? 'br' : /\bgzip\b/.test(accept) ? 'gzip' : null
    if (enc) {
      body = compressed(path, mtime, body, enc)
      headers['content-encoding'] = enc
      headers.vary = 'accept-encoding'
    }
  }
  headers['content-length'] = body.length
  res.writeHead(status, headers)
  res.end(req.method === 'HEAD' ? undefined : body)
}

async function handle(req, res) {
  const url = decodeURIComponent((req.url || '/').split('?')[0])
  const candidates = [join(ROOT, url), join(ROOT, url, 'index.html'), join(ROOT, url + '.html')]
  for (const p of candidates) {
    try {
      const s = await stat(p)
      if (!s.isFile()) continue
      send(req, res, 200, p, await readFile(p), s.mtimeMs)
      return
    } catch {}
  }
  const notFound = join(ROOT, '404.html')
  const nf = await stat(notFound).catch(() => null)
  send(req, res, 404, notFound, await readFile(notFound).catch(() => Buffer.from('Not found')), nf?.mtimeMs ?? 0)
}

const tls = process.env.TLS_KEY && process.env.TLS_CERT
const server = tls
  ? createSecureServer({ key: readFileSync(process.env.TLS_KEY), cert: readFileSync(process.env.TLS_CERT), allowHTTP1: true }, handle)
  : createServer(handle)
server.listen(PORT, () => console.log(`serving ${ROOT} on ${tls ? 'https' : 'http'}://localhost:${PORT}${tls ? ' (HTTP/2)' : ''}`))
