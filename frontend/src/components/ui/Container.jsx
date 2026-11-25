export function Container({ className = '', children, ...props }) {
  return (
    <div className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 ${className}`} {...props}>
      {children}
    </div>
  )
}

/** Large rounded page container (the signature layout block). */
export function Panel({ as: Tag = 'section', className = '', children, ...props }) {
  return (
    <Tag className={`panel mx-3 sm:mx-4 lg:mx-6 ${className}`} {...props}>
      {children}
    </Tag>
  )
}
