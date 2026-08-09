/**
 * =============================================================================
 * Skills.tsx — the toolbox, shown as a slow auto-scrolling marquee.
 *
 * Why a marquee here (and nowhere else): a skills list is pure scanning
 * content — gentle motion draws the eye without asking for interaction.
 * It pauses on hover so every chip is readable, and the Magic UI Marquee
 * component falls back gracefully under reduced motion.
 *
 * Skills come from SKILLS in src/data/content.tsx.
 * =============================================================================
 */

import { Reveal } from "@/components/Reveal"
import { SectionLabel } from "@/components/primitives"
import { Marquee } from "@/components/ui/marquee"
import { useResumeLinkProps } from "@/components/ResumeDialog"
import { SKILLS } from "@/data/content"

export function Skills() {
  const resumeLink = useResumeLinkProps()

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="mx-auto max-w-5xl scroll-mt-[70px] px-6 pb-16 pt-8"
    >
      <h2 id="skills-heading" className="sr-only">
        Skills
      </h2>
      <SectionLabel aria-hidden>SKILLS</SectionLabel>

      <Reveal>
        {/* slow scroll (40s per loop), pauses when hovered */}
        <Marquee pauseOnHover className="mb-5 [--duration:40s]">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="mx-1 rounded-md border border-hairline bg-card px-4 py-2 text-[0.95rem] font-medium text-ink"
            >
              {skill}
            </span>
          ))}
        </Marquee>

        <p className="max-w-[44em] text-[0.92rem] text-ink-faint">
          The short list. Every project above shows its exact stack, and the
          full breakdown — from MPI to soldering — is in{" "}
          <a
            {...resumeLink}
            target="_blank"
            rel="noopener"
            className="text-teal-link underline underline-offset-2"
          >
            my resume
          </a>
          .
        </p>
      </Reveal>
    </section>
  )
}
