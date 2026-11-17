# Redesign, Phase 0: audit and proposed structure

Date: 17 November 2026 · Branch: `redesign` · No visible changes to the site in this phase.

## 1. What was done

- Created the `redesign` branch from `main` (at `4114cb0`).
- Unpacked the build pack into `design-handoff/` (git-ignored). Moved its `CLAUDE.md` to the project root (there was none before).
- Read `BUILD-PLAN.md`, `CLAUDE.md` and the full content file, and looked at all 11 renders.
- Installed `gsap` 3.15.1 and `@nuxtjs/sitemap` 8.6.2. `@nuxt/fonts`, `@nuxt/image` and `@nuxt/content` were already installed.
- Confirmed the production build still passes (20 pages prerendered, as before).
- Confirmed the road source exists at `C:\Users\HP\cipher4-hyperspeed\build\src` (`index.js`, `presets.js`).

## 2. Versions

| Package | Installed | Note |
|---|---|---|
| nuxt | 4.5.2 | |
| vue | 3.5.41 | |
| three | 0.185.1 | Same as the portable road build |
| postprocessing | 6.39.4 | Same as the portable road build |
| lenis | 1.3.26 | Only used inside `ScrollStack.vue` today, not site-wide (see section 5) |
| @nuxt/content | 3.15.2 | |
| @nuxt/fonts | 0.14.0 | Currently loads Inter and Inter Tight; switches to Geist in Phase 1 |
| @nuxt/image | 2.1.0 | Provider pinned to `ipxStatic` for Vercel; keep that |
| @nuxt/icon | 2.4.1 | Lucide icons; replaced by `C4Icon` plus a few inline UI glyphs |
| gsap | 3.15.1 | New |
| @nuxtjs/sitemap | 8.6.2 | New. Installed but not switched on until Phase 7 (see section 5) |

No Tailwind in the project, so styling stays plain CSS as the plan says.

## 3. Current project: keep, rewrite or remove

**Keep** (as is, or with small changes)

| File | Plan |
|---|---|
| `composables/useContactForm.ts` | Keep the Web3Forms wiring. Add the honeypot and the J2 messages (Phase 7) |
| `composables/useSiteSchema.ts` | Keep. Update the Organization data from the content file (Phase 7) |
| `content/insights/*.md`, `content.config.ts` | Keep. Apply the exact find-and-replace edits from content H2 (Phase 5) |
| `scripts/*` (Playwright QA: contrast, keyboard, overflow, screenshots) | Keep and reuse for the checks in every phase |
| `nuxt.config.ts` | Keep. Change fonts, add redirects, sitemap and route rules over the phases |

**Rewrite** (same job, new design and copy)

| Current | Becomes |
|---|---|
| `assets/css/tokens.css`, `base.css`, `components.css`, `utilities.css` | New `tokens.css` with the plan's exact values, plus base, layout and focus styles |
| `layout/AppHeader.vue` | `SiteHeader` |
| `layout/MobileNav.vue` | `MobileMenu` |
| `layout/AppFooter.vue` | `SiteFooter` |
| `sections/CtaBand.vue` | `ClosingBand` |
| `ui/PageHero.vue`, `ui/SectionHeader.vue` | Same names, new design |
| `sections/ContactForm.vue` | `ContactForm` (two tabs, two steps on phones) |
| `ui/HyperspeedField.vue` | `HyperspeedRoad` from the portable source. The old file is retired once the new one matches it |
| `plugins/reveal.ts` | `useReveal` composable (same IntersectionObserver idea) |
| `sections/HomeHero`, `WhatWeDo`, `WhereWeWork`, `ProcessFlow`, `ui/LogoLoop` | New home sections from the boards |
| `data/*.ts` | Rewritten from the content file: `services`, `sectors`, `work`, `technologies`, `company`, `navigation`, `credentials`, `youth` |
| `pages/solutions/*` | `pages/services/*` (old addresses redirect) |
| `pages/industries/*` | `pages/sectors/*` (old addresses redirect) |
| `pages/projects.vue` | `pages/work/*` and `pages/products/lucidhr.vue` |
| Other pages (about, careers, contact, credentials, insights, privacy, terms) and `error.vue` | Rebuilt with the new components and copy |

**Remove** (once their replacement is live; I will ask before deleting)

- Effects not in the new design: `NebulaShader`, `SplashCursor`, `DriftWall`, `GlassSurface`, `ScrollStack`, `plugins/shine.ts`
- Small parts replaced by new components: `FeatureCard`, `CheckList`, `ProofStrip`
- `server/routes/sitemap.xml.ts` and `robots.txt.ts`, replaced by `@nuxtjs/sitemap` in Phase 7
- `@nuxt/icon` and `@iconify-json/lucide`
- Old images in `public/images/` that are not in the approved set (project screenshots, stock photos, illustrations). Project images will come only from `design-handoff/assets/work/`

**Not touched** (outside the site build): `legacy/`, `static/`, the root `assets/` folder, `cipher4-handover/`, `docs/profile/` and the other untracked docs.

## 4. Proposed folder structure

```
app/
  assets/css/        tokens.css · base.css (type, focus) · layout.css (container, section spacing)
  components/
    brand/           C4Logo · C4Icon (20 icons)
    ui/              C4Button · Eyebrow · SectionHeader · Breadcrumb
    layout/          SiteHeader · MobileMenu · ActionDock · SiteFooter · ClosingBand · PageHero
    road/            HyperspeedRoad
    home/            one component per home section, in board order
    blocks/          shared inner-page sections (problem cards, build lists, sector lines, related cards…)
    forms/           ContactForm · LaunchpadForm · InterestForm
    work/            WorkCarousel · work cards
  composables/       useReveal · useRoadController · useLenis · useContactForm · useSiteSchema
  lib/hyperspeed/    index.js · presets.js · LICENSE-REACT-BITS.md (from the portable build's source)
  data/              site · navigation · services · sectors · work · technologies · company · credentials · youth
  pages/             index · services/ · sectors/ · work/ · products/lucidhr · technologies · about
                     credentials · insights/ · youth/ · careers · contact · privacy · terms · _styleguide
  error.vue          404 page (returns status 404)
public/
  images/work/       the 4 approved screenshots
  images/clients/    client logos
  images/road/       still frames for no-WebGL and low-power devices
  og/                share images
  favicon.svg
```

## 5. Things I noticed

1. **Client logos and GitHub.** The site has to show the client logos and the four project screenshots, and Vercel builds from GitHub, so the copies the site uses must be committed (in `public/images/`). The pack itself stays ignored. The current site already commits its client logos. Please confirm this is fine.
2. **Lenis is not site-wide today.** It only runs inside `ScrollStack.vue`. Turning it on for the whole site (and off for reduced motion) is new work, done in Phase 6.
3. **Sitemap clash.** The project already serves its own `sitemap.xml` and `robots.txt`. `@nuxtjs/sitemap` is installed but switched off until Phase 7, when the old routes are removed. Otherwise two sitemaps would fight.
4. **Work page images.** Content F1 lists 7 website cards. Only Lighthouse has an approved screenshot. The others (Zeal, Quick Trips, Lustre, the Foundation, AA Heritage, Kasim Auwal Lawal) will use logo cards. There is no logo in the pack for the Kasim card, so it will be name-only.
5. **LucidHR waitlist link.** Content F4 says to point to the waitlist address, but gives no URL. I need it before Phase 4.
6. **Boards.** I will read each board's exact values in the phase that builds from it (Main and Icons in Phase 1, Motion in Phase 2, and so on).
7. **.gitignore.** It already had one uncommitted line (`docs/profile/preview/`). It is committed on this branch together with the new `design-handoff/` line.
