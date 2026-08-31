// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/content',
    '@vueuse/nuxt',
  ],

  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/base.css',
    '~/assets/css/components.css',
    '~/assets/css/utilities.css',
  ],

  runtimeConfig: {
    public: {
      // Set in .env — see .env.example. Never commit the real key.
      web3formsKey: '',
      siteUrl: 'https://cipherfourai.com',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en-NG' },
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'theme-color', content: '#14204F' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // Self-host the type. Removes the render-blocking Google Fonts request
  // and the third-party data transfer that came with it.
  // Self-host the type. Removes the render-blocking Google Fonts request
  // and the third-party data transfer that came with it.
  //
  // Inter Tight 300 exists for the display headline only. `font-synthesis-weight:
  // none` in base.css means an unlisted weight does not degrade gracefully —
  // the browser silently substitutes the nearest loaded weight, so a light
  // headline would render at 600 and nobody would see an error. Any weight
  // referenced in tokens.css must appear here.
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600] },
      { name: 'Inter Tight', provider: 'google', weights: [300, 600, 700] },
    ],
    defaults: { subsets: ['latin'] },
  },

  // Lucide only. The old site loaded Font Awesome twice and Material Symbols
  // once — three icon stylesheets for about twenty glyphs.
  //
  // Both bundles are pinned to the locally installed @iconify-json/lucide so
  // nothing is fetched from the Iconify API at build or at runtime. Without
  // this the prerender tries the network and silently drops icons.
  icon: {
    mode: 'svg',
    provider: 'server',
    serverBundle: 'local',
    fallbackToApi: false,
    clientBundle: {
      scan: true,
      sizeLimitKb: 512,
      // `scan` only finds icon names written literally in templates. Every
      // icon below is referenced dynamically from a file in app/data, so it
      // has to be declared here or it silently renders as nothing.
      // Adding an icon to a data file? Add it here too.
      icons: [
        // solutions.ts
        'lucide:layout-dashboard',
        'lucide:bot',
        'lucide:server',
        // industries.ts
        'lucide:route',
        'lucide:container',
        'lucide:flame',
        'lucide:git-branch',
        // process.ts
        'lucide:target',
        'lucide:package',
        'lucide:life-buoy',
        'lucide:settings',
        // credentials.ts
        'lucide:building-2',
        'lucide:hard-hat',
        'lucide:badge-check',
        'lucide:shield',
        'lucide:shield-check',
        'lucide:lock',
        'lucide:check-circle-2',
        'lucide:scale',
        // home differentiators
        'lucide:map-pin',
        'lucide:plug',
        'lucide:cloud-off',
        'lucide:flag',
        // ProofStrip.vue — referenced from a computed, not written literally
        // in the template, so `scan` cannot find them.
        'lucide:layers',
        'lucide:calendar',
      ],
    },
  },

  image: {
    // PIN THE PROVIDER.
    // ------------------------------------------------------------------
    // @nuxt/image picks its provider by sniffing the build environment, and
    // on Vercel it finds `process.env.VERCEL` and switches to the `vercel`
    // provider, which emits `/_vercel/image?url=...` URLs.
    //
    // That endpoint only exists when the deployment declares an `images`
    // block in .vercel/output/config.json, and `nitro.preset: 'static'`
    // never emits one. So every one of those URLs fell through to the
    // catch-all and returned the 404 page: HTTP 200, Content-Type
    // text/html, 3KB. The browser cannot decode HTML as an image, fired the
    // onerror handler @nuxt/image attaches, and rendered the alt text.
    //
    // It passed every local check because VERCEL is not set locally, so the
    // same config resolved to ipxStatic and worked.
    //
    // ipxStatic prerenders each variant to a real file under /_ipx/ at build
    // time, which is what a static deployment needs and what the local build
    // was already producing.
    provider: 'ipxStatic',
    quality: 72,
    format: ['avif', 'webp'],
    screens: { xs: 360, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536, '2xl': 1920 },
  },

  content: {
    build: {
      markdown: {
        toc: { depth: 3 },
      },
    },
  },

  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sitemap.xml', '/robots.txt'],
      failOnError: false,
    },
  },

  experimental: {
    payloadExtraction: true,
  },

  typescript: {
    strict: true,
  },
})
