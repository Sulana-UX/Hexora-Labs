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

  /** Optional public URL once a domain is chosen (set VITE_SITE_URL). */
  url: import.meta.env.VITE_SITE_URL || '',

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

/** Section metadata used for per-URL document titles. */
export const sectionMeta = {
  home: { title: 'Hexora Labs – Software Solutions | Web, Mobile & AI Development' },
  services: { title: 'Services | Hexora Labs – Software Solutions' },
  work: { title: 'Our Work | Hexora Labs – Software Solutions' },
  'student-hub': { title: 'Student Hub – University Project Guidance | Hexora Labs' },
  process: { title: 'How We Work | Hexora Labs – Software Solutions' },
  about: { title: 'About | Hexora Labs – Software Solutions' },
  contact: { title: 'Contact | Hexora Labs – Software Solutions' },
}
