/**
 * SINGLE SOURCE OF TRUTH for company identity and contact details.
 *
 * The previous site stated contact information in four separate places and
 * two of them were wrong — a placeholder email (info@cipher4.ai) and a
 * placeholder address ("123 Tech Avenue, Innovation City, 10101") were live
 * in the footer beside the real Nigerian offices.
 *
 * Nothing in this codebase may hard-code an address, phone number or email.
 * Import from here.
 *
 * ⚠️ ITEMS MARKED `TODO(cipher4)` NEED YOUR CONFIRMATION BEFORE LAUNCH.
 */

export interface Office {
  city: string
  label: string
  street: string
  area: string
  state: string
  country: string
  phone: string
  isHeadquarters?: boolean
  /**
   * Real coordinates for the office's area. Public geographic fact, not a
   * claim about client sites.
   *
   * Optional: these were added for the operations globe, which has since been
   * removed. Nothing reads them today. They are kept because they are correct
   * and a map may want them again, but they must not be a required field for
   * adding an office.
   */
  lat?: number
  lng?: number
}

export const company = {
  legalName: 'Cipher4 AI & Robotics Ltd',
  shortName: 'Cipher4',
  tagline: 'Intelligence for critical operations',

  // TODO(cipher4): your CAC registration number. Nigerian buyers look for
  // this before they read anything else — it belongs in the footer.
  rcNumber: '' as string,

  description:
    'Cipher4 AI & Robotics Ltd builds software platforms and robotic systems for transport, logistics, oil and gas, and supply chain operations across Nigeria and West Africa.',

  founded: 2023,

  email: 'support@cipherfourai.com',
  // TODO(cipher4): confirm — used for the WhatsApp click-to-chat button.
  // Format: international, digits only, no + or spaces.
  whatsapp: '2348101867840',

  offices: [
    {
      city: 'Abuja',
      label: 'Head Office',
      street: '13 Parakou Crescent',
      area: 'Wuse 2',
      state: 'FCT',
      country: 'Nigeria',
      phone: '+234 810 186 7840',
      isHeadquarters: true,
      lat: 9.0765,
      lng: 7.4891,
    },
    {
      city: 'Lagos',
      label: 'Lagos Office',
      street: '32/34 Calcutta Crescent',
      area: 'Apapa',
      state: 'Lagos',
      country: 'Nigeria',
      phone: '+234 901 701 0342',
      lat: 6.4478,
      lng: 3.3619,
    },
    {
      city: 'Kaduna',
      label: 'Kaduna Office',
      street: '64 Alhalal Plaza, Waff Road',
      area: 'Kaduna',
      state: 'Kaduna',
      country: 'Nigeria',
      phone: '+234 815 511 4430',
      lat: 10.5222,
      lng: 7.4383,
    },
  ] satisfies Office[],

  hours: 'Monday to Friday, 8:00am – 5:00pm WAT',
  responseTime: 'We reply to enquiries within one business day.',

  // TODO(cipher4): replace with real profile URLs. Every social link on the
  // old site pointed at "#", which is worse than having no icons at all.
  social: {
    linkedin: '',
    x: '',
    youtube: '',
  },
} as const

/** Formats an office as a single-line address string. */
export function formatAddress(office: Office): string {
  return `${office.street}, ${office.area}, ${office.state}, ${office.country}`
}

/** Strips a display phone number down to a tel: href. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export const headquarters = company.offices.find((o) => o.isHeadquarters)!
