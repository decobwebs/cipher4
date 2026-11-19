# Phase 6 checklist: every movement, and where it stands

Checked on the **production build** (`npx nuxi build`, served as static files), with motion on, at desktop (1440 px) and phone (390 px) sizes, by an automated pass that looks for evidence each movement actually ran (lines fully drawn, cards settled, the road reacting, the stage lit). Last run: 19 November 2026, after the fixes in this round.

"Before" is the state you tested (commit `60842b5`).

## The 24 Choreography movements

| # | Movement | Page | Before | Now |
|---|---|---|---|---|
| 01 | Hero lines rise into place (with Arrival) | Home | Working | **Working** |
| 02 | Client logos come into focus | Home | Working | **Working** |
| 03 | Mission words light up as you read (scroll-linked) | Home | Partly: the last words stayed grey at normal reading position | **Working**: fully dark once the statement is on screen |
| 04 | One stack deals out six | Home, Services | Working | **Working** |
| 05 | One route joins four industries | Home, Sectors, Launchpad | Working | **Working** |
| 06 | Work: zoom-through from depth, light-dust carousel | Home, Our work | Partly: built to the Motion board; your carousel script was not found | **Working, to the board.** Matching your script still needs the script itself (see note) |
| 07 | Each promise gets signed off | Home, About, Credentials | Working | **Working** |
| 08 | How we deliver: stages light along the road | Home | **Not working** (you saw nothing happen) | **Working, rebuilt** to your brief: pinned, sideways, horizontal road, lights at centre; phones get a lit timeline |
| 09 | A scattered stack snaps together | Home, Technologies, service and sector pages | Working | **Working** |
| 10 | Articles turn down like pages | Home, Insights, Youth | Working | **Working** |
| 11 | Lines grow up into a light | Home youth band, About, Youth | Working | **Working** |
| 12 | The night road arrives below (closing band) | Most pages | Working | **Working** |
| 13 | Page header: the path types, the headline rises | Every inner page | Partly: the header road was hidden behind the words and flickered | **Working**: road in its own space right of the text |
| 14 | Problems fall into line | Service pages | Working | **Working** |
| 15 | Four parts join one record | Operational platforms | Working | **Working** |
| 16 | Your systems plug in | Operational platforms | Working | **Working** |
| 17 | A tide line runs across (each sector's own line) | Sector pages | Working | **Working** |
| 18 | Checked off like a manifest | Sector pages, Services, service pages | Working | **Working** |
| 19 | The screen opens up (scroll-linked) | Case studies, LucidHR | Partly: jumped from full width to small on load | **Working**: starts small from the first frame |
| 20 | The outcome gets underlined | Case studies | Working | **Working** |
| 21 | Your message travels (send) | Contact | Built, not tested | **Working**: arrow and trail play, header road speeds up, then the message appears (tested with no form key, so nothing was sent) |
| 22 | Three cities, one line | Contact | Working | **Working** |
| 23 | The footer logo draws itself | Every page | Working | **Working** |
| 24 | A burst of speed between pages | Every page change | Working | **Working** |

## Scroll-linked moments and transitions

| Item | Page | Before | Now |
|---|---|---|---|
| Lenis smooth scrolling, connected to GSAP ScrollTrigger | Every page | Working, but scroll handlers forced layout every frame | **Working**: Lenis driven by `gsap.ticker`, ScrollTrigger updated on every Lenis scroll, lag smoothing off, re-measured after fonts, images, height changes and page changes; scroll handlers no longer read the page layout |
| Hero exit (road speeds up, view widens, fades) | Home | Working | **Working** |
| Mission words | Home | Partly | **Working** (see 03) |
| How we deliver | Home | Not working | **Working** (see 08) |
| Section road strip | Home, Services | Partly: a second strip on Home added cost | **Working**: one strip per page; moves only while scrolling, stops when you stop |
| Transitions between sections | Every page | Working, but the fixed fade layer made scrolling slow | **Working**: a static soft blend where sections meet, no cost while scrolling |
| Page transitions | Every page change | Working | **Working** |
| Only one road at a time; roads off screen stop | Every page | Working | **Working**; the slow-device check now also works on Home (before, it never stepped in there) |

## Note on the carousel

The Motion board describes the carousel as "the 3D card carousel you shared". That script is not in the project, the design pack or anywhere on this laptop. The carousel is built to the board's description: 3D cards, cards leaving the centre break into amber and indigo light, drag, swipe, arrows and keys, and it never traps the page scroll. Send the script (any file in the project folder) and I will match it exactly.
