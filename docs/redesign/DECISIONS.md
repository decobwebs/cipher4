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
4. **Road experiments kept on real pages:**
   - Arrival: home hero, once per visit
   - Steering: desktop with a mouse only
   - Sector road: home Sectors section, desktop only
   - Message sent: contact page, brighter car
   - 404 road
5. **Dropped:** Day to night.
6. **Demo only:** Spine and Launch stay on `/_roads` only, never on real pages.
7. **No loops or folds on any road**, except the home hero, which stays exactly as it is.
8. **Header roads between 900 and 1100 px wide** sit in a band under the text.

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
| 2026-11-18 | Header road choices per page (Phase 5) are approved: Sectors uses the maritime road; Our work, Credentials, Careers and Launchpad the long straight road; the other pages the service road; articles, Privacy and Terms have no road. |
| 2026-11-19 | **Phase 6 not approved.** Fix list from the owner's local test (items below). Phase 6 is not done until every item on the animation checklist works smoothly. |
| 2026-11-19 | **Performance.** Lenis driven by `gsap.ticker`, ScrollTrigger updated on every Lenis scroll, lag smoothing off, and ScrollTrigger refreshed after fonts, images and page changes. Test on the production build (`npx nuxi build`, then `npx nuxi preview`), not only dev mode, and measure the frame rate while scrolling each page. Report Home and a service page before and after fixes. Only one road runs at a time; roads off screen stop completely. |
| 2026-11-19 | **How we deliver (desktop) is a horizontal scroll section:** the section pins; scrolling down moves the six stages sideways, left to right; the light-speed road runs horizontally across the section beneath the stages, moving at scroll speed and stopping when scrolling stops; each stage lights as it reaches the centre; after the last stage the page continues normally; scrolling up reverses everything. **Phones and tablets:** no pinning, a vertical timeline where stages light as you scroll. Text never sits on the road. |
| 2026-11-19 | **Inner-page roads** must not break (flicker, freeze, wrong shape or blank) on any page that has a road. Find the exact cause and fix it everywhere. |
| 2026-11-19 | **Work page logos:** every logo in the same box (max 160 px wide by 48 px tall), scaled to fit with the same visual weight, in solid ink `#0E1222`, never grey, stretched or blurred. Logo files too low in quality to look sharp are reported; the owner will supply better files in `design-handoff/client-logos/`. |
| 2026-11-19 | **Checklist:** all 24 Choreography animations, plus the scroll-linked moments (hero exit, mission words, How we deliver, section strips) and page transitions, each marked working / partly working / not built, with its page. Every item must be finished. |
| 2026-11-19 | **Phase 6 sign-off recordings:** a short screen recording of the home page (from the production build) and a service page, at desktop and phone sizes. |
