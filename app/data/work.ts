/**
 * Case studies and the LucidHR product page (content F2, F3, F4). Every
 * string is from design-handoff/content/cipher4-website-content-v1.md.
 * Images only from the approved set (public/images/work).
 *
 * Privacy (content Part A and plan section 7): no link to the Reliant
 * Anchor platform, no system details, no status labels beyond the content.
 */
import type { RoadName } from '~/lib/hyperspeed/roads'

export interface Case {
  slug: string
  path: string
  kind: 'case' | 'product'
  seo: { title: string; description: string }
  eyebrow: string
  title: string
  lead?: string
  facts?: { label: string; value: string }[]
  image: { src: string; w: number; h: number; alt: string }
  road: RoadName
  challenge?: string
  solution?: { text: string; points: string[] }
  result?: { before: string; highlight: string }
  audiences?: { title: string; text: string }[]
  actions: { label: string; to?: string; href?: string; variant: 'primary' | 'secondary' }[]
  next?: string // slug of the next item
}

export const CASE_LABELS = {
  client: 'Client',
  field: 'Field',
  services: 'Services',
  challenge: 'The challenge',
  solution: 'Our solution',
  result: 'The result',
  next: 'Next', // F3: "Next: LucidHR"
  nextCase: 'Next case study', // F2: "Next case study: Harbours360"
}

export const cases: Case[] = [
  // F2
  {
    slug: 'reliant-anchor',
    path: '/work/reliant-anchor',
    kind: 'case',
    seo: {
      title: 'Reliant Anchor case study | Cipher4 AI & Robotics',
      description: 'How Cipher4 engineered a dedicated operations platform giving a marine fuel logistics company complete command of every delivery.',
    },
    eyebrow: 'Case study · Maritime and ports · Oil and gas',
    title: 'Complete operational command for marine fuel delivery',
    facts: [
      { label: 'Client', value: 'Reliant Anchor' },
      { label: 'Field', value: 'Marine fuel logistics' },
      { label: 'Services', value: 'Operational platforms' },
    ],
    // F2 note: the login screen is acceptable as the hero image.
    image: { src: '/images/work/reliant-anchor.jpg', w: 1400, h: 875, alt: 'The sign-in screen of the operations platform built for Reliant Anchor' },
    road: 'case',
    challenge: 'Marine fuel delivery moves through several handovers, strict regulation and quantities that must be accounted for at every step. Coordinating it across phone calls, paper and spreadsheets left too much room for delay, error and dispute.',
    solution: {
      text: 'We designed and built a dedicated operations platform, engineered from the ground up for marine fuel operations. It brings every delivery, movement, approval and regulatory record into one controlled system.',
      points: [
        'Full visibility of every operation, from dispatch to completion',
        'Approval workflows and a complete audit trail at every critical step',
        'Regulatory and compliance records managed in one place',
        'A dedicated client view of delivery records and performance',
        'Performance insight for management, drawn from real operational data',
      ],
    },
    result: {
      before: 'Reliant Anchor runs its operations on a single platform, with ',
      highlight: 'a complete and verifiable record of every delivery.',
    },
    actions: [{ label: 'Discuss a platform for your operation', to: '/contact', variant: 'primary' }],
    next: 'harbours360',
  },
  // F3
  {
    slug: 'harbours360',
    path: '/work/harbours360',
    kind: 'case',
    seo: {
      title: 'Harbours360 case study | Cipher4 AI & Robotics',
      description: 'How Cipher4 engineered Harbours360, a marketplace where verified buyers and sellers trade high-value maritime and industrial assets with confidence.',
    },
    eyebrow: 'Case study · Maritime and ports · Supply chain and procurement',
    title: 'A trusted marketplace for high-value maritime assets',
    facts: [
      { label: 'Client', value: 'Harbours360' },
      { label: 'Field', value: 'Marketplace for maritime and industrial assets' },
      { label: 'Services', value: 'Digital platforms · Operational platforms' },
    ],
    // F3 note: no screenshots with home page statistics or listing counts.
    image: { src: '/images/work/harbours360.jpg', w: 1400, h: 875, alt: 'A Harbours360 market page' },
    road: 'case',
    challenge: 'High-value vessels and equipment were traded through informal networks, where buyers and sellers had little way to verify each other and large payments rested on trust.',
    solution: {
      text: 'We engineered Harbours360, a complete digital marketplace where verified buyers and sellers trade with confidence.',
      points: [
        'Verification of every participant and every listing',
        'A structured deal process, from first enquiry to completion',
        'A secure, controlled payment process',
        'Auctions, requests for quotation and market intelligence in one place',
      ],
    },
    result: {
      before: 'Harbours360 gives the maritime and industrial sector ',
      highlight: 'a safer, more transparent way to buy and sell high-value assets.',
    },
    actions: [
      { label: 'Visit Harbours360', href: 'https://www.harbours360.com', variant: 'secondary' },
      { label: 'Discuss a marketplace', to: '/contact', variant: 'primary' },
    ],
    next: 'lucidhr',
  },
  // F4
  {
    slug: 'lucidhr',
    path: '/products/lucidhr',
    kind: 'product',
    seo: {
      title: 'LucidHR | A Cipher4 product',
      description: 'LucidHR uses artificial intelligence to match seafarers with the roles that fit their rank, certification and experience. Coming soon from Cipher4.',
    },
    eyebrow: 'A Cipher4 product · Coming soon',
    title: 'Intelligent crew matching for the maritime industry',
    lead: 'LucidHR uses artificial intelligence to match seafarers with roles that fit their rank, certification and experience, so employers reach the right candidates faster and seafarers find the right ships.',
    image: { src: '/images/work/lucidhr.jpg', w: 1400, h: 613, alt: 'The LucidHR dashboard' },
    road: 'case',
    audiences: [
      { title: 'For seafarers', text: 'One professional profile for your rank, certificates and sea service, and roles matched to the experience you actually have.' },
      { title: 'For employers', text: 'Candidates matched by meaning, not keywords, so the shortlist starts with people who fit the vessel and the role.' },
    ],
    // No waitlist address yet (owner, Phase 0): the contact page, general
    // enquiry, with the message heading "LucidHR waitlist" (prefill: Phase 7).
    actions: [{ label: 'Join the waitlist', to: '/contact?type=general&topic=lucidhr-waitlist', variant: 'primary' }],
  },
]

export const caseBySlug = (slug: string) => cases.find((c) => c.slug === slug)

// --- Our work (content F1) ----------------------------------------------------

export type WorkFilter = 'all' | 'platforms' | 'websites'

export const workIndex = {
  seo: {
    title: 'Our work | Cipher4 AI & Robotics',
    description: 'Platforms and digital products Cipher4 has engineered for organisations in maritime, energy, logistics and beyond.',
  },
  eyebrow: 'Our work',
  title: 'Trusted with the systems that matter',
  lead: 'Selected platforms and digital products we have engineered for organisations in maritime, energy, logistics and beyond.',
  filters: [
    { key: 'all', label: 'All' },
    { key: 'platforms', label: 'Platforms' },
    { key: 'websites', label: 'Websites' },
  ] satisfies { key: WorkFilter; label: string }[],
  platformsTitle: 'Platforms',
  websitesTitle: 'Websites and digital products',
  visit: 'Visit site',
}

export interface PlatformCard {
  name: string
  field: string
  line: string
  link: { label: string; to: string }
  image: { src: string; w: number; h: number; alt: string }
}

export const platformCards: PlatformCard[] = [
  {
    name: 'Reliant Anchor',
    field: 'Marine fuel logistics',
    line: 'Complete operational command for marine fuel delivery.',
    link: { label: 'Read the case study', to: '/work/reliant-anchor' },
    image: { src: '/images/work/reliant-anchor.jpg', w: 1400, h: 875, alt: 'The sign-in screen of the operations platform built for Reliant Anchor' },
  },
  {
    name: 'Harbours360',
    field: 'Maritime and industrial asset marketplace',
    line: 'A trusted marketplace for high-value maritime assets.',
    link: { label: 'Read the case study', to: '/work/harbours360' },
    image: { src: '/images/work/harbours360.jpg', w: 1400, h: 875, alt: 'A Harbours360 market page' },
  },
  {
    name: 'LucidHR',
    field: 'A Cipher4 product',
    line: 'Intelligent crew matching for the maritime industry. Coming soon.',
    link: { label: 'Learn more', to: '/products/lucidhr' },
    image: { src: '/images/work/lucidhr.jpg', w: 1400, h: 613, alt: 'The LucidHR dashboard' },
  },
]

export interface WebsiteCard {
  name: string
  field: string
  headline: string
  line: string
  /** Only the approved images (public/images/work); otherwise the logo. */
  image?: { src: string; w: number; h: number; alt: string }
  logo?: { src: string; w: number; h: number }
  /**
   * "Visit site" link (opens in a new tab, rel="noopener"). Set only once
   * the owner has sent the address AND the public site has no leftover
   * placeholder text (DECISIONS.md, 2026-11-18).
   */
  url?: string
  /** Address supplied by the owner but not linked yet (placeholders found). */
  pendingUrl?: string
}

export const websiteCards: WebsiteCard[] = [
  {
    name: 'Lighthouse Maritime Agency',
    field: 'Ship agency',
    headline: 'A website built to win port-call business.',
    line: 'A focused digital presence that guides shipowners and operators straight to a cost estimate request, with service, port and port-call information to support the decision.',
    image: { src: '/images/work/lighthouse.jpg', w: 1400, h: 875, alt: 'The Lighthouse Maritime Agency website' },
    // Not linked: on 18 Nov 2026 the site still showed "[X hours]" three times.
    pendingUrl: 'https://lighthousemaritimeltd.com/',
    logo: { src: '/images/logos/lighthouse.png', w: 100, h: 122 },
  },
  {
    name: 'Zeal Global Resources',
    field: 'Petroleum haulage',
    headline: 'A haulage brand built for trust and compliance.',
    line: "A complete website that presents Zeal's fleet, safety standards and services with precision, and turns visitors into quote requests.",
    logo: { src: '/images/logos/zeal.png', w: 273, h: 160 },
    // Not linked: on 18 Nov 2026 the site still showed "[NUMBER] per tank",
    // "[X hours]" and "[Monday to Saturday, 8am to 6pm]".
    pendingUrl: 'https://zealgloballtd.com/',
  },
  {
    name: 'Quick Trips',
    field: 'Travel',
    headline: 'A travel website that starts the journey.',
    line: 'An interactive travel experience, with a guided trip planner and a destination globe, that turns browsing into enquiries.',
    logo: { src: '/images/logos/quick-trips.png', w: 382, h: 124 },
  },
  {
    name: 'Lustre by Kal',
    field: 'Corporate gifting',
    headline: 'Premium gifting, ordered with ease.',
    line: 'An elegant online catalogue and ordering experience for a premium corporate gifting brand, supported by launch videos we produced.',
    logo: { src: '/images/logos/lustre.png', w: 188, h: 160 },
  },
  {
    name: 'Reliant Anchor Foundation',
    field: 'Non-profit, education',
    headline: 'A digital home for a foundation investing in young people.',
    line: "A dignified website that presents the foundation's programmes and partners, and makes it simple to support its work.",
    logo: { src: '/images/logos/foundation.png', w: 391, h: 157 },
  },
  {
    // Name only: no logo in the pack, and never his photo (F1 note).
    name: 'Kasim Auwal Lawal',
    field: 'Executive profile',
    headline: 'A career in maritime logistics, told with distinction.',
    line: 'A personal executive website presenting a career, companies and credentials in a single immersive story.',
  },
  {
    name: 'AA Heritage Navigation',
    field: 'Maritime and energy logistics',
    headline: 'A clear introduction for a maritime and energy consultancy.',
    line: "A focused website presenting the company's story, services and vision.",
    logo: { src: '/images/logos/aa-heritage.png', w: 252, h: 160 },
  },
]
