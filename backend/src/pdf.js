/**
 * Branded PDF summary for project inquiries (used by functions/api/inquiry.js).
 * Pure JavaScript (pdf-lib) — runs in Node.js (Vercel functions and local dev).
 */
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export const BRAND = {
  name: 'Hexora Labs – Software Solutions',
  email: 'hexoralabs@gmail.com',
  phone: '072 357 7663',
}
const NAVY = rgb(11 / 255, 35 / 255, 67 / 255)
const BLUE = rgb(0, 102 / 255, 230 / 255)
const ICE = rgb(234 / 255, 243 / 255, 252 / 255)
const MUTED = rgb(75 / 255, 90 / 255, 110 / 255)
const LINE = rgb(219 / 255, 230 / 255, 242 / 255)

/** Standard PDF fonts only cover Latin-1; map common symbols and replace the rest. */
const cc = (...codes) => String.fromCharCode(...codes)
const charClass = (...codes) => new RegExp(`[${cc(...codes)}]`, 'g')
const PDF_MAP = [
  [charClass(0x2018, 0x2019, 0x201a, 0x2032), "'"],
  [charClass(0x201c, 0x201d, 0x201e, 0x2033), '"'],
  [charClass(0x2013, 0x2014, 0x2212), '-'],
  [charClass(0x2026), '...'],
  [charClass(0x2022, 0xb7), '-'],
  [charClass(0xa0), ' '],
]
// Anything outside printable ASCII + Latin-1 (and newline) becomes '?'
const NON_LATIN1 = new RegExp(`[^${cc(10)}${cc(0x20)}-${cc(0x7e)}${cc(0xa1)}-${cc(0xff)}]`, 'g')

const HAS_NON_LATIN1 = new RegExp(NON_LATIN1.source)

export function pdfSafe(s) {
  let out = s.replace(/\r\n?/g, '\n')
  for (const [re, rep] of PDF_MAP) out = out.replace(re, rep)
  return out.replace(NON_LATIN1, '?')
}

export function formatDeadline(value) {
  if (!value) return 'Not specified'
  const d = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

function wrap(text, font, size, maxWidth) {
  const lines = []
  for (const para of text.split('\n')) {
    if (!para.trim()) {
      lines.push('')
      continue
    }
    let line = ''
    for (const word of para.split(/\s+/)) {
      const tryLine = line ? `${line} ${word}` : word
      if (font.widthOfTextAtSize(tryLine, size) <= maxWidth) {
        line = tryLine
        continue
      }
      if (line) lines.push(line)
      // break very long words
      let w = word
      while (font.widthOfTextAtSize(w, size) > maxWidth) {
        let cut = w.length
        while (cut > 1 && font.widthOfTextAtSize(w.slice(0, cut), size) > maxWidth) cut--
        lines.push(w.slice(0, cut))
        w = w.slice(cut)
      }
      line = w
    }
    lines.push(line)
  }
  return lines
}

export async function buildPdf(data, logoBytes) {
  const pdf = await PDFDocument.create()
  pdf.setTitle(`Project Inquiry ${data.reference}`)
  pdf.setAuthor(BRAND.name)
  pdf.setSubject(`Project inquiry from ${data.name}`)
  pdf.setCreator('hexoralabs website')

  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const logo = logoBytes ? await pdf.embedPng(logoBytes).catch(() => null) : null

  const W = 595.28
  const H = 841.89
  const M = 50
  const contentW = W - M * 2
  const pages = []
  let page
  let y

  const newPage = () => {
    page = pdf.addPage([W, H])
    pages.push(page)
    page.drawRectangle({ x: 0, y: H - 6, width: W, height: 6, color: BLUE })
    y = H - M
  }
  const ensure = (needed) => {
    if (y - needed < M + 30) {
      newPage()
      y -= 10
    }
  }

  newPage()

  // Header: logo + document label
  if (logo) {
    const lw = 170
    const lh = (logo.height / logo.width) * lw
    page.drawImage(logo, { x: M, y: y - lh, width: lw, height: lh })
  } else {
    page.drawText('Hexora Labs', { x: M, y: y - 24, size: 22, font: bold, color: NAVY })
  }
  const label = 'PROJECT INQUIRY'
  page.drawText(label, { x: W - M - bold.widthOfTextAtSize(label, 10), y: y - 12, size: 10, font: bold, color: BLUE })
  const ref = data.reference
  page.drawText(ref, { x: W - M - regular.widthOfTextAtSize(ref, 10), y: y - 27, size: 10, font: regular, color: MUTED })
  const when = pdfSafe(data.submittedAt)
  page.drawText(when, { x: W - M - regular.widthOfTextAtSize(when, 9), y: y - 40, size: 9, font: regular, color: MUTED })
  y -= 64
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 1, color: LINE })
  y -= 34

  // Title
  for (const line of wrap(pdfSafe(data.projectType), bold, 20, contentW)) {
    page.drawText(line, { x: M, y, size: 20, font: bold, color: NAVY })
    y -= 26
  }
  page.drawText(pdfSafe(`Submitted by ${data.name}`), { x: M, y: y + 4, size: 11, font: regular, color: MUTED })
  y -= 30

  // Details table
  const rows = [
    ['Full name', data.name],
    ['Email address', data.email],
    ['Project type', data.projectType],
    ['Estimated budget', data.budget || 'Not specified'],
    ['Expected deadline', formatDeadline(data.deadline)],
    ['Submitted', data.submittedAt],
    ['Reference', data.reference],
  ]
  const labelW = 140
  rows.forEach(([k, v], i) => {
    const lines = wrap(pdfSafe(v), regular, 10.5, contentW - labelW - 24)
    const rowH = Math.max(28, lines.length * 14 + 14)
    ensure(rowH)
    if (i % 2 === 0) page.drawRectangle({ x: M, y: y - rowH + 8, width: contentW, height: rowH, color: ICE })
    page.drawText(k.toUpperCase(), { x: M + 12, y: y - 9, size: 8, font: bold, color: MUTED })
    lines.forEach((ln, j) => page.drawText(ln, { x: M + labelW, y: y - 10 - j * 14, size: 10.5, font: regular, color: NAVY }))
    y -= rowH
  })
  y -= 26

  // Description
  ensure(60)
  page.drawText('PROJECT DESCRIPTION', { x: M, y, size: 9, font: bold, color: BLUE })
  y -= 8
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.75, color: LINE })
  y -= 20
  if (HAS_NON_LATIN1.test(data.description) || HAS_NON_LATIN1.test(data.name)) {
    const note = 'Note: some characters (for example Sinhala or Tamil) cannot be shown in this PDF and appear as "?". The original text is in the email.'
    for (const line of wrap(note, regular, 9, contentW)) {
      page.drawText(line, { x: M, y, size: 9, font: regular, color: MUTED })
      y -= 12
    }
    y -= 8
  }
  for (const line of wrap(pdfSafe(data.description), regular, 11, contentW)) {
    ensure(16)
    if (line) page.drawText(line, { x: M, y, size: 11, font: regular, color: NAVY })
    y -= 16
  }

  // Footer on every page
  pages.forEach((p, i) => {
    p.drawLine({ start: { x: M, y: 42 }, end: { x: W - M, y: 42 }, thickness: 0.5, color: LINE })
    p.drawText(pdfSafe(`${BRAND.name}  ·  ${BRAND.email}  ·  ${BRAND.phone}`), { x: M, y: 28, size: 8, font: regular, color: MUTED })
    const pg = `Page ${i + 1} of ${pages.length}`
    p.drawText(pg, { x: W - M - regular.widthOfTextAtSize(pg, 8), y: 28, size: 8, font: regular, color: MUTED })
  })

  return pdf.save()
}
