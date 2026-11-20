/**
 * Organization structured data (plan, Phase 7, step 5).
 *
 * Every fact comes from the content file, through data/site.ts and
 * data/home.ts: the legal name, the home page description, the six
 * services, the three offices and their numbers, the enquiries email and
 * hours, and the RC number. Nothing here that the site itself does not
 * say (content rules: no claims, no positioning beyond the copy).
 */
import { company, offices, contact } from '~/data/site'
import { homeSeo, services } from '~/data/home'

const REGION: Record<string, string> = { Abuja: 'FCT', Lagos: 'Lagos', Kaduna: 'Kaduna' }

export function useSiteSchema() {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl || '').replace(/\/$/, '')

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: company.legalName,
    alternateName: company.name,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/images/cipher4-mark-512.png`,
    slogan: company.tagline,
    description: homeSeo.description,
    email: contact.email,
    telephone: contact.phone,
    foundingDate: '2023',
    ...(company.rcNumber ? { identifier: `RC ${company.rcNumber}` } : {}),
    knowsAbout: services.items.map((s) => s.title),
    address: offices.map((o) => ({
      '@type': 'PostalAddress',
      streetAddress: o.address.replace(/, FCT$/, ''),
      addressLocality: o.city,
      addressRegion: REGION[o.city] ?? o.city,
      addressCountry: 'NG',
    })),
    contactPoint: offices.map((o) => ({
      '@type': 'ContactPoint',
      telephone: o.phone,
      email: contact.email,
      contactType: 'customer service',
      areaServed: 'Worldwide',
      availableLanguage: 'English',
      hoursAvailable: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
    })),
    ...(contact.linkedin ? { sameAs: [contact.linkedin] } : {}),
  }

  useHead({
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(organization) }],
  })
}
