/**
 * =============================================================================
 * About.tsx — bio paragraphs (left) + quick-facts list (right).
 * All text comes from ABOUT_PARAGRAPHS and FACTS in src/data/content.tsx.
 * =============================================================================
 */

import { Reveal } from "@/components/Reveal"
import { SectionLabel } from "@/components/primitives"
import { ABOUT_PARAGRAPHS, FACTS } from "@/data/content"

export function About() {
  return (
    <section id="about" className="mx-auto max-w-5xl scroll-mt-[70px] px-6 pb-16 pt-8">
      <SectionLabel>ABOUT</SectionLabel>

      <div className="grid gap-9 md:grid-cols-[1.4fr_1fr] md:gap-14">
        {/* left: heading + bio paragraphs */}
        <Reveal>
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-[clamp(1.7rem,3.4vw,2.3rem)] font-bold leading-[1.15] tracking-[-0.015em] text-ink">
            Hardware taught me constraints. Software taught me speed.
          </h2>
          {ABOUT_PARAGRAPHS.map((para, i) => (
            <p key={i} className="mb-4 text-ink-soft [&_strong]:font-semibold [&_strong]:text-ink">
              {para}
            </p>
          ))}
        </Reveal>

        {/* right: quick-facts definition list */}
        <Reveal delay={0.1}>
          <dl className="flex flex-col">
            {FACTS.map((fact, i) => (
              <div
                key={fact.label}
                className={
                  "flex justify-between gap-4 border-b border-hairline py-3 text-[0.95rem]" +
                  (i === 0 ? " border-t" : "")
                }
              >
                <dt className="text-ink-faint">{fact.label}</dt>
                <dd className="m-0 text-right font-medium text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
