/**
 * =============================================================================
 * Hero.tsx — the opening section: name, thesis, CTAs, and the live scan panel.
 *
 * Motion: a single entrance sequence — eyebrow → headline → thesis → CTAs
 * fade up one after another (0.1s apart) on first load. The ScanPanel's
 * canvas provides the only continuous motion, and it's the point: it makes
 * the "BLE firmware" claim feel real.
 * =============================================================================
 */

import { Reveal } from "@/components/Reveal"
import { HeroPhoto } from "@/components/HeroPhoto"
import { PulseDot } from "@/components/primitives"
import { useResumeLinkProps } from "@/components/ResumeDialog"
import { IDENTITY } from "@/data/content"

export function Hero() {
  const resumeLink = useResumeLinkProps()

  return (
    <header className="overflow-hidden border-b border-hairline">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-14 sm:py-20 md:grid-cols-[1.15fr_0.85fr] md:gap-12">
        {/* ---- Left column: text ---- */}
        <div>
          {/* eyebrow: "COMPUTER ENGINEERING · TAMU '26 · ● OPEN TO WORK" */}
          <Reveal delay={0}>
            <p className="mb-5 flex flex-wrap items-center gap-2.5 font-mono text-xs tracking-[0.04em] text-copper-deep before:h-px before:w-8 before:bg-copper before:content-['']">
              COMPUTER ENGINEERING · TEXAS A&amp;M '26 ·{" "}
              <span className="flex items-center gap-2 whitespace-nowrap">
                <PulseDot /> OPEN TO WORK
              </span>
            </p>
          </Reveal>

          {/* headline: name on two lines with a teal period */}
          <Reveal delay={0.1}>
            <h1 className="mb-6 font-[family-name:var(--font-display)] text-[clamp(2.6rem,6vw,4.2rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink">
              {IDENTITY.firstLine}
              <br />
              {IDENTITY.secondLine}
              <span className="text-copper">.</span>
            </h1>
          </Reveal>

          {/* the one-sentence thesis */}
          <Reveal delay={0.2}>
            <p className="mb-8 max-w-[34em] text-lg text-ink-soft">
              I build products end to end —{" "}
              <strong className="font-semibold text-ink">
                from BLE firmware and soldered circuits to React Native apps
                and cloud backends.
              </strong>{" "}
              Most engineers pick one side of the stack. I ship both.
            </p>
          </Reveal>

          {/* call-to-action buttons */}
          <Reveal delay={0.3}>
            <div className="flex flex-wrap gap-3.5">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-[0.95rem] font-semibold text-white no-underline transition-all hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(20,28,36,0.25)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                See my work
              </a>
              <a
                {...resumeLink}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-md border border-ink px-5 py-3 text-[0.95rem] font-semibold text-ink no-underline transition-colors hover:border-copper hover:text-copper"
              >
                View resume
              </a>
            </div>
          </Reveal>
        </div>

        {/* ---- Right column: framed headshot ---- */}
        <Reveal delay={0.25}>
          <HeroPhoto />
        </Reveal>
      </div>
    </header>
  )
}
