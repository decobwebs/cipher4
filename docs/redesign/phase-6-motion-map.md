# Phase 6: every section and the animation it uses

Numbers (01 to 24) are the Choreography board's movements. "Motion 0x" is the Motion board.
Every entrance plays once, the first time its section is a quarter on screen, and stays settled after that.
With reduced motion switched on, every section simply appears finished, smooth scrolling stays off and no scroll-linked moment is built.

## On every page

| Part | Animation | What it means |
|---|---|---|
| Page header | **13, the path types itself.** The breadcrumb types out like a system address, then the headline rises from behind a clean edge, then the eyebrow, lead and buttons. The page's own road runs behind (or below, up to 1100 px). | You know exactly where you are. |
| Section headings | **Rise.** Eyebrow, heading and lead rise 24 px and fade in, one after another (Motion 08). | Text simply arrives; it never waits more than 0.4 s. |
| Icons | **Drawn in.** Each icon draws line by line, then its amber node lights (Motion 07, from Phase 1). | A trail arriving. |
| Between sections | **Section tone.** The page's background eases (0.6 s) between white, paper and mist as each section takes the middle of the screen, instead of a hard edge. | No section change is a hard cut. |
| Closing band | **12, the night road arrives below.** The band darkens in, the night road fades up beneath, the call to action rises. | The next step of the journey is yours. |
| Footer | **23, the logo draws itself.** The arc, stem and ring draw stroke by stroke, the solid parts fade in, the amber node lights last. | A signature at the end of the page. |
| Moving between pages | **24, a burst of speed.** The road on screen stretches its trails for 0.4 s while the old page fades out fast and the new one fades in. A road that arrives on the new page within a second starts with the same burst. | Moving fast, without a hard cut. |
| Scrolling | **Lenis smooth scrolling**, connected to GSAP ScrollTrigger and driven by the same clock. Phones keep their own touch scrolling. Paused while the phone menu is open. | Calm, even movement. |

## Home `/`

| # | Section | Animation | What it means |
|---|---|---|---|
| 1 | Hero | **01, lines rise into place** while the road already runs (Arrival: fast start that settles, once per visit; Steering with a mouse). **Motion 02, leaving the hero (scroll-linked):** as you scroll out the road speeds up and the view widens, then fades as the mission arrives; scrolling back reverses it. | You've arrived mid-journey. |
| 2 | Clients | **02, logos come into focus**, one after the next. | Trust becomes clear. |
| 3 | Mission | **03, words light up as you read (scroll-linked):** soft grey (still readable) darkening word by word as you scroll. | You set the pace. |
| 4 | Services | **04, one stack deals out six.** | Six capabilities, one partner. |
| – | Road strip | **Motion 03:** a calm road between Services and Sectors, moving only while you scroll (desktop). | One chapter joins the next. |
| 5 | Sectors | **05, one route joins four industries:** a line travels across the cards and each one's amber stop lights as the line reaches it. The sector road beside the heading changes shape to the card you point at (desktop). | The same discipline serves them all. |
| 6 | Our work | **06, zoom-through from depth:** the featured project flies forward, its neighbours swing in. **Carousel:** cards turn in 3D between centre and sides; a card leaving the centre breaks into amber and indigo light. | Going inside the work. |
| 7 | Why Cipher4 | **07, each promise gets signed off:** a tick draws beside each one in turn. | Accountability you can check. |
| 8 | How we deliver | **08, stages light up along the road (scroll-linked).** Desktop: the section holds while you scroll, the road drives forward only while you scroll, each stage lights as you reach it. Phones: no hold; each stage lights as it crosses the screen. | You always know where you are. |
| 9 | Technologies | **09, a scattered stack snaps together.** | Different tools working as one. |
| – | Road strip | **Motion 03**, between Technologies and Insights (desktop). | |
| 10 | Insights | **10, articles turn down like pages.** | Something to sit and read. |
| 11 | Youth band | **11, lines grow up into a light.** | Young people growing into their skills. |
| 12 | Closing band | **12.** | |

## Services `/services`

| Section | Animation | Meaning |
|---|---|---|
| Header | 13 (service road) | |
| Sector selector | Rise | |
| Six service cards | **Deal out from one stack** (04's meaning) | Six capabilities, one partner. |
| Road strip | Motion 03 (desktop) | |
| How we deliver table | **Checked off like a manifest** (18's meaning): an amber line sweeps each stage's row in turn | Every stage accounted for. |
| Four ways to work together | Cards rise one after another | |
| Response times | Rise | |
| Closing band | 12 | |

## Service pages `/services/…`

| Section | Animation | Meaning |
|---|---|---|
| Header | 13 (service road) | |
| What usually brings people to us | **14, problems fall into line:** the cards arrive crooked and straighten | Disorder is what we fix. |
| What we build | **15, four parts join one record** (Operational platforms: four cards settle, amber lines reach from each to the centre, the shared-record seal lights). Other services: cards rise one after another | One system, not four tools. |
| How we approach AI (AI and automation) | Cards rise | |
| What every project includes (Digital platforms) | Rise, with each check drawing itself | |
| In your sector | **Checked off like a manifest** (18's meaning) | Each sector accounted for. |
| For organisations too (Education technology) | Rise | |
| Fits what you already run (Operational platforms) | **16, your systems plug in:** lines run from each system into the platform, one after another, then it lights | We connect, we don't replace. |
| Selected websites (Digital platforms), Brands (IT infrastructure) | **Snap together** (09's meaning) | |
| Related | Cards rise | |
| Closing band | 12 | |

## Sectors `/sectors` and sector pages `/sectors/…`

| Page | Section | Animation | Meaning |
|---|---|---|---|
| Overview | Header | 13 (maritime road) | |
| Overview | Four sector panels | **One route joins four industries** (05's meaning) | |
| Overview | Beyond our four sectors | Rise | |
| Sector | What we hear first | **17, the sector's own line runs across each card:** a wave (maritime), a pipeline (oil and gas), the route's stops (logistics), a chain (supply chain) | We speak your industry. |
| Sector | What we build | **18, checked off like a manifest** | Nothing missed. |
| Sector | Operating context | Rise | |
| Sector | Services we draw on | Snap together | |
| Sector | Related work / reading, Other sectors | Cards rise | |
| Both | Closing band | 12 | |

## Work, case studies and LucidHR

| Page | Section | Animation | Meaning |
|---|---|---|---|
| Our work | Header | 13 (long straight road) | |
| Our work | Platforms | **06 zoom-through**, and the light-dust carousel | Going inside the work. |
| Our work | Websites and digital products | Cards rise one after another | |
| Case study | Header | 13 (long straight road) | |
| Case study / LucidHR | The product screen | **19, the screen opens up (scroll-linked):** a small window that opens to full width as you scroll to it | Stepping into the system we built. |
| LucidHR | For seafarers / For employers | Rise | |
| Case study | The challenge, Our solution | Rise (the solution's checks draw themselves) | |
| Case study | The result | **20, the outcome gets underlined:** an amber marker sweeps under the result, word by word | The part to remember. |
| Case study | Next | Rise | |
| All | Closing band | 12 | |

## Contact `/contact`

| Section | Animation | Meaning |
|---|---|---|
| Header | 13 (deep, slow road) | |
| Form | **21, your message travels:** on send, the arrow leaves on a light trail and the header road speeds up; then the thank-you rises in (Message sent: the amber car, kept from Phase 2b) | It's on its way to us. |
| Reach us directly | Rise | |
| Offices | **22, three cities, one line:** the head office lights first, then a line reaches out to Lagos and Kaduna | One team across the country. |

## Company pages

| Page | Section | Animation | Meaning |
|---|---|---|---|
| Technologies | Header | 13 | |
| Technologies | Each group of names | **Snap together** (09's meaning) | We make different tools work as one. |
| Technologies | "The tools change. Our standards do not." | Rises from behind a clean edge | |
| About | Mission, Vision | **Rise from behind a clean edge** (01's movement) | |
| About | Values | Cards rise | |
| About | Three commitments | **Each one signed off** (07's meaning) | Commitments you can hold us to. |
| About | In-house and company facts | Rise | |
| About | Community | **Lines grow up into a light** (11's meaning) | |
| Credentials | Registration | Rise | |
| Credentials | Policy positions | **Each one signed off** (07's meaning) | Terms we accept in a contract. |
| Credentials | References | Rise | |
| Credentials | Preparing a submission? | Closing band, 12 | |
| Insights | Articles | **Turn down like pages** (10) | Something to sit and read. |
| Insights | Working on something similar? | Closing band, 12 | |
| Article | The article text | Still: nothing moves while you read | Reading comes first. |
| Article | The other article | Card rises | |
| Youth and skills | Where we focus | Cards rise | |
| Youth and skills | How we help | **Lines grow up into a light** (11's meaning), then the rows rise | Growing into their skills. |
| Youth and skills | Two ways in | Turn down like pages | |
| Launchpad | How it works | **One route from idea to launch** (05's movement): each step lights as the line reaches it | |
| Launchpad | What we look for, the form | Rise (the checks draw themselves) | |
| Scholarships | Coming soon | Rise | |
| Careers | What we look for / What you get | Cards rise | |
| Careers | Open roles | Rise | |
| Privacy, Terms | The text | Still (reading pages); header only | |
| 404 | Heading and links | Rise from behind a clean edge; the road runs on in a calm loop and fades into empty space | Nowhere further on this address. |

## Rules kept

- Only `transform` and `opacity` move, plus `stroke-dashoffset` for drawn lines. (The logos' "focus" fades a ready-blurred copy away; the blur itself never animates.)
- Entrances last 600 to 900 ms with expo-out; lines draw with the in-out curve.
- No text waits more than 0.6 s once its section is on screen, and nothing moves under words while they are read.
- If the app has not started within 4 s (a script failed, or a very slow phone), the starting states are dropped, so nothing ever stays hidden.
- The carousel never takes the page scroll: vertical swipes always scroll the page, and the wheel is never captured.
