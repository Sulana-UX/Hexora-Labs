import { site } from '../config/site'

/**
 * Inquiry service — the single boundary between the UI and however inquiries
 * are delivered.
 *
 * Today: builds a mailto: link that opens the visitor's own email app with the
 * details pre-filled. Nothing is sent or stored by this website.
 *
 * Future (Supabase): implement `submitViaSupabase` (see src/lib/supabase.js)
 * and switch INQUIRY_PROVIDER. The form component only calls `submitInquiry`
 * and reads its result, so no UI changes are required.
 */
export const INQUIRY_PROVIDER = 'mailto' // 'mailto' | 'supabase'

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

/**
 * Submit an inquiry. Returns `{ status, ... }`:
 *  - `{ status: 'handoff', mailto }` → the email app was asked to open; the
 *     visitor still has to press Send. Never treat this as "delivered".
 *  - `{ status: 'sent' }` → (future) stored server-side.
 */
export async function submitInquiry(values) {
  if (INQUIRY_PROVIDER === 'supabase') {
    const { submitViaSupabase } = await import('../lib/supabase')
    await submitViaSupabase(values)
    return { status: 'sent' }
  }

  const mailto = buildMailtoUrl(values)
  window.location.href = mailto
  return { status: 'handoff', mailto }
}
