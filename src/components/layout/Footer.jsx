import { Link } from 'react-router-dom'
import { ArrowUp, ExternalLink, Mail, Phone } from 'lucide-react'
import { navigation, site } from '../../config/site'
import { services } from '../../data/content'
import { useGoToSection } from '../../hooks/useGoToSection'
import { useInquiry } from '../../context/InquiryContext'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'

const linkCls = 'text-[0.95rem] text-navy/80 transition-colors hover:text-primary'
const headCls = 'font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy/55'

export function Footer() {
  const go = useGoToSection()
  const { presetProjectType } = useInquiry()
  const year = new Date().getFullYear()
  const socials = site.socials.filter((s) => s.url)

  const nav = (section, projectType) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return
    e.preventDefault()
    if (projectType) presetProjectType(projectType)
    go(section)
  }

  return (
    <footer className="mt-16 border-t border-line bg-white sm:mt-20">
      <Container className="pt-16 sm:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.15fr] lg:gap-10">
          <div className="max-w-sm">
            <Logo className="h-10 w-auto" />
            <p className="mt-6 text-pretty text-[0.95rem] leading-relaxed text-muted">
              Hexora Labs is a software development startup building affordable, modern digital solutions for
              students, startups, individuals and small businesses.
            </p>
            {socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social media">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-sm font-medium text-navy hover:border-navy/30"
                    >
                      {s.label} <ExternalLink aria-hidden="true" className="size-3.5" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-labelledby="footer-nav-title">
            <h2 id="footer-nav-title" className={headCls}>
              Navigate
            </h2>
            <ul className="mt-5 space-y-3">
              {navigation.map((n) => (
                <li key={n.section}>
                  <a href={n.path} onClick={nav(n.section)} className={linkCls}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={headCls}>Services</h2>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.id}>
                  <a href="/contact" onClick={nav('contact', s.projectType)} className={linkCls}>
                    {s.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="/student-hub" onClick={nav('student-hub')} className={linkCls}>
                  University Project Mentoring
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={headCls}>Get in touch</h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-5 inline-flex items-center gap-2 break-all font-display text-lg font-semibold text-navy transition-colors hover:text-primary"
            >
              <Mail aria-hidden="true" className="size-4 shrink-0 text-primary" />
              {site.email}
            </a>
            {site.phone && (
              <a
                href={site.phone.href}
                className="mt-3 flex items-center gap-2 font-display text-lg font-semibold text-navy transition-colors hover:text-primary"
              >
                <Phone aria-hidden="true" className="size-4 shrink-0 text-primary" />
                {site.phone.display}
              </a>
            )}
            {site.whatsapp && (
              <a
                href={site.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center gap-2 text-[0.95rem] font-semibold text-[#0b6b34] transition-colors hover:text-[#25a244]"
              >
                <WhatsAppIcon className="size-4 shrink-0" />
                Chat on WhatsApp
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}

            <div className="mt-8 rounded-2xl bg-ice/70 p-5">
              <h3 className="font-sans text-sm font-semibold text-navy">Your privacy</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                This website does not collect or store inquiry details. The contact form only prepares an email in your
                own email app — we receive your information only if you choose to send it, and use it solely to respond.
              </p>
              <Link to="/privacy" className="mt-3 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline">
                Read the privacy notice
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-4 border-t border-line py-8 text-sm text-muted sm:flex-row sm:items-center">
          <p>
            © {year} {site.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-navy">
              Privacy
            </Link>
            <button type="button" onClick={() => go('home')} className="group inline-flex items-center gap-2 font-medium text-navy">
              Back to top
              <span className="grid size-8 place-items-center rounded-full bg-ice transition-colors group-hover:bg-navy group-hover:text-white">
                <ArrowUp aria-hidden="true" className="size-4" />
              </span>
            </button>
          </div>
        </div>
      </Container>
    </footer>
  )
}
