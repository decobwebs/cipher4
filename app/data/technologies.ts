/**
 * Technologies page (content F5). Every string is from
 * design-handoff/content/cipher4-website-content-v1.md.
 *
 * Owner decision (docs/redesign/DECISIONS.md): technology names, not
 * company logos. This replaces the F5 note about official logos.
 */
export const technologiesPage = {
  seo: {
    title: 'Technologies | Cipher4 AI & Robotics',
    description: 'The platforms, languages and tools Cipher4 works with across software, cloud, data, artificial intelligence, security and workplace technology.',
  },
  eyebrow: 'Technologies',
  title: 'The technology we work with',
  lead: "We work with the platforms, languages and tools that power the world's most demanding systems, and choose for each project what will serve it best for years, not months.",
  closing: 'The tools change. Our standards do not.',
  groups: [
    { title: 'Frontend and mobile', items: ['React', 'Next.js', 'Vue', 'Nuxt', 'Angular', 'TypeScript', 'Tailwind CSS', 'Flutter', 'React Native'] },
    { title: 'Backend and APIs', items: ['Python', 'FastAPI', 'Django', 'Node.js', 'Go', 'Java', 'GraphQL', 'REST'] },
    { title: 'Cloud and infrastructure', items: ['Amazon Web Services', 'Microsoft Azure', 'Google Cloud', 'Vercel', 'Cloudflare', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions'] },
    { title: 'Data', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Supabase', 'Elasticsearch', 'Apache Kafka'] },
    { title: 'Artificial intelligence', items: ['OpenAI', 'Anthropic Claude', 'Google Gemini', 'Hugging Face', 'PyTorch', 'TensorFlow', 'LangChain', 'Vector databases'] },
    { title: 'Security', items: ['Cloudflare Zero Trust', 'AWS IAM', 'Okta', 'HashiCorp Vault', 'Snyk', 'OWASP ZAP', 'Fortinet', 'Sentry'] },
    { title: 'Communications and payments', items: ['Twilio', "Africa's Talking", 'WhatsApp Business', 'Resend', 'Stripe', 'Paystack'] },
    { title: 'Workplace and hardware', items: ['Microsoft 365', 'Google Workspace', 'Windows', 'Dell', 'HP', 'Lenovo', 'Cisco'] },
    { title: 'Motion and experience', items: ['GSAP', 'Three.js', 'Framer Motion', 'Remotion'] },
  ],
}
