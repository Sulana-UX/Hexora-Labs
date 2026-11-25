import { motion } from 'motion/react'
import { AppWindow, BrainCircuit, Globe, Monitor, Smartphone } from 'lucide-react'
import { Container, Panel } from '../ui/Container'
import { Button } from '../ui/Button'
import { HeroIllustration } from '../illustrations/HeroIllustration'
import { useGoToSection } from '../../hooks/useGoToSection'

const ease = [0.22, 1, 0.36, 1]
const fade = (delay) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
})

const capabilities = [
  { icon: Globe, label: 'Web' },
  { icon: AppWindow, label: 'Web Apps' },
  { icon: Smartphone, label: 'Mobile' },
  { icon: Monitor, label: 'Desktop' },
  { icon: BrainCircuit, label: 'AI & Data' },
]

export function Hero() {
  const go = useGoToSection()
  const onLink = (section) => (e) => {
    e.preventDefault()
    go(section)
  }

  return (
    <Panel id="home" aria-labelledby="hero-title" className="relative mt-3 overflow-hidden bg-ice sm:mt-4">
      {/* soft light falloff — one restrained accent, not a gradient wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-white/70 blur-3xl"
      />
      <Container className="relative grid items-center gap-10 pb-14 pt-32 sm:pb-20 sm:pt-36 lg:grid-cols-[1.02fr_1fr] lg:gap-6 lg:pb-24 lg:pt-40">
        <div className="max-w-xl">
          <motion.h1
            id="hero-title"
            {...fade(0.08)}
            className="text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.35rem]"
          >
            Your Vision.
            <br />
            Engineered into <span className="text-primary">Reality.</span>
          </motion.h1>

          <motion.p {...fade(0.22)} className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-muted sm:text-lg">
            We design and develop modern digital solutions for students, startups, and businesses — transforming
            ideas into meaningful technology.
          </motion.p>

          <motion.div {...fade(0.32)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/contact" onClick={onLink('contact')} variant="navy" size="lg">
              Start Your Project
            </Button>
            <Button href="/work" onClick={onLink('work')} variant="outline" size="lg">
              Explore Our Work
            </Button>
          </motion.div>

          <motion.ul {...fade(0.42)} aria-label="What we build" className="mt-11 flex flex-wrap gap-x-5 gap-y-3 border-t border-navy/10 pt-6">
            {capabilities.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-medium text-navy/75">
                <Icon aria-hidden="true" className="size-4 text-primary" strokeWidth={2} />
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none">
          <HeroIllustration />
        </div>
      </Container>
    </Panel>
  )
}
