/** Simple WhatsApp-style glyph (speech bubble with handset), drawn to match Lucide's stroke style. */
export function WhatsAppIcon({ className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" />
      <path d="M9.2 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .5-.1.7l-.5.6c-.1.2-.2.4 0 .6.7 1.2 1.6 2 2.8 2.6.2.1.4.1.6-.1l.6-.7c.2-.2.4-.2.6-.1l1.7.8c.2.1.4.3.3.6-.1.9-.8 1.7-1.8 1.8-3.4.3-7.1-3.4-6.8-6.8.1-.6.4-1.1.6-1.5z" />
    </svg>
  )
}
