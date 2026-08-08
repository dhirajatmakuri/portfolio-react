/**
 * =============================================================================
 * DemoBox.tsx — the fake "browser window" that wraps live project demos.
 *
 * Two exports:
 *   <DemoBox>       the outer chrome (dots, URL pill, LIVE badge) — wraps
 *                   any children (an iframe preview OR the water demo)
 *   <IframePreview> a real <iframe> of an external site, rendered at
 *                   1280px wide and scaled down to fit the card, with a
 *                   hover overlay linking to the full site
 * =============================================================================
 */

import { useEffect, useRef } from "react"

/* ---------------------------------------------------------------------------
 * DemoBox — outer shell with the browser-style header bar
 * ------------------------------------------------------------------------- */
export function DemoBox({
  url,           // text shown in the fake URL pill
  badge,         // e.g. "LIVE PREVIEW" or "INTERACTIVE"
  children,
}: {
  url: string
  badge: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-5 max-w-[660px] overflow-hidden rounded-[10px] border border-hairline bg-ink-panel shadow-[0_14px_36px_rgba(16,22,29,0.18)]">
      {/* header bar: traffic-light dots + URL pill + badge */}
      <div
        className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-3.5 py-2"
        aria-hidden="true"
      >
        <span className="flex gap-[5px]">
          <i className="h-2 w-2 rounded-full bg-white/20" />
          <i className="h-2 w-2 rounded-full bg-white/20" />
          <i className="h-2 w-2 rounded-full bg-white/20" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-full bg-white/[0.06] px-3 py-1 font-mono text-[0.7rem] text-[#97A39E]">
          {url}
        </span>
        <span className="font-mono text-[0.66rem] tracking-[0.08em] text-teal-bright">
          {badge}
        </span>
      </div>
      {children}
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * IframePreview — scaled-down live preview of an external site
 * ------------------------------------------------------------------------- */
export function IframePreview({
  src,
  title,
  ctaLabel,
}: {
  src: string
  title: string
  ctaLabel: string
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)

  /* The iframe renders the site at desktop width (1280px) and we scale it
     down with a CSS transform so the whole page fits the card. Re-computed
     on resize so it stays correct at every screen size. */
  useEffect(() => {
    const vp = viewportRef.current
    const frame = frameRef.current
    if (!vp || !frame) return

    function size() {
      const s = vp!.clientWidth / 1280
      frame!.style.transform = `scale(${s})`
      frame!.style.height = `${Math.ceil(vp!.clientHeight / s)}px`
    }
    size()

    // ResizeObserver > window resize: also fires when the card itself
    // changes width (e.g. sidebar layout shifts)
    const ro = new ResizeObserver(size)
    ro.observe(vp)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={viewportRef} className="relative h-[250px] overflow-hidden bg-ink-panel sm:h-[330px]">
      {/* the actual site, non-interactive (clicks go to the overlay link) */}
      <iframe
        ref={frameRef}
        src={src}
        title={title}
        loading="lazy"
        tabIndex={-1}
        aria-hidden="true"
        scrolling="no"
        className="pointer-events-none absolute left-0 top-0 w-[1280px] origin-top-left border-0"
      />
      {/* full-card link with a hover gradient + CTA pill */}
      <a
        href={src}
        target="_blank"
        rel="noopener"
        aria-label={ctaLabel}
        className="group absolute inset-0 block"
      >
        {/* bottom gradient appears on hover */}
        <span className="absolute inset-0 bg-gradient-to-b from-transparent from-55% to-[rgba(16,22,29,0.6)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
        {/* CTA pill slides up on hover */}
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-2 whitespace-nowrap rounded-md bg-background px-4 py-2.5 text-sm font-semibold text-foreground opacity-0 shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          Open the full project site ↗
        </span>
      </a>
    </div>
  )
}
