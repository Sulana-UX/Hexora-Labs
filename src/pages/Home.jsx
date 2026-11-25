import { lazy, Suspense, useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { navigation, sectionMeta } from '../config/site'
import { scrollToSection } from '../hooks/useGoToSection'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { Hero } from '../components/sections/Hero'
import { Services } from '../components/sections/Services'
import { StudentHub } from '../components/sections/StudentHub'
import { Portfolio } from '../components/sections/Portfolio'
import { Process } from '../components/sections/Process'
import { About } from '../components/sections/About'
import { Contact } from '../components/sections/Contact'

const NotFound = lazy(() => import('./NotFound'))

const sectionByPath = Object.fromEntries(navigation.map((n) => [n.path, n.section]))
sectionByPath['/process'] = 'process'

/**
 * One-page home. Clean section URLs (/services, /work, ...) render this page
 * and scroll to the matching section on direct visits and back/forward.
 */
export default function Home() {
  const { pathname, hash, state } = useLocation()
  const navType = useNavigationType()
  const cleanPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const section = sectionByPath[cleanPath]
  const first = useRef(true)

  useDocumentTitle(sectionMeta[section ?? 'home']?.title)

  useEffect(() => {
    if (!section) return
    // In-page clicks already scrolled; only handle direct loads / back-forward.
    if (state?.fromNav && navType !== 'POP') return
    const target = state?.scrollTo ?? (hash ? hash.slice(1) : section)
    const behavior = first.current ? 'auto' : undefined
    first.current = false
    if (target === 'home') {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }
    // wait a frame so layout settles
    const raf = requestAnimationFrame(() => scrollToSection(target, behavior))
    return () => cancelAnimationFrame(raf)
  }, [section, hash, state, navType])

  if (!section)
    return (
      <Suspense fallback={<div className="min-h-screen" />}>
        <NotFound />
      </Suspense>
    )

  return (
    <>
      <Hero />
      <Services />
      <StudentHub />
      <Portfolio />
      <Process />
      <About />
      <Contact />
    </>
  )
}
