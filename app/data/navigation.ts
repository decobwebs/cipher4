/**
 * Site navigation. Defined once and consumed by both the header and the
 * footer — in the old build these were copy-pasted between index.html and
 * about.html and had already drifted apart (different emails, different
 * targets, and links to an "Academy" page that never existed).
 */

export interface NavItem {
  label: string
  to: string
  description?: string
  children?: NavItem[]
}

export const primaryNav: NavItem[] = [
  {
    label: 'Solutions',
    to: '/solutions',
    children: [
      {
        label: 'Software Platforms',
        to: '/solutions/software-platforms',
        description: 'Fleet, asset and procurement systems built for operations',
      },
      {
        label: 'Field & Offshore Robotics',
        to: '/solutions/robotics',
        description: 'Inspection and monitoring where sending a person is costly',
      },
      {
        label: 'Technology Supply & Deployment',
        to: '/solutions/technology-supply',
        description: 'Hardware, software and commissioning, delivered working',
      },
    ],
  },
  {
    label: 'Industries',
    to: '/industries',
    children: [
      { label: 'Transport', to: '/industries/transport' },
      { label: 'Logistics', to: '/industries/logistics' },
      { label: 'Oil & Gas', to: '/industries/oil-and-gas' },
      { label: 'Supply Chain', to: '/industries/supply-chain' },
    ],
  },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'Insights', to: '/insights' },
]

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Solutions',
    items: [
      { label: 'Software Platforms', to: '/solutions/software-platforms' },
      { label: 'Field & Offshore Robotics', to: '/solutions/robotics' },
      { label: 'Technology Supply', to: '/solutions/technology-supply' },
      { label: 'All Solutions', to: '/solutions' },
    ],
  },
  {
    title: 'Industries',
    items: [
      { label: 'Transport', to: '/industries/transport' },
      { label: 'Logistics', to: '/industries/logistics' },
      { label: 'Oil & Gas', to: '/industries/oil-and-gas' },
      { label: 'Supply Chain', to: '/industries/supply-chain' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About', to: '/about' },
      { label: 'Credentials & Compliance', to: '/credentials' },
      { label: 'Projects', to: '/projects' },
      { label: 'Insights', to: '/insights' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Use', to: '/terms' },
    ],
  },
]
