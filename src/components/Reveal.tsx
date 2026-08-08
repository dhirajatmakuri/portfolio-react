/**
 * =============================================================================
 * Reveal.tsx — the ONE scroll-reveal animation used across the whole site.
 *
 * Motion philosophy: effective, not flashy. Content fades in and rises 14px
 * the first time it scrolls into view — the same effect the original HTML
 * site had — implemented with the `motion` library.
 *
 * Usage:
 *   <Reveal>...content...</Reveal>
 *   <Reveal delay={0.15}>...staggered content...</Reveal>
 *
 * Accessibility: if the visitor has "reduce motion" turned on in their OS,
 * we skip the animation entirely and just show the content.
 * =============================================================================
 */

import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

interface RevealProps {
  children: ReactNode
  /** Seconds to wait before animating — use for staggering siblings */
  delay?: number
  className?: string
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  // Respect the OS-level "prefers reduced motion" setting
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    // No animation at all — content is simply visible
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      // Start slightly lower and transparent...
      initial={{ opacity: 0, y: 14 }}
      // ...animate to natural position when scrolled into view...
      whileInView={{ opacity: 1, y: 0 }}
      // ...only once (don't re-animate when scrolling back up),
      // and start when ~12% of the element is visible.
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  )
}
