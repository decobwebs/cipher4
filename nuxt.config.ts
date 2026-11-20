// https://nuxt.com/docs/api/configuration/nuxt-config
import { dropInlinedStylesheets } from './scripts/drop-inlined-css.mjs'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/content',
    '@vueuse/nuxt',
  ],

  // The design system: tokens, base, layout, then the shared page and form
  // blocks. (The old legacy-*.css files were removed in Phase 6.)
  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/base.css',
    '~/assets/css/layout.css',
    '~/assets/css/pages.css',
    '~/assets/css/forms.css',
    '~/assets/css/motion.css',
    '~/assets/css/blueprint.css',
  ],

  // Components live in app/components/c4/** and are registered by their
  // file name alone (C4Logo, SiteHeader...), as the plan names them.
  // app/components/dev holds the internal /_roads demo frame (DevRoadDemo).
  components: [
    { path: '~/components/c4', pathPrefix: false },
    '~/components',
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
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'theme-color', content: '#14204F' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      // Marks that JavaScript runs, before first paint. Entrance and draw-on
      // states only apply under `.c4-js`, so with JavaScript off every icon,
      // line and word is simply shown. It also keeps a copy of the address's
      // query string: during start-up the router briefly drops it, and the
      // road's ?motion=on test switch needs to see it.
      //
      // Phase 6: `.c4-motion` turns on the sections' starting states (they
      // play in from there), unless the device asks for reduced motion.
      // Safety: if the app has not started within 4 s (a script failed, or
      // a very slow phone), it is taken off again, so nothing stays hidden.
      script: [
        {
          innerHTML: "var d=document.documentElement;d.classList.add('c4-js');window.__c4Search=location.search;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('c4-motion');setTimeout(function(){if(!window.__c4m)d.classList.remove('c4-motion')},4000)}",
          tagPosition: 'head',
        },
      ],
    },
    // Choreography 24: the old page fades out quickly, the new one fades in
    // as the road bursts (styles in assets/css/motion.css).
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // Self-host the type: no request to Google at runtime. Only the weights
  // in use (Geist 400/500/600, Geist Mono 400). `font-synthesis-weight: none`
  // in base.css means an unlisted weight silently falls back to the nearest
  // loaded one, so any weight used in CSS must appear here.
  fonts: {
    families: [
      // Phase 8: preloaded, so the real fonts arrive with the first paint
      // instead of swapping in a second later (a second full layout).
      { name: 'Geist', provider: 'google', weights: [400, 500, 600], styles: ['normal'], preload: true },
      { name: 'Geist Mono', provider: 'google', weights: [400], styles: ['normal'], preload: true },
    ],
    defaults: { subsets: ['latin'] },
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
    // C4_OUTPUT_DIR builds somewhere else, so a running `nuxi preview` (which
    // holds .output open) does not block a test build. Unset: .output.
    ...(process.env.C4_OUTPUT_DIR ? { output: { dir: process.env.C4_OUTPUT_DIR } } : {}),
    // Phase 8: drop stylesheet links whose CSS is already inline on the page.
    hooks: {
      'prerender:generate': dropInlinedStylesheets,
    },
    prerender: {
      crawlLinks: true,
      // `/_styleguide` and `/_roads` are linked from nowhere, so the crawler
      // cannot find them.
      routes: [
        '/', '/sitemap.xml', '/robots.txt', '/_styleguide', '/_roads',
        // The share-card page, which scripts/make-og-images.mjs photographs.
        '/_og',
        // Phase 2b road experiments (internal, removed at launch).
        '/_roads/demos', '/_roads/arrival', '/_roads/sectors', '/_roads/steering',
        '/_roads/message-sent', '/_roads/not-found', '/_roads/spine', '/_roads/launch',
        // The 404 page, written as 404.html for the host to serve with status 404.
        '/404.html',
      ],
      failOnError: false,
    },
  },

  // Old addresses move permanently (301) to their new pages, so links and
  // search rankings carry over (content B1). scripts/check-redirects.mjs
  // tests each one.
  // These give a true 301 in the dev server. The static build can only
  // write "refresh" pages for them, so vercel.json repeats the same list as
  // real 301s for the live host. Keep the two lists the same.
  routeRules: {
    '/solutions': { redirect: { to: '/services', statusCode: 301 } },
    '/solutions/software-platforms': { redirect: { to: '/services/operational-platforms', statusCode: 301 } },
    '/solutions/robotics': { redirect: { to: '/services/iot-robotics', statusCode: 301 } },
    '/solutions/technology-supply': { redirect: { to: '/services/it-infrastructure', statusCode: 301 } },
    '/industries': { redirect: { to: '/sectors', statusCode: 301 } },
    '/industries/transport': { redirect: { to: '/sectors/logistics-and-transport', statusCode: 301 } },
    '/industries/logistics': { redirect: { to: '/sectors/logistics-and-transport', statusCode: 301 } },
    '/industries/oil-and-gas': { redirect: { to: '/sectors/oil-and-gas', statusCode: 301 } },
    '/industries/supply-chain': { redirect: { to: '/sectors/supply-chain-and-procurement', statusCode: 301 } },
    '/projects': { redirect: { to: '/work', statusCode: 301 } },
  },

  // Dev server only: prepare the road's 3D libraries up front. Otherwise the
  // first page that loads the road makes Vite stop and reload the page.
  vite: {
    optimizeDeps: { include: ['three', 'postprocessing'] },
  },

  experimental: {
    payloadExtraction: true,
    // Phase 8: links fetch their page when hovered, focused or touched, not
    // as soon as they scroll into view, so loading the page is not shared
    // with preparing every page it links to.
    defaults: {
      nuxtLink: {
        prefetchOn: { visibility: false, interaction: true },
      },
    },
  },

  // Phase 8: write all the CSS a page needs into its HTML, including the
  // global design-system files, so the first paint does not wait on a row
  // of separate stylesheet downloads (each one a round trip on a phone).
  features: {
    inlineStyles: true,
  },

  typescript: {
    strict: true,
  },
})
