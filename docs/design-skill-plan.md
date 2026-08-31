# Design skill plan — Cipher4 site

Written 2026-08-18. Purpose: decide **which** of the newly installed design skills this
specific repo should use, before any code is written. Read this before starting design work.

Nothing in this plan has been implemented. It is a decision document.

---

## 1. What is installed

All at **user scope** (`~/.claude/`), so it is available in every project, not just this one.

**Marketplaces** (5): `anthropics/skills`, `nextlevelbuilder/ui-ux-pro-max-skill`,
`claudekit/frontend-design-pro-demo`, `freshtechbro/claudedesignskills`,
`addyosmani/web-quality-skills` — 18 plugins, all enabled.

**Standalone skills** (10) in `~/.claude/skills/`: `threejs-fundamentals`, `-geometry`,
`-materials`, `-lighting`, `-textures`, `-animation`, `-loaders`, `-shaders`,
`-postprocessing`, `-interaction`.

**MCP servers**: `playwright`, `chrome-devtools`.

### Corrections to the original install list

| Requested | Reality |
|---|---|
| `anthropic/frontend-design` | Repo does not exist. Real source is the `anthropics/skills` marketplace; installed its `example-skills` plugin, which contains `frontend-design`. |
| `@anthropic-ai/chrome-devtools-mcp` | 404 on npm — Anthropic does not publish this. Real package is `chrome-devtools-mcp` (Chrome DevTools team). Installed that. |
| `pinkforest/threejs-playground` | Does not exist; that account has no such repo. Installed `dogmandcl/Claude-Threejs-Skills` instead, which carries the identical 10-skill set. Unvetted (0 stars) but pure markdown, no scripts, and the API usage checks out. |

---

## 2. The starting point is already good

This matters more than the skill list. The repo is not a rescue job:

- `app/assets/css/tokens.css` — raw scale → semantic role layer, a documented WCAG rule
  explaining why two cyans exist (`cyan-500` fails AA for text at ~2.9:1, `cyan-700` passes
  at ~4.9:1), navy-tinted shadows, and an `.on-dark` context block that re-points token
  values so components need no dark variants.
- `app/plugins/reveal.ts` — zero-dependency IntersectionObserver reveal. Single shared
  observer, unobserves after firing, degrades safely without JS, respects reduced motion,
  and documents the Vue SSR error it works around.
- `nuxt.config.ts` — fonts self-hosted to kill the render-blocking Google Fonts request,
  Iconify pinned to a local bundle so nothing is fetched at build or runtime, static
  prerender.
- `scripts/` — a hand-built Playwright QA suite: `audit.mjs` (contrast + alt text across
  14 routes), `keyboard-check.mjs` (focus-visible + tab traps), `find-overflow.mjs`,
  `overflow-sweep.mjs`, `shots.mjs` (multi-breakpoint screenshots).

**Consequence:** several installed skills duplicate work already done here, and at least one
would actively regress a documented decision. Triage below.

---

## 3. Skill triage

### Use — adds capability this repo lacks

| Skill | Why it earns its place |
|---|---|
| **`ui-ux-pro-max`** | The strongest of the set. Ships a working Python search tool over versioned CSV data, including `stacks/nuxtjs.csv` and `stacks/vue.csv` written for **Nuxt 4.5** with `app/pages` conventions, docs URLs, severity, and a `verified_at` of 2026-08-13 — i.e. current for this exact stack. Verified working: `python "$PLUGIN/scripts/search.py" "<query>" --stack nuxtjs`. Caveat: `references/pro-rules.md` is native/mobile-scoped; use `references/quick-reference.md` for web. |
| **`example-skills:frontend-design`** | A thinking skill, not a template. Two-pass process: draft a token plan, then critique it against the brief before writing code. Explicitly names the three AI-default looks to avoid and argues for spending boldness in exactly one place. This is the right instrument for choosing *what* the 3D moment should be. |
| **`threejs-*` (the 10 standalone)** + **`threejs-webgl`** | Framework-agnostic vanilla Three.js, which is what a Nuxt client-only component needs. Use the standalone set as API reference; `threejs-webgl` adds a starter scene and materials guide. |
| **`web-quality-skills:core-web-vitals`** / **`:performance`** / **`:accessibility`** | Accurate, current, Addy Osmani's. The LCP/INP/CLS thresholds and the 75th-percentile framing are the budget this project should be held to once 3D lands. Complements — does not replace — the existing `scripts/`. |
| **`gsap-scrolltrigger`** | The only credible way to drive scroll-linked camera moves on a 3D hero. Adds roughly 35KB gzip (core + plugin). **Verify licensing before shipping** — GSAP's terms changed under Webflow and all plugins became free including commercial use, but this skill's docs say nothing about licensing, so confirm at gsap.com rather than trusting either source. |

### Redundant — the repo already does this, better

| Skill | Why to skip |
|---|---|
| **`scroll-reveal-libraries`** (AOS) | `reveal.ts` already does this with zero dependencies, SSR-safe, with stagger and directional variants. AOS would add weight and do less. Using it would be a regression. |
| **`locomotive-scroll`** | Hijacks native scroll. Costs accessibility, breaks scroll-anchoring, and is a known jank source on mid-range Android — against three of the four stated constraints. |
| **`webapp-testing`** / much of **`web-quality-audit`** | `scripts/audit.mjs`, `keyboard-check.mjs` and `shots.mjs` already cover contrast, focus, tab traps, overflow and visual QA on this repo's actual routes. Prefer extending those over introducing a parallel harness. |

### Not applicable — React-only

`react-three-fiber`, `motion-framer`, `animated-component-libraries` (Magic UI / React Bits),
and most of `web3d-integration-patterns` assume React. This is Nuxt 4 / Vue 3. The *layered
separation* architecture in `web3d-integration-patterns` (3D layer / animation layer / UI
layer, kept independent) is worth stealing conceptually; none of its code transfers.

### Conflicts — do not apply as written

**`frontend-design-pro`** carries the rule *"NEVER use Inter, Roboto, Arial, system-ui, or
any default AI font."* This site's type system is Inter + Inter Tight, self-hosted
specifically to remove a render-blocking request. Following that rule would undo a
deliberate, documented performance decision to satisfy a generic style preference. It also
hands out hardcoded Unsplash URLs — external image requests, against the self-hosted
approach, and such IDs are frequently fabricated. Its aesthetic-direction table is useful as
a menu of vocabulary; its non-negotiables are not for this project.

**`lightweight-3d-effects`** is only half lightweight. Vanilla-Tilt (~5KB) and Zdog (~28KB)
are genuinely cheap; Vanta.js is built on Three.js and is not. All its examples load from
unpkg CDN, which contradicts this repo's no-third-party-runtime stance. Vendor locally if
used at all.

---

## 4. The unresolved tension

The stated direction was **full 3D showcase**, with **hard performance budget**, **WCAG AA**,
**must work on mid-range mobile**, and **impact over budget** all selected. Those last four
cannot all be maximised simultaneously — Three.js is roughly 150–200KB gzip before any scene
code, and mid-range Android is exactly where WebGL costs bite.

This is resolvable, but only as an explicit architecture, not as a compromise on quality:

1. **The 3D hero is an enhancement, never the content.** The existing `HomeHero.vue` — photo,
   directional two-stop scrim, grid mask, drifting auras — stays as the served baseline. It
   already looks good and it is what ships in the HTML.
2. **Gate on capability, not on guesswork.** Mount the canvas only when the device passes a
   check (WebGL2 present, `deviceMemory`/`hardwareConcurrency` above a floor, not
   `prefers-reduced-motion`, not Save-Data). Everything failing gets the current hero and
   loses nothing.
3. **Never block LCP.** Nuxt 4.5 lazy hydration (`<LazyHero3d hydrate-on-visible />`) is the
   mechanism — surfaced by `ui-ux-pro-max --stack nuxtjs`, severity Low, documented at
   nuxt.com. Import `three` dynamically so it lands in its own chunk outside the entry bundle.
4. **Cap the pixel ratio.** The `threejs-webgl` starter uses `setPixelRatio(window.devicePixelRatio)`
   uncapped; the standalone `threejs-fundamentals` correctly uses
   `Math.min(window.devicePixelRatio, 2)`. On a 3× phone the uncapped version renders ~2.25×
   the fragments for no visible gain. Use the cap. The skills disagree — this one is right.
5. **Budget before building.** Record current LCP/INP/CLS and transfer size, set the ceiling,
   and treat the 3D work as failed if it breaks the ceiling on a throttled mid-tier profile.

**Open question for you:** which of these wins when they collide — the budget, or the
showcase? Point 1–4 keeps both, but only if the 3D hero is genuinely optional. If it must be
the primary experience on every device, the budget has to move, and that should be a stated
decision rather than a discovered one.

---

## 5. Suggested order

Not started. Each phase should end with a decision point.

**Phase 0 — Baseline.** Run the existing `scripts/audit.mjs`, `keyboard-check.mjs`,
`overflow-sweep.mjs` against a fresh build, plus a Chrome DevTools MCP trace for real
LCP/INP/CLS. Fix the hardcoded stale scratchpad path in `scripts/shots.mjs` while there.
Output: the numbers the redesign is accountable to.
*Skills: `core-web-vitals`, `performance`, existing scripts, chrome-devtools MCP.*

**Phase 1 — Direction.** Decide what the 3D moment *is* before deciding how to build it. The
brief writes itself from the subject: offshore, logistics, oil and gas, West African routes,
and a logo whose circuit nodes the token file already treats as the brand's central motif.
Candidates worth comparing: a route/network globe, or a node-field that makes the logo's
circuit idea literal at page scale. Pick one; make it the single signature element.
*Skills: `example-skills:frontend-design` (two-pass process), `ui-ux-pro-max --design-system`,
`modern-web-design` for vocabulary.*

**Phase 2 — Architecture spike.** Build the capability gate, the lazy-hydration boundary and
the fallback path with a placeholder cube. Measure. Confirm the budget survives before any
scene design goes in.
*Skills: `threejs-fundamentals`, `ui-ux-pro-max --stack nuxtjs`.*

**Phase 3 — The scene.** Only once Phase 2 holds.
*Skills: `threejs-geometry` / `-materials` / `-lighting` / `-shaders`, `gsap-scrolltrigger`
for scroll linkage.*

**Phase 4 — Section language.** Whatever is agreed for the rest of the page, built on the
existing `v-reveal` directive rather than a new animation dependency.

**Phase 5 — Verify.** Re-run Phase 0 in full. AA contrast on every new surface, keyboard
path intact, reduced-motion honoured, no horizontal overflow at 360px, and the budget met on
a throttled profile.

---

## 6. Decisions still needed

1. Budget vs showcase, when they collide (§4).
2. Which signature element (§5, Phase 1) — this drives everything downstream.
3. Whether the redesign is homepage-first or a whole-site sweep.
4. Whether GSAP earns its ~35KB, or whether scroll linkage can ride on the existing
   IntersectionObserver work.
