/**
 * Contact page and form copy (content J2). Every string is from
 * design-handoff/content/cipher4-website-content-v1.md.
 */
export const contactPage = {
  seo: {
    title: 'Contact | Cipher4 AI & Robotics',
    description: 'Talk to Cipher4 about a platform, AI, connected systems, a website or IT infrastructure. Offices in Abuja, Lagos and Kaduna.',
  },
  eyebrow: 'Contact',
  title: 'Start with the problem',
  lead: 'Tell us what you need to get right. If we are not the right people for it, we will say so.',
}

export const sectorOptions = ['Maritime and ports', 'Oil and gas', 'Logistics and transport', 'Supply chain and procurement', 'Other']
export const serviceOptions = ['Operational platforms', 'AI and automation', 'IoT and robotics', 'Digital platforms and websites', 'IT infrastructure and support', 'Education technology', 'Not sure yet']
export const timelineOptions = ['Immediate', 'Within 3 months', '3 to 6 months', 'Planning or budgeting']
export const tenderOptions = ['Yes, formal tender', 'Yes, RFQ or RFP', 'No, direct engagement', 'Not yet decided']

export type FormType = 'general' | 'quote'

export const forms: Record<FormType, { tab: string; intro: string; message: { label: string; placeholder?: string }; submit: string }> = {
  general: {
    tab: 'General enquiry',
    intro: 'For a conversation about a problem, a possible project, or whether an idea is worth pursuing.',
    message: {
      label: 'What do you need to get right?',
      placeholder: 'Describe the problem rather than the technology you think you need. It usually leads to a better answer, faster.',
    },
    submit: 'Send enquiry',
  },
  quote: {
    tab: 'Request a quote',
    intro: 'For a defined scope, a request for quotation or a formal tender. Tell us the format and deadline, and we will work to them.',
    message: { label: 'What needs to be supplied, built or set up, where, and by when?' },
    submit: 'Request a quote',
  },
}

export const fieldLabels = {
  name: 'Full name',
  email: 'Work email',
  organisation: 'Organisation',
  phone: 'Phone',
  sector: 'Sector',
  service: 'Service of interest',
  serviceQuote: 'Service',
  timeline: 'Timeline',
  tender: 'Is this part of a formal tender?',
}

export const privacyLine = { before: 'We use what you send only to reply to you. See our ', link: 'privacy policy', to: '/privacy', after: '.' }

export const messages = {
  sending: 'Sending…',
  successTitle: 'Thank you. Your message has reached us.',
  successText: 'We reply to every enquiry within one business day.',
  errorTitle: "Your message didn't send.",
  errorText: 'Please try again, or email us directly at support@cipherfourai.com.',
}

export const reach = {
  title: 'Reach us directly',
  items: [
    { kind: 'WhatsApp', text: 'Chat with the team', href: 'https://wa.me/2348101867840', icon: 'whatsapp', external: true },
    { kind: 'Email', text: 'support@cipherfourai.com', href: 'mailto:support@cipherfourai.com', icon: 'mail', external: false },
    { kind: 'Phone', text: '+234 810 186 7840', href: 'tel:+2348101867840', icon: 'phone', external: false },
  ],
  hours: 'Monday to Friday, 8:00am to 5:00pm WAT',
}

export const officesBlock = {
  title: 'Offices',
  note: 'Visits are by appointment.',
  items: [
    { label: 'Abuja · Head office', address: '13 Parakou Crescent, Wuse 2, FCT', phone: '+234 810 186 7840', head: true },
    { label: 'Lagos', address: '32/34 Calcutta Crescent, Apapa, Lagos', phone: '+234 901 701 0342', head: false },
    { label: 'Kaduna', address: '64 Alhalal Plaza, Waff Road, Kaduna', phone: '+234 815 511 4430', head: false },
  ],
}
