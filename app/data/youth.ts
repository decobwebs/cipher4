/**
 * Youth and skills, Launchpad and Scholarships (content Part I). Every
 * string is from design-handoff/content/cipher4-website-content-v1.md.
 *
 * A community commitment, not a service and never an "academy": no
 * accreditation, certificates, admissions or guaranteed outcomes.
 */
import type { C4IconName } from '~/lib/icons'

export const youthPage = {
  seo: {
    title: 'Youth and skills | Cipher4 AI & Robotics',
    description: "Cipher4's commitment to young people: mentoring, practical technology skills and support for young founders with ideas worth building.",
  },
  eyebrow: 'Community',
  title: 'Opening technology to the next generation',
  lead: 'Technology will shape the next generation of work. We believe young people should be building it, not only using it. Through mentoring, practical skills sessions and support for promising ideas, we help young people gain the skills and confidence to take part.',
  focus: {
    title: 'Where we focus',
    items: [
      { title: 'Software development', text: 'Building for the web, from interfaces to backend systems.' },
      { title: 'Artificial intelligence', text: 'Understanding how AI works and using it responsibly to solve real problems.' },
      { title: 'Design', text: 'Creating products that are clear, useful and good to use.' },
      { title: 'Data', text: 'Turning information into insight that supports better decisions.' },
      { title: 'Cloud and security', text: 'How modern systems run, and how to keep them safe.' },
      { title: 'Digital skills for work', text: 'Confident use of the tools every modern workplace depends on.' },
    ],
  },
  help: {
    title: 'How we help',
    items: [
      { title: 'Mentoring', text: 'Guidance from working engineers and designers on skills, projects and careers.', icon: 'one-partner' },
      { title: 'Practical learning', text: 'Hands-on sessions built around real problems rather than theory alone.', icon: 'education-technology' },
      { title: 'Exposure to real work', text: 'Selected young people gain experience alongside our team on genuine projects.', icon: 'job-control' },
    ] satisfies { title: string; text: string; icon: C4IconName }[],
  },
  ways: {
    title: 'Two ways in',
    items: [
      { title: 'Launchpad', text: 'Have an idea worth building? Bring it to us.', to: '/youth/launchpad' },
      { title: 'Scholarships', text: 'Coming soon. Register your interest.', to: '/youth/scholarships' },
    ],
  },
}

export const launchpadPage = {
  seo: {
    title: 'Launchpad | Cipher4 AI & Robotics',
    description: 'Young founders with an idea that solves a real problem can submit it to Cipher4. Selected ideas receive support to move from concept to launch.',
  },
  eyebrow: 'Youth and skills',
  title: 'Have an idea worth building?',
  lead: 'If you are young and have an idea that solves a real problem, we want to hear it. Selected ideas receive Cipher4\'s support to move from concept to launch.',
  steps: {
    title: 'How it works',
    items: [
      { title: 'Submit your idea.', text: 'Tell us the problem, who it affects and how your idea solves it.' },
      { title: 'Review.', text: 'Our team assesses every submission and meets the most promising founders.' },
      { title: 'Agree the path.', text: 'Together we define what your idea needs to go live and how we will work together.' },
      { title: 'Build and launch.', text: 'We support you through design, development and launch.' },
    ],
  },
  lookFor: {
    title: 'What we look for',
    items: ['A real problem, affecting real people', 'A clear idea of who would use it', 'The commitment to see it through'],
  },
  form: {
    title: 'Submit your idea',
    fields: {
      name: 'Full name',
      email: 'Email',
      phone: 'Phone',
      age: 'Age range',
      location: 'Where you are based',
      problem: 'The problem you want to solve',
      idea: 'Your idea, and how it solves the problem',
      users: 'Who would use it',
      progress: 'What you have done so far',
      own: 'I confirm this idea is my own, or that I have permission to share it.',
      guardian: 'A parent or guardian has agreed to my submission and can be contacted.',
    },
    ageOptions: ['Under 18', '18 to 24', '25 to 30', 'Over 30'],
    /** The value of the age option that shows the guardian checkbox. */
    under18: 'Under 18',
    progressHint: 'sketch, prototype, research, nothing yet',
    submit: 'Submit your idea',
    smallPrint: {
      text: 'Support and terms are agreed individually for each project. Submitting an idea does not transfer any ownership of it to Cipher4. Please do not include anything you are not ready to share. See our ',
      privacy: { label: 'privacy policy', to: '/privacy' },
      and: ' and ',
      terms: { label: 'terms', to: '/terms' },
      end: '.',
    },
  },
}

export const scholarshipsPage = {
  seo: {
    title: 'Scholarships | Cipher4 AI & Robotics',
    description: 'Cipher4 is preparing technology scholarships for talented young people. Register your interest to hear first when applications open.',
  },
  eyebrow: 'Youth and skills',
  title: 'Scholarships',
  lead: 'We are preparing scholarships to support talented young people in technology who need help to take the next step.',
  /**
   * The status block. When scholarships open, this one block is replaced by
   * four sections (who can apply, what is covered, how to apply, key dates)
   * and nothing else on the page changes (I3 note).
   */
  status: {
    state: 'coming-soon' as 'coming-soon' | 'open',
    title: 'Coming soon.',
    text: 'Register your interest and we will let you know as soon as applications open.',
    fields: { email: 'Email', area: 'Area of interest' },
    areaOptions: ['Software development', 'Artificial intelligence', 'Design', 'Data', 'Cloud and security', 'Not sure yet'],
    submit: 'Register interest',
  },
}

/** Form messages: the J2 wording, which is the site's only form wording. */
export const youthMessages = {
  sending: 'Sending…',
  successTitle: 'Thank you. Your message has reached us.',
  errorTitle: "Your message didn't send.",
  errorText: 'Please try again, or email us directly at support@cipherfourai.com.',
}
