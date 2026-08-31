import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'

const ROOT = '.output/public'
const PORT = Number(process.env.PORT || 3200)
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain',
}

createServer(async (req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0])
  const candidates = [join(ROOT, url), join(ROOT, url, 'index.html'), join(ROOT, url + '.html')]
  for (const p of candidates) {
    try {
      const s = await stat(p)
      if (!s.isFile()) continue
      res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' })
      res.end(await readFile(p))
      return
    } catch {}
  }
  res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
  res.end(await readFile(join(ROOT, '404.html')).catch(() => 'Not found'))
}).listen(PORT, () => console.log(`serving ${ROOT} on http://localhost:${PORT}`))
