import { company, formatAddress } from '~/data/company'

/**
 * Organization + LocalBusiness structured data.
 *
 * The old site had no structured data at all, which meant search engines had
 * to infer the company name, the sectors served and the three office
 * locations from prose. This states them.
 */
export function useSiteSchema() {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl || '').replace(/\/$/, '')

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: company.legalName,
    alternateName: company.shortName,
    url: siteUrl,
    // The full-resolution mark, NOT the header asset. `cipher4-logo.png` is
    // resized to 96px because the header renders it at 28px and the footer at
    // 40px — it was shipping at 1024x1024 and 1.3MB, on every page, which was
    // the single heaviest asset on the site. Structured data wants a proper
    // logo (Google asks for at least 112px), so it reads the full copy.
    logo: `${siteUrl}/images/cipher4-logo-full.png`,
    description: company.description,
    email: company.email,
    foundingDate: String(company.founded),
    ...(company.rcNumber ? { identifier: `RC ${company.rcNumber}` } : {}),
    address: company.offices.map((office) => ({
      '@type': 'PostalAddress',
      streetAddress: `${office.street}, ${office.area}`,
      addressLocality: office.city,
      addressRegion: office.state,
      addressCountry: 'NG',
    })),
    contactPoint: company.offices.map((office) => ({
      '@type': 'ContactPoint',
      telephone: office.phone,
      contactType: 'sales',
      areaServed: 'NG',
      availableLanguage: 'English',
    })),
    sameAs: Object.values(company.social).filter(Boolean),
    knowsAbout: [
      'Fleet management systems',
      'Asset tracking',
      'Offshore inspection robotics',
      'Digital procurement',
      'Industrial automation',
      'Maritime logistics technology',
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria',
    },
  }

  const localBusinesses = company.offices.map((office, i) => ({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}/#office-${office.city.toLowerCase()}`,
    name: `${company.legalName} — ${office.city}`,
    parentOrganization: { '@id': `${siteUrl}/#organization` },
    url: siteUrl,
    telephone: office.phone,
    email: company.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${office.street}, ${office.area}`,
      addressLocality: office.city,
      addressRegion: office.state,
      addressCountry: 'NG',
    },
    openingHours: 'Mo-Fr 08:00-17:00',
    ...(i === 0 ? { description: company.description } : {}),
  }))

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(organization),
      },
      ...localBusinesses.map((biz) => ({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(biz),
      })),
    ],
  })
}
