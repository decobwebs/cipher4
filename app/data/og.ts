/**
 * Share images (Open Graph), 1200 x 630 (owner, 20 Nov 2026): white, the
 * blueprint grid, the Cipher4 logo and the page title. One image for Home
 * and one per page of each type the owner named (services, sectors, case
 * studies, contact, youth); every other page uses the default.
 *
 * The images are made from this list by scripts/make-og-images.mjs, which
 * draws each one through the internal /_og page. Words come from the
 * pages' own data, so a title change is one script run away.
 */
import { services } from '~/data/services'
import { sectors } from '~/data/sectors'
import { cases } from '~/data/work'
import { contactPage } from '~/data/contact'
import { youthPage, launchpadPage, scholarshipsPage } from '~/data/youth'
import { hero } from '~/data/home'
import type { C4IconName } from '~/lib/icons'

export interface ShareCard {
  /** File name in public/og (without .png). */
  file: string
  /** Page address it belongs to. */
  path: string
  /** Small mono label over the title: the page type. */
  kind: string
  title: string
  icon: C4IconName
}

export const shareCards: ShareCard[] = [
  { file: 'home', path: '/', kind: 'Cipher4 AI & Robotics', title: `${hero.titleLead} ${hero.titleAccent}`, icon: 'operational-platforms' },
  ...services.map((s) => ({ file: `service-${s.slug}`, path: `/services/${s.slug}`, kind: 'Services', title: s.title, icon: s.icon })),
  ...sectors.map((s) => ({ file: `sector-${s.slug}`, path: `/sectors/${s.slug}`, kind: 'Sectors', title: s.title, icon: s.icon })),
  ...cases.map((c) => ({
    file: `case-${c.slug}`,
    path: c.path,
    kind: c.kind === 'product' ? 'A Cipher4 product' : 'Case study',
    title: c.title,
    icon: (c.slug === 'reliant-anchor' ? 'job-control' : c.slug === 'harbours360' ? 'digital-platforms' : 'ai-automation') as C4IconName,
  })),
  { file: 'contact', path: '/contact', kind: 'Contact', title: contactPage.title, icon: 'mail' },
  { file: 'youth', path: '/youth', kind: 'Youth and skills', title: youthPage.title, icon: 'education-technology' },
  { file: 'youth-launchpad', path: '/youth/launchpad', kind: 'Youth and skills', title: launchpadPage.title, icon: 'pilot' },
  { file: 'youth-scholarships', path: '/youth/scholarships', kind: 'Youth and skills', title: scholarshipsPage.title, icon: 'training' },
]

/** Every other page: the default card (J6: the logo and the tagline). */
export const defaultCard: ShareCard = {
  file: 'default', path: '', kind: 'Cipher4 AI & Robotics', title: 'Intelligence for critical operations.', icon: 'operational-platforms',
}

export function ogImageFor(path: string): { src: string; alt: string } {
  const clean = path === '/' ? '/' : path.replace(/\/$/, '')
  const card = shareCards.find((c) => c.path === clean) ?? defaultCard
  return { src: `/og/${card.file}.png`, alt: `Cipher4 AI & Robotics: ${card.title}` }
}
