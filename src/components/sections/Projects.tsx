/**
 * =============================================================================
 * Projects.tsx — featured project rows + the "more work" card grid.
 *
 * Everything is data-driven from src/data/content.tsx:
 *   PROJECTS[]  → full-width rows (meta column | content column)
 *   MORE_WORK[] → compact cards at the bottom
 *
 * A project's optional `demo` field decides what renders under its bullets:
 *   { kind: "iframe" } → live scaled site preview inside browser chrome
 *   { kind: "water" }  → the interactive water-reflection canvas
 * =============================================================================
 */

import { Reveal } from "@/components/Reveal"
import { SectionLabel, GitHubIcon } from "@/components/primitives"
import { DemoBox, IframePreview } from "@/components/DemoBox"
import { WaterReflection } from "@/components/WaterReflection"
import { StackStrip } from "@/components/StackStrip"
import { PROJECTS, MORE_WORK, type Project } from "@/data/content"

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="mx-auto max-w-5xl scroll-mt-[70px] px-6 pb-16 pt-8"
    >
      <h2 id="projects-heading" className="sr-only">
        Projects
      </h2>
      <SectionLabel aria-hidden>PROJECTS</SectionLabel>

      {/* ---- Featured projects (full rows) ----
          showDivider is false for the FIRST project so its top border doesn't
          collide with the PROJECTS label's line; every later project keeps a
          top border, which is what separates one project from the next. There
          is no bottom border, so nothing collides with the MORE WORK label. */}
      {PROJECTS.map((project, i) => (
        <Reveal key={project.title}>
          <ProjectRow project={project} showDivider={i > 0} />
        </Reveal>
      ))}

      {/* ---- More work (compact grid) ---- */}
      <SectionLabel className="mt-12">MORE WORK</SectionLabel>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
        {MORE_WORK.map((card, i) => (
          // small stagger (i % 3) so each ROW of 3 cards cascades slightly
          <Reveal key={card.title} delay={(i % 3) * 0.08}>
            <div className="h-full rounded-lg border border-hairline bg-card p-5">
              <span className="mb-2.5 block font-mono text-xs tracking-[0.04em] text-copper-deep">
                {card.tag}
              </span>
              <h4 className="mb-2 font-[family-name:var(--font-display)] text-[1.08rem] font-bold text-ink">
                {card.title}
              </h4>
              <p className="text-[0.92rem] leading-relaxed text-ink-soft">{card.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
 * ProjectRow — one featured project: meta column on the left,
 * title/bullets/tags/demo/links on the right
 * ------------------------------------------------------------------------- */
function ProjectRow({
  project,
  showDivider,
}: {
  project: Project
  showDivider: boolean
}) {
  return (
    <article
      className={`grid gap-2.5 py-8 md:grid-cols-[190px_1fr] md:gap-8${
        showDivider ? " border-t border-hairline" : ""
      }`}
    >
      {/* left meta column: dates + course context */}
      <div className="flex flex-row flex-wrap gap-3.5 font-mono text-xs tracking-[0.04em] md:flex-col md:gap-1.5">
        <span className="text-ink-faint">{project.when}</span>
        <span className="text-teal-link">{project.context}</span>
        {project.extra && <span className="text-ink-faint">{project.extra}</span>}
      </div>

      {/* right content column */}
      <div>
        <h3 className="mb-2 font-[family-name:var(--font-display)] text-[1.45rem] font-bold tracking-[-0.01em] text-ink">
          {project.title}
        </h3>

        {/* one flowing, first-person description paragraph */}
        <p
          className="mb-4 max-w-[62ch] text-[0.98rem] leading-relaxed text-ink-soft
            [&_strong]:font-semibold [&_strong]:text-ink
            [&_code]:rounded [&_code]:border [&_code]:border-hairline [&_code]:bg-copper/5
            [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.85em]"
        >
          {project.description}
        </p>

        {/* tech stack — animated logo strip (see StackStrip.tsx) */}
        <StackStrip stack={project.stack} />

        {/* optional embedded demo */}
        {project.demo?.kind === "iframe" && (
          <DemoBox url={project.demo.label} badge="LIVE PREVIEW">
            <IframePreview
              src={project.demo.url}
              title={`${project.title} site preview`}
              ctaLabel={`Open the ${project.title} project site (opens in new tab)`}
            />
          </DemoBox>
        )}
        {project.demo?.kind === "water" && (
          <DemoBox url="water_reflection.py — live in-browser port" badge="INTERACTIVE">
            <WaterReflection />
          </DemoBox>
        )}

        {/* external links (GitHub, demo videos, ...) */}
        {project.links.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-4">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-link no-underline hover:underline hover:underline-offset-2"
              >
                {link.github && <GitHubIcon />}
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
