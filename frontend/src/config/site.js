/**
 * Central brand & contact configuration.
 * Update values here — components read from this file only.
 */
export const site = {
  name: 'Hexora Labs',
  fullName: 'Hexora Labs – Software Solutions',
  tagline: 'Your Vision. Engineered into Reality.',
  description:
    'Hexora Labs designs and develops modern websites, applications and data solutions for university students, startups, individuals and small businesses.',
  email: 'hexoralabs@gmail.com',

  /** Public site URL (VITE_SITE_URL; default set in vite.config.js). Used for canonical/OG URLs. */
  url: (import.meta.env.VITE_SITE_URL || '').replace(/\/+$/, ''),

  /**
   * Optional contact channels. Leave as null until real details exist —
   * nothing is rendered for null values.
   */
  phone: { display: '072 357 7663', href: 'tel:+94723577663' },
  whatsapp: {
    display: '072 357 7663',
    href: `https://wa.me/94723577663?text=${encodeURIComponent("Hi Hexora Labs, I'd like to discuss a project.")}`,
  },

  /**
   * Social profiles. Only entries with a non-empty `url` are displayed.
   */
  socials: [
    { label: 'LinkedIn', url: '' },
    { label: 'GitHub', url: '' },
    { label: 'Facebook', url: '' },
    { label: 'Instagram', url: '' },
  ],
}

/** Primary navigation. `path` doubles as a clean, shareable URL for each section. */
export const navigation = [
  { label: 'Home', path: '/', section: 'home' },
  { label: 'Services', path: '/services', section: 'services' },
  { label: 'Our Work', path: '/work', section: 'work' },
  { label: 'Student Hub', path: '/student-hub', section: 'student-hub' },
  { label: 'About', path: '/about', section: 'about' },
  { label: 'Contact', path: '/contact', section: 'contact' },
]

/**
 * Section metadata used for per-URL titles and descriptions.
 * Section URLs (/services, /work, ...) show the one-page home, so their canonical URL is '/'.
 */
export const sectionMeta = {
  home: {
    title: 'Hexora Labs – Software Solutions | Web, Mobile & AI Development',
    description:
      'Hexora Labs designs and develops websites, web and mobile apps, desktop software, APIs, databases and AI/data solutions for students, startups and small businesses — with affordable university project mentoring.',
  },
  services: {
    title: 'Services | Hexora Labs – Software Solutions',
    description:
      'Website development, web applications, mobile apps, desktop software, APIs and backends, databases, AI/ML and data analytics, and testing — built with modern technologies.',
  },
  work: {
    title: 'Our Work | Hexora Labs – Software Solutions',
    description: 'Projects built by Hexora Labs, with screenshots, highlights and the technologies used.',
  },
  'student-hub': {
    title: 'Student Hub – University Project Guidance | Hexora Labs',
    description:
      'Affordable university project mentoring: planning, coding and debugging help, prototypes, testing, documentation and presentation preparation.',
  },
  process: {
    title: 'How We Work | Hexora Labs – Software Solutions',
    description: 'Our four-step process — Discover, Design, Develop, Deliver — keeps every project clear from idea to launch.',
  },
  about: {
    title: 'About | Hexora Labs – Software Solutions',
    description:
      'Why choose Hexora Labs: transparent pricing, personalised solutions, modern technologies, clear communication and ongoing support.',
  },
  contact: {
    title: 'Contact | Hexora Labs – Software Solutions',
    description: 'Tell us about your project. Send an inquiry, email hexoralabs@gmail.com or message us on WhatsApp.',
  },
}
