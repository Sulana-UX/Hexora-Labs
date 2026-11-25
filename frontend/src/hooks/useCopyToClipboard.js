import { useCallback, useEffect, useRef, useState } from 'react'

/** Copy text with a legacy fallback. `copied` resets after a short delay. */
export function useCopyToClipboard(resetMs = 2200) {
  const [copied, setCopied] = useState(false)
  const timer = useRef()

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(
    async (text) => {
      let ok
      try {
        await navigator.clipboard.writeText(text)
        ok = true
      } catch {
        try {
          const ta = document.createElement('textarea')
          ta.value = text
          ta.setAttribute('readonly', '')
          ta.style.position = 'fixed'
          ta.style.opacity = '0'
          document.body.appendChild(ta)
          ta.select()
          ok = document.execCommand('copy')
          document.body.removeChild(ta)
        } catch {
          ok = false
        }
      }
      setCopied(ok ? 'ok' : 'error')
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), resetMs)
      return ok
    },
    [resetMs],
  )

  return { copied, copy }
}
