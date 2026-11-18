/**
 * Insights index (content H1). The article cards themselves come from
 * content/insights/*.md (@nuxt/content).
 */
export const insightsPage = {
  seo: {
    title: 'Insights | Cipher4 AI & Robotics',
    description: 'Engineering notes on building systems for maritime, oil and gas, logistics and supply chain: field connectivity, auditable procurement and operational intelligence.',
  },
  eyebrow: 'Insights',
  title: 'Notes from the work',
  lead: 'Written by our engineers, about the problems critical operations keep running into. No product announcements and no trend filler.',
  closing: {
    title: 'Working on something similar?',
    lead: 'If one of these matches a problem you have, we are happy to talk it through, without it becoming a sales conversation.',
    cta: { label: 'Start a conversation', to: '/contact' },
  },
}

export const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
