/**
 * Careers, privacy, terms and the 404 page (content J1, J3, J4, J5). Every
 * string is from design-handoff/content/cipher4-website-content-v1.md.
 *
 * Legal text is written as blocks: a heading, then paragraphs and lists.
 * In a list item, *text*: marks the italic lead-in (J3 "What we collect").
 */

export const careersPage = {
  seo: {
    title: 'Careers | Cipher4 AI & Robotics',
    description: 'Work on systems that critical operations depend on. Engineering, AI, design and infrastructure roles at Cipher4 AI & Robotics.',
  },
  eyebrow: 'Careers',
  title: 'Build what critical operations run on',
  lead: 'We are a focused team building systems that have to work under real pressure: in ports, on the road and in the field. If you care about getting the details right, we should talk.',
  lookFor: {
    title: 'What we look for',
    items: [
      'People who want to see their work running in the real world, not just in a repository',
      "The confidence to say a plan won't work, and the ability to explain why",
      'Care for the person who inherits your work after you',
      'Curiosity about the industries we serve',
    ],
  },
  get: {
    title: 'What you get',
    items: [
      'Work that is used by real operations, not a slide deck',
      'A small, senior team, so your work is visible and your voice counts',
      'Exposure to AI, platforms, infrastructure and design across several industries',
      'Offices in Abuja, Lagos and Kaduna',
    ],
  },
  roles: {
    title: 'Open roles',
    none: 'No advertised vacancies right now.',
    noneText: 'We hire when we meet the right person, not only when a role opens. If your work fits what we do, write to us.',
    open: {
      title: 'Open application',
      text: 'Send your CV and a short note about something you built and what made it difficult. We read every application.',
      cta: { label: 'Apply by email', href: 'mailto:support@cipherfourai.com?subject=Open%20application' },
    },
  },
  project: {
    text: 'Not looking for a job, but have a project?',
    link: { label: 'Talk to us', to: '/contact' },
  },
}

export type LegalBlock =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }

export interface LegalSection {
  title: string
  blocks: LegalBlock[]
}

export interface LegalPage {
  seo: { title: string; description: string }
  title: string
  /**
   * "Last updated: [publication date]". The date is set at launch; until
   * then the line is not shown.
   */
  lastUpdated: string
  sections: LegalSection[]
}

const p = (text: string): LegalBlock => ({ kind: 'p', text })
const ul = (...items: string[]): LegalBlock => ({ kind: 'ul', items })

export const LAST_UPDATED_LABEL = 'Last updated:'

export const privacyPage: LegalPage = {
  seo: {
    title: 'Privacy policy | Cipher4 AI & Robotics',
    description: 'How Cipher4 AI & Robotics Ltd collects, uses and protects personal data, in line with the Nigeria Data Protection Act 2023.',
  },
  title: 'Privacy policy',
  lastUpdated: '',
  sections: [
    {
      title: 'Who we are',
      blocks: [p('Cipher4 AI & Robotics Ltd ("Cipher4", "we") is a company registered in Nigeria, with its head office at 13 Parakou Crescent, Wuse 2, Abuja, FCT. We are the data controller for the personal data described in this policy. For any question about this policy or your data, contact support@cipherfourai.com.')],
    },
    {
      title: 'What we collect',
      blocks: [
        p('We collect only what we need to respond to you and to run our business.'),
        ul(
          '*Enquiries and quotes:* your name, work email, organisation, phone number if you give it, and your message.',
          '*Launchpad submissions:* your name, contact details, age range, location and the details of your idea.',
          '*Scholarship interest:* your email address and area of interest.',
          '*Job applications:* your CV and anything else you choose to send.',
          '*Correspondence:* emails, call notes and meeting records created while we discuss or deliver work.',
          '*Website use:* basic technical information such as pages visited, device type and approximate location, collected through privacy-respecting analytics. We do not use advertising or tracking cookies.',
        ),
      ],
    },
    {
      title: 'Why we use it',
      blocks: [
        ul(
          'To reply to your enquiry and prepare a proposal or quotation',
          'To review Launchpad submissions and contact selected founders',
          'To tell you when scholarship applications open',
          'To consider job applications',
          'To deliver and support work you have engaged us for',
          'To meet legal, tax and regulatory obligations',
        ),
        p('We do not sell personal data, and we do not share it with anyone for their own marketing.'),
      ],
    },
    {
      title: 'Our lawful basis',
      blocks: [p('We process your data with your consent when you contact us or submit a form, under contract when we deliver work for you, and to meet legal obligations where the law requires us to keep records. You can withdraw consent at any time.')],
    },
    {
      title: 'Young people',
      blocks: [p('Launchpad and scholarships are open to young people. If you are under 18, we need a parent or guardian to agree to your submission, and we may contact them before taking it further.')],
    },
    {
      title: 'Who processes data for us',
      blocks: [p('Form submissions reach us through a third-party form service, and our email, hosting and business tools are provided by established service providers. They act only on our instructions. Some of them process data outside Nigeria, and where they do, we rely on the safeguards the Nigeria Data Protection Act 2023 requires.')],
    },
    {
      title: 'How long we keep it',
      blocks: [
        ul(
          "Enquiries that don't lead to work: up to 24 months",
          'Launchpad submissions not taken forward: up to 12 months',
          'Scholarship interest: until applications open and close, or until you ask us to remove you',
          'Job applications: up to 12 months, unless you ask us to keep them longer',
          'Client records: for the length of the engagement and as long afterwards as Nigerian tax and company law requires',
        ),
      ],
    },
    {
      title: 'Your rights',
      blocks: [p('Under the Nigeria Data Protection Act 2023 you may ask us for a copy of your personal data, and ask us to correct it, delete it, restrict how we use it or stop using it. Write to support@cipherfourai.com and we will respond within one month. If you are not satisfied with our response, you may complain to the Nigeria Data Protection Commission.')],
    },
    {
      title: 'Client operational data',
      blocks: [p('This policy covers personal data. Operational data in systems we build for clients belongs to the client, is governed by the contract for that work, and is never used by Cipher4 for any other purpose.')],
    },
    {
      title: 'Security',
      blocks: [p('We protect personal data with access controls, encryption in transit and individually attributed, least-privilege access.')],
    },
    {
      title: 'Changes',
      blocks: [p('When we change this policy, we update the date at the top of this page. We tell existing clients directly about any material change.')],
    },
  ],
}

export const termsPage: LegalPage = {
  seo: {
    title: 'Terms of use | Cipher4 AI & Robotics',
    description: 'The terms governing use of the Cipher4 AI & Robotics Ltd website.',
  },
  title: 'Terms of use',
  lastUpdated: '',
  sections: [
    {
      title: 'About these terms',
      blocks: [p('This website is operated by Cipher4 AI & Robotics Ltd, a company registered in Nigeria. By using the site, you accept these terms. They cover the website only. Any work we do for you is governed by the contract for that work.')],
    },
    {
      title: 'What is on this site',
      blocks: [p('The content describes our capabilities in general terms. It is not a technical specification, a warranty or an offer to contract, and it should not be relied on as advice for a specific situation. We keep the site accurate and current, but we may change content without notice.')],
    },
    {
      title: 'Ownership',
      blocks: [p('The Cipher4 name, logo, designs, text and images on this site belong to Cipher4 AI & Robotics Ltd or are used with permission. You may read, print and share pages for your own evaluation. You may not republish, resell or present our content as your own, or use our branding without written permission.')],
    },
    {
      title: 'Client and third-party names',
      blocks: [p('Client names and logos appear with permission. Product, vendor and organisation names mentioned on this site belong to their owners, and mentioning them does not imply a partnership or endorsement unless we say so explicitly.')],
    },
    {
      title: 'Launchpad submissions',
      blocks: [p('Submitting an idea through Launchpad does not transfer any ownership of it to Cipher4. Because we work on many projects and receive many ideas, we may already be developing, or may later develop, something similar. A submission does not create any obligation between you and us until terms are agreed in writing.')],
    },
    {
      title: 'Links',
      blocks: [p('Where we link to other websites, we do not control them and are not responsible for their content or how they handle your data.')],
    },
    {
      title: 'Limits of liability',
      blocks: [p('We provide this website as it is. As far as Nigerian law allows, we are not liable for loss arising from reliance on its content, from the site being unavailable, or for any indirect or consequential loss. Nothing in these terms limits liability that cannot lawfully be limited.')],
    },
    {
      title: 'Sensitive information',
      blocks: [p("Please don't send confidential or commercially sensitive material through the website forms. If you need to share something sensitive, email support@cipherfourai.com and we will agree a secure way to receive it.")],
    },
    {
      title: 'Governing law',
      blocks: [p('These terms are governed by the laws of the Federal Republic of Nigeria, and disputes are subject to the jurisdiction of the Nigerian courts.')],
    },
    {
      title: 'Contact',
      blocks: [p('Questions about these terms: support@cipherfourai.com.')],
    },
  ],
}

export const notFoundPage = {
  title: 'Page not found | Cipher4 AI & Robotics',
  eyebrow: '404',
  heading: 'This page is not here',
  lead: 'The link may be out of date, or the page may have moved when we rebuilt the site. These will take you where you need to go.',
  primary: { label: 'Back to home', to: '/' },
  secondary: { label: 'Talk to us', to: '/contact' },
  links: [
    { label: 'Services', to: '/services' },
    { label: 'Sectors', to: '/sectors' },
    { label: 'Our work', to: '/work' },
    { label: 'About', to: '/about' },
  ],
}
