/**
 * =============================================================================
 * useActiveSection — a scroll-spy hook.
 *
 * Watches the given section ids and returns the id of the one currently in the
 * "reading zone": a thin horizontal band ~45–50% down the viewport. As you
 * scroll, whichever section crosses that band becomes active. The Nav uses the
 * result to highlight the matching link.
 *
 * `ids` must be a STABLE array reference (define it at module scope, not inline
 * in render) so the observer isn't torn down and rebuilt on every render.
 * =============================================================================
 */

import { useEffect, useState } from "react"

export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState("")

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // A section entering the band (from either scroll direction) becomes
        // active. We never clear on exit, so the last one stays highlighted
        // in the small gaps between sections.
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
