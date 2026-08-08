/**
 * =============================================================================
 * primitives.tsx — tiny shared UI pieces used by multiple sections:
 *
 *   <SectionLabel>   the "ABOUT ————" mono label with a hairline rule
 *   <TraceDivider>   the PCB-trace SVG divider between hero and content
 *   <GitHubIcon>     the GitHub mark (inline SVG, inherits text color)
 *   <PulseDot>       the small pulsing status dot (● open to work / live)
 * =============================================================================
 */

import { cn } from "@/lib/utils"

/* ---------------------------------------------------------------------------
 * SectionLabel — "PROJECTS ————————" style label above every section
 * ------------------------------------------------------------------------- */
export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        // mono uppercase label + a 1px line that stretches to fill the row
        "mb-8 flex items-center gap-3 font-mono text-sm tracking-[0.08em] text-copper-deep",
        "after:h-px after:flex-1 after:bg-hairline after:content-['']",
        className
      )}
    >
      {children}
    </p>
  )
}

/* ---------------------------------------------------------------------------
 * TraceDivider — decorative circuit-trace line between hero and About.
 * Pure SVG, no animation (it's a divider, not a distraction).
 * ------------------------------------------------------------------------- */
export function TraceDivider() {
  return (
    <div className="relative mx-auto h-12 max-w-5xl px-6 sm:h-[72px]" aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1032 72"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* the trace path: down → diagonal jog → across → down */}
        <path
          d="M 40 0 V 22 L 62 44 H 990 V 72"
          stroke="#0E8078"
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
        {/* solder-pad circles at each corner of the trace */}
        <circle cx="40" cy="22" r="3.5" fill="#F0F4F8" stroke="#0E8078" strokeWidth="1.5" />
        <circle cx="990" cy="44" r="3.5" fill="#F0F4F8" stroke="#0E8078" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * GitHubIcon — official mark as an inline SVG so it inherits `currentColor`
 * ------------------------------------------------------------------------- */
export function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4 fill-current", className)} aria-hidden="true">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
    </svg>
  )
}

/* ---------------------------------------------------------------------------
 * LinkedInIcon — LinkedIn mark as inline SVG (inherits currentColor).
 * lucide-react 1.x dropped brand icons, so we ship our own.
 * ------------------------------------------------------------------------- */
export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4 fill-current", className)} aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  )
}

/* ---------------------------------------------------------------------------
 * PulseDot — small pulsing dot used for "OPEN TO WORK" / "LIVE" indicators.
 * The pulse is a gentle opacity blink (CSS only, disabled by reduced motion
 * via the `motion-safe:` variant).
 * ------------------------------------------------------------------------- */
export function PulseDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block h-[7px] w-[7px] rounded-full bg-copper",
        "motion-safe:animate-[pulse_1.6s_ease-in-out_infinite]",
        className
      )}
    />
  )
}
