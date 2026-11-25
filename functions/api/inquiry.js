/**
 * POST /api/inquiry — Cloudflare Pages Function.
 *
 * Validates a project inquiry, renders a branded PDF summary and emails it
 * (with the PDF attached) to the Hexora Labs inbox through Gmail SMTP.
 *
 * Required environment variables (never commit these):
 *   GMAIL_USER          the Gmail address that sends the email
 *   GMAIL_APP_PASSWORD  a Google "App password" for that account
 *   INQUIRY_TO          where inquiries are delivered (defaults to GMAIL_USER)
 * Local: .dev.vars · Production: Cloudflare Pages → Settings → Variables and Secrets
 */
import { WorkerMailer } from 'worker-mailer'
import { buildPdf, formatDeadline } from '../../server/inquiry-pdf.js'

const LIMITS = { name: 100, email: 160, projectType: 80, budget: 80, deadline: 20, description: 5000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })

/* ------------------------------------------------------------------ helpers */

function clean(value, max) {
  return String(value ?? '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max)
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

function makeReference(now) {
  const ymd = now.toISOString().slice(2, 10).replace(/-/g, '')
  const rand = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().padStart(6, '0').slice(-4)
  return `HX-${ymd}-${rand}`
}

function toBase64(bytes) {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  return btoa(binary)
}

/* ---------------------------------------------------------------------- PDF */

/* -------------------------------------------------------------------- email */

function emailHtml(d) {
  const row = (k, v) =>
    `<tr><td style="padding:10px 14px;background:#EAF3FC;color:#4B5A6E;font:600 12px Arial,sans-serif;text-transform:uppercase;letter-spacing:.04em;width:150px;vertical-align:top">${k}</td><td style="padding:10px 14px;color:#0B2343;font:15px Arial,sans-serif;border-bottom:1px solid #DBE6F2">${escapeHtml(v)}</td></tr>`
  return `<!doctype html><html><body style="margin:0;background:#F4F7FB;padding:24px">
  <table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #DBE6F2">
    <tr><td style="background:#0B2343;padding:22px 28px;color:#fff;font:700 18px Arial,sans-serif">New project inquiry <span style="color:#00B9F1;font-weight:400;font-size:13px;margin-left:8px">${d.reference}</span></td></tr>
    <tr><td style="padding:24px 28px">
      <p style="margin:0 0 16px;color:#0B2343;font:15px Arial,sans-serif">A new inquiry was sent from the Hexora Labs website. The full details are attached as a PDF. Reply to this email to answer <strong>${escapeHtml(d.name)}</strong> directly.</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-radius:10px;overflow:hidden">
        ${row('Name', d.name)}${row('Email', d.email)}${row('Project type', d.projectType)}${row('Budget', d.budget || 'Not specified')}${row('Deadline', formatDeadline(d.deadline))}${row('Submitted', d.submittedAt)}
      </table>
      <p style="margin:22px 0 6px;color:#0066E6;font:700 12px Arial,sans-serif;letter-spacing:.08em">PROJECT DESCRIPTION</p>
      <div style="white-space:pre-wrap;color:#111827;font:15px/1.6 Arial,sans-serif;background:#F8FBFE;border:1px solid #DBE6F2;border-radius:10px;padding:14px 16px">${escapeHtml(d.description)}</div>
    </td></tr>
  </table></body></html>`
}

function emailText(d) {
  return [
    `New project inquiry (${d.reference})`,
    '',
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Project type: ${d.projectType}`,
    `Budget: ${d.budget || 'Not specified'}`,
    `Deadline: ${formatDeadline(d.deadline)}`,
    `Submitted: ${d.submittedAt}`,
    '',
    'Project description:',
    d.description,
    '',
    'The full inquiry is attached as a PDF.',
  ].join('\n')
}

/* ------------------------------------------------------------------ handler */

export async function onRequestPost({ request, env }) {
  // Same-origin only
  const origin = request.headers.get('Origin')
  if (origin && new URL(origin).host !== new URL(request.url).host) return json(403, { success: false, message: 'Forbidden' })

  if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) {
    return json(500, { success: false, message: 'Email delivery is not configured.' })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json(400, { success: false, message: 'Invalid request.' })
  }

  // Bot traps: hidden checkbox and implausibly fast submissions → pretend success
  if (body.botcheck || (typeof body.elapsedMs === 'number' && body.elapsedMs < 2500)) {
    return json(200, { success: true, reference: 'HX-OK' })
  }

  const data = {
    name: clean(body.name, LIMITS.name),
    email: clean(body.email, LIMITS.email),
    projectType: clean(body.projectType, LIMITS.projectType),
    budget: clean(body.budget, LIMITS.budget),
    deadline: clean(body.deadline, LIMITS.deadline),
    description: clean(body.description, LIMITS.description),
  }
  if (!data.name || !EMAIL_RE.test(data.email) || !data.projectType || data.description.length < 20) {
    return json(422, { success: false, message: 'Please complete all required fields.' })
  }

  const now = new Date()
  data.reference = makeReference(now)
  data.submittedAt = `${now.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Colombo',
  })} (Sri Lanka time)`

  try {
    let logoBytes = null
    try {
      const res = await fetch(new URL('/brand/logo-horizontal.png', request.url))
      if (res.ok) logoBytes = new Uint8Array(await res.arrayBuffer())
    } catch {
      /* logo is optional */
    }

    const pdfBytes = await buildPdf(data, logoBytes)
    const safeName = data.name.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'client'

    await WorkerMailer.send(
      {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        credentials: { username: env.GMAIL_USER, password: env.GMAIL_APP_PASSWORD.replace(/\s+/g, '') },
        authType: 'plain',
      },
      {
        from: { name: 'Hexora Labs Website', email: env.GMAIL_USER },
        to: env.INQUIRY_TO || env.GMAIL_USER,
        reply: { name: data.name, email: data.email },
        subject: `New Project Inquiry: ${data.projectType} — ${data.name} [${data.reference}]`,
        text: emailText(data),
        html: emailHtml(data),
        attachments: [
          { filename: `Hexora-Inquiry-${data.reference}-${safeName}.pdf`, content: toBase64(pdfBytes), type: 'application/pdf' },
        ],
      },
    )

    return json(200, { success: true, reference: data.reference })
  } catch (err) {
    console.error('Inquiry delivery failed:', err?.message || err)
    return json(502, { success: false, message: 'We could not send your inquiry right now.' })
  }
}

export function onRequest() {
  return json(405, { success: false, message: 'Method not allowed' })
}
