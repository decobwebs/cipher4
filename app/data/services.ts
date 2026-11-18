/**
 * Service pages (content D2 to D7). Every string is from
 * design-handoff/content/cipher4-website-content-v1.md. Each service has
 * only the sections the content file gives it; the template leaves the
 * others out (plan, Phase 4).
 */
import type { C4IconName } from '~/lib/icons'

export type SectorKey = 'maritime' | 'oilGas' | 'logistics' | 'supplyChain'

export interface BuildItem {
  title: string
  text?: string
  bullets?: string[]
  icon?: C4IconName
}

export interface RelatedItem {
  kind: 'service' | 'case' | 'product' | 'youth'
  title: string
  line: string
  to: string
  icon?: C4IconName
  image?: { src: string; w: number; h: number }
}

export interface Service {
  slug: string
  seo: { title: string; description: string }
  title: string
  lead: string
  cta: { label: string; to: string }
  icon: C4IconName
  problems: string[]
  build: { label: string; title?: string; items: BuildItem[] }
  approach?: { title: string; items: { title: string; text: string }[] }
  includes?: { title: string; items: string[] }
  sectors?: Record<SectorKey, string>
  note?: { title: string; text: string }
  fits?: { title: string; text: string; items: string[]; deployment: { label: string; text: string } }
  selected?: { title: string; items: string[]; to: string }
  brands?: { title: string; items: string[] }
  related?: RelatedItem[]
}

export const SERVICE_EYEBROW = 'Services'
export const PROBLEMS_TITLE = 'What usually brings people to us'
export const SECTORS_TITLE = 'In your sector'
export const RELATED_TITLE = 'Related'

export const sectorRows: { key: SectorKey; title: string; to: string; icon: C4IconName }[] = [
  { key: 'maritime', title: 'Maritime and ports', to: '/sectors/maritime-and-ports', icon: 'maritime' },
  { key: 'oilGas', title: 'Oil and gas', to: '/sectors/oil-and-gas', icon: 'oil-gas' },
  { key: 'logistics', title: 'Logistics and transport', to: '/sectors/logistics-and-transport', icon: 'logistics' },
  { key: 'supplyChain', title: 'Supply chain and procurement', to: '/sectors/supply-chain-and-procurement', icon: 'supply-chain' },
]

const IMG = {
  reliant: { src: '/images/work/reliant-anchor.jpg', w: 1400, h: 875 },
}

export const services: Service[] = [
  // D2
  {
    slug: 'operational-platforms',
    seo: {
      title: 'Operational platforms | Cipher4 AI & Robotics',
      description: 'Custom platforms that bring people, assets, approvals and records into one controlled system, built for maritime, oil and gas, logistics and supply chain operations.',
    },
    title: 'One system for the whole operation',
    lead: 'We build the platforms that sit between your assets and the people who make decisions about them. Operations, approvals, records and reporting live in one place, instead of six spreadsheets and a WhatsApp group.',
    cta: { label: 'Discuss your operation', to: '/contact' },
    icon: 'operational-platforms',
    problems: [
      'Information about one job lives in four places, and nobody is sure which one is right.',
      'By the time a delay reaches the person who could have prevented it, it has already cost a day.',
      'Reporting to a client or a regulator means someone spends a week rebuilding the same numbers by hand.',
    ],
    build: {
      label: 'What we build',
      title: 'The parts of a well-run operation',
      items: [
        { title: 'Operations and job control', text: 'Every job as one record, moving through defined stages, with the right people notified at each step.', icon: 'job-control', bullets: ['Job creation, assignment and tracking', 'Stage-by-stage status with timestamps', 'Field updates from any device', 'Escalation when something stalls'] },
        { title: 'Approvals and accountability', text: "Decisions made in the system, not in someone's inbox.", icon: 'accountability', bullets: ['Approval workflows matched to your authority levels', 'A complete history of who did what, when and why', 'Nothing important overwritten', 'Documents attached to the decisions they support'] },
        { title: 'Assets, compliance and documents', text: 'Equipment, licences, permits and certificates tracked against the work they allow.', icon: 'document', bullets: ['Asset registers with condition and history', 'Licence and certificate tracking with expiry alerts', 'Regulatory records ready when they are asked for', 'Document control with version history'] },
        { title: 'Reporting and performance', text: 'The numbers management needs, produced by the system rather than assembled by hand.', icon: 'chart', bullets: ['Live dashboards for operations and management', 'Performance measured against your own targets', 'Client-facing views of their own records', 'Exports in the formats your stakeholders expect'] },
      ],
    },
    sectors: {
      maritime: 'Vessel operations, port calls, bunkering, crew and marine services managed end to end.',
      oilGas: 'Field operations, permits, regulatory records and asset integrity in one controlled system.',
      logistics: 'Fleet visibility, dispatch, delivery records and performance across every route.',
      supplyChain: 'Tendering, vendor management, approvals and spend, with a complete record of every decision.',
    },
    fits: {
      title: 'Fits what you already run',
      text: 'You already run systems that work. We connect to them rather than asking you to replace them.',
      items: ['ERP and finance systems', 'Email and document stores', 'Vessel tracking (AIS) and telematics feeds', 'Mobile money and banking services', 'Messaging and notification services'],
      deployment: { label: 'Deployment', text: 'Cloud, on-premise or hybrid. Your operational data remains yours, and we state that in the contract.' },
    },
    related: [
      { kind: 'service', title: 'AI and automation', line: 'Intelligence built into the work', to: '/services/ai-automation', icon: 'ai-automation' },
      { kind: 'service', title: 'IoT and robotics', line: 'Physical assets, connected', to: '/services/iot-robotics', icon: 'iot-robotics' },
      { kind: 'case', title: 'Reliant Anchor', line: 'Complete operational command for marine fuel delivery.', to: '/work/reliant-anchor', image: IMG.reliant },
    ],
  },
  // D3
  {
    slug: 'ai-automation',
    seo: {
      title: 'AI and automation | Cipher4 AI & Robotics',
      description: 'Artificial intelligence built into operational systems: intelligent matching, document understanding, forecasting, assistants and automation for critical industries.',
    },
    title: 'Intelligence built into the work itself',
    lead: 'AI earns its place when it removes real work from skilled people. We build it into the systems your teams already use, so it reads, predicts, matches and acts where decisions are made.',
    cta: { label: 'Discuss an AI project', to: '/contact' },
    icon: 'ai-automation',
    problems: [
      'Skilled staff spend hours reading documents, retyping data and answering the same questions.',
      "Decisions rely on experience that lives in a few people's heads.",
      'The organisation has tried AI tools, but nothing connects to how the work is actually done.',
    ],
    build: {
      label: 'What we build',
      title: 'AI that does a job, not a demo',
      items: [
        { title: 'Intelligent matching and search', text: 'Search that understands meaning, not just keywords. It matches people to roles, buyers to assets and questions to the right answers.' },
        { title: 'Document intelligence', text: 'Certificates, permits, invoices and reports read, checked and filed automatically, with people reviewing the exceptions.' },
        { title: 'Forecasting and early warning', text: 'Arrival times, demand, equipment condition and risk, predicted from your own operational data.' },
        { title: 'Assistants and agents', text: "Assistants that answer from your organisation's own records and procedures, and agents that carry out routine tasks within limits you set." },
        { title: 'Workflow automation', text: 'Repetitive steps removed: notifications, data entry, routing and reporting handled by the system.' },
      ],
    },
    approach: {
      title: 'How we approach AI',
      items: [
        { title: 'Your data stays yours.', text: 'We say exactly where data goes and who can see it, before anything is built.' },
        { title: 'People stay in command.', text: 'AI recommends and automates within limits you approve, and every action is recorded.' },
        { title: 'Measured, not assumed.', text: 'Every AI feature is tested against real cases before it goes live.' },
      ],
    },
    sectors: {
      maritime: 'Crew matching, voyage documentation and vessel data turned into decisions.',
      oilGas: 'Document intelligence for certificates and permits, and predictive maintenance for critical equipment.',
      logistics: 'Arrival forecasting, route optimisation and automated exception alerts.',
      supplyChain: 'Bid analysis, supplier risk signals and demand forecasting.',
    },
    related: [
      { kind: 'product', title: 'LucidHR', line: 'Intelligent crew matching', to: '/products/lucidhr', image: { src: '/images/work/lucidhr.jpg', w: 1400, h: 613 } },
      { kind: 'service', title: 'Operational platforms', line: 'One system for the whole operation', to: '/services/operational-platforms', icon: 'operational-platforms' },
    ],
  },
  // D4
  {
    slug: 'iot-robotics',
    seo: {
      title: 'IoT and robotics | Cipher4 AI & Robotics',
      description: 'Sensors, connected devices and robotic systems that monitor assets and environments continuously, bringing real-world data into the systems decisions are made on.',
    },
    title: 'Connecting physical assets to the systems that manage them',
    lead: "Sensors, connected devices and robotic systems that watch your assets continuously, so problems are seen before they become failures and inspections happen without putting people in harm's way.",
    cta: { label: 'Discuss a monitoring project', to: '/contact' },
    icon: 'iot-robotics',
    problems: [
      'Assets are checked on a schedule rather than when something changes.',
      'An inspection needs permits, access equipment and a weather window, and the work below has to stop.',
      'Readings from the field arrive as photographs and handwritten notes, days after they were taken.',
    ],
    build: {
      label: 'What we design and integrate',
      title: 'From the sensor to the decision',
      items: [
        { title: 'Condition monitoring', text: 'Sensors on the equipment that matters, reporting temperature, pressure, vibration, levels and position continuously.' },
        { title: 'Remote inspection', text: 'Drone and remote-camera inspection for structures, tanks and hard-to-reach areas, flown to repeatable paths so results compare over time.' },
        { title: 'Connected fleets and cargo', text: 'Telematics, location and cargo condition from vehicles, vessels and containers in transit.' },
        { title: 'Analysis and alerts', text: 'The value is not the data. It is the comparison with last week, the alert that reaches the right engineer, and the record that goes into your maintenance system.' },
      ],
    },
    sectors: {
      maritime: 'Tank levels, engine condition and vessel position reported in real time.',
      oilGas: 'Remote monitoring and drone-based inspection of hard-to-reach structures.',
      logistics: 'Telematics, cargo condition and temperature monitoring in transit.',
      supplyChain: 'Warehouse tracking and automated inventory visibility.',
    },
    related: [
      { kind: 'service', title: 'AI and automation', line: 'Intelligence built into the work', to: '/services/ai-automation', icon: 'ai-automation' },
      { kind: 'service', title: 'Operational platforms', line: 'One system for the whole operation', to: '/services/operational-platforms', icon: 'operational-platforms' },
    ],
  },
  // D5
  {
    slug: 'digital-platforms',
    seo: {
      title: 'Digital platforms and websites | Cipher4 AI & Robotics',
      description: 'Marketplaces, client portals and websites engineered for performance and trust, for organisations where reputation decides contracts.',
    },
    title: 'A digital presence built for serious buyers',
    lead: 'In industries where contracts are large and trust is everything, your website is often the first thing a buyer checks. We design and engineer marketplaces, portals and websites that are fast, secure and built to win business.',
    cta: { label: 'Start a website or platform', to: '/contact' },
    icon: 'digital-platforms',
    problems: [
      'The website no longer reflects the size and quality of the business.',
      'Enquiries arrive with too little information to act on.',
      'Customers phone to ask questions a portal could answer at any hour.',
    ],
    build: {
      label: 'What we build',
      title: 'Strategy, design, content and engineering under one roof',
      items: [
        { title: 'Corporate websites', text: "Clear positioning, professional writing and design that holds up to a procurement team's scrutiny." },
        { title: 'Marketplaces', text: 'Platforms where verified buyers and sellers meet, with listings, enquiries, auctions and structured deals.' },
        { title: 'Client and supplier portals', text: 'Secure spaces where your customers and partners see their own records, documents and status.' },
        { title: 'Enquiry and ordering experiences', text: 'Quote requests, trip planners, order flows and booking forms that collect exactly what your team needs to respond.' },
      ],
    },
    includes: {
      title: 'What every project includes',
      items: ['Writing and structure, not just design', 'Performance on mid-range phones and busy networks', 'Accessibility and search visibility built in from the start', 'Analytics, so you can see what works', 'Handover with documentation, and support after launch'],
    },
    sectors: {
      maritime: 'Asset marketplaces, agency websites and client portals.',
      oilGas: 'Corporate websites and compliance-ready digital presence for operators and service companies.',
      logistics: 'Quote, booking and tracking experiences for customers.',
      supplyChain: 'Supplier portals and B2B ordering platforms.',
    },
    selected: {
      title: 'Selected websites',
      items: ['Lighthouse Maritime Agency', 'Zeal Global Resources', 'Quick Trips', 'Lustre by Kal'],
      to: '/work',
    },
  },
  // D6
  {
    slug: 'it-infrastructure',
    seo: {
      title: 'IT infrastructure and support | Cipher4 AI & Robotics',
      description: 'Procurement, installation, software setup, maintenance, repairs and upgrades for offices and field sites. Computers, servers, networks and workplace technology, set up properly and kept that way.',
    },
    title: 'Technology set up properly, and kept that way',
    lead: 'Everything an organisation needs to equip its offices and field sites and keep them running, from choosing the right equipment to supporting it for years after installation. One contract, one accountable partner.',
    cta: { label: 'Request a quote', to: '/contact?type=quote' },
    icon: 'it-infrastructure',
    problems: [
      "Equipment comes from one supplier and the software from another, and nobody owns the problem when they don't work together.",
      'Computers slow down, fail or fall out of date, and there is no plan for keeping them healthy.',
      'A new office or team needs to be fully equipped, quickly, without a dozen separate vendors.',
    ],
    build: {
      label: 'What we do',
      title: 'From procurement to long-term support',
      items: [
        { title: 'Procurement and supply', text: 'We advise on and source the right equipment from leading brands such as Dell and HP, specified for how and where it will actually be used.', bullets: ['Laptops, desktops and workstations', 'Servers, storage and backup', 'Printers, scanners and peripherals', 'Meeting-room and collaboration equipment'] },
        { title: 'Installation and setup', text: 'Equipment installed, configured and ready to use on day one.', bullets: ['Computer and server installation', 'Network design, cabling and wireless', 'Printer and peripheral setup', 'User accounts and access'] },
        { title: 'Software installation and licensing', text: 'The right software on every device, properly licensed.', bullets: ['Operating systems', 'Microsoft 365 and Office: Word, Excel, PowerPoint, Outlook and Teams', 'Security and antivirus software', 'Business and specialist applications'] },
        { title: 'System maintenance', text: 'Scheduled health checks that find problems before your staff do.', bullets: ['Performance and storage checks', 'Security updates and patching', 'Backup verification', 'Hardware condition reports'] },
        { title: 'Repairs and upgrades', text: 'When something fails or falls behind, we diagnose it, replace what is faulty and upgrade what is outdated.', bullets: ['Fault diagnosis and repair', 'Component replacement and upgrades', 'Operating system and software upgrades', 'Data migration to new equipment'] },
        { title: 'Workspace setup', text: 'Complete technology fit-outs for new offices, branches and teams, from cabling to the last desktop.' },
      ],
    },
    sectors: {
      maritime: 'Terminal offices, port control rooms and onboard IT.',
      oilGas: 'Field offices and remote sites, with rugged equipment and long-range connectivity.',
      logistics: 'Depots, yards and dispatch centres.',
      supplyChain: 'Warehouses and head offices.',
    },
    brands: {
      title: 'Brands we supply and support',
      items: ['Dell', 'HP', 'Lenovo', 'Cisco', 'Microsoft'],
    },
  },
  // D7
  {
    slug: 'education-technology',
    seo: {
      title: 'Education technology | Cipher4 AI & Robotics',
      description: 'E-learning platforms, learning management systems, examination software and emerging learning technology for schools, universities, training providers and organisations.',
    },
    title: 'Technology for learning',
    lead: 'We build the digital platforms schools, universities, training providers and organisations use to teach, train and assess, whether learners are in the room or across the world.',
    cta: { label: 'Discuss a learning platform', to: '/contact' },
    icon: 'education-technology',
    problems: [
      "Training is delivered in person only, so it can't reach people who are remote or busy.",
      'Tests are set, taken and marked on paper, and results take weeks.',
      'Courses, records and certificates sit in different places, with no view of who has learned what.',
    ],
    build: {
      label: 'What we build',
      items: [
        { title: 'E-learning solutions', bullets: ['Virtual classrooms', 'Distance learning programmes', 'Online training platforms', 'Educational games', 'Corporate training'] },
        { title: 'Learning management systems', bullets: ['Teaching software', 'Simulated experiment software', 'Test paper evaluation', 'Pilot training portals', 'Examination management'] },
        { title: 'Emerging learning technology', bullets: ['Mobile learning', 'Educational AR and VR', 'Artificial intelligence and machine learning', 'Learning analytics'] },
      ],
    },
    note: {
      title: 'For organisations too',
      text: 'Safety inductions, compliance refreshers and technical training for staff and contractors, with records that show who completed what and when.',
    },
    related: [
      { kind: 'youth', title: 'Youth and skills', line: 'Our community commitment', to: '/youth' },
    ],
  },
]

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug)
