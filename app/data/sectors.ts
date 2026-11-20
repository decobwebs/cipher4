/**
 * Sector pages (content E2 to E5). Every string is from
 * design-handoff/content/cipher4-website-content-v1.md.
 */
import type { C4IconName } from '~/lib/icons'
import type { RoadName } from '~/lib/hyperspeed/roads'

export type SectorLine = 'wave' | 'pipeline' | 'route' | 'chain'

export interface RelatedWork {
  kind: 'Case study' | 'Product' | 'Website'
  name: string
  line: string
  to: string
  image?: { src: string; w: number; h: number }
  logo?: string
}

export interface Sector {
  slug: string
  code: string // for the numbered "What we build" list: M-01, O-01...
  seo: { title: string; description: string }
  title: string
  lead: string
  cta: { label: string; to: string }
  icon: C4IconName
  road: RoadName
  line: SectorLine
  problems: { title: string; text: string }[]
  build: string[]
  context: string[]
  services: { title: string; to: string; icon: C4IconName }[]
  related: { title: string; items: RelatedWork[] }
  others: string[] // slugs of the other three sectors
}

export const SECTOR_EYEBROW = 'Sectors'
export const HEADINGS = {
  problems: 'What we hear first',
  build: 'What we build',
  context: 'Operating context',
  services: 'Services we draw on',
  others: 'Other sectors',
}

const S = {
  platforms: { title: 'Operational platforms', to: '/services/operational-platforms', icon: 'operational-platforms' as C4IconName },
  ai: { title: 'AI and automation', to: '/services/ai-automation', icon: 'ai-automation' as C4IconName },
  iot: { title: 'IoT and robotics', to: '/services/iot-robotics', icon: 'iot-robotics' as C4IconName },
  digital: { title: 'Digital platforms and websites', to: '/services/digital-platforms', icon: 'digital-platforms' as C4IconName },
  it: { title: 'IT infrastructure and support', to: '/services/it-infrastructure', icon: 'it-infrastructure' as C4IconName },
}

// Lines from content C6 and F1 (each project's own wording).
const W = {
  reliant: { kind: 'Case study', name: 'Reliant Anchor', line: 'Complete operational command for marine fuel delivery.', to: '/work/reliant-anchor', image: { src: '/images/work/reliant-anchor.jpg', w: 1400, h: 875 } },
  harbours: { kind: 'Case study', name: 'Harbours360', line: 'A trusted marketplace for high-value maritime assets.', to: '/work/harbours360', image: { src: '/images/work/harbours360.jpg', w: 1400, h: 875 } },
  lucid: { kind: 'Product', name: 'LucidHR', line: 'Intelligent crew matching for the maritime industry. Coming soon.', to: '/products/lucidhr', image: { src: '/images/work/lucidhr.jpg', w: 1400, h: 613 } },
  lighthouse: { kind: 'Website', name: 'Lighthouse Maritime Agency', line: 'A website built to win port-call business.', to: '/work', image: { src: '/images/work/lighthouse.jpg', w: 1400, h: 875 } },
  zeal: { kind: 'Website', name: 'Zeal Global Resources', line: 'A haulage brand built for trust and compliance.', to: '/work', logo: '/images/logos/zeal.png' },
} satisfies Record<string, RelatedWork>

export const sectors: Sector[] = [
  // E2
  {
    slug: 'maritime-and-ports',
    code: 'M',
    seo: {
      title: 'Maritime and ports | Cipher4 AI & Robotics',
      description: 'Systems for vessel operations, port calls, bunkering, crewing and marine services: every movement coordinated, every record ready for scrutiny.',
    },
    title: 'Maritime and ports',
    lead: 'A single vessel call can involve an agent, a terminal, a fuel supplier, several regulators and a crew, each working from a different record. We build the systems that keep them on the same page, from arrival to sailing.',
    cta: { label: 'Talk to us about maritime', to: '/contact?sector=maritime' },
    icon: 'maritime',
    road: 'sector-maritime',
    line: 'wave',
    problems: [
      { title: 'Every handover is a chance for a dispute', text: "Fuel, cargo and services change hands several times between shore and ship. When the figures don't agree, the evidence is scattered across paper, phones and spreadsheets." },
      { title: 'Port costs and delays are known too late', text: 'Estimates, clearances and berth windows shift by the hour, and the people paying for them hear about changes after the fact.' },
      { title: 'Crew and compliance records live in folders', text: 'Certificates expire, sea service goes unrecorded, and finding the right officer for a vessel depends on who you know.' },
    ],
    build: [
      'Vessel and port-call management, from arrival to sailing',
      'Marine fuel and bunkering operations, with every quantity and handover recorded',
      'Regulatory clearances and licences tracked against the work they allow',
      'Crew records, certification and intelligent crew matching',
      'Marketplaces for vessels, offshore equipment and marine services',
      'Client portals for owners, operators and charterers',
    ],
    context: [
      'West African ports run under congestion and access constraints that make accurate time and quantity records commercially significant.',
      'Marine work answers to several authorities at once, and a system has to hold the evidence each of them may ask for.',
      'Equipment working in salt air and heat wears differently, and maintenance has to follow how assets are really used.',
    ],
    services: [S.platforms, S.ai, S.iot, S.digital],
    related: { title: 'Related work', items: [W.reliant, W.harbours, W.lucid, W.lighthouse] },
    others: ['oil-and-gas', 'logistics-and-transport', 'supply-chain-and-procurement'],
  },
  // E3
  {
    slug: 'oil-and-gas',
    code: 'O',
    seo: {
      title: 'Oil and gas | Cipher4 AI & Robotics',
      description: 'Systems for field operations, compliance, asset integrity and remote monitoring, where access is hard and every record must satisfy a regulator.',
    },
    title: 'Oil and gas',
    lead: 'In oil and gas the expensive problems are access problems: getting people to the asset, getting data back from it, and proving to a regulator that both were done properly. We build the systems that make each of those faster, safer and easier to defend.',
    cta: { label: 'Talk to us about oil and gas', to: '/contact?sector=oil-and-gas' },
    icon: 'oil-gas',
    road: 'sector-oil-gas',
    line: 'pipeline',
    problems: [
      { title: 'Inspection access is slow and costly', text: 'Rope access, permits, weather windows and a stand-down of the work below. Every structural inspection carries all four.' },
      { title: 'Movements are coordinated by phone', text: "Rotations, boat schedules and manifests change by the hour and live in someone's head until they change again." },
      { title: 'Field data comes back in fragments', text: 'Records arrive as photographs, spreadsheets and verbal reports, and someone in town turns them into something auditable.' },
    ],
    build: [
      'Field operations and work-order management',
      'Permit, licence and certificate tracking with expiry alerts',
      'Remote monitoring and drone-based inspection of hard-to-reach structures',
      'Condition monitoring and predictive maintenance for critical equipment',
      'Personnel and movement coordination',
      'Inspection and integrity records that satisfy an audit',
    ],
    // The second sentence of the first item ("Cipher4 is a Nigerian-owned
    // technology company.") is an open decision (plan, section 9). Default:
    // not stated, so it is left out until the owner confirms it.
    context: [
      "Work under Nigeria's Oil and Gas Industry Content Development Act carries local content obligations, and local capability is a scored criterion.",
      'Anything that connects to operational technology needs a security posture a plant manager will accept. We integrate on a read-only basis by default, with segmented access.',
      'Remote and offshore connectivity is expensive and intermittent, and systems for the field must be designed for the connection that actually exists.',
    ],
    services: [S.platforms, S.iot, S.ai, S.it],
    related: { title: 'Related work', items: [W.zeal, W.reliant] },
    others: ['maritime-and-ports', 'logistics-and-transport', 'supply-chain-and-procurement'],
  },
  // E4
  {
    slug: 'logistics-and-transport',
    code: 'L',
    seo: {
      title: 'Logistics and transport | Cipher4 AI & Robotics',
      description: 'Systems for fleets, depots, yards and deliveries: live visibility, dispatch, proof of delivery and maintenance based on real usage.',
    },
    title: 'Logistics and transport',
    lead: 'Logistics fails at the seams: the handover between road and sea, the truck that left without its paperwork, the delay nobody logged. We build the systems that hold those seams together and let everyone read the same status at the same time.',
    cta: { label: 'Talk to us about logistics', to: '/contact?sector=logistics' },
    icon: 'logistics',
    road: 'sector-logistics',
    line: 'route',
    problems: [
      { title: 'Delays are known too late to act', text: 'A truck held at a checkpoint for four hours becomes a missed vessel window. The information usually arrives after the consequence does.' },
      { title: '"Where is my cargo?" takes a phone call', text: 'A question customers ask every day still depends on finding the one person who knows.' },
      { title: 'Equipment use is a guess', text: 'Nobody can say which units sat idle last month, so the fleet grows to cover a problem that scheduling could have solved.' },
    ],
    build: [
      'Live location and status for vehicles, vessels and high-value assets',
      'Dispatch, job assignment and driver scheduling',
      'Digital proof of delivery and chain of custody',
      'Customer-facing tracking, without a phone call',
      'Maintenance based on real usage, not the calendar',
      'Utilisation, dwell-time and performance reporting',
    ],
    context: [
      'Road corridors in the region carry checkpoint and security delays that imported routing models do not anticipate. We plan for them explicitly.',
      'Coastal and inland waterway movement needs vessel tracking and tide-aware scheduling, not just a map.',
      'Regulated cargo such as petroleum products needs every quantity and permit recorded, from loading to discharge.',
    ],
    services: [S.platforms, S.iot, S.ai, S.digital],
    related: { title: 'Related work', items: [W.zeal, W.reliant] },
    others: ['maritime-and-ports', 'oil-and-gas', 'supply-chain-and-procurement'],
  },
  // E5
  {
    slug: 'supply-chain-and-procurement',
    code: 'S',
    seo: {
      title: 'Supply chain and procurement | Cipher4 AI & Robotics',
      description: 'Sourcing and procurement systems that are faster to run and easy to defend: structured tenders, consistent evaluation and a complete audit trail.',
    },
    title: 'Supply chain and procurement',
    lead: 'Procurement is where operational money is won and lost, and where scrutiny lands hardest. We build sourcing systems that make the process faster to run and straightforward to defend.',
    cta: { label: 'Talk to us about procurement', to: '/contact?sector=supply-chain' },
    icon: 'supply-chain',
    road: 'sector-supply-chain',
    line: 'chain',
    problems: [
      { title: 'Tender evaluation is inconsistent', text: 'Bids arrive in different formats and are compared by whoever is free that week, against criteria that shift between rounds.' },
      { title: 'Supplier performance is remembered, not recorded', text: 'Everyone knows which vendor delivers late. Nobody can prove it at the next award.' },
      { title: 'The audit trail is rebuilt after the fact', text: 'When a decision is questioned months later, the reasoning has to be reconstructed from email.' },
    ],
    build: [
      'Digital tender publication and structured bid submission',
      'Consistent, criteria-based evaluation and scoring',
      'Supplier records with delivery and quality history',
      'Approval workflows with a complete audit trail',
      'Spend visibility by category, project and vendor',
      'Supplier portals and B2B ordering',
    ],
    context: [
      'Public-sector and energy-company procurement carries process requirements that generic e-procurement products do not model. We build to the process you are actually held to.',
      'Local content reporting is a continuing obligation. Captured as sourcing happens, it becomes a report, not an annual reconstruction.',
      'An auditable record has to show the reasoning, not just the outcome.',
    ],
    services: [S.platforms, S.ai, S.digital],
    // E5 has "Related reading" instead of related work.
    related: { title: 'Related reading', items: [] },
    others: ['maritime-and-ports', 'oil-and-gas', 'logistics-and-transport'],
  },
]

export const relatedReading = {
  title: 'What makes a procurement record survive an audit',
  to: '/insights/procurement-systems-that-survive-audit',
  sector: 'Supply chain',
  read: '5 min read',
}

export const sectorBySlug = (slug: string) => sectors.find((s) => s.slug === slug)

// --- Sectors overview (content E1) ------------------------------------------
// The four panels use the home page lines (C5), from data/home.ts.
export const sectorsOverview = {
  seo: {
    title: 'Sectors | Cipher4 AI & Robotics',
    description: 'Systems for maritime and ports, oil and gas, logistics and transport, and supply chain: industries where regulation is strict and records must hold.',
  },
  eyebrow: 'Sectors',
  title: 'Built for industries where failure is expensive',
  lead: 'Our work is concentrated in four sectors that share the same demands: high-value assets in difficult places, regulation that punishes poor records, and decisions that cannot wait. Knowing these industries well is worth more to our clients than knowing many industries a little.',
  beyond: {
    title: 'Beyond our four sectors',
    text: 'Our websites and digital products serve businesses of every kind, from travel and corporate gifting to non-profit organisations. Our platforms, AI and connected systems are built for the four industries above.',
    link: { label: 'See our work', to: '/work' },
  },
}
