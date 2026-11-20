# Cipher4 redesign: owner decisions

Every new session reads this file first, before `CLAUDE.md` rules are applied to new work.
Each new decision the owner makes is added here, with its date. Newer entries win over older ones.

## Standing decisions (recorded 18 November 2026)

### Review and publishing
1. **No pushing.** Never push to GitHub, on any branch, until the owner says so. Work stays in local commits on the `redesign` branch. No Vercel previews.
2. **Local review.** The owner reviews on their own laptop. Every phase report ends with:
   - the run command: `npx nuxi dev --host 0.0.0.0 --port 3300` (run in `C:\Users\HP\Cipher4`)
   - the localhost links for the pages built in that phase
   - the phone link (same Wi-Fi; check the laptop's address with `ipconfig`)
3. Reports are written in plain, simple language.

### Roads
4. **Road experiments kept on real pages** *(narrowed on 2026-11-20: see "Design direction change" below; the Sector road is removed)*:
   - Arrival: home hero, once per visit
   - Steering: desktop with a mouse only
   - Sector road: home Sectors section, desktop only
   - Message sent: contact page, brighter car
   - 404 road
5. **Dropped:** Day to night.
6. **Demo only:** Spine and Launch stay on `/_roads` only, never on real pages.
7. **No loops or folds on any road**, except the home hero, which stays exactly as it is.
8. **Header roads between 900 and 1100 px wide** sit in a band under the text. *(From 2026-11-20 only the contact header keeps a road.)*

### Content and naming
9. Use technology **names**, not company logos.
10. "**Nigerian-owned**" stays out until the owner confirms it.
11. Never use **internal system names** in file names or web addresses.
12. **Content file wording always wins** over board wording.

### Phase 6 brief (recorded ahead of time)
13. Animation is the most important part of the site for the owner. Phase 6 must deliver the full motion system from the Motion and Choreography boards:
    - Lenis connected to GSAP ScrollTrigger
    - all 24 section animations, each with its meaning
    - the scroll-linked moments
    - designed transitions between sections, never a hard cut
    - page transitions
    - the work carousel matching the owner's 3D card carousel script, with light dust, never trapping page scroll
    - a screen video of each page scrolling, at desktop and phone sizes

### Phase 5 scope additions
14. In Phase 5, remove the old contact form, `/solutions`, `/industries` and `/projects`, and redirect (301) each old address to its new page.

## Decision log

| Date | Decision |
|---|---|
| 2026-11-18 | File created with the decisions above. Phase 4 approved; Phase 5 started. |
| 2026-11-18 | Phase 5 approved. Phase 6 started. |
| 2026-11-18 | Website addresses: Zeal Global Resources `https://zealgloballtd.com/`, Lighthouse Maritime Agency `https://lighthousemaritimeltd.com/`. Before adding a "Visit site" link, check the public site for leftover placeholder text (lorem ipsum, "your text here", dummy phone numbers or emails), viewing public pages only: never log in or submit anything. A site with placeholders gets no link, and the owner is told what was found. The other website cards stay without links until the owner sends their addresses. |
| 2026-11-18 | Every external link opens in a new tab with `rel="noopener"`. |
| 2026-11-18 | RC number: 8980008. Footer: "Registered in Nigeria. RC 8980008." Credentials registration row: "RC 8980008". |
| 2026-11-18 | The Critical operations support tier (1 hour, 24/7) stays out. |
| 2026-11-18 | "Last updated" on Privacy and Terms stays hidden until launch day. |
| 2026-11-18 | Old unused files (old header, footer, mobile menu and default layout, old small components, old data files, legacy styles) may be deleted, after checking nothing still uses them. |
| 2026-11-18 | *(Superseded 2026-11-20: inner headers get blueprint drawings, not roads.)* Header road choices per page (Phase 5) are approved: Sectors uses the maritime road; Our work, Credentials, Careers and Launchpad the long straight road; the other pages the service road; articles, Privacy and Terms have no road. |
| 2026-11-19 | **Phase 6 not approved.** Fix list from the owner's local test (items below). Phase 6 is not done until every item on the animation checklist works smoothly. |
| 2026-11-19 | **Performance.** Lenis driven by `gsap.ticker`, ScrollTrigger updated on every Lenis scroll, lag smoothing off, and ScrollTrigger refreshed after fonts, images and page changes. Test on the production build (`npx nuxi build`, then `npx nuxi preview`), not only dev mode, and measure the frame rate while scrolling each page. Report Home and a service page before and after fixes. Only one road runs at a time; roads off screen stop completely. |
| 2026-11-19 | *(Superseded 2026-11-20: the blueprint build replaces it.)* **How we deliver (desktop) is a horizontal scroll section:** the section pins; scrolling down moves the six stages sideways, left to right; the light-speed road runs horizontally across the section beneath the stages, moving at scroll speed and stopping when scrolling stops; each stage lights as it reaches the centre; after the last stage the page continues normally; scrolling up reverses everything. **Phones and tablets:** no pinning, a vertical timeline where stages light as you scroll. Text never sits on the road. |
| 2026-11-19 | **Inner-page roads** must not break (flicker, freeze, wrong shape or blank) on any page that has a road. Find the exact cause and fix it everywhere. |
| 2026-11-19 | **Work page logos:** every logo in the same box (max 160 px wide by 48 px tall), scaled to fit with the same visual weight, in solid ink `#0E1222`, never grey, stretched or blurred. Logo files too low in quality to look sharp are reported; the owner will supply better files in `design-handoff/client-logos/`. |
| 2026-11-19 | **Checklist:** all 24 Choreography animations, plus the scroll-linked moments (hero exit, mission words, How we deliver, section strips) and page transitions, each marked working / partly working / not built, with its page. Every item must be finished. |
| 2026-11-19 | **Phase 6 sign-off recordings:** a short screen recording of the home page (from the production build) and a service page, at desktop and phone sizes. |

## Design direction change (2026-11-20)

Phase 6 not approved after reviewing the production build. Everything below replaces any earlier decision it conflicts with.

### A. The road: only where it means something
The road means "an operation in motion": decisions going out, information coming back. It stays **only** on:
- the home hero
- the closing band
- the contact page header (with Message sent)
- the 404 page

Removed everywhere else: the section strips, the home Sectors road, How we deliver, and all other inner-page headers.
- **Home hero:** the road gets its own area on the right half of the hero, so the whole road shows (amber and indigo sides), with only a soft fade at that area's left edge. It never sits behind text.
- **Bug to fix:** roads must start correctly after client-side page changes (route changes, page transitions, back and forward). Re-initialise on every route change, call `ScrollTrigger.refresh()`, and test by clicking between pages without reloading.

### B. Second brand language: the blueprint
Based on the owner's blueprint T-shirt design: an engineer's drawing.
- **Grid paper:** 1 px lines in `#1A3AB5` at 6 to 8% opacity, 48 px squares, fading out at the edges with a radial mask.
- **Dot grid:** 1.5 px dots at the same spacing.
- **Construction details:** thin crosshair registration marks at section corners, measurement ticks along an edge, small drawing-sheet labels in Geist Mono ("SHEET 03 / 12", "DWG C4-0xx") at 50% opacity.
- **Illustrations** are line drawings (1.5 px indigo lines, amber nodes) that draw themselves as they enter the screen.
- **Backgrounds rotate** down the page: white, grid paper, dot grid, soft paper-to-mist gradients. Never two plain sections in a row. Text contrast stays WCAG AA everywhere.
- **Inner page headers:** the road is replaced by a large blueprint drawing of that page's icon, drawn with construction lines, guide circles and measurements, drawing itself on load.

### C. No empty columns
Design rule: a column must never sit empty next to content.
1. **Mission:** under the mission sentence on the left, a blueprint diagram of "Sense → Decide → Prove": three nodes on grid paper joined by lines, each with a small mono label. The paragraph stays on the right. The nodes light up in order as it enters.
2. **What you can expect from us:** the left column is sticky (heading and a large blueprint drawing). As each promise reaches the middle of the screen, the drawing changes to that promise's icon, drawn large in blueprint style, with a crossfade.
3. **Every page:** any column or area left visibly empty next to content gets a meaningful element or a better layout. Report the list of changes.

### D. How we deliver: a blueprint that builds itself
The horizontal road is removed. Desktop pins; phones get a vertical version with no pinning.
- 01 Discovery: a survey grid draws and measurement points appear
- 02 Design: construction lines draw the plan of a system (modules as outlined boxes, connections as dashed lines)
- 03 Pilot: one module fills solid indigo
- 04 Deployment: all modules fill and the connections turn solid
- 05 Training: small people nodes appear around the system
- 06 Support: a live amber pulse travels around the connections in a loop

The stage text sits beside the drawing, never on it. The active stage is highlighted; scrolling back reverses each step.

### E. Section transitions: no straight dividing lines
No hard horizontal lines or flat edges between sections. Varied down the page, with GSAP ScrollTrigger and Lenis:
- **Sheet stack:** the next section slides up over the previous one like a sheet of drawing paper (32 px top corners, soft shadow); the previous section scales to 0.97 and dims slightly.
- **Grid draw-in:** the new section's grid lines draw in from one edge before its content arrives.
- **Colour wash:** the background colour changes smoothly as the section enters.

Every entrance still follows the Choreography rules: plays once, text never hidden more than 0.6 s, only transform and opacity animated, still with reduced motion.

### Sign-off for this round
Screenshots of the home page sections (desktop and phone), a screen recording of the full home page scroll and of one service page, and the C3 list. Then stop and wait for approval.

## Phase 7 (2026-11-20)

| Date | Decision |
|---|---|
| 2026-11-20 | **Phase 6 approved** (round 3, the blueprint direction, commit `10c5e33`). Phase 7 started: forms, SEO and redirects. |
| 2026-11-20 | **Form key:** the owner adds `NUXT_PUBLIC_WEB3FORMS_KEY` to `.env` personally. Never read or edit `.env`. The form works with the key when it is there and shows the "Setup needed" state when it is not. When the owner says the key is added, send **one** test message only, with "TEST — please ignore" in the subject. |
| 2026-11-20 | **Analytics:** none for now. The slot in `app.vue` stays empty; the privacy policy stays as written. |
| 2026-11-20 | **Share images (Open Graph):** 1200 × 630, in brand style (white, blueprint grid, Cipher4 logo, the page title), for Home and each page type: service, sector, case study, contact, youth. This replaces the content file's J6 note (logo on deep indigo). |
| 2026-11-20 | **Still open, no action now:** the 3D carousel reference script and better client logo files; the owner sends them when available. |
| 2026-11-20 | **How Phase 7 was built (Claude, for review):** the sitemap stays a small generated file (`server/routes/sitemap.xml.ts`) built from the same data as the pages, not the `@nuxtjs/sitemap` module; it lists the 30 public pages and leaves out redirects, the 404 page and the internal pages. robots.txt also blocks `/_og`, the internal share-card page. Share images are made from the built site by `scripts/make-og-images.mjs` into `public/og/`; pages without their own card (lists, About, legal, articles) use the default card. `scripts/check-redirects.mjs` checks content B1, `nuxt.config.ts` and `vercel.json` agree, and can test a build or a running server. |
| 2026-11-20 | **Descriptions kept as written:** 9 page descriptions run past 160 characters and two article titles past 70, so search results may shorten them. They are the content file's wording, so they stay unless the owner shortens them. |
| 2026-11-20 | **Removed as unused after Phase 7:** `app/data/company.ts` (replaced by `data/site.ts` in the structured data), `app/data/industries.ts` and `app/data/solutions.ts` (only the old sitemap used them). `public/images/og-default.jpg` is now unused but kept until the owner says to remove it. |
