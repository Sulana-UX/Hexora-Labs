import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1]

/** Subtle fade-up when scrolled into view. Reduced motion is handled by <MotionConfig reducedMotion="user">. */
export function Reveal({ as = 'div', delay = 0, y = 24, className = '', children, ...props }) {
  const Tag = motion[as] ?? motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, ease, delay }}
      {...props}
    >
      {children}
    </Tag>
  )
}
