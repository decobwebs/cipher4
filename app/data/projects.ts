/**
 * PROJECTS & CLIENTS
 * ============================================================================
 * ⚠️  NOTHING IN THIS FILE MAY BE INVENTED.
 *
 * Case studies are written from the actual systems, then approved by the
 * client before publication. The rules we work under:
 *
 *   1. Nothing verbatim from a repository — no code, schemas, file trees,
 *      internal URLs or repository names.
 *   2. No secrets, ever — credentials, .env contents, keys, endpoints and
 *      infrastructure detail do not appear here or anywhere else.
 *   3. No client name is published without explicit per-client approval.
 *      Uncleared clients are described by sector: "a West African port
 *      operator", "an offshore drilling contractor".
 *   4. Every case study is approved by the client before it ships.
 *   5. The write-up is business outcome, not implementation detail.
 *
 * The Projects page renders an honest empty state while this array is empty.
 * It does not render placeholder projects, because a fake case study is worse
 * than no case study.
 * ============================================================================
 */

export interface Project {
  slug: string
  title: string
  /** Published client name, or a sector description if not cleared. */
  client: string
  /** true only when the client has approved use of their name. */
  clientNameApproved: boolean
  sector: 'Transport' | 'Logistics' | 'Oil & Gas' | 'Supply Chain'
  year: string
  summary: string
  /** The operational problem, in the client's terms. */
  challenge: string[]
  /** What we built. Capability level, not implementation level. */
  built: string[]
  /** What changed. Only outcomes the client has confirmed. */
  outcome: string[]
  image?: string
  imageAlt?: string
  /** The live product, where there is a public one to visit. */
  url?: string
  /** Set true only once the client has signed off the published text. */
  approved: boolean
}

export const projects: Project[] = [
  {
    slug: 'harbours360',
    title: 'A marketplace for buying and selling ships and offshore equipment',
    client: 'Harbours360',
    clientNameApproved: true,
    sector: 'Supply Chain',
    year: '2026',
    url: 'https://www.harbours360.com',
    summary:
      'Harbours360 is an online marketplace for ships, offshore equipment and heavy industrial machinery in Africa. Buyers and sellers are both checked before they can trade, listings are inspected before they go live, and the money sits with a bank until the asset has been delivered.',
    challenge: [
      'Ships and offshore equipment were being bought and sold over phone calls and messaging apps. Neither side could easily confirm who the other person was, or whether the asset was really theirs to sell.',
      'Someone always had to go first. Either the buyer sent the money and hoped, or the seller released the asset and hoped. When a deal went wrong there was no record to fall back on.',
      'Deals crossed borders and currencies, and each one was put together from scratch. Afterwards there was nothing either side could show a regulator.',
    ],
    built: [
      'A public catalogue anyone can search. A listing only goes live after agents have checked the documents, the ownership and the condition of the asset.',
      'Identity and company checks on both sides before anyone can trade, so each party knows who they are dealing with.',
      'Purchase requests that go to a named agent, who reviews the buyer and the paperwork before a deal is created.',
      'Live auctions with a countdown, open bidding and reserve prices, so every bidder sees the same thing at the same moment.',
      'Payments held in escrow with a partner bank. Funds are released only once delivery is confirmed, and can be split into stages.',
      'Digital signing for purchase agreements, inspection reports and handover certificates, with every step recorded.',
      'Several currencies supported, and reporting built around Nigerian maritime and company rules, so a finished deal can be shown to a regulator.',
    ],
    outcome: [],
    image: '/images/projects/harbours360.png',
    imageAlt:
      'The Harbours360 marketplace home page shown on a laptop, with a search bar and category filters for vessels, offshore equipment and marine machinery',
    approved: true,
  },
]

export interface Client {
  name: string
  /** Path to a logo in public/images/clients/. SVG or transparent PNG. */
  logo: string
  /** Written permission to display the logo. Nothing renders without it. */
  permissionGranted: boolean
}

export const clients: Client[] = [
  // Logos render only when permissionGranted is true. These five were
  // selected by Cipher4 for publication; the flag records that decision in
  // code so nothing can appear here by accident.
  //
  // Note on naming: a client's product may be known by a different working
  // name inside its own codebase. The published name is always the brand the
  // client trades under, never the working one. Rule 1 above covers this.
  { name: 'Reliant Anchor Operations', logo: '/images/clients/reliant-anchor-operations.png', permissionGranted: true },
  { name: 'Reliant Anchor Foundation', logo: '/images/clients/reliant-anchor-foundation.png', permissionGranted: true },
  { name: 'Harbours360', logo: '/images/clients/harbours360.png', permissionGranted: true },
  { name: 'Lucid HR', logo: '/images/clients/lucid-hr.png', permissionGranted: true },
  { name: 'Quick Trips Travels Agency', logo: '/images/clients/quick-trips.png', permissionGranted: true },
]

export interface Testimonial {
  quote: string
  name: string
  role: string
  company: string
  approved: boolean
}

export const testimonials: Testimonial[] = [
  // Named quotes only, with role and company, and only once approved.
]

export const publishedProjects = () => projects.filter((p) => p.approved)
export const publishedClients = () => clients.filter((c) => c.permissionGranted)
export const publishedTestimonials = () =>
  testimonials.filter((t) => t.approved)

export const sectors = [
  'All',
  'Transport',
  'Logistics',
  'Oil & Gas',
  'Supply Chain',
] as const
