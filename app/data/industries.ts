/**
 * The four sectors. These pages carry the search traffic and they are what
 * you send a specific buyer to, so each one is written for someone who works
 * in that sector rather than for a general audience.
 *
 * Positioning is consistent everywhere: Transport, Logistics, Oil & Gas and
 * Supply Chain. The old about.html also claimed manufacturing, healthcare and
 * agriculture, which contradicted the home page's "exclusively" framing.
 */

export interface Industry {
  slug: string
  name: string
  icon: string
  teaser: string
  summary: string
  image: string
  imageAlt: string
  /** Operational realities, written for someone who works in this sector. */
  challenges: { title: string; description: string }[]
  capabilities: string[]
  /** Sector-specific compliance and environmental context. */
  context: string[]
}

export const industries: Industry[] = [
  {
    slug: 'transport',
    name: 'Transport',
    icon: 'lucide:route',
    teaser: 'Road, sea and air movements, coordinated and accounted for.',
    summary:
      'Transport operations fail at the seams: the handover between road and sea, the vehicle that left without the paperwork, the delay nobody logged. We build the systems that hold those seams together.',
    image: '/images/industry-transport.jpg',
    imageAlt: 'Haulage fleet on a coastal highway at dawn',
    challenges: [
      {
        title: 'You find out about delays too late to act',
        description:
          'A truck held at a checkpoint for four hours becomes a missed vessel window. The information usually arrives after the consequence does.',
      },
      {
        title: 'Multi-modal handovers lose accountability',
        description:
          'Cargo moving road to sea to air crosses three operators and three systems. When something goes missing, reconstructing the chain takes days.',
      },
      {
        title: 'Compliance evidence is assembled after the fact',
        description:
          'Journey records, driver hours and vehicle checks exist on paper in a folder, until an auditor asks for six months of them.',
      },
    ],
    capabilities: [
      'Live tracking for vehicles, vessels and aircraft on one view',
      'Journey planning with realistic transit times',
      'Automatic exception alerts on delay, deviation and stop',
      'Driver and crew assignment with hours tracking',
      'Digital proof of delivery and chain of custody',
      'Compliance records that are captured as work happens',
    ],
    context: [
      'Nigerian road corridors carry checkpoint and security delays that a European routing model does not anticipate. We plan for them explicitly.',
      'Coastal and inland waterway movement needs AIS integration and tide-aware scheduling, not just a map.',
      'Rotary-wing crew transfers are scheduled against weather windows and manifest limits, and both change late.',
    ],
  },
  {
    slug: 'logistics',
    name: 'Logistics',
    icon: 'lucide:container',
    teaser: 'Terminal, yard and field logistics with one version of the truth.',
    summary:
      'Logistics operations run on high-value assets moving between people who cannot see each other. We build the systems that let a terminal manager, a yard supervisor and a client all read the same status at the same time.',
    image: '/images/industry-logistics.jpg',
    imageAlt:
      'Container terminal at blue hour with gantry cranes over a stacked yard',
    challenges: [
      {
        title: 'Equipment utilisation is a guess',
        description:
          'Nobody can say which units were idle last month, so the fleet grows to cover a problem that scheduling could have solved.',
      },
      {
        title: 'Client enquiries take a phone call to answer',
        description:
          'Where is my cargo is a question that should not require someone to find the person who knows.',
      },
      {
        title: 'Maintenance happens after the failure',
        description:
          'Service intervals are calendar-based, so equipment working hard is treated the same as equipment sitting idle.',
      },
    ],
    capabilities: [
      'Live location and condition for high-value assets',
      'Yard and terminal movement records',
      'Load planning and dispatch scheduling',
      'Usage-based maintenance triggers',
      'Client-facing status without a phone call',
      'Utilisation and dwell-time reporting',
    ],
    context: [
      'Apapa and Tin Can operations run under congestion and access constraints that make accurate dwell-time data commercially significant.',
      'Marine logistics for offshore support runs on manifests, permits and weather. The system has to understand all three.',
      'Equipment working in salt air and heat has a maintenance profile that a generic asset system will get wrong.',
    ],
  },
  {
    slug: 'oil-and-gas',
    name: 'Oil & Gas',
    icon: 'lucide:flame',
    teaser: 'Offshore, onshore and marine operations where access is the constraint.',
    summary:
      'In oil and gas the expensive problems are access problems: getting a person to the asset, getting data back from it, and proving to a regulator that both were done properly. That is the work we do.',
    image: '/images/industry-oil-and-gas.jpg',
    imageAlt:
      'Offshore platform and support vessel in calm sea at dusk, deck lights on',
    challenges: [
      {
        title: 'Inspection access is slow and costly',
        description:
          'Rope access, permits, weather windows and a stand-down of the work below. Every structural inspection carries all four.',
      },
      {
        title: 'Crew and vessel movements are coordinated by phone',
        description:
          'Rotations, boat schedules and helicopter manifests change hourly and live in someone’s head until they change again.',
      },
      {
        title: 'Data comes back from the field in fragments',
        description:
          'Field records arrive as photographs, spreadsheets and verbal reports, then someone in town assembles them into something auditable.',
      },
    ],
    capabilities: [
      'Drone and remote-unit inspection of structures and confined spaces',
      'Vessel and helicopter movement coordination',
      'Personnel-on-board tracking and manifest management',
      'Rig-to-shore reporting over constrained links',
      'Condition monitoring on critical equipment',
      'Inspection records that satisfy an integrity audit',
    ],
    context: [
      'Work under the NOGICD Act carries Nigerian Content obligations. Local capability is a scored criterion, and we are a Nigerian company with Nigerian engineers.',
      'Anything connecting to operational technology networks needs a security posture that a plant manager will accept. We default to read-only integration and segmented access.',
      'Offshore bandwidth is expensive and intermittent. Our field systems capture locally and sync opportunistically rather than assuming a connection.',
    ],
  },
  {
    slug: 'supply-chain',
    name: 'Supply Chain',
    icon: 'lucide:git-branch',
    teaser: 'Procurement and sourcing that survives an audit.',
    summary:
      'Procurement is where operational money is won and lost, and where scrutiny lands hardest. We build sourcing systems that make the process faster to run and straightforward to defend.',
    image: '/images/industry-supply-chain.jpg',
    imageAlt:
      'Procurement team reviewing tender documentation in a meeting room',
    challenges: [
      {
        title: 'Tender evaluation is inconsistent',
        description:
          'Bids arrive in different formats and get compared by whoever is free that week, against criteria that shift between rounds.',
      },
      {
        title: 'Supplier performance is remembered, not recorded',
        description:
          'Everyone knows which vendor delivers late. Nobody can prove it at the next award.',
      },
      {
        title: 'The audit trail is assembled retrospectively',
        description:
          'When a decision is questioned months later, the reasoning has to be reconstructed from email.',
      },
    ],
    capabilities: [
      'Digital tender publication and structured bid submission',
      'Consistent, criteria-based bid scoring',
      'Supplier records with delivery and quality history',
      'Approval workflows with a complete audit trail',
      'Spend visibility by category, project and vendor',
      'Document control with version history',
    ],
    context: [
      'Public-sector and IOC procurement carries process requirements that a generic e-procurement product does not model. We build to the process you are actually held to.',
      'Local content reporting is a recurring obligation, not an annual exercise. Capture it as sourcing happens.',
      'Audit defensibility means the record has to show the reasoning, not just the outcome.',
    ],
  },
]

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug)
}
