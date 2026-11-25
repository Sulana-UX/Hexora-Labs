import { ArrowUpRight } from 'lucide-react'

const base =
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,color,box-shadow,transform] duration-300 ease-out focus-visible:outline-offset-4 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60'

const variants = {
  primary: 'bg-primary text-white shadow-[0_10px_24px_-12px_rgb(0_102_230/0.7)] hover:bg-primary-600 hover:shadow-[0_16px_30px_-14px_rgb(0_102_230/0.8)]',
  navy: 'bg-navy text-white hover:bg-navy-800 shadow-[0_10px_24px_-14px_rgb(11_35_67/0.8)]',
  light: 'bg-white text-navy hover:bg-ice shadow-soft',
  outline: 'border border-navy/15 bg-white/60 text-navy hover:border-navy/30 hover:bg-white',
  ghostDark: 'border border-white/20 text-white hover:bg-white/10',
}

const sizes = {
  sm: 'h-10 pl-4 pr-1.5 text-sm',
  md: 'h-12 pl-6 pr-2 text-[0.95rem]',
  lg: 'h-14 pl-7 pr-2 text-base',
}

/** Arrow inside a circular chip — rotates on hover. */
function ArrowChip({ variant, size }) {
  const chip =
    variant === 'primary' || variant === 'navy'
      ? 'bg-white/15 text-white group-hover:bg-white group-hover:text-primary'
      : variant === 'ghostDark'
        ? 'bg-white/10 text-white group-hover:bg-white group-hover:text-navy'
        : 'bg-navy text-white group-hover:bg-primary'
  const dim = size === 'sm' ? 'size-7' : size === 'lg' ? 'size-10' : 'size-9'
  return (
    <span
      aria-hidden="true"
      className={`ml-1 grid ${dim} place-items-center rounded-full transition-colors duration-300 ${chip}`}
    >
      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" strokeWidth={2.2} />
    </span>
  )
}

/**
 * Polymorphic button. Pass `href` for a link, otherwise renders <button>.
 * `arrow` adds the arrow chip; without it padding becomes symmetrical.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  arrow = true,
  href,
  className = '',
  children,
  ...props
}) {
  const pad = arrow ? sizes[size] : sizes[size].replace(/pr-\S+/, size === 'sm' ? 'pr-4' : size === 'lg' ? 'pr-7' : 'pr-6')
  const cls = `${base} ${variants[variant]} ${pad} ${className}`
  const content = (
    <>
      <span>{children}</span>
      {arrow && <ArrowChip variant={variant} size={size} />}
    </>
  )
  if (href)
    return (
      <a href={href} className={cls} {...props}>
        {content}
      </a>
    )
  return (
    <button type="button" className={cls} {...props}>
      {content}
    </button>
  )
}
