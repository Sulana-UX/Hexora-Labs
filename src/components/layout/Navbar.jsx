import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { navigation, site } from '../../config/site'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useGoToSection } from '../../hooks/useGoToSection'
import { useLocation } from 'react-router-dom'
import { Logo } from '../ui/Logo'

const sectionIds = navigation.map((n) => n.section)

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const onHome = navigation.some((n) => n.path === pathname)
  const activeOnHome = useActiveSection(sectionIds)
  const active = onHome ? activeOnHome : null
  const go = useGoToSection()
  const toggleRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mobile menu: lock scroll, close on Escape, focus first link, close on desktop resize
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const mq = window.matchMedia('(min-width: 1024px)')
    const onMq = (e) => e.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    requestAnimationFrame(() => panelRef.current?.querySelector('a')?.focus())
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [open])

  const handleNav = (e, section) => {
    // allow new-tab / modified clicks to behave natively
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return
    e.preventDefault()
    setOpen(false)
    // wait for the menu to start closing so scroll lock is released
    requestAnimationFrame(() => go(section))
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4 lg:px-6">
      <nav
        aria-label="Primary"
        className={`relative mx-auto flex h-16 max-w-[1240px] items-center justify-between rounded-full border bg-white/95 pl-5 pr-2 backdrop-blur-md transition-[box-shadow,border-color] duration-300 sm:h-[4.25rem] sm:pl-6 ${
          scrolled || open
            ? 'border-line shadow-[0_12px_32px_-16px_rgb(11_35_67/0.28)]'
            : 'border-white/0 shadow-[0_6px_24px_-18px_rgb(11_35_67/0.25)]'
        }`}
      >
        <a
          href="/"
          onClick={(e) => handleNav(e, 'home')}
          className="shrink-0 rounded-lg"
          aria-label="Hexora Labs – go to homepage"
        >
          <Logo eager className="h-8 w-auto sm:h-9" />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => {
            const isActive = active === item.section
            return (
              <li key={item.section}>
                <a
                  href={item.path}
                  onClick={(e) => handleNav(e, item.section)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`relative block rounded-full px-4 py-2 text-[0.9rem] font-medium transition-colors duration-200 ${
                    isActive ? 'text-navy' : 'text-muted hover:text-navy'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-ice"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="/contact"
            onClick={(e) => handleNav(e, 'contact')}
            className="group hidden h-12 items-center gap-2 rounded-full bg-navy pl-5 pr-1.5 text-[0.9rem] font-semibold text-white transition-colors duration-300 hover:bg-primary sm:inline-flex"
          >
            Let&apos;s Talk
            <span className="grid size-9 place-items-center rounded-full bg-white/12 transition-colors duration-300 group-hover:bg-white group-hover:text-primary">
              <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid size-12 place-items-center rounded-full bg-ice text-navy transition-colors hover:bg-ice-200 lg:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'x' : 'm'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 -z-10 bg-navy/25 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="panel"
              id="mobile-menu"
              ref={panelRef}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-2 max-w-[1240px] origin-top overflow-hidden rounded-[1.75rem] border border-line bg-white p-3 shadow-lift lg:hidden"
            >
              <ul className="flex flex-col">
                {navigation.map((item, i) => (
                  <motion.li
                    key={item.section}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.25 }}
                  >
                    <a
                      href={item.path}
                      onClick={(e) => handleNav(e, item.section)}
                      aria-current={active === item.section ? 'location' : undefined}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-lg font-medium transition-colors ${
                        active === item.section ? 'bg-ice text-navy' : 'text-navy/80 hover:bg-ice/60'
                      }`}
                    >
                      {item.label}
                      <span className="font-sans text-xs font-medium text-muted/70">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-2 rounded-2xl bg-navy p-4 text-white">
                <p className="text-sm text-white/70">Have a project in mind?</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <a href={`mailto:${site.email}`} className="text-sm font-semibold underline-offset-4 hover:underline">
                    {site.email}
                  </a>
                  <a
                    href="/contact"
                    onClick={(e) => handleNav(e, 'contact')}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-navy"
                  >
                    Let&apos;s Talk <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
