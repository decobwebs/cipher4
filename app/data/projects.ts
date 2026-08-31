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
  /** Set true only once the client has signed off the published text. */
  approved: boolean
}

export const projects: Project[] = [
  // Populated from the project repositories once paths are shared and each
  // write-up is approved. See docs/project-intake.md for what we need.
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
  // Note on naming: the codebase for Harbours360 is called "MarineXchange"
  // internally. The published name is the one below — a working repository
  // name is not a brand.
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
