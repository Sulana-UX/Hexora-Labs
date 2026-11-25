import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const InquiryContext = createContext(null)

/**
 * Lets any "Enquire" button pre-select a project type in the contact form
 * before scrolling to it.
 */
export function InquiryProvider({ children }) {
  const [preset, setPreset] = useState({ projectType: '', nonce: 0 })

  const presetProjectType = useCallback((projectType) => {
    setPreset((p) => ({ projectType, nonce: p.nonce + 1 }))
  }, [])

  const value = useMemo(() => ({ preset, presetProjectType }), [preset, presetProjectType])
  return <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInquiry() {
  const ctx = useContext(InquiryContext)
  if (!ctx) throw new Error('useInquiry must be used within InquiryProvider')
  return ctx
}
