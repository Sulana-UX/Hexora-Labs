import { BookOpenCheck } from 'lucide-react'
import { studentSupport } from '../../data/content'
import { Container, Panel } from '../ui/Container'
import { Eyebrow } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { Button } from '../ui/Button'
import { useInquiry } from '../../context/InquiryContext'
import { useGoToSection } from '../../hooks/useGoToSection'
import { Photo } from '../ui/Photo'
import { photos } from '../../data/images'

const journey = ['First idea', 'Planning', 'Prototype', 'Testing', 'Final demo']

export function StudentHub() {
  const { presetProjectType } = useInquiry()
  const go = useGoToSection()

  const discuss = (e) => {
    e.preventDefault()
    presetProjectType('University Project Guidance')
    go('contact')
  }

  return (
    <Panel id="student-hub" aria-labelledby="student-title" className="relative overflow-hidden bg-navy text-white">
      {/* hairline technical grid, faded */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_65%)]"
      />
      <Container className="relative py-20 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="flex flex-col">
            <Reveal>
              <Eyebrow tone="light">Student Hub</Eyebrow>
              <h2
                id="student-title"
                className="mt-5 text-balance text-[2rem] font-semibold leading-[1.08] text-white sm:text-[2.6rem] lg:text-[3.1rem]"
              >
                Stuck on Your University Project?
              </h2>
              <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
                From your first idea to your final demonstration, get affordable technical guidance and development
                support that helps you build with confidence.
              </p>
              <div className="mt-9">
                <Button href="/contact" onClick={discuss} variant="primary" size="lg">
                  Discuss Your Project
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="group relative mt-12">
              <Photo
                photo={photos.students}
                sizes="(min-width: 1024px) 540px, 100vw"
                className="aspect-[4/3] rounded-[1.75rem] sm:aspect-[16/10] lg:aspect-[4/3]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-gradient-to-t from-navy/70 via-navy/0 to-navy/0"
              />
              <p className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-navy shadow-soft">
                Learn by building
              </p>
            </Reveal>

            <Reveal
              delay={0.14}
              className="relative mx-3 -mt-16 rounded-3xl border border-white/12 bg-navy-800/95 p-6 shadow-[0_24px_48px_-24px_rgb(0_0_0/0.6)] backdrop-blur sm:mx-6"
            >
              <div className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-cyan/15 text-cyan">
                  <BookOpenCheck aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white">We guide. You build.</h3>
                  <p className="mt-1.5 text-pretty text-sm leading-relaxed text-white/70">
                    Our mentoring is about helping you understand and develop your own work — explaining concepts,
                    reviewing your approach and helping you debug — always in line with your university&apos;s academic
                    requirements and integrity policies.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:self-center">
            <ul className="grid gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-2">
              {studentSupport.map(({ icon: Icon, title, text }, i) => (
                <Reveal
                  as="li"
                  key={title}
                  delay={0.04 * i}
                  className={`group bg-navy p-6 transition-colors duration-300 hover:bg-navy-800 ${
                    i === studentSupport.length - 1 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <Icon aria-hidden="true" className="size-5 text-cyan transition-transform duration-300 group-hover:-translate-y-0.5" strokeWidth={1.9} />
                  <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/60">{text}</p>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.15} className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Support across every stage</p>
              <ol className="mt-4 grid grid-cols-5 gap-2">
                {journey.map((step, i) => (
                  <li key={step} className="flex flex-col gap-2.5">
                    <span
                      aria-hidden="true"
                      className="h-1.5 rounded-full bg-cyan"
                      style={{ opacity: 0.3 + (i / (journey.length - 1)) * 0.7 }}
                    />
                    <span className="text-[0.7rem] font-medium leading-tight text-white/70 sm:text-xs">{step}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </Container>
    </Panel>
  )
}
