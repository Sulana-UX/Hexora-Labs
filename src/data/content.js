import {
  AppWindow,
  BrainCircuit,
  BugOff,
  ClipboardList,
  Code2,
  Database,
  FileCheck2,
  GraduationCap,
  Globe,
  HeartHandshake,
  Layers,
  LifeBuoy,
  MessagesSquare,
  Monitor,
  PencilRuler,
  Presentation,
  Rocket,
  Search,
  ServerCog,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wallet,
  Wrench,
} from 'lucide-react'

/** Project types offered in the inquiry form (also used for pre-filling). */
export const projectTypes = [
  'Website Development',
  'Web Application',
  'Mobile Application',
  'Desktop Application',
  'API & Backend Development',
  'Database Solution',
  'AI/ML & Data Analytics',
  'University Project Guidance',
  'Software Testing & Debugging',
  'Something else',
]

/** Budget tiers — edit freely (e.g. add currency ranges once pricing is set). */
export const budgetRanges = [
  'Student budget',
  'Small — starter project',
  'Medium — custom build',
  'Large — complex system',
  'Not sure yet — need advice',
  'Prefer to discuss',
]

export const services = [
  {
    id: 'web',
    icon: Globe,
    title: 'Website Development',
    description:
      'Fast, responsive websites that present your brand clearly — from landing pages and portfolios to multi-page business sites.',
    tags: ['React', 'Responsive', 'SEO-ready'],
    projectType: 'Website Development',
  },
  {
    id: 'webapp',
    icon: AppWindow,
    title: 'Web Applications',
    description:
      'Dashboards, portals and booking systems built around your workflow, with secure logins and clean, intuitive interfaces.',
    tags: ['SPA', 'Dashboards'],
    projectType: 'Web Application',
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Mobile Apps',
    description:
      'Cross-platform Android and iOS apps that feel native, work smoothly and are ready to grow with your users.',
    tags: ['Android', 'iOS'],
    projectType: 'Mobile Application',
  },
  {
    id: 'desktop',
    icon: Monitor,
    title: 'Desktop Software',
    description:
      'Reliable Windows and cross-platform tools for billing, inventory, records and internal operations.',
    tags: ['Windows', 'Offline-first'],
    projectType: 'Desktop Application',
  },
  {
    id: 'api',
    icon: ServerCog,
    title: 'APIs & Backend',
    description:
      'Well-structured REST APIs, authentication and server logic that keep your apps fast, secure and connected.',
    tags: ['REST', 'Auth', 'Integrations'],
    projectType: 'API & Backend Development',
  },
  {
    id: 'db',
    icon: Database,
    title: 'Database Solutions',
    description:
      'Database design, migration and optimisation — so your data stays organised, consistent and quick to query.',
    tags: ['SQL', 'NoSQL'],
    projectType: 'Database Solution',
  },
  {
    id: 'ai',
    icon: BrainCircuit,
    title: 'AI, ML & Data Analytics',
    description:
      'Turn raw data into decisions with predictive models, dashboards and intelligent features tailored to your problem.',
    tags: ['Python', 'Machine Learning', 'Visualisation'],
    projectType: 'AI/ML & Data Analytics',
  },
  {
    id: 'testing',
    icon: BugOff,
    title: 'Testing & Debugging',
    description:
      'Find and fix what is holding your software back — systematic testing, bug fixing and code-quality reviews.',
    tags: ['QA', 'Bug fixing'],
    projectType: 'Software Testing & Debugging',
  },
]

export const studentSupport = [
  { icon: Wallet, title: 'Student-friendly pricing', text: 'Transparent quotes sized for student budgets.' },
  { icon: GraduationCap, title: 'Technical mentoring', text: 'One-to-one sessions that explain the why, not just the how.' },
  { icon: Wrench, title: 'Coding & debugging help', text: 'Work through errors and blockers together.' },
  { icon: ClipboardList, title: 'Project planning', text: 'Scope, requirements, architecture and timelines.' },
  { icon: Layers, title: 'Prototype development', text: 'Guidance turning your concept into a working prototype.' },
  { icon: FileCheck2, title: 'Testing & documentation', text: 'Test plans, reports and clear technical write-ups.' },
  { icon: Presentation, title: 'Presentation preparation', text: 'Get ready to demo and explain your work confidently.' },
]

export const processSteps = [
  {
    number: '01',
    title: 'Discover',
    icon: Search,
    text: 'Understand client requirements and objectives.',
    detail: 'A conversation about your goals, users, timeline and budget.',
  },
  {
    number: '02',
    title: 'Design',
    icon: PencilRuler,
    text: 'Plan the architecture and user experience.',
    detail: 'Wireframes, technical stack and a clear plan you can review.',
  },
  {
    number: '03',
    title: 'Develop',
    icon: Code2,
    text: 'Build, test, and refine the solution.',
    detail: 'Iterative builds with regular updates and room for feedback.',
  },
  {
    number: '04',
    title: 'Deliver',
    icon: Rocket,
    text: 'Deliver the solution with relevant guidance and support.',
    detail: 'Handover, deployment help and walkthroughs of how it works.',
  },
]

export const reasons = [
  {
    icon: Wallet,
    title: 'Affordable, transparent pricing',
    text: 'A clear quote before work begins, explained line by line — no hidden extras.',
  },
  {
    icon: Sparkles,
    title: 'Personalised solutions',
    text: 'Built around your goals and constraints rather than a one-size-fits-all template.',
  },
  {
    icon: Code2,
    title: 'Modern technologies',
    text: 'Current, well-supported tools chosen for performance and long-term maintainability.',
  },
  {
    icon: MessagesSquare,
    title: 'Clear communication',
    text: 'Plain-language updates at every stage, so you always know where your project stands.',
  },
  {
    icon: ShieldCheck,
    title: 'Careful attention to quality',
    text: 'Code reviews, testing and attention to detail across design and development.',
  },
  {
    icon: LifeBuoy,
    title: 'Ongoing technical support',
    text: 'Help after delivery for questions, fixes and future improvements.',
  },
]

export const aboutIcon = HeartHandshake
