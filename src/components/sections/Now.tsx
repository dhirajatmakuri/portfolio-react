/**
 * =============================================================================
 * Now.tsx — "what I'm doing right now": job-hunt status, current build,
 * current learning — plus the "ask-rishi" AI-agent placeholder card.
 *
 * Data comes from NOW_ITEMS and AGENT_SUGGESTIONS in src/data/content.tsx.
 * =============================================================================
 */

import { Reveal } from "@/components/Reveal"
import { SectionLabel, PulseDot } from "@/components/primitives"
import { NOW_ITEMS, AGENT_SUGGESTIONS, IDENTITY } from "@/data/content"

export function Now() {
  return (
    <section id="now" className="mx-auto max-w-5xl scroll-mt-[70px] px-6 pb-16 pt-8">
      <SectionLabel>NOW</SectionLabel>

      <div className="grid items-start gap-9 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
        {/* ---- Left: status heading + the three "now" rows ---- */}
        <Reveal>
          <h2 className="mb-1 flex items-center gap-3 font-[family-name:var(--font-display)] text-[clamp(1.7rem,3.4vw,2.3rem)] font-bold tracking-[-0.015em] text-ink">
            <PulseDot className="h-2 w-2" />
            Actively job hunting.
          </h2>
          <p className="mb-6 text-ink-soft">
            Class of May 2026 — here's what I'm working on right now.
          </p>

          {NOW_ITEMS.map((item, i) => (
            <div
              key={item.tag}
              className={
                "grid grid-cols-[90px_1fr] gap-4 border-b border-hairline py-4 sm:grid-cols-[110px_1fr]" +
                (i === 0 ? " border-t" : "")
              }
            >
              <span className="pt-0.5 font-mono text-xs tracking-[0.04em] text-copper-deep">
                {item.tag}
              </span>
              <div>
                <h3 className="mb-1 text-[1.05rem] font-semibold text-ink">{item.title}</h3>
                <p className="text-[0.95rem] text-ink-soft">{item.body}</p>
              </div>
            </div>
          ))}
        </Reveal>

        {/* ---- Right: "ask-rishi" AI agent placeholder (dark card) ---- */}
        <Reveal delay={0.1}>
          <div
            aria-label="AI agent placeholder — coming soon"
            className="rounded-[10px] bg-ink-panel p-[22px] text-[#C9D2CE] shadow-[0_14px_36px_rgba(16,22,29,0.22)]"
          >
            {/* card header: name + COMING SOON badge */}
            <div className="mb-4 flex items-center justify-between font-mono text-xs tracking-[0.04em] text-[#8A9590]">
              <span>ask-rishi — ai agent</span>
              <span className="rounded border border-teal-bright/45 px-2 py-0.5 text-[0.66rem] tracking-[0.09em] text-teal-bright">
                COMING SOON
              </span>
            </div>

            <p className="mb-3.5 text-[0.92rem] text-[#97A39E]">
              An AI agent trained on my projects and experience will live here —
              ask it anything about my work, 24/7. Until it ships, the fastest
              way to reach me is{" "}
              <a href={`mailto:${IDENTITY.email}`} className="text-teal-bright underline underline-offset-2">
                email
              </a>
              .
            </p>

            {/* example questions */}
            <div className="mb-4 flex flex-col gap-2" aria-hidden="true">
              {AGENT_SUGGESTIONS.map((q) => (
                <span
                  key={q}
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-[0.85rem]"
                >
                  {q}
                </span>
              ))}
            </div>

            {/* fake input line with a blinking prompt caret */}
            <div
              aria-hidden="true"
              className="flex items-center gap-2.5 rounded-md border border-dashed border-white/20 bg-white/[0.04] px-3.5 py-2.5 font-mono text-[0.8rem] text-[#97A39E]"
            >
              <span className="text-copper motion-safe:animate-[pulse_1.2s_step-end_infinite]">&gt;</span>
              <span>ask me anything about my work…</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
