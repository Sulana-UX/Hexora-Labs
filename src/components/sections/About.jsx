import { reasons } from '../../data/content'
import { photos } from '../../data/images'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { Photo } from '../ui/Photo'
import badge from '../../assets/brand/logo-badge.webp'

const audiences = ['University students', 'Startups', 'Individuals', 'Small businesses']

function Collage() {
  return (
    <div className="group relative pb-10 pl-6 sm:pb-12 sm:pl-12">
      <Photo
        photo={photos.workspace}
        sizes="(min-width: 1024px) 560px, 100vw"
        className="aspect-[4/3] rounded-[2rem] shadow-lift"
      />
      {/* inset detail photo */}
      <div className="absolute bottom-0 left-0 w-[38%] max-w-[220px] rounded-[1.6rem] bg-white p-1.5 shadow-lift sm:p-2">
        <Photo photo={photos.code} sizes="220px" className="aspect-square rounded-[1.25rem]" />
      </div>
      {/* emblem */}
      <img
        src={badge}
        alt=""
        width="640"
        height="640"
        loading="lazy"
        decoding="async"
        className="absolute -right-2 -top-6 size-20 rounded-full shadow-lift ring-4 ring-white sm:-right-5 sm:size-24"
      />
    </div>
  )
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-24 sm:py-32">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <Reveal>
            <Eyebrow>About Hexora Labs</Eyebrow>
            <h2 id="about-title" className="mt-5 text-balance text-[2rem] font-semibold leading-[1.08] sm:text-[2.6rem] lg:text-[3.1rem]">
              Why Choose Hexora Labs?
            </h2>
            <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted sm:text-lg">
              Hexora Labs is a software development startup with a simple goal: make well-built, modern software
              accessible and affordable. We work closely with every client so the result fits their needs — not a
              template.
            </p>
            <div className="mt-8">
              <p className="text-sm font-semibold text-navy">Built for</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {audiences.map((a) => (
                  <li key={a} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium text-navy/80">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Collage />
          </Reveal>
        </div>

        <ul className="mt-20 grid gap-x-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {reasons.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={(i % 3) * 0.06} className="group border-t border-line py-8">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-ice text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.9} />
                </span>
                <span className="font-display text-sm font-medium text-navy/25">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 max-w-sm text-pretty text-[0.95rem] leading-relaxed text-muted">{text}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
