/**
 * Home page copy. Every string comes from
 * design-handoff/content/cipher4-website-content-v1.md, Part C (and B4 for
 * the closing band, in data/site.ts). Change words here, not in components.
 */
import type { C4IconName } from '~/lib/icons'
import type { Distortion } from '~/lib/hyperspeed/index'

export const homeSeo = {
  title: 'Cipher4 AI & Robotics | Intelligence for critical operations',
  description: 'Cipher4 engineers software, AI and connected systems for maritime, oil and gas, logistics and supply chain operations: platforms that let organisations see, control and prove every part of their work.',
  socialTitle: 'Cipher4 AI & Robotics',
  socialDescription: 'Intelligence for critical operations.',
}

// C1
export const hero = {
  eyebrow: 'Maritime · Oil and gas · Logistics · Supply chain',
  titleLead: 'Intelligence for',
  titleAccent: 'critical operations.',
  lead: 'We engineer the software, AI and connected systems that let complex operations sense what is happening, decide what comes next and prove what was done.',
  primary: { label: 'Talk to us', to: '/contact' },
  secondary: { label: 'See our work', to: '/work' },
}

// C2. Logos are white on transparent; shown in one tone (CSS filter).
export const clients = {
  label: 'Organisations we work with',
  logos: [
    { name: 'Reliant Anchor', src: '/images/logos/reliant-anchor.png', w: 120, h: 140 },
    { name: 'Harbours360', src: '/images/logos/harbours360.png', w: 168, h: 160 },
    { name: 'Lighthouse Maritime Agency', src: '/images/logos/lighthouse.png', w: 100, h: 122 },
    { name: 'Zeal Global Resources', src: '/images/logos/zeal.png', w: 273, h: 160 },
    { name: 'AA Heritage Navigation', src: '/images/logos/aa-heritage.png', w: 252, h: 160 },
    { name: 'Quick Trips', src: '/images/logos/quick-trips.png', w: 382, h: 124 },
    { name: 'Lustre by Kal', src: '/images/logos/lustre.png', w: 188, h: 160 },
    { name: 'Reliant Anchor Foundation', src: '/images/logos/foundation.png', w: 391, h: 157 },
  ],
}

// C3. The supporting sentence is the Mission paragraph from G1 (About);
// the Home board places it here.
export const mission = {
  eyebrow: 'Our mission',
  quiet: "To make the world's critical operations",
  strong: 'intelligent, autonomous and accountable',
  support: 'Across ships, fleets, energy and supply chains, we build the software, AI and connected systems that let operations sense what is happening, decide what comes next and prove what was done.',
  link: { label: 'About Cipher4', to: '/about' },
}

// C4
export const services = {
  eyebrow: 'What we do',
  title: 'Six capabilities. One accountable partner.',
  lead: 'From the platform an operation runs on to the devices in every office, we design, build and support the technology critical industries depend on.',
  items: [
    { title: 'Operational platforms', line: 'One system for the whole operation: people, assets, approvals and records in one place.', to: '/services/operational-platforms', icon: 'operational-platforms' },
    { title: 'AI and automation', line: 'Intelligence built into the work, taking repetitive tasks off skilled people.', to: '/services/ai-automation', icon: 'ai-automation' },
    { title: 'IoT and robotics', line: 'Sensors, connected devices and robotic systems that report what is happening on the ground.', to: '/services/iot-robotics', icon: 'iot-robotics' },
    { title: 'Digital platforms and websites', line: 'Marketplaces, portals and websites that earn trust where reputation decides contracts.', to: '/services/digital-platforms', icon: 'digital-platforms' },
    { title: 'IT infrastructure and support', line: 'Equipment sourced, installed, maintained and upgraded, for offices and field sites.', to: '/services/it-infrastructure', icon: 'it-infrastructure' },
    { title: 'Education technology', line: 'Platforms that schools, universities and organisations use to teach, train and assess.', to: '/services/education-technology', icon: 'education-technology' },
  ] satisfies { title: string; line: string; to: string; icon: C4IconName }[],
  /** "Explore" on each card (C4). */
  cta: 'Explore',
  all: { label: 'All services', to: '/services' },
}

// C5. `shape` is the road shape the sector road morphs to (Phase 2b).
export const sectors = {
  eyebrow: 'Where we work',
  title: 'Built for industries where failure is expensive',
  lead: 'Our work is concentrated in four sectors that share the same demands: high-value assets, strict regulation and no tolerance for poor records.',
  items: [
    { title: 'Maritime and ports', line: 'Vessels, port calls, bunkering and marine services, coordinated and accounted for.', to: '/sectors/maritime-and-ports', icon: 'maritime', shape: 'turbulentDistortion', tint: 'a' },
    { title: 'Oil and gas', line: 'Field operations, compliance and asset integrity where access is hard and scrutiny is constant.', to: '/sectors/oil-and-gas', icon: 'oil-gas', shape: 'deepDistortion', tint: 'b' },
    { title: 'Logistics and transport', line: 'Fleets, depots and deliveries with one version of the truth.', to: '/sectors/logistics-and-transport', icon: 'logistics', shape: 'LongRaceDistortion', tint: 'c' },
    { title: 'Supply chain and procurement', line: 'Sourcing that is faster to run and straightforward to defend.', to: '/sectors/supply-chain-and-procurement', icon: 'supply-chain', shape: 'xyDistortion', tint: 'd' },
  ] satisfies { title: string; line: string; to: string; icon: C4IconName; shape: Distortion; tint: string }[],
}

// C6. Images only from the approved set (public/images/work).
export interface WorkFeature {
  name: string
  field: string
  line: string
  link: { label: string; to: string }
  image: { src: string; w: number; h: number; alt: string }
}

export const work = {
  eyebrow: 'Our work',
  title: 'Trusted with the systems that matter',
  all: { label: 'See all our work', to: '/work' },
  items: [
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
  ] satisfies WorkFeature[],
}

// C7
export const why = {
  eyebrow: 'Why Cipher4',
  title: 'What you can expect from us',
  items: [
    { title: 'Specialists, not generalists', text: 'We know the language, the regulation and the pressure points of the industries we serve. You spend less time explaining your operation and more time improving it.', icon: 'specialists' },
    { title: 'One partner, start to finish', text: 'Strategy, design, engineering, infrastructure and support under one contract, with one team accountable for the result.', icon: 'one-partner' },
    { title: 'Accountability by design', text: 'Every action recorded, every approval in its place, every figure traceable. Our systems are built to stand up to scrutiny.', icon: 'accountability' },
    { title: 'We work with what you have', text: 'You already run systems that work. We connect to them rather than asking you to start again.', icon: 'works-with-what-you-have' },
  ] satisfies { title: string; text: string; icon: C4IconName }[],
}

// C8
export const deliver = {
  eyebrow: 'How we deliver',
  title: 'Six stages, and you know what each one gives you',
  lead: 'Every engagement follows the same sequence, so you always know what happens next and what lands in your hands at the end of each stage.',
  link: { label: 'Engagement models and support', to: '/services#delivery' },
  receiveLabel: 'You receive',
  stages: [
    { n: '01', title: 'Discovery', text: 'We learn how your operation really works.', receive: 'findings and a written scope.', icon: 'discovery' },
    { n: '02', title: 'Design', text: 'Architecture, integrations and a delivery plan, agreed before anything is built.', receive: 'a design document and a fixed price.', icon: 'design' },
    { n: '03', title: 'Pilot', text: 'One site, one team or one process, to prove the system in real conditions.', receive: 'a working system on a limited scope.', icon: 'pilot' },
    { n: '04', title: 'Deployment', text: 'Rollout across the operation, integrated with what you already run.', receive: 'a commissioned, accepted system.', icon: 'deployment' },
    { n: '05', title: 'Training and handover', text: 'Users and administrators trained separately, with documentation for whoever looks after it next.', receive: 'trained teams and a handover pack.', icon: 'training' },
    { n: '06', title: 'Support', text: 'Defined response times, named contacts and scheduled maintenance.', receive: 'a signed support agreement.', icon: 'support' },
  ] satisfies { n: string; title: string; text: string; receive: string; icon: C4IconName }[],
}

// C9. Names stand in until the official logos are supplied (content F5 note).
export const technologies = {
  eyebrow: 'Technologies',
  title: 'The technology we work with',
  names: ['AWS', 'Microsoft Azure', 'Google Cloud', 'React', 'Next.js', 'Python', 'PostgreSQL', 'OpenAI', 'Anthropic Claude', 'Docker', 'Kubernetes', 'Cloudflare', 'Microsoft 365', 'Dell', 'HP'],
  link: { label: 'All technologies', to: '/technologies' },
}

// C10 (dates from H1; category labels as corrected in H2)
export const insights = {
  eyebrow: 'Insights',
  title: 'Notes from the work',
  items: [
    { sector: 'Oil and gas', read: '6 min read', title: 'Design field systems for the connection you actually have', date: '14 July 2026', to: '/insights/offshore-connectivity-field-systems' },
    { sector: 'Supply chain', read: '5 min read', title: 'What makes a procurement record survive an audit', date: '2 June 2026', to: '/insights/procurement-systems-that-survive-audit' },
  ],
  link: { label: 'All insights', to: '/insights' },
}

// C11
export const youth = {
  eyebrow: 'Community',
  strong: 'Opening technology to the next generation.',
  rest: 'Mentoring, practical skills and support for young people with ideas worth building.',
  link: { label: 'Youth and skills', to: '/youth' },
}
