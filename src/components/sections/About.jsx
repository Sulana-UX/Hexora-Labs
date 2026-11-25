import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { reasons } from '../../data/content'
import { photos } from '../../data/images'
import { Container } from '../ui/Container'
import { Eyebrow } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { Photo } from '../ui/Photo'
import badge from '../../assets/brand/logo-badge.webp'

const audiences = ['University students', 'Startups', 'Individuals', 'Small businesses']
const ease = [0.22, 1, 0.36, 1]

/** Three photos + emblem moving at different speeds as the section scrolls past. */
function ParallaxCollage({ scrollYProgress, reduce }) {
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const p = reduce ? scrollYProgress : smooth
  const mainY = useTransform(p, [0, 1], reduce ? [0, 0] : [50, -50])
  const mainScale = useTransform(p, [0, 0.5], reduce ? [1, 1] : [1.06, 1])
  const codeY = useTransform(p, [0, 1], reduce ? [0, 0] : [110, -90])
  const codeRotate = useTransform(p, [0, 1], reduce ? [0, 0] : [-6, 3])
  const dashY = useTransform(p, [0, 1], reduce ? [0, 0] : [-40, 70])
  const dashRotate = useTransform(p, [0, 1], reduce ? [0, 0] : [5, -2])
  const badgeRotate = useTransform(p, [0, 1], reduce ? [0, 0] : [-25, 35])

  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px]">
      {/* main photo */}
      <motion.div style={{ y: mainY }} className="group absolute inset-x-[8%] top-[8%] bottom-[12%]">
        <motion.div style={{ scale: mainScale }} className="h-full w-full">
          <Photo
            photo={photos.workspace}
            sizes="(min-width: 1024px) 460px, 85vw"
            className="h-full w-full rounded-[2rem] shadow-lift"
          />
        </motion.div>
      </motion.div>

      {/* analytics card — top right */}
      <motion.div
        style={{ y: dashY, rotate: dashRotate }}
        className="group absolute right-0 top-0 w-[40%] rounded-[1.4rem] bg-white p-1.5 shadow-lift sm:p-2"
      >
        <Photo photo={photos.analytics} sizes="220px" className="aspect-[4/3] rounded-[1.1rem]" />
      </motion.div>

      {/* code close-up — bottom left */}
      <motion.div
        style={{ y: codeY, rotate: codeRotate }}
        className="group absolute bottom-0 left-0 w-[36%] rounded-[1.4rem] bg-white p-1.5 shadow-lift sm:p-2"
      >
        <Photo photo={photos.code} sizes="200px" className="aspect-square rounded-[1.1rem]" />
      </motion.div>

      {/* emblem */}
      <motion.img
        style={{ rotate: badgeRotate }}
        src={badge}
        alt=""
        width="640"
        height="640"
        loading="lazy"
        decoding="async"
        className="absolute bottom-[4%] right-[4%] size-16 rounded-full shadow-lift ring-4 ring-white sm:size-20"
      />
    </div>
  )
}

/** Tracks which reason sits in the middle band of the viewport. */
function useActiveIndex(count) {
  const [active, setActive] = useState(0)
  const refs = useRef([])
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.index))
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    refs.current.slice(0, count).forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [count])
  return [active, refs]
}

export function About() {
  const reduce = useReducedMotion()
  const stageRef = useRef(null)
  const listRef = useRef(null)
  const [active, itemRefs] = useActiveIndex(reasons.length)

  const { scrollYProgress: stageProgress } = useScroll({ target: stageRef, offset: ['start end', 'end start'] })
  const { scrollYProgress: listProgress } = useScroll({ target: listRef, offset: ['start 55%', 'end 55%'] })
  const lineScale = useSpring(listProgress, { stiffness: 140, damping: 30 })

  const ActiveIcon = reasons[active].icon

  return (
    <section id="about" aria-labelledby="about-title" className="py-24 sm:py-32">
      <Container>
        {/* intro */}
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
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
          </Reveal>
          <Reveal delay={0.1} className="lg:pb-2">
            <p className="text-sm font-semibold text-navy">Built for</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {audiences.map((a) => (
                <li key={a} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium text-navy/80">
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* scroll story */}
        <div ref={stageRef} className="mt-16 grid gap-28 lg:mt-20 lg:grid-cols-[1fr_1fr] lg:gap-20">
          {/* sticky visual */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ParallaxCollage scrollYProgress={stageProgress} reduce={reduce} />

            <div className="mt-10 hidden items-center gap-5 rounded-3xl border border-line bg-white p-5 shadow-soft lg:flex">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-navy text-white">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={active}
                    initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    <ActiveIcon aria-hidden="true" className="size-6 text-cyan" strokeWidth={1.9} />
                  </motion.span>
                </AnimatePresence>
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-xs font-semibold tracking-[0.16em] text-primary">
                  0{active + 1} <span className="text-navy/30">/ 0{reasons.length}</span>
                </p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={active}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="mt-1 truncate font-display text-lg font-semibold text-navy"
                  >
                    {reasons[active].title}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="flex gap-1.5" aria-hidden="true">
                {reasons.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-6 bg-primary' : 'w-1.5 bg-navy/15'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* reasons */}
          <div ref={listRef} className="relative">
            <span aria-hidden="true" className="absolute bottom-0 left-[1.35rem] top-0 w-px bg-line" />
            <motion.span
              aria-hidden="true"
              style={{ scaleY: lineScale }}
              className="absolute bottom-0 left-[1.35rem] top-0 w-px origin-top bg-gradient-to-b from-primary to-cyan"
            />
            <ol className="space-y-4 lg:space-y-6">
              {reasons.map(({ icon: Icon, title, text }, i) => {
                const on = i === active
                return (
                  <li
                    key={title}
                    ref={(el) => {
                      itemRefs.current[i] = el
                    }}
                    data-index={i}
                    className="relative flex gap-6 py-6 lg:min-h-[13rem] lg:items-center lg:py-10"
                  >
                    <span
                      className={`relative z-10 grid size-11 shrink-0 place-items-center rounded-xl border transition-all duration-500 ${
                        on
                          ? 'scale-110 border-primary bg-primary text-white shadow-[0_10px_24px_-10px_rgb(0_102_230/0.8)]'
                          : 'border-line bg-white text-primary'
                      }`}
                    >
                      <Icon aria-hidden="true" className="size-5" strokeWidth={1.9} />
                    </span>
                    <div className={`transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-100 lg:opacity-40'}`}>
                      <p className="font-display text-sm font-semibold text-primary">0{i + 1}</p>
                      <h3 className="mt-1 text-xl font-semibold sm:text-2xl">{title}</h3>
                      <p className="mt-2 max-w-md text-pretty text-[0.95rem] leading-relaxed text-muted sm:text-base">{text}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  )
}
