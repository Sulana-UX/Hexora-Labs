/**
 * Portfolio entries.
 *
 * IMPORTANT: everything below is a CONCEPT / DEMONSTRATION project created to
 * illustrate Hexora Labs' approach — not completed client work. Keep `concept: true`
 * until replaced with real, verifiable projects. To add a real project, add an
 * entry with `concept: false`, and either a `preview` key (see
 * src/components/illustrations/ProjectPreviews.jsx) or an `image` imported from
 * src/assets/portfolio/.
 */
export const portfolioCategories = [
  { id: 'all', label: 'All' },
  { id: 'website', label: 'Websites' },
  { id: 'webapp', label: 'Web Applications' },
  { id: 'mobile', label: 'Mobile Applications' },
  { id: 'desktop', label: 'Desktop Software' },
  { id: 'ai', label: 'AI & Data Solutions' },
]

export const projects = [
  {
    id: 'campus-connect',
    title: 'Campus Connect',
    category: 'webapp',
    concept: true,
    description:
      'A portal concept for university clubs to publish events, manage registrations and share announcements in one place.',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    preview: 'campus',
  },
  {
    id: 'brew-bloom',
    title: 'Brew & Bloom',
    category: 'website',
    concept: true,
    description:
      'A marketing website concept for a neighbourhood café — seasonal menu, opening hours and table-reservation requests.',
    tags: ['React', 'Tailwind CSS', 'SEO'],
    preview: 'cafe',
  },
  {
    id: 'pocket-ledger',
    title: 'PocketLedger',
    category: 'mobile',
    concept: true,
    description:
      'A personal finance app concept with budgets, spending categories and clear monthly insights.',
    tags: ['Flutter', 'SQLite'],
    preview: 'finance',
  },
  {
    id: 'stockroom',
    title: 'StockRoom',
    category: 'desktop',
    concept: true,
    description:
      'An offline-first inventory and billing tool concept for small retail shops, with low-stock alerts and receipts.',
    tags: ['Electron', 'React', 'SQLite'],
    preview: 'inventory',
  },
  {
    id: 'insight-lens',
    title: 'InsightLens',
    category: 'ai',
    concept: true,
    description:
      'A sales-forecasting dashboard concept that pairs historical data with a machine-learning model and readable charts.',
    tags: ['Python', 'scikit-learn', 'FastAPI'],
    preview: 'forecast',
  },
  {
    id: 'mediqueue',
    title: 'MediQueue',
    category: 'webapp',
    concept: true,
    description:
      'An appointment-booking concept for small clinics — live queue status, reminders and a simple staff dashboard.',
    tags: ['React', 'REST API', 'MongoDB'],
    preview: 'clinic',
  },
]
