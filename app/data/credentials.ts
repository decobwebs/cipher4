/**
 * CREDENTIALS & COMPLIANCE
 * ============================================================================
 * ⚠️  READ THIS BEFORE EDITING.
 *
 * For a Nigerian company selling into oil & gas, logistics and the public
 * sector, these are checked BEFORE anyone reads your value proposition. They
 * were completely absent from the old site, which is the single largest
 * commercial gap it had.
 *
 * NOTHING HERE PUBLISHES UNTIL YOU SET `status: 'held'` AND FILL IN THE
 * REFERENCE. Items left as 'pending' render as "in progress"; items left as
 * 'unknown' do not render at all. This is deliberate — publishing a
 * certification you do not hold is fraud, and publishing a vague claim about
 * one is worse than saying nothing.
 *
 * Cipher4: go through this file line by line and set each status honestly.
 * ============================================================================
 */

export type CredentialStatus =
  /** Held, verified, safe to publish. Requires `reference`. */
  | 'held'
  /** Genuinely in progress. Renders as "in progress" with no number. */
  | 'pending'
  /** Not held / not started / unconfirmed. Does not render. */
  | 'unknown'

export interface Credential {
  name: string
  issuer: string
  /** Registration or certificate number. Required when status is 'held'. */
  reference: string
  description: string
  /** Why a buyer cares. Shown as supporting text. */
  relevance: string
  status: CredentialStatus
}

export interface CredentialGroup {
  title: string
  intro: string
  icon: string
  items: Credential[]
}

export const credentialGroups: CredentialGroup[] = [
  {
    title: 'Corporate registration',
    icon: 'lucide:building-2',
    intro:
      'Cipher4 AI & Robotics Ltd is a limited liability company registered in Nigeria.',
    items: [
      {
        name: 'Corporate Affairs Commission (CAC)',
        issuer: 'Corporate Affairs Commission, Nigeria',
        reference: '', // TODO(cipher4): RC number
        description: 'Incorporation as a Nigerian limited liability company.',
        relevance:
          'Confirms legal standing to contract. Requested in every prequalification.',
        status: 'unknown',
      },
      {
        name: 'Tax Identification Number (TIN)',
        issuer: 'Federal Inland Revenue Service',
        reference: '',
        description: 'Federal tax registration.',
        relevance: 'Required before award and for invoice processing.',
        status: 'unknown',
      },
      {
        name: 'VAT registration',
        issuer: 'Federal Inland Revenue Service',
        reference: '',
        description: 'Registered for Value Added Tax.',
        relevance: 'Required to invoice corporate and government clients.',
        status: 'unknown',
      },
      {
        name: 'Tax Clearance Certificate',
        issuer: 'Federal Inland Revenue Service',
        reference: '',
        description: 'Current tax clearance, available on request.',
        relevance: 'A standing prequalification requirement.',
        status: 'unknown',
      },
    ],
  },
  {
    title: 'Sector registration',
    icon: 'lucide:hard-hat',
    intro:
      'Registrations that qualify Cipher4 to bid for and deliver oil and gas work in Nigeria.',
    items: [
      {
        name: 'NIPEX / NJQS vendor registration',
        issuer: 'Nigerian Petroleum Exchange',
        reference: '',
        description:
          'Registration on the Nigerian Joint Qualification System, with prequalified product and service categories.',
        relevance:
          'Effectively a gate condition for NNPC and IOC tenders. Buyers search the NJQS directory directly.',
        status: 'unknown',
      },
      {
        name: 'NCDMB certification',
        issuer: 'Nigerian Content Development and Monitoring Board',
        reference: '',
        description:
          'Certification under the Nigerian Oil and Gas Industry Content Development Act.',
        relevance:
          'Nigerian Content is a scored criterion in tender evaluation, not a formality.',
        status: 'unknown',
      },
      {
        name: 'DPR / NUPRC permit',
        issuer: 'Nigerian Upstream Petroleum Regulatory Commission',
        reference: '',
        description: 'Permit to provide services to the upstream petroleum sector.',
        relevance: 'Required for certain categories of upstream service provision.',
        status: 'unknown',
      },
    ],
  },
  {
    title: 'Management systems',
    icon: 'lucide:badge-check',
    intro:
      'Certifications covering how we manage quality, information security and safety.',
    items: [
      {
        name: 'ISO 9001: Quality management',
        issuer: 'Accredited certification body',
        reference: '',
        description: 'Certified quality management system.',
        relevance: 'Commonly requested; sometimes scored in technical evaluation.',
        status: 'unknown',
      },
      {
        name: 'ISO 27001: Information security',
        issuer: 'Accredited certification body',
        reference: '',
        description: 'Certified information security management system.',
        relevance:
          'Increasingly required where a vendor touches operational data or connects to OT networks.',
        status: 'unknown',
      },
      {
        name: 'ISO 45001: Occupational health and safety',
        issuer: 'Accredited certification body',
        reference: '',
        description: 'Certified occupational health and safety management system.',
        relevance: 'Expected of any contractor mobilising people to site.',
        status: 'unknown',
      },
    ],
  },
  {
    title: 'Insurance',
    icon: 'lucide:shield',
    intro:
      'Cover held for work on client sites, offshore installations and terminals.',
    items: [
      {
        name: 'Public liability',
        issuer: '',
        reference: '',
        description: 'Third-party injury and property damage cover.',
        relevance: 'Mandatory to mobilise to most client sites.',
        status: 'unknown',
      },
      {
        name: 'Professional indemnity',
        issuer: '',
        reference: '',
        description: 'Cover for professional advice and system design.',
        relevance: 'Standard requirement for technology and engineering contracts.',
        status: 'unknown',
      },
      {
        name: "Workmen's compensation / Group personal accident",
        issuer: '',
        reference: '',
        description: 'Cover for personnel working on client sites and offshore.',
        relevance: 'Required before any personnel mobilisation.',
        status: 'unknown',
      },
    ],
  },
]

/**
 * OEM and vendor authorisations for the technology supply business.
 * Right now the site says "we supply laptops and servers" with nothing to
 * indicate you are authorised to. A partner tier is a genuine differentiator
 * and buyers do check it.
 */
export interface Partner {
  name: string
  tier: string
  status: CredentialStatus
}

export const partners: Partner[] = [
  { name: 'Dell Technologies', tier: '', status: 'unknown' },
  { name: 'HP', tier: '', status: 'unknown' },
  { name: 'Lenovo', tier: '', status: 'unknown' },
  { name: 'Cisco', tier: '', status: 'unknown' },
  { name: 'Microsoft', tier: '', status: 'unknown' },
  { name: 'Fortinet', tier: '', status: 'unknown' },
]

/** Only credentials that are confirmed held or genuinely in progress render. */
export function publishableCredentials(group: CredentialGroup) {
  return group.items.filter((i) => i.status !== 'unknown')
}

export function hasPublishableCredentials() {
  return credentialGroups.some((g) => publishableCredentials(g).length > 0)
}

export const publishablePartners = () =>
  partners.filter((p) => p.status !== 'unknown')

/**
 * Policy statements. These are written and true regardless of certification
 * status — a company can have a serious HSE posture without ISO 45001, and
 * buyers would rather read an honest statement than see nothing at all.
 */
export const policies = [
  {
    title: 'Health, safety and environment',
    icon: 'lucide:shield-check',
    body: [
      'Our engineers mobilise to terminals, yards, vessels and offshore installations. We work inside the client’s permit-to-work system, attend the client’s site induction, and follow the client’s HSE procedures without exception.',
      'Personnel deployed offshore hold current BOSIET or equivalent certification and valid offshore medicals. We will not mobilise anyone who does not.',
      'We hold stop-work authority as a principle: any Cipher4 engineer may halt an activity they judge unsafe, and will be supported for doing so.',
    ],
  },
  {
    title: 'Information and operational technology security',
    icon: 'lucide:lock',
    body: [
      'We connect to operational networks on a read-only basis by default. Where write access is genuinely required, it is scoped, logged and agreed in writing first.',
      'Integrations are segmented from control systems. We do not place anything in the path of a safety function.',
      'Access is least-privilege and individually attributed. Shared credentials are not used on client systems.',
      'Client operational data belongs to the client. We will state data ownership, retention and deletion terms in the contract, and we will support export at any point.',
    ],
  },
  {
    title: 'Quality and delivery',
    icon: 'lucide:check-circle-2',
    body: [
      'Every deployment has written acceptance criteria agreed before build starts. Acceptance is a test against those criteria, not an opinion.',
      'Systems are handed over with documentation written for the engineer who inherits them, not for the one who built them.',
      'We tell clients when we think a requested approach is wrong, and we put the recommendation in writing.',
    ],
  },
  {
    title: 'Business conduct',
    icon: 'lucide:scale',
    body: [
      'Cipher4 does not offer, pay, solicit or accept bribes, facilitation payments or kickbacks, in any form, in any jurisdiction.',
      'We disclose conflicts of interest in tender processes we participate in.',
      'Our people are instructed to decline gifts or hospitality that could reasonably be seen to influence a commercial decision.',
    ],
  },
]
