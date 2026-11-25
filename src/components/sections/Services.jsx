import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react'
import { services } from '../../data/content'
import { site } from '../../config/site'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { useInquiry } from '../../context/InquiryContext'
import { useGoToSection } from '../../hooks/useGoToSection'

const byId = Object.fromEntries(services.map((s) => [s.id, s]))

/** Placement in the 4-column bento grid (desktop). */
const layout = {
  web: 'md:col-span-2 lg:col-span-2 lg:row-span-2',
  webapp: 'md:col-span-2 lg:col-span-2',
  mobile: '',
  desktop: '',
  ai: 'md:col-span-2 lg:col-span-2',
  api: '',
  db: '',
  testing: 'md:col-span-2 lg:col-span-2',
}

function useEnquire() {
  const { presetProjectType } = useInquiry()
  const go = useGoToSection()
  return (projectType) => (e) => {
    e.preventDefault()
    presetProjectType(projectType)
    go('contact')
  }
}

function EnquireLink({ service, dark = false }) {
  const enquire = useEnquire()
  return (
    <a
      href="/contact"
      onClick={enquire(service.projectType)}
      className={`group/link mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
        dark ? 'text-white hover:text-cyan' : 'text-navy hover:text-primary'
      }`}
      aria-label={`Enquire about ${service.title}`}
    >
      Enquire
      <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/link:translate-x-1" />
    </a>
  )
}

function Tags({ tags, dark }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Focus areas">
      {tags.map((t) => (
        <li
          key={t}
          className={`rounded-full px-2.5 py-1 text-[0.7rem] font-medium ${
            dark ? 'bg-white/10 text-white/80' : 'bg-ice text-navy/70'
          }`}
        >
          {t}
        </li>
      ))}
    </ul>
  )
}

function ServiceCard({ service, className = '', children, delay = 0 }) {
  const Icon = service.icon
  return (
    <Reveal
      as="article"
      delay={delay}
      className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-500 ease-out hover:-translate-y-1 hover:border-primary/25 hover:shadow-lift sm:p-7 ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-12 place-items-center rounded-2xl bg-ice text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
          <Icon aria-hidden="true" className="size-[1.35rem]" strokeWidth={1.9} />
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-5 text-navy/25 transition-all duration-500 group-hover:rotate-45 group-hover:text-primary"
        />
      </div>
      {children}
      <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>
      <p className="mt-2.5 text-pretty text-[0.95rem] leading-relaxed text-muted">{service.description}</p>
      <div className="mt-auto pt-5">
        <Tags tags={service.tags} />
        <EnquireLink service={service} />
      </div>
    </Reveal>
  )
}

/** Miniature responsive-website wireframe for the featured card. */
function WebVisual() {
  return (
    <div aria-hidden="true" className="relative mt-7 hidden h-[210px] sm:block">
      <div className="absolute inset-x-0 top-0 overflow-hidden rounded-2xl border border-line bg-[#f8fbfe] transition-transform duration-700 ease-out group-hover:-translate-y-1.5">
        <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
          <span className="size-2 rounded-full bg-[#d5e1ee]" />
          <span className="size-2 rounded-full bg-[#d5e1ee]" />
          <span className="size-2 rounded-full bg-[#d5e1ee]" />
          <span className="ml-2 h-3.5 flex-1 rounded bg-white" />
        </div>
        <div className="grid grid-cols-[1.3fr_1fr] gap-4 p-4">
          <div>
            <div className="h-2 w-16 rounded-full bg-primary/50" />
            <div className="mt-3 h-3.5 w-[85%] rounded bg-navy/85" />
            <div className="mt-2 h-3.5 w-[60%] rounded bg-navy/85" />
            <div className="mt-3 h-2 w-[90%] rounded-full bg-[#dbe6f2]" />
            <div className="mt-1.5 h-2 w-[70%] rounded-full bg-[#dbe6f2]" />
            <div className="mt-4 flex gap-2">
              <span className="h-6 w-20 rounded-full bg-navy" />
              <span className="h-6 w-16 rounded-full border border-line bg-white" />
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-ice-200 to-ice p-2">
            <div className="h-full rounded-lg border border-white bg-white/60" />
          </div>
        </div>
      </div>
      {/* phone breakpoint preview */}
      <div className="absolute -bottom-3 right-5 h-[150px] w-[78px] rounded-[16px] border-[3px] border-navy bg-white p-1.5 shadow-soft transition-transform duration-700 ease-out group-hover:-translate-y-3">
        <div className="h-1.5 w-8 rounded-full bg-primary/50" />
        <div className="mt-2 h-2 w-full rounded bg-navy/85" />
        <div className="mt-1 h-2 w-3/4 rounded bg-navy/85" />
        <div className="mt-2 h-10 rounded-md bg-ice" />
        <div className="mt-2 h-4 w-10 rounded-full bg-navy" />
      </div>
    </div>
  )
}

function AICard({ delay }) {
  const service = byId.ai
  const Icon = service.icon
  return (
    <Reveal
      as="article"
      delay={delay}
      className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-navy p-6 text-white transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-28px_rgb(11_35_67/0.8)] sm:p-7 ${layout.ai}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 300 120"
        className="pointer-events-none absolute -right-4 bottom-0 w-[62%] opacity-90 transition-transform duration-700 group-hover:-translate-y-1"
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const h = [26, 38, 30, 48, 44, 60, 52, 70, 64, 84, 78, 98][i]
          return <rect key={i} x={i * 24 + 6} y={120 - h} width="14" height={h} rx="4" fill={i > 8 ? '#00B9F1' : '#ffffff'} opacity={i > 8 ? 0.9 : 0.08} />
        })}
        <path d="M13 92 L 61 80 L 109 70 L 157 58 L 205 44 L 253 30 L 289 18" fill="none" stroke="#00B9F1" strokeWidth="2" strokeDasharray="5 6" />
        <circle cx="289" cy="18" r="5" fill="#00B9F1" />
      </svg>
      <div className="relative flex items-start justify-between gap-4">
        <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-cyan transition-colors duration-500 group-hover:bg-cyan group-hover:text-navy">
          <Icon aria-hidden="true" className="size-[1.35rem]" strokeWidth={1.9} />
        </span>
        <ArrowUpRight aria-hidden="true" className="size-5 text-white/30 transition-all duration-500 group-hover:rotate-45 group-hover:text-cyan" />
      </div>
      <h3 className="relative mt-6 text-xl font-semibold text-white">{service.title}</h3>
      <p className="relative mt-2.5 max-w-sm text-pretty text-[0.95rem] leading-relaxed text-white/70">{service.description}</p>
      <div className="relative mt-auto pt-5">
        <Tags tags={service.tags} dark />
        <EnquireLink service={service} dark />
      </div>
    </Reveal>
  )
}

function StartTile({ delay }) {
  const go = useGoToSection()
  return (
    <Reveal
      delay={delay}
      className="relative flex flex-col justify-between gap-8 overflow-hidden rounded-[1.75rem] bg-primary p-6 text-white sm:p-7 md:col-span-2 lg:col-span-2"
    >
      <div aria-hidden="true" className="absolute -right-16 -top-16 size-56 rounded-full border-[28px] border-white/10" />
      <div className="relative">
        <h3 className="text-2xl font-semibold text-white">Not sure what you need?</h3>
        <p className="mt-2.5 max-w-sm text-white/80">
          Describe your idea in plain words. We&apos;ll suggest an approach that fits your goals and budget.
        </p>
      </div>
      <div className="relative flex flex-wrap items-center gap-3">
        <a
          href="/contact"
          onClick={(e) => {
            e.preventDefault()
            go('contact')
          }}
          className="group inline-flex h-12 items-center gap-2 rounded-full bg-white pl-5 pr-1.5 text-sm font-semibold text-navy transition-colors hover:bg-ice"
        >
          Start a conversation
          <span className="grid size-9 place-items-center rounded-full bg-navy text-white transition-colors group-hover:bg-primary">
            <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </a>
        <a
          href={`mailto:${site.email}`}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white/90 underline-offset-4 hover:underline"
        >
          <Mail aria-hidden="true" className="size-4" /> {site.email}
        </a>
      </div>
    </Reveal>
  )
}

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading id="services-title" eyebrow="Services" title="What We Can Build for You" />
          <Reveal className="max-w-sm text-pretty text-muted lg:pb-2">
            End-to-end development across web, mobile, desktop and data — scoped to what your project actually needs.
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <ServiceCard service={byId.web} className={layout.web}>
            <WebVisual />
          </ServiceCard>
          <ServiceCard service={byId.webapp} className={layout.webapp} delay={0.05} />
          <ServiceCard service={byId.mobile} delay={0.1} />
          <ServiceCard service={byId.desktop} delay={0.15} />
          <AICard delay={0} />
          <ServiceCard service={byId.api} delay={0.05} />
          <ServiceCard service={byId.db} delay={0.1} />
          <ServiceCard service={byId.testing} className={layout.testing} delay={0} />
          <StartTile delay={0.05} />
        </div>
      </Container>
    </section>
  )
}
