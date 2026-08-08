/**
 * =============================================================================
 * Experience.tsx — work/research experience rows.
 * Data comes from EXPERIENCE in src/data/content.tsx — add new roles there.
 * =============================================================================
 */

import { Reveal } from "@/components/Reveal"
import { SectionLabel } from "@/components/primitives"
import { EXPERIENCE } from "@/data/content"

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="mx-auto max-w-5xl scroll-mt-[70px] px-6 pb-16 pt-8"
    >
      <h2 id="experience-heading" className="sr-only">
        Experience
      </h2>
      <SectionLabel aria-hidden>EXPERIENCE</SectionLabel>

      {/* Divider only ABOVE the 2nd+ role (i > 0), so it separates roles
          without adding a redundant line against the EXPERIENCE / SKILLS
          section-label rules. Same approach as the Projects section. */}
      {EXPERIENCE.map((role, i) => (
        <Reveal key={role.title}>
          <article
            className={`grid gap-2.5 py-7 md:grid-cols-[190px_1fr] md:gap-8${
              i > 0 ? " border-t border-hairline" : ""
            }`}
          >
            {/* date column */}
            <span className="font-mono text-xs tracking-[0.04em] text-ink-faint">
              {role.when}
            </span>
            {/* role details */}
            <div>
              <h3 className="mb-0.5 text-[1.15rem] font-semibold text-ink">{role.title}</h3>
              <p className="mb-2.5 text-[0.95rem] font-medium text-teal-link">{role.org}</p>
              <p className="text-[0.98rem] text-ink-soft">{role.body}</p>
            </div>
          </article>
        </Reveal>
      ))}
    </section>
  )
}
