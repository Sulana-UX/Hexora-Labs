import { Reveal } from './Reveal'

export function Eyebrow({ children, tone = 'dark', className = '' }) {
  const color = tone === 'light' ? 'text-cyan' : 'text-primary'
  return (
    <p className={`inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] ${color} ${className}`}>
      <span aria-hidden="true" className="h-px w-6 bg-current" />
      {children}
    </p>
  )
}

export function SectionHeading({ eyebrow, title, intro, tone = 'dark', align = 'left', className = '', id }) {
  const center = align === 'center' ? 'mx-auto text-center items-center' : ''
  return (
    <Reveal className={`flex max-w-2xl flex-col gap-5 ${center} ${className}`}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2
        id={id}
        className={`text-balance text-[2rem] font-semibold leading-[1.08] sm:text-[2.6rem] lg:text-[3.1rem] ${
          tone === 'light' ? 'text-white' : ''
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`text-pretty text-base leading-relaxed sm:text-lg ${tone === 'light' ? 'text-white/70' : 'text-muted'}`}>
          {intro}
        </p>
      )}
    </Reveal>
  )
}
