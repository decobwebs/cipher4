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
      description: 'How Cipher4 engineered Harbours360, a digital marketplace where verified buyers and sellers trade high-value maritime and industrial assets with confidence.',
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
