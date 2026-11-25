import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Check } from 'lucide-react'
import { featuredProjects } from '../../data/portfolio'
import { Reveal } from '../ui/Reveal'

const ease = [0.22, 1, 0.36, 1]

function Showcase({ project }) {
  const [view, setView] = useState(0)
  const dark = project.theme === 'dark'
  const current = project.views[view].image

  return (
    <div
      className={`group relative overflow-hidden rounded-[1.75rem] p-5 pb-16 sm:p-8 sm:pb-20 ${
        dark ? 'bg-[#0d0c10]' : 'bg-[#e7efe6]'
      }`}
    >
      {/* soft glow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-24 -top-24 size-80 rounded-full blur-3xl ${
          dark ? 'bg-[#c9a24a]/20' : 'bg-white/70'
        }`}
      />

      {/* view toggle */}
      <div
        role="group"
        aria-label={`${project.title} screenshots`}
        className={`relative mb-4 inline-flex rounded-full p-1 ${dark ? 'bg-white/10' : 'bg-white/80 shadow-soft'}`}
      >
        {project.views.map((v, i) => (
          <button
            key={v.label}
            type="button"
            aria-pressed={view === i}
            onClick={() => setView(i)}
            className={`relative h-8 rounded-full px-3.5 text-xs font-semibold transition-colors ${
              view === i ? (dark ? 'text-[#0d0c10]' : 'text-white') : dark ? 'text-white/70 hover:text-white' : 'text-navy/70 hover:text-navy'
            }`}
          >
            {view === i && (
              <motion.span
                layoutId={`${project.id}-view`}
                className={`absolute inset-0 rounded-full ${dark ? 'bg-[#e2c27a]' : 'bg-navy'}`}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{v.label}</span>
          </button>
        ))}
      </div>

      {/* browser frame */}
      <div className="relative overflow-hidden rounded-xl bg-white shadow-[0_30px_60px_-24px_rgb(0_0_0/0.45)] ring-1 ring-black/5 transition-transform duration-700 ease-out group-hover:-translate-y-1">
        <div className={`flex items-center gap-1.5 px-3 py-2 ${dark ? 'bg-[#1b1a20]' : 'bg-white'}`}>
          <span className={`size-2 rounded-full ${dark ? 'bg-white/20' : 'bg-[#d5e1ee]'}`} />
          <span className={`size-2 rounded-full ${dark ? 'bg-white/20' : 'bg-[#d5e1ee]'}`} />
          <span className={`size-2 rounded-full ${dark ? 'bg-white/20' : 'bg-[#d5e1ee]'}`} />
          <span className={`ml-3 h-3.5 w-1/3 rounded ${dark ? 'bg-white/10' : 'bg-[#f1f5fa]'}`} />
        </div>
        <div className="relative aspect-[16/10] bg-black/5">
          <AnimatePresence initial={false}>
            <motion.img
              key={current.src}
              src={current.src}
              srcSet={current.srcSet}
              sizes="(min-width: 1024px) 640px, 92vw"
              width={current.width}
              height={current.height}
              alt={current.alt}
              loading="lazy"
              decoding="async"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease }}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </AnimatePresence>
        </div>
      </div>

      {/* floating secondary screen */}
      <figure className="absolute bottom-4 right-4 w-[46%] max-w-[300px] transition-transform duration-700 ease-out group-hover:-translate-y-3 sm:bottom-6 sm:right-6">
        <div className="overflow-hidden rounded-xl bg-white p-1 shadow-[0_24px_48px_-16px_rgb(0_0_0/0.5)] ring-1 ring-black/5">
          <img
            src={project.inset.src}
            width={project.inset.width}
            height={project.inset.height}
            alt={project.inset.alt}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full rounded-lg object-cover object-top"
          />
        </div>
        <figcaption
          className={`mt-2 text-right text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${dark ? 'text-[#e2c27a]' : 'text-navy/60'}`}
        >
          {project.insetLabel}
        </figcaption>
      </figure>
    </div>
  )
}

function FeaturedProject({ project, flip }) {
  return (
    <Reveal as="article" aria-labelledby={`fp-${project.id}`} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <div className={`lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
        <Showcase project={project} />
      </div>
      <div className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-navy px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white">
            Featured build
          </span>
          <span className="rounded-full bg-ice px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-primary">
            {project.category}
          </span>
        </div>
        <h3 id={`fp-${project.id}`} className="mt-5 text-3xl font-semibold sm:text-4xl">
          {project.title}
        </h3>
        <p className="mt-1 font-display text-base font-medium text-primary">{project.tagline}</p>
        <p className="mt-4 text-pretty leading-relaxed text-muted">{project.description}</p>
        <ul className="mt-6 space-y-2.5">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-[0.95rem] text-navy/85">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Check aria-hidden="true" className="size-3" strokeWidth={3} />
              </span>
              {h}
            </li>
          ))}
        </ul>
        <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.tags.map((t) => (
            <li key={t} className="rounded-full border border-line px-2.5 py-1 text-xs font-medium text-navy/70">
              {t}
            </li>
          ))}
        </ul>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-navy pl-5 pr-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary"
        >
          View source on GitHub
          <span className="grid size-9 place-items-center rounded-full bg-white/15 transition-colors group-hover/btn:bg-white group-hover/btn:text-primary">
            <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/btn:rotate-45" />
          </span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </Reveal>
  )
}

export function FeaturedProjects() {
  return (
    <div className="mt-14 space-y-20 sm:space-y-28">
      {featuredProjects.map((p, i) => (
        <FeaturedProject key={p.id} project={p} flip={i % 2 === 1} />
      ))}
    </div>
  )
}
