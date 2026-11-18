/**
 * Site-wide copy for the redesign: navigation, footer, offices, contact and
 * the closing band. Every string comes from
 * design-handoff/content/cipher4-website-content-v1.md (Parts B and J).
 * Change the words here, not in the components.
 */
import type { C4IconName } from '~/lib/icons'

export interface NavItem {
  label: string
  to: string
  line?: string
  icon?: C4IconName
}

export interface NavGroup {
  label: string
  /** Opens a panel when it has items; a plain link when it has `to` only. */
  to?: string
  items?: NavItem[]
  /** "All services →" style link at the foot of the panel. */
  all?: NavItem
}

/** Content B2: header navigation. */
export const mainNav: NavGroup[] = [
  {
    label: 'Services',
    items: [
      { label: 'Operational platforms', line: 'One system for the whole operation', to: '/services/operational-platforms', icon: 'operational-platforms' },
      { label: 'AI and automation', line: 'Intelligence built into the work', to: '/services/ai-automation', icon: 'ai-automation' },
      { label: 'IoT and robotics', line: 'Physical assets, connected', to: '/services/iot-robotics', icon: 'iot-robotics' },
      { label: 'Digital platforms', line: 'Built for serious buyers', to: '/services/digital-platforms', icon: 'digital-platforms' },
      { label: 'IT infrastructure', line: 'Set up properly, kept that way', to: '/services/it-infrastructure', icon: 'it-infrastructure' },
      { label: 'Education technology', line: 'Platforms for learning', to: '/services/education-technology', icon: 'education-technology' },
    ],
    all: { label: 'All services', to: '/services' },
  },
  {
    label: 'Sectors',
    items: [
      { label: 'Maritime and ports', to: '/sectors/maritime-and-ports', icon: 'maritime' },
      { label: 'Oil and gas', to: '/sectors/oil-and-gas', icon: 'oil-gas' },
      { label: 'Logistics and transport', to: '/sectors/logistics-and-transport', icon: 'logistics' },
      { label: 'Supply chain and procurement', to: '/sectors/supply-chain-and-procurement', icon: 'supply-chain' },
    ],
  },
  { label: 'Work', to: '/work' },
  {
    label: 'Company',
    items: [
      { label: 'About', to: '/about' },
      { label: 'Technologies', to: '/technologies' },
      { label: 'Credentials', to: '/credentials' },
      { label: 'Insights', to: '/insights' },
      { label: 'Youth and skills', to: '/youth' },
      { label: 'Careers', to: '/careers' },
    ],
  },
]

export const primaryCta: NavItem = { label: 'Talk to us', to: '/contact' }

/** Content B3: footer link columns. */
export const footerColumns: { label: string; items: NavItem[] }[] = [
  {
    label: 'Services',
    items: [
      { label: 'Operational platforms', to: '/services/operational-platforms' },
      { label: 'AI and automation', to: '/services/ai-automation' },
      { label: 'IoT and robotics', to: '/services/iot-robotics' },
      { label: 'Digital platforms', to: '/services/digital-platforms' },
      { label: 'IT infrastructure', to: '/services/it-infrastructure' },
      { label: 'Education technology', to: '/services/education-technology' },
    ],
  },
  {
    label: 'Sectors',
    items: [
      { label: 'Maritime and ports', to: '/sectors/maritime-and-ports' },
      { label: 'Oil and gas', to: '/sectors/oil-and-gas' },
      { label: 'Logistics and transport', to: '/sectors/logistics-and-transport' },
      { label: 'Supply chain and procurement', to: '/sectors/supply-chain-and-procurement' },
    ],
  },
  {
    label: 'Company',
    items: [
      { label: 'About', to: '/about' },
      { label: 'Our work', to: '/work' },
      { label: 'Technologies', to: '/technologies' },
      { label: 'Credentials', to: '/credentials' },
      { label: 'Insights', to: '/insights' },
      { label: 'Youth and skills', to: '/youth' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]

export const legalLinks: NavItem[] = [
  { label: 'Privacy policy', to: '/privacy' },
  { label: 'Terms of use', to: '/terms' },
]

export interface Office {
  city: string
  label: string
  address: string
  /** Display form, as written in the content file. */
  phone: string
}

/** Content B3 and J2. */
export const offices: Office[] = [
  { city: 'Abuja', label: 'Abuja · Head office', address: '13 Parakou Crescent, Wuse 2, FCT', phone: '+234 810 186 7840' },
  { city: 'Lagos', label: 'Lagos', address: '32/34 Calcutta Crescent, Apapa', phone: '+234 901 701 0342' },
  { city: 'Kaduna', label: 'Kaduna', address: '64 Alhalal Plaza, Waff Road', phone: '+234 815 511 4430' },
]

export const contact = {
  email: 'support@cipherfourai.com',
  phone: '+234 810 186 7840',
  hours: 'Monday to Friday, 8:00am to 5:00pm WAT',
  whatsapp: 'https://wa.me/2348101867840',
  /** Shown once the company page exists (plan section 9). */
  linkedin: '' as string,
}

/** `tel:` form of a displayed number. */
export const telHref = (display: string) => `tel:${display.replace(/[^\d+]/g, '')}`

export const company = {
  name: 'Cipher4',
  legalName: 'Cipher4 AI & Robotics Ltd',
  tagline: 'Intelligence for critical operations.',
  /**
   * Content B3. RC number from the owner (DECISIONS.md, 2026-11-18).
   * Footer: "Registered in Nigeria. RC 8980008."
   */
  rcNumber: '8980008' as string,
}

/** Content B4: the closing band at the bottom of most pages. */
export const closingBand = {
  title: 'Tell us what you need to get right.',
  lead: 'Most conversations start with an operational problem, not a technology. Describe yours, and we will tell you plainly how we would approach it.',
  // The third sentence of B4. The board sets it as a mono line under the
  // buttons; the words are unchanged.
  promise: 'We reply to every enquiry within one business day.',
  primary: { label: 'Talk to us', to: '/contact' },
  secondary: { label: 'See our work', to: '/work' },
}
