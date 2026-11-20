# Phase 6, round 3: the blueprint direction

Owner's brief of 20 November 2026 (recorded in DECISIONS.md, "Design direction change"). Checked on the production build at desktop (1440 px) and phone (390 px) sizes with motion on, and with reduced motion.

## A. The road, only where it means something

| Item | Now |
|---|---|
| Roads kept | Home hero, closing band, contact header (Message sent), 404 page |
| Roads removed | The section strips (Home, Services), the home Sectors road, How we deliver, and every other inner-page header |
| Home hero | The road has its own area on the right half of the hero (from just past the text column to the right edge). The whole road shows, amber and indigo sides, with only a 120 px soft fade at that area's left edge, in the gap between the words and the road. It never sits behind text. On phones it stays in its own band under the words. |
| Roads after page changes | After every page change (links, Back, Forward) the road controller checks every road on the new page from scratch, and ScrollTrigger measures again. Tested by clicking between pages without reloading, then Back and Forward, then an unknown address: the header, hero, closing and 404 roads all start each time. A road can no longer be started twice. |

## B. The blueprint language

| Element | Where |
|---|---|
| Grid paper (1 px indigo lines at 7%, 48 px squares, fading out at the edges) | Home: Mission, Our work, Youth band. Inner pages: mist sections |
| Dot grid (1.5 px dots, 48 px spacing) | Home: Sectors, How we deliver. Inner pages: paper sections |
| Paper-to-mist wash | Home: Services, Technologies |
| Construction marks (corner crosshairs, a measuring edge, "DWG C4-0xx · SHEET 0x / 09" in mono at 50%) | Home: Mission, Sectors, Why, How we deliver, Youth band |
| Self-drawing blueprint drawings (1.5 px indigo, amber node; guide circles, centre lines, a construction line, measurements, title block) | Every inner page header except Contact; Why Cipher4; Launchpad form |

Every page header now carries a drawing of its own icon: each service and each sector its own; Services overview (Design), Sectors (Specialists), Our work (Reporting), case studies (Job control, Digital platforms, AI), Technologies (Works with what you have), About (Accountability), Credentials (Check), Insights and articles (Document), Youth (Education technology), Launchpad (Pilot), Scholarships (Training), Careers (One partner), Privacy and Terms (Document).

Text contrast: the grounds sit far below any text colour. The mission words' scroll effect now starts at 62% (not 28%), and the quiet words are slate, so every moment passes AA for large text.

## C. No empty columns (the C3 list)

| Page | Section | What was empty | Change |
|---|---|---|---|
| Home | Mission | Space under the sentence, beside the paragraph | Sense → Decide → Prove diagram under the sentence; paragraph on the right; nodes light in order |
| Home | Why Cipher4 | Left column under the heading | Sticky heading with a large blueprint drawing that crossfades to each promise's icon as it reaches the middle of the screen |
| Home | Sectors | Right of the heading (the removed road's box) | Split heading: title left, lead right |
| Home | How we deliver | (rebuilt) | Stage list left, drawing right, side by side |
| Services | How we deliver | Right of the heading | Split heading: lead on the right |
| About | Mission and vision | Right 40% beside the mission | The Sense → Decide → Prove diagram beside the mission |
| Technologies | Closing line | Band to the right of the line | Centred |
| Launchpad | Submit your idea | Left column beside the long form | Sticky heading with a blueprint drawing |
| Insights articles | The article | Right 40% beside the text, the whole article long | Sticky "On this page" list of the article's sections |
| Insights articles | Other article | Space beside the single card | An "All insights" card |
| Case studies | The challenge, solution, result | Left column held only a small number | Large outlined numerals with a measuring tick |
| Every inner page | Header | Right half (the road was hidden under a fade) | The page's blueprint drawing |
| Privacy, Terms | Header | Right half | A document drawing |

Checked and fine as they were: service pages, sector pages, Contact, Sectors overview, Our work, Credentials, Insights index, Youth, Scholarships, Careers, Privacy and Terms body (section list left, text at reading width).

## D. How we deliver, the blueprint build

Desktop: the section holds (it fits a 900 px screen), the stage list on the left and the drawing on the right, never overlapping. While held, the stage in focus opens (text and "You receive"); the others show their titles (the folded text stays readable by screen readers). Phones and tablets: no hold, each stage has its own small drawing beside its text, showing its step.

| Stage | The drawing |
|---|---|
| 01 Discovery | Survey grid draws; measurement points appear |
| 02 Design | Module outlines draw; dashed connections appear |
| 03 Pilot | The core module fills indigo |
| 04 Deployment | Every module fills; the connections draw solid |
| 05 Training | People nodes appear around the system |
| 06 Support | An amber pulse loops round the connections |

Scrolling back removes each step in reverse. Verified: steps 1 to 6 in order, the active stage always matching the drawing, and reversing on the way back.

## E. Section transitions

| Transition | Where |
|---|---|
| Sheet stack (32 px rounded top, soft shadow; the section underneath holds, scales to 0.97 and dims) | Home: Sectors over Services, Why over Our work, Insights over Technologies. Every inner page: the first section over the page header |
| Grid draw-in (from an edge, before the content) | Home: Mission (left), Our work (top), Youth band (right). Inner pages: paper and mist sections, by turns |
| Colour wash (the ground fades up) | Home: Services, Technologies. Inner pages: by turns with the grid draw-in |

No straight lines remain between sections (the rules above and below the client strip, the youth band, the article and legal text and the 404 road were removed). The sheet's shape is in the page from the first paint, so nothing shifts when the motion code loads. A section is held only once all of it has been seen, so its own buttons (the work carousel's arrows) are usable before the next sheet covers it.

Rules kept: each entrance plays once; only transform and opacity animate (plus line drawing); reduced motion shows every section finished, with the sheet shapes but no movement.
