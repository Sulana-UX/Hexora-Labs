import { motion } from 'motion/react'
import { processSteps } from '../../data/content'
import { Container, Panel } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { Photo } from '../ui/Photo'
import { photos } from '../../data/images'

const ease = [0.22, 1, 0.36, 1]

export function Process() {
  return (
    <Panel id="process" aria-labelledby="process-title" className="bg-ice">
      <Container className="py-20 sm:py-28">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
          <SectionHeading
            id="process-title"
            eyebrow="How We Work"
            title="A clear path from idea to launch"
            intro="Four focused stages keep every project predictable — you always know what is happening and what comes next."
          />
          <Reveal delay={0.1} className="group relative">
            <Photo
              photo={photos.wireframe}
              sizes="(min-width: 1024px) 520px, 100vw"
              className="aspect-[16/9] rounded-[1.75rem] shadow-soft"
            />
            <p className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-navy shadow-soft">
              Every build starts with a plan
            </p>
          </Reveal>
        </div>

        <ol className="relative mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* connector — horizontal on desktop */}
          <motion.span
            aria-hidden="true"
            className="absolute left-7 right-[12%] top-7 hidden h-px origin-left bg-gradient-to-r from-primary via-cyan to-primary/20 lg:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '0px 0px -20% 0px' }}
            transition={{ duration: 1.4, ease }}
          />
          {/* connector — vertical on mobile */}
          <motion.span
            aria-hidden="true"
            className="absolute bottom-8 left-7 top-7 w-px origin-top bg-gradient-to-b from-primary via-cyan to-primary/20 md:hidden"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '0px 0px -20% 0px' }}
            transition={{ duration: 1.4, ease }}
          />

          {processSteps.map(({ number, title, icon: Icon, text, detail }, i) => (
            <motion.li
              key={number}
              className="group relative pl-20 md:pl-0"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.15 }}
            >
              <span className="absolute left-0 top-0 grid size-14 place-items-center rounded-2xl border border-white bg-white text-primary shadow-soft transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-navy group-hover:text-white md:relative">
                <Icon aria-hidden="true" className="size-6" strokeWidth={1.8} />
              </span>
              <div className="md:mt-8">
                <p className="font-display text-sm font-semibold tracking-wider text-primary">{number}</p>
                <h3 className="mt-1 text-2xl font-semibold">{title}</h3>
                <p className="mt-3 font-medium text-navy/85">{text}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{detail}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </Container>
    </Panel>
  )
}
