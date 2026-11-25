import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle, Check, ChevronDown, Copy, Mail, MailOpen, Phone, Send } from 'lucide-react'
import { site } from '../../config/site'
import { budgetRanges, projectTypes } from '../../data/content'
import {
  buildInquiryBody,
  buildInquirySubject,
  emptyInquiry,
  submitInquiry,
  validateInquiry,
} from '../../services/inquiry'
import { useInquiry } from '../../context/InquiryContext'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { Container, Panel } from '../ui/Container'
import { Eyebrow } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'

const inputBase =
  'peer w-full rounded-2xl border bg-white px-4 text-[0.95rem] text-ink placeholder:text-muted/60 transition-[border-color,box-shadow] duration-200 focus:outline-none focus:ring-4'
const okBorder = 'border-line hover:border-navy/25 focus:border-primary focus:ring-primary/12'
const errBorder = 'border-red-400 focus:border-red-500 focus:ring-red-500/12'

function Field({ label, name, error, optional, hint, children }) {
  const errId = `${name}-error`
  const hintId = `${name}-hint`
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="flex items-baseline justify-between text-sm font-semibold text-navy">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {children({
        id: name,
        name,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': [error ? errId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined,
        className: error ? errBorder : okBorder,
      })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} className="flex items-center gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle aria-hidden="true" className="size-3.5" /> {error}
        </p>
      )}
    </div>
  )
}

function Select({ options, placeholder, value, onChange, className, ...props }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`${inputBase} ${className} h-13 cursor-pointer appearance-none pr-11 ${value ? '' : 'text-muted/70'}`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="text-ink">
            {o}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
    </div>
  )
}

function DirectEmail() {
  const { copied, copy } = useCopyToClipboard()
  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft">
      <p className="text-sm font-semibold text-navy">Prefer to reach us directly?</p>
      <p className="mt-1 break-all font-display text-lg font-semibold text-primary sm:text-xl">{site.email}</p>
      {site.phone && (
        <a
          href={site.phone.href}
          className="mt-1 inline-flex items-center gap-2 font-display text-lg font-semibold text-navy transition-colors hover:text-primary sm:text-xl"
        >
          <Phone aria-hidden="true" className="size-4 text-primary" />
          {site.phone.display}
        </a>
      )}
      <div className="mt-5 flex flex-wrap gap-2.5">
        <a
          href={`mailto:${site.email}`}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-primary"
        >
          <Mail aria-hidden="true" className="size-4" /> Email us
        </a>
        <button
          type="button"
          onClick={() => copy(site.email)}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-navy transition-colors hover:border-navy/25 hover:bg-ice/50"
        >
          {copied === 'ok' ? (
            <Check aria-hidden="true" className="size-4 text-primary" />
          ) : (
            <Copy aria-hidden="true" className="size-4" />
          )}
          {copied === 'ok' ? 'Copied' : 'Copy email'}
        </button>
        {site.phone && (
          <a
            href={site.phone.href}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-navy transition-colors hover:border-navy/25 hover:bg-ice/50"
          >
            <Phone aria-hidden="true" className="size-4" /> Call us
          </a>
        )}
        {site.whatsapp && (
          <a
            href={site.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-5 text-sm font-semibold text-[#0b6b34] transition-colors hover:border-[#25D366] hover:bg-[#25D366]/20"
          >
            <WhatsAppIcon className="size-4" /> WhatsApp
            <span className="sr-only">(opens WhatsApp in a new tab)</span>
          </a>
        )}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {copied === 'ok' ? 'Email address copied to clipboard' : copied === 'error' ? 'Copy failed — please copy the address manually' : ''}
      </p>
    </div>
  )
}

const steps = [
  'Fill in your project details below.',
  'Your email app opens with the message ready.',
  'Review it and press Send — that’s when we receive it.',
]

export function Contact() {
  const { preset } = useInquiry()
  const [values, setValues] = useState(emptyInquiry)
  const [errors, setErrors] = useState({})
  const [handoff, setHandoff] = useState(null) // { mailto } after opening the email app
  const [seenNonce, setSeenNonce] = useState(0)
  const formRef = useRef(null)
  const statusRef = useRef(null)
  const { copied, copy } = useCopyToClipboard()
  const uid = useId()

  // Apply a project-type preset coming from "Enquire" buttons (state adjustment during render).
  if (preset.nonce !== seenNonce) {
    setSeenNonce(preset.nonce)
    if (preset.projectType) setValues((v) => ({ ...v, projectType: preset.projectType }))
  }

  const today = new Date().toISOString().slice(0, 10)

  const update = (field) => (e) => {
    const value = e.target.value
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }))
    if (handoff) setHandoff(null)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = validateInquiry(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      formRef.current?.querySelector(`[name="${first}"]`)?.focus()
      return
    }
    const result = await submitInquiry(values)
    if (result.status === 'handoff') {
      setHandoff({ mailto: result.mailto })
      requestAnimationFrame(() => statusRef.current?.focus())
    }
  }

  const fullText = `To: ${site.email}\nSubject: ${buildInquirySubject(values)}\n\n${buildInquiryBody(values).replace(/\r\n/g, '\n')}`

  return (
    <Panel id="contact" aria-labelledby="contact-title" className="bg-ice">
      <Container className="grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="flex flex-col">
          <Reveal>
            <Eyebrow>Contact</Eyebrow>
            <h2 id="contact-title" className="mt-5 text-balance text-[2.2rem] font-semibold leading-[1.05] sm:text-[2.8rem] lg:text-[3.4rem]">
              Have Something in Mind?
            </h2>
            <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted sm:text-lg">
              Tell us about your idea. Let&apos;s figure out how to bring it to life.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy/60">How this form works</p>
            <ol className="mt-4 space-y-3">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-[0.95rem] text-navy/85">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-xs font-semibold text-primary shadow-soft">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.12} className="mt-10 lg:mt-auto lg:pt-10">
            <DirectEmail />
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <form
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            aria-labelledby={`${uid}-form-title`}
            className="rounded-[2rem] bg-white p-6 shadow-[0_30px_60px_-40px_rgb(11_35_67/0.45)] sm:p-9"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id={`${uid}-form-title`} className="text-xl font-semibold sm:text-2xl">
                  Project inquiry
                </h3>
                <p className="mt-1.5 text-sm text-muted">Fields marked * are required.</p>
              </div>
              <span className="hidden size-12 place-items-center rounded-2xl bg-ice text-primary sm:grid">
                <Send aria-hidden="true" className="size-5" />
              </span>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Field label="Full Name *" name="name" error={errors.name}>
                {({ className, ...p }) => (
                  <input
                    {...p}
                    type="text"
                    autoComplete="name"
                    required
                    value={values.name}
                    onChange={update('name')}
                    placeholder="Your full name"
                    className={`${inputBase} ${className} h-13`}
                  />
                )}
              </Field>
              <Field label="Email Address *" name="email" error={errors.email}>
                {({ className, ...p }) => (
                  <input
                    {...p}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={values.email}
                    onChange={update('email')}
                    placeholder="you@example.com"
                    className={`${inputBase} ${className} h-13`}
                  />
                )}
              </Field>
              <Field label="Project Type *" name="projectType" error={errors.projectType}>
                {(p) => (
                  <Select
                    {...p}
                    required
                    options={projectTypes}
                    placeholder="Select a project type"
                    value={values.projectType}
                    onChange={update('projectType')}
                  />
                )}
              </Field>
              <Field label="Estimated Budget" name="budget" optional>
                {(p) => (
                  <Select
                    {...p}
                    options={budgetRanges}
                    placeholder="Select a range"
                    value={values.budget}
                    onChange={update('budget')}
                  />
                )}
              </Field>
              <div className="sm:col-span-2">
                <Field label="Expected Deadline" name="deadline" optional hint="An approximate date is fine.">
                  {({ className, ...p }) => (
                    <input
                      {...p}
                      type="date"
                      min={today}
                      value={values.deadline}
                      onChange={update('deadline')}
                      className={`${inputBase} ${className} h-13 ${values.deadline ? '' : 'text-muted/70'}`}
                    />
                  )}
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Project Description *" name="description" error={errors.description}>
                  {({ className, ...p }) => (
                    <textarea
                      {...p}
                      required
                      rows={5}
                      value={values.description}
                      onChange={update('description')}
                      placeholder="What would you like to build? Who is it for, and what should it do?"
                      className={`${inputBase} ${className} resize-y py-3.5 leading-relaxed`}
                    />
                  )}
                </Field>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xs text-xs leading-relaxed text-muted">
                This opens your email app with your details filled in. Nothing is sent or stored by this website.
              </p>
              <button
                type="submit"
                className="group inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-primary pl-7 pr-2 font-semibold text-white shadow-[0_10px_24px_-12px_rgb(0_102_230/0.7)] transition-colors duration-300 hover:bg-primary-600"
              >
                Open in Email App
                <span className="grid size-10 place-items-center rounded-full bg-white/15 transition-colors group-hover:bg-white group-hover:text-primary">
                  <MailOpen aria-hidden="true" className="size-4" />
                </span>
              </button>
            </div>

            <AnimatePresence>
              {handoff && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    ref={statusRef}
                    tabIndex={-1}
                    role="status"
                    className="mt-6 rounded-2xl border border-primary/20 bg-ice/60 p-5"
                  >
                    <p className="flex items-center gap-2 font-semibold text-navy">
                      <MailOpen aria-hidden="true" className="size-4 text-primary" />
                      Almost there — your inquiry has not been sent yet.
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Your email app should now be open with a message addressed to{' '}
                      <strong className="font-semibold text-navy">{site.email}</strong>. Please review it and press{' '}
                      <strong className="font-semibold text-navy">Send</strong> in your email app. If nothing opened, copy
                      the inquiry and email it to us manually.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      <a
                        href={handoff.mailto}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-navy px-4 text-sm font-semibold text-white hover:bg-primary"
                      >
                        <Mail aria-hidden="true" className="size-4" /> Open email app again
                      </a>
                      <button
                        type="button"
                        onClick={() => copy(fullText)}
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-navy hover:border-navy/25"
                      >
                        {copied === 'ok' ? <Check aria-hidden="true" className="size-4 text-primary" /> : <Copy aria-hidden="true" className="size-4" />}
                        {copied === 'ok' ? 'Inquiry copied' : copied === 'error' ? 'Copy failed' : 'Copy inquiry text'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </Container>
    </Panel>
  )
}
