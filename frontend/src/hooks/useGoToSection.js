import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { navigation } from '../config/site'

const sectionPath = Object.fromEntries(navigation.map((n) => [n.section, n.path]))

export function scrollToSection(id, behavior) {
  const el = document.getElementById(id)
  if (!el) return false
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (id === 'home') window.scrollTo({ top: 0, behavior: behavior ?? (reduce ? 'auto' : 'smooth') })
  else el.scrollIntoView({ behavior: behavior ?? (reduce ? 'auto' : 'smooth'), block: 'start' })
  return true
}

/**
 * Navigate to a section: updates the clean URL (e.g. /services) and scrolls.
 * Works from any route — off the home page it navigates home first.
 */
export function useGoToSection() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return useCallback(
    (section) => {
      const path = sectionPath[section] ?? `/#${section}`
      const onHome = Object.values(sectionPath).includes(pathname)
      if (onHome) {
        if (pathname !== path) navigate(path, { replace: false, state: { fromNav: true } })
        scrollToSection(section)
        // Move focus for keyboard & screen-reader users without a second jump
        const el = document.getElementById(section)
        if (el) {
          el.setAttribute('tabindex', '-1')
          el.focus({ preventScroll: true })
        }
      } else {
        navigate(path, { state: { scrollTo: section } })
      }
    },
    [navigate, pathname],
  )
}
