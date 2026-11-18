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
