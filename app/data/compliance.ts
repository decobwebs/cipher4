/**
 * Credentials and compliance page (content G2). Every string is from
 * design-handoff/content/cipher4-website-content-v1.md.
 *
 * Only registrations actually held are shown (G2 note). The RC number
 * comes from data/site.ts (company.rcNumber), shown as "RC 8980008".
 */
import type { C4IconName } from '~/lib/icons'
import { company } from '~/data/site'

const registrationRows = [
  { label: 'Registered name', value: 'Cipher4 AI & Robotics Ltd' },
  { label: 'Registered with', value: 'Corporate Affairs Commission, Nigeria' },
  { label: 'RC number', value: company.rcNumber ? `RC ${company.rcNumber}` : '' },
  { label: 'Established', value: '2023' },
]

export const credentialsPage = {
  seo: {
    title: 'Credentials and compliance | Cipher4 AI & Robotics',
    description: 'Company registration, policy positions on safety, security, quality and conduct, and documentation for prequalification with Cipher4 AI & Robotics Ltd.',
  },
  eyebrow: 'Credentials and compliance',
  title: 'What a procurement team needs, in one place',
  lead: 'Our registration details and the policy positions we work to. If you need documents for a prequalification pack, ask and we will send them the same working day.',
  cta: { label: 'Request documents', to: '/contact?type=documents' },
  registration: {
    title: 'Registration',
    rows: registrationRows.filter((r) => r.value),
  },
  policies: {
    label: 'Policy positions',
    title: 'How we work on your sites and in your systems',
    lead: 'These are commitments we will accept as contract terms.',
    groups: [
      {
        title: 'Health, safety and environment',
        icon: 'check',
        items: [
          "On client sites we work inside the client's permit-to-work system, attend the site induction and follow the client's HSE procedures without exception.",
          'Any member of our team may stop an activity they judge unsafe, and will be supported for doing so.',
        ],
      },
      {
        title: 'Information security',
        icon: 'accountability',
        items: [
          'We connect to operational systems on a read-only basis by default. Where write access is required, it is scoped, logged and agreed in writing first.',
          'Access is least-privilege and individually attributed. We do not use shared credentials on client systems.',
          'Client data belongs to the client. Ownership, retention and deletion terms are stated in the contract, and we support export at any time.',
        ],
      },
      {
        title: 'Quality and delivery',
        icon: 'document',
        items: [
          'Every engagement has written acceptance criteria, agreed before build starts.',
          'Systems are handed over with documentation written for whoever looks after them next.',
        ],
      },
      {
        title: 'Business conduct',
        icon: 'one-partner',
        items: [
          'Cipher4 does not offer, pay, solicit or accept bribes, facilitation payments or kickbacks, in any form, in any jurisdiction.',
          'We disclose conflicts of interest in any tender we take part in.',
          'Our people decline gifts or hospitality that could reasonably be seen to influence a commercial decision.',
        ],
      },
    ] satisfies { title: string; icon: C4IconName; items: string[] }[],
  },
  references: {
    title: 'References',
    text: "Client references are available on request, with that client's consent. Tell us the sector and scope you are evaluating, and we will put you in touch with the most comparable engagement.",
    cta: { label: 'Request a reference', to: '/contact?type=reference' },
  },
  submission: {
    title: 'Preparing a submission?',
    text: 'Send us your prequalification checklist and we will tell you clearly which items we can provide.',
    cta: { label: 'Send your checklist', to: '/contact?type=documents' },
  },
}
