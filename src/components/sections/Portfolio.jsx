import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Info } from 'lucide-react'
import { portfolioCategories, projects } from '../../data/portfolio'
import { previewStages } from '../illustrations/previewStages'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'

const categoryLabel = Object.fromEntries(portfolioCategories.map((c) => [c.id, c.label.replace(/s$/, '')]))
/** Alternating wide / narrow columns for an asymmetric, editorial rhythm. */
const spans = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7']

function ProjectCard({ project, span }) {
  const { Component, stage } = previewStages[project.preview]
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`group ${span}`}
      aria-labelledby={`project-${project.id}`}
    >
      <div
        className={`relative h-[260px] overflow-hidden sm:h-[320px] lg:h-[360px] rounded-[1.75rem] ${stage} transition-shadow duration-500 group-hover:shadow-lift`}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02]">
          <Component />
        </div>
        {project.concept && (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-navy shadow-soft backdrop-blur">
            Concept project
          </span>
        )}
      </div>
      <div className="mt-5 flex flex-col gap-4 px-1">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{categoryLabel[project.category]}</p>
          <h3 id={`project-${project.id}`} className="mt-1.5 text-xl font-semibold sm:text-2xl">
            {project.title}
          </h3>
          <p className="mt-2 text-pretty text-[0.95rem] leading-relaxed text-muted">{project.description}</p>
        </div>
        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.tags.map((t) => (
            <li key={t} className="rounded-full border border-line px-2.5 py-1 text-xs font-medium text-navy/70">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  )
}

export function Portfolio() {
  const [filter, setFilter] = useState('all')
  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )
  const counts = useMemo(() => {
    const c = { all: projects.length }
    projects.forEach((p) => (c[p.category] = (c[p.category] ?? 0) + 1))
    return c
  }, [])

  return (
    <section id="work" aria-labelledby="work-title" className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="work-title"
            eyebrow="Our Work"
            title="Ideas Turned into Experiences"
            intro="A selection of concept projects that show how we approach design, architecture and user experience across platforms."
          />
          <Reveal className="flex max-w-sm gap-3 rounded-2xl border border-line bg-ice/50 p-4 text-sm leading-relaxed text-muted">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>
              <strong className="font-semibold text-navy">Concept projects.</strong> These are demonstration designs created
              by Hexora Labs to illustrate our capabilities — they are not completed client work.
            </p>
          </Reveal>
        </div>

        <Reveal className="-mx-5 mt-12 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0 [scrollbar-width:none]">
          <div role="group" aria-label="Filter projects by category" className="flex w-max gap-2">
            {portfolioCategories.map((cat) => {
              const active = filter === cat.id
              const n = counts[cat.id] ?? 0
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(cat.id)}
                  className={`relative h-11 rounded-full px-5 text-sm font-medium transition-colors duration-300 ${
                    active ? 'text-white' : 'border border-line text-navy/75 hover:border-navy/25 hover:text-navy'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="work-filter"
                      className="absolute inset-0 rounded-full bg-navy"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="relative">
                    {cat.label}
                    <span className={`ml-1.5 text-xs ${active ? 'text-white/60' : 'text-muted/70'}`}>{n}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>

        <p className="sr-only" aria-live="polite">
          Showing {visible.length} {visible.length === 1 ? 'project' : 'projects'}
        </p>

        <motion.div layout className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-12">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                span={visible.length === 1 ? 'md:col-span-2 lg:col-span-8' : spans[i % spans.length]}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  )
}
