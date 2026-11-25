import logoHorizontal from '../../assets/brand/logo-horizontal.webp'

/** Official Hexora Labs horizontal lockup (760×172 source, transparent background). */
export function Logo({ className = 'h-9 w-auto', eager = false }) {
  return (
    <img
      src={logoHorizontal}
      alt="Hexora Labs – Software Solutions"
      width="760"
      height="172"
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
    />
  )
}
