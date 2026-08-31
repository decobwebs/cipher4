/**
 * How an engagement actually runs.
 *
 * The old site covered this in one throwaway line — "concept → prototype →
 * certified deployment → 24/7 support" — and claimed SLA-backed support
 * without defining a single response time. Buyers read that as filler.
 */

export interface ProcessStep {
  number: string
  title: string
  duration: string
  description: string
  deliverable: string
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discovery and site assessment',
    duration: '1–2 weeks',
    description:
      'We go and look. Our engineers walk the operation, sit with the people doing the work, and find out what actually happens rather than what the process document says happens.',
    deliverable: 'Findings report and a written scope, with the things we advise against.',
  },
  {
    number: '02',
    title: 'Solution design',
    duration: '2–4 weeks',
    description:
      'Architecture, integration points, hardware specification and a delivery plan, reviewed with your technical and HSE teams before anything is built.',
    deliverable: 'Design document, integration plan, bill of materials, fixed price.',
  },
  {
    number: '03',
    title: 'Pilot',
    duration: '6–12 weeks',
    description:
      'One site, one route, one asset class. Small enough to be honest about, large enough to prove whether the thing works in your conditions.',
    deliverable: 'Working system in production on a limited scope, with measured results.',
  },
  {
    number: '04',
    title: 'Deployment and commissioning',
    duration: 'Scope-dependent',
    description:
      'Rollout across sites, with our engineers on the ground for installation, network commissioning and integration with the systems you already run.',
    deliverable: 'Commissioned system, integration tested, formally accepted.',
  },
  {
    number: '05',
    title: 'Training and handover',
    duration: '1–2 weeks',
    description:
      'Users and administrators trained separately, because they need different things. Documentation written for the person who inherits this in two years.',
    deliverable: 'Trained teams, administrator documentation, handover pack.',
  },
  {
    number: '06',
    title: 'Support',
    duration: 'Ongoing',
    description:
      'Defined response times, named contacts and scheduled preventive maintenance. Support is a contract with numbers in it, not a promise.',
    deliverable: 'Signed support agreement with the tier you have chosen.',
  },
]

export interface EngagementModel {
  title: string
  icon: string
  description: string
  bestFor: string
}

export const engagementModels: EngagementModel[] = [
  {
    title: 'Fixed-scope project',
    icon: 'lucide:target',
    description:
      'Defined deliverables, fixed price, agreed acceptance criteria. Most deployments start here.',
    bestFor: 'A specific system you need built and commissioned.',
  },
  {
    title: 'Supply and deploy',
    icon: 'lucide:package',
    description:
      'Hardware and software sourced, configured, installed and handed over working, under one contract.',
    bestFor: 'Equipping a site, office, vessel or new operation.',
  },
  {
    title: 'Retained support',
    icon: 'lucide:life-buoy',
    description:
      'Ongoing maintenance, monitoring and enhancement of systems already in production.',
    bestFor: 'Keeping a deployed system healthy and improving.',
  },
  {
    title: 'Managed service',
    icon: 'lucide:settings',
    description:
      'We run the platform and the field operation for you against agreed service levels.',
    bestFor: 'Operations without an internal technical team to carry it.',
  },
]

export interface SupportTier {
  name: string
  response: string
  coverage: string
  includes: string[]
  onSite: string
}

export const supportTiers: SupportTier[] = [
  {
    name: 'Standard',
    response: 'Next business day',
    coverage: 'Mon–Fri, 8:00am–5:00pm WAT',
    onSite: 'Scheduled visits',
    includes: [
      'Remote diagnosis and support',
      'Software updates and patches',
      'Quarterly preventive maintenance',
      'Named support contact',
    ],
  },
  {
    name: 'Priority',
    response: '4 business hours',
    coverage: 'Mon–Sat, 7:00am–7:00pm WAT',
    onSite: 'Within 2 business days',
    includes: [
      'Everything in Standard',
      'Priority queue and escalation path',
      'Monthly preventive maintenance',
      'Spares held for critical components',
    ],
  },
  {
    name: 'Critical operations',
    response: '1 hour, 24/7',
    coverage: '24 hours, every day',
    onSite: 'Same day where access allows',
    includes: [
      'Everything in Priority',
      'Round-the-clock on-call engineer',
      'Proactive monitoring with alerting',
      'Agreed spares holding on site',
      'Quarterly service review',
    ],
  },
]
