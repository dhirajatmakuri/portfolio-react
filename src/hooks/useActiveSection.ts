/**
 * =============================================================================
 * useActiveSection — a scroll-spy hook.
 *
 * Returns the id of the section the reader is currently "in", which the Nav
 * uses to highlight the matching link.
 *
 * How it decides: the active section is the LAST one whose top edge has passed
 * a threshold line sitting just below the sticky nav. That line is derived from
 * the same `scroll-mt-[70px]` the sections carry, which is where an anchor click
 * parks them — so clicking a link always highlights the link you clicked.
 *
 * This replaces an earlier IntersectionObserver that watched a thin band 45–50%
 * down the viewport. That band could never be reached by a section shorter than
 * ~half the viewport: clicking "Skills" (269px tall) left the band sitting over
 * Contact, so the highlight jumped to Contact the moment you clicked. Any
 * section shorter than the band's offset was unselectable.
 *
 * `ids` must be a STABLE array reference (define it at module scope, not inline
 * in render) so the listeners aren't torn down and rebuilt on every render.
 * =============================================================================
 */

import { useEffect, useState } from "react"

export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState("")

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
      // guard against NAV_LINKS drifting out of document order
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
    if (els.length === 0) return

    let frame = 0

    function compute() {
      frame = 0

      // Threshold line: just under the sticky bar, measured live so it stays
      // correct when the bar changes height (mobile vs desktop).
      //
      // Measure the BAR ROW, not <nav> itself: on mobile the open menu panel is
      // a child of <nav>, so the element grows from ~61px to ~400px while open.
      // Measuring <nav> would push this line most of the way down the screen and
      // hand the highlight to whichever section happened to be under it.
      const bar = document.querySelector("nav")?.firstElementChild
      const barH = bar ? bar.getBoundingClientRect().height : 0

      // The line must sit at or below where an anchor click parks a section,
      // otherwise the section you just clicked lands *under* the line and the
      // previous one stays highlighted. Read the landing position straight off
      // the element's scroll-margin-top rather than assuming it matches the bar
      // height — they were 2px apart on mobile and 3px apart on desktop, so
      // every breakpoint was a coin flip.
      const landing = parseFloat(getComputedStyle(els[0]).scrollMarginTop) || 0
      const line = Math.max(barH + 8, landing + 4)

      // At the very bottom the last section may be too short to push its top
      // above the line — the page simply can't scroll any further. Give it to
      // the last section so "Contact" highlights when you reach the end.
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
      if (atBottom) {
        setActive(els[els.length - 1].id)
        return
      }

      // Walk down; the last section whose top has crossed the line wins.
      // Above the first section (i.e. in the hero) nothing is active.
      let current = ""
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id
        else break
      }
      setActive(current)
    }

    // rAF-throttled: scroll fires far more often than we need to recompute
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ids])

  return active
}
