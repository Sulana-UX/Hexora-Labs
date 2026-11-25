import { site } from '../config/site'

/**
 * Inquiry service — the single boundary between the UI and however inquiries
 * are delivered.
 *
 * Providers (set with VITE_INQUIRY_PROVIDER, default 'api'):
 *  - 'api'    : POSTs to the Hexora backend (backend/ — Vercel serverless functions) at
 *               `${VITE_API_URL}/api/inquiry`, which emails the inquiry with a
 *               PDF summary attached to hexoralabs@gmail.com via Gmail SMTP.
 *               In development VITE_API_URL can stay empty: Vite proxies /api
 *               to the local backend (see vite.config.js).
 *  - 'mailto' : opens the visitor's own email app with the details pre-filled.
 *  - 'supabase' (future): see src/lib/supabase.js.
 *
 * The form component only calls `submitInquiry` and reads its result.
 */
export const INQUIRY_PROVIDER = import.meta.env.VITE_INQUIRY_PROVIDER || 'api'
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

export const emptyInquiry = {
  name: '',
  email: '',
  projectType: '',
  budget: '',
  deadline: '',
  description: '',
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateInquiry(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please enter your full name.'
  if (!values.email.trim()) errors.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  if (!values.projectType) errors.projectType = 'Please choose a project type.'
  if (values.description.trim().length < 20)
    errors.description = 'Please describe your project in a little more detail (at least 20 characters).'
  return errors
}

function formatDeadline(value) {
  if (!value) return 'Not specified'
  const d = new Date(`${value}T00:00:00`)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function buildInquirySubject(values) {
  return `Project Inquiry: ${values.projectType || 'General'} — ${values.name.trim()}`
}

export function buildInquiryBody(values) {
  return [
    'Hello Hexora Labs,',
    '',
    'I would like to discuss a project.',
    '',
    `Full name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    `Project type: ${values.projectType || 'Not specified'}`,
    `Estimated budget: ${values.budget || 'Not specified'}`,
    `Expected deadline: ${formatDeadline(values.deadline)}`,
    '',
    'Project description:',
    values.description.trim(),
    '',
    'Thank you.',
  ].join('\r\n')
}

/** Properly encoded mailto: URL (RFC 6068 — spaces as %20, newlines as %0D%0A). */
export function buildMailtoUrl(values) {
  const subject = encodeURIComponent(buildInquirySubject(values))
  const body = encodeURIComponent(buildInquiryBody(values))
  return `mailto:${site.email}?subject=${subject}&body=${body}`
}

async function submitViaApi(values, { honeypot, elapsedMs }) {
  const res = await fetch(`${API_URL}/api/inquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: values.name.trim(),
      email: values.email.trim(),
      projectType: values.projectType,
      budget: values.budget,
      deadline: values.deadline,
      description: values.description.trim(),
      botcheck: honeypot ? true : undefined,
      elapsedMs,
    }),
  })
  let data = {}
  try {
    data = await res.json()
  } catch {
    /* non-JSON response (e.g. function not available) */
  }
  if (!res.ok || !data.success) throw new Error(data.message || `Request failed (${res.status})`)
  return data
}

/**
 * Submit an inquiry. Returns `{ status, ... }`:
 *  - `{ status: 'sent', reference? }` → delivered by the website (api / supabase)
 *  - `{ status: 'handoff', mailto }`  → email app asked to open; visitor must still press Send
 * Throws on network / service errors so the UI can offer alternatives.
 */
export async function submitInquiry(values, { honeypot = '', elapsedMs } = {}) {
  if (INQUIRY_PROVIDER === 'api') {
    const data = await submitViaApi(values, { honeypot, elapsedMs })
    return { status: 'sent', reference: data.reference }
  }
  if (INQUIRY_PROVIDER === 'supabase') {
    const { submitViaSupabase } = await import('../lib/supabase')
    await submitViaSupabase(values)
    return { status: 'sent' }
  }

  const mailto = buildMailtoUrl(values)
  window.location.href = mailto
  return { status: 'handoff', mailto }
}
