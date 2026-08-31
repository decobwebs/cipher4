/**
 * The three capability groups.
 *
 * Copy note: the previous site described capabilities in abstractions
 * ("solutions that enhance operational awareness"). Everything here names a
 * specific thing the system does, because that is what a technical buyer
 * reads for. No percentage claims appear anywhere — the old build asserted
 * "30% less downtime" and "33% higher productivity" with no source, which is
 * a liability in a tender evaluation rather than a selling point.
 */

export interface Solution {
  slug: string
  title: string
  shortTitle: string
  icon: string
  summary: string
  /** One line for the home page card. */
  teaser: string
  image: string
  imageAlt: string
  /**
   * Flat illustration for the home page's "what we do" band, on the page's
   * own palette. Optional: a card with no illustration falls back to a
   * composed icon plate of the same size and shape, so a missing asset reads
   * as a design choice rather than a hole. See SectionsWhatWeDo.
   */
  illustration?: string
  problem: string[]
  whatWeBuild: { title: string; description: string; items: string[] }[]
  integrations: string[]
  deployment: string
}

export const solutions: Solution[] = [
  {
    slug: 'software-platforms',
    title: 'Software platforms built for operations',
    shortTitle: 'Software Platforms',
    icon: 'lucide:layout-dashboard',
    teaser:
      'Fleet, asset and procurement systems that show you what is actually happening, in time to act on it.',
    summary:
      'We build the operational systems that sit between your assets and the people who have to make decisions about them: tracking, dispatch, maintenance, procurement and reporting, in one place instead of six spreadsheets.',
    image: '/images/solutions-software-platforms.jpg',
    illustration: '/images/illustrations/solution-software-platforms.png',
    imageAlt:
      'Operations control room with wall-mounted monitoring displays showing vessel and fleet positions',
    problem: [
      'Asset positions live in one system, work orders in another, and the fuel log in a notebook on a desk in Apapa.',
      'By the time a delay reaches the person who could have prevented it, it has already cost a day.',
      'Reporting to a client or a regulator means someone spends a week rebuilding the same numbers by hand.',
    ],
    whatWeBuild: [
      {
        title: 'Fleet and asset tracking',
        description:
          'Live position, status and condition for vehicles, vessels, workboats, helicopters and heavy equipment, on one map, with the history retained.',
        items: [
          'GPS, AIS and telematics ingestion',
          'Geofencing with exception alerts',
          'Trip, fuel and utilisation records',
          'Offline capture that syncs when the link returns',
        ],
      },
      {
        title: 'Dispatch and job coordination',
        description:
          'Digital work orders that replace phone calls and WhatsApp threads, with a record of who was told what and when.',
        items: [
          'Job assignment and status tracking',
          'Crew and equipment scheduling',
          'Mobile app for field teams',
          'Full audit trail per job',
        ],
      },
      {
        title: 'Maintenance and inspection',
        description:
          'Service intervals tracked against real usage rather than a calendar, so equipment gets attention before it fails.',
        items: [
          'Usage-based service triggers',
          'Digital inspection checklists with photos',
          'Defect logging and close-out',
          'Certificate and expiry tracking',
        ],
      },
      {
        title: 'Procurement and tendering',
        description:
          'Structured sourcing that survives an audit. Every bid, every evaluation and every award is recorded against the same criteria.',
        items: [
          'Digital tender publication and bid submission',
          'Structured bid comparison and scoring',
          'Supplier records and performance history',
          'Approval workflows with an audit trail',
        ],
      },
    ],
    integrations: [
      'ERP systems (SAP, Oracle, Microsoft Dynamics, Sage)',
      'SCADA and ICS historians, read-only where required',
      'AIS and VMS feeds for marine traffic',
      'Telematics and GPS hardware from most major vendors',
      'VSAT and other satellite links for remote sites',
      'Existing document stores and email',
    ],
    deployment:
      'Cloud, on-premise, or a hybrid where field sites hold local data and sync to a central instance when connectivity allows. Your operational data remains yours, and we will put that in the contract.',
  },
  {
    slug: 'robotics',
    title: 'Field and offshore robotics',
    shortTitle: 'Field & Offshore Robotics',
    icon: 'lucide:bot',
    teaser:
      'Inspection and monitoring for places where sending a person is slow, expensive or unsafe.',
    summary:
      'We build and deploy robotic systems for inspection, monitoring and routine intervention in environments where access is restricted: offshore structures, confined spaces, live plant and remote sites.',
    image: '/images/solutions-robotics.jpg',
    illustration: '/images/illustrations/solution-robotics.png',
    imageAlt:
      'Inspection drone operating near an offshore platform structure at first light',
    problem: [
      'A structural inspection needs rope access, a permit, a weather window and a stand-down of the work below it.',
      'Confined-space entry carries risk that no report can justify if there was another way to get the data.',
      'Remote sites get visited on a schedule rather than when something changes.',
    ],
    whatWeBuild: [
      {
        title: 'Aerial inspection',
        description:
          'Drone survey of structures, flare stacks, tanks, pipelines and terminal infrastructure, flown to a repeatable path so results compare across visits.',
        items: [
          'Visual and thermal survey',
          'Repeatable automated flight paths',
          'Corrosion and defect flagging',
          'Reports generated from the flight, not retyped afterwards',
        ],
      },
      {
        title: 'Remote and subsea units',
        description:
          'Remotely operated units for splash-zone, subsea and confined-space work where the alternative is putting a person in the hazard.',
        items: [
          'Hull, riser and structure inspection',
          'Tank and vessel internal survey',
          'Tethered operation with live video',
          'Data capture tied to position',
        ],
      },
      {
        title: 'Fixed monitoring',
        description:
          'Sensors and cameras left in place on assets that matter, reporting condition continuously instead of at the next scheduled visit.',
        items: [
          'Vibration, temperature and pressure monitoring',
          'Perimeter and access monitoring',
          'Anomaly detection against a learned baseline',
          'Low-bandwidth reporting for satellite links',
        ],
      },
      {
        title: 'Analysis and reporting',
        description:
          'The value is not the footage. It is the comparison between this survey and the last one, and the report that lands with the integrity engineer.',
        items: [
          'Survey-to-survey change detection',
          'Automated defect classification with human review',
          'Reports in your existing format',
          'Findings pushed into your maintenance system',
        ],
      },
    ],
    integrations: [
      'Existing integrity and maintenance management systems',
      'Client reporting templates and formats',
      'Permit-to-work and HSE processes',
      'Satellite and VSAT links for offshore data return',
    ],
    deployment:
      'Our engineers mobilise to site. We work inside your permit-to-work system, brief with your HSE team, and hand over data in the format your integrity engineers already use.',
  },
  {
    slug: 'technology-supply',
    title: 'Technology supply, deployment and commissioning',
    shortTitle: 'Technology Supply & Deployment',
    icon: 'lucide:server',
    teaser:
      'Hardware, software and networks sourced, configured and installed. Delivered working, not delivered in boxes.',
    summary:
      'We source, configure, install and commission the technology your operation runs on: end-user devices, servers, networking, connectivity and the software stack on top of them, under one accountable contract rather than five vendors pointing at each other.',
    image: '/images/solutions-technology-supply.jpg',
    imageAlt:
      'Engineer commissioning network and server equipment in an industrial equipment room',
    problem: [
      'The laptops arrive from one supplier, the licences from another, and nobody owns the fact that neither works on the site network.',
      'A rugged device is specified for an office and fails in the field within a month.',
      'Equipment gets installed and then abandoned, because nobody was contracted to train anyone on it.',
    ],
    whatWeBuild: [
      {
        title: 'End-user and office technology',
        description:
          'Laptops, desktops, workstations and peripherals, specified for where they will actually be used and delivered configured.',
        items: [
          'Standard, rugged and high-performance laptops',
          'Engineering and analytics workstations',
          'Printers, scanners and peripherals',
          'Meeting-room and collaboration equipment',
        ],
      },
      {
        title: 'Infrastructure and connectivity',
        description:
          'The equipment rooms, networks and links that everything else depends on, built for the uptime the operation needs.',
        items: [
          'On-premise and hybrid servers',
          'Storage and backup',
          'Routers, switches, firewalls and access points',
          'Satellite and long-range connectivity for remote sites',
          'Industrial PCs and edge devices',
        ],
      },
      {
        title: 'Software and configuration',
        description:
          'Every device arrives with the right stack on it, licensed properly and hardened before it reaches a user.',
        items: [
          'Operating systems and endpoint security',
          'Licensing, correctly assigned and tracked',
          'Standard build images per role',
          'Integration with your identity and access systems',
        ],
      },
      {
        title: 'Installation, training and support',
        description:
          'Our engineers do the physical install and the commissioning, then train the people who will live with it.',
        items: [
          'On-site installation and cabling',
          'Network design and commissioning',
          'User and administrator training',
          'Documentation and formal handover',
          'Preventive maintenance and support cover',
        ],
      },
    ],
    integrations: [
      'Existing domain, identity and access management',
      'Current network topology and addressing',
      'Legacy systems that must keep running',
      'Your procurement and asset register',
    ],
    deployment:
      'We work in offices, terminals, yards, vessels and offshore locations. One contract, one accountable partner, and a handover pack that means the next engineer can pick it up.',
  },
]

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug)
}
