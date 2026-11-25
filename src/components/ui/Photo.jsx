import { useState } from 'react'

/**
 * Responsive, lazy-loaded photo with a soft placeholder and a gentle zoom on
 * hover of the nearest `.group`. `sizes` should describe the rendered width.
 */
export function Photo({ photo, sizes = '100vw', className = '', imgClassName = '', eager = false, decorative = false }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`relative overflow-hidden bg-ice-200 ${className}`}>
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={decorative ? '' : photo.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.03] ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  )
}
