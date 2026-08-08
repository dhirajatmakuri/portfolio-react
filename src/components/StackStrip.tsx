/**
 * =============================================================================
 * StackStrip.tsx — a project's tech stack shown as a row of brand LOGOS that
 * cascade in when the card scrolls into view, with a name tooltip on hover.
 *
 * How it's wired:
 *   - TECH is a central registry mapping a short key ("react", "postgresql")
 *     to a display name + its react-icons logo. Add a tech once here and every
 *     project can reference it by key.
 *   - Each project in content.tsx lists `stack: string[]` of these keys.
 *   - Unknown keys are silently skipped, and tags that have no real logo
 *     (concepts like "design tokens" or "BLE GAP/GATT") are intentionally left
 *     out of the strip — the project description already carries that detail.
 *
 * Motion: a parent stagger reveals each logo ~50ms after the previous one.
 * Respects prefers-reduced-motion (logos just appear, no slide).
 * =============================================================================
 */

import { motion, useReducedMotion, type Variants } from "motion/react"
import type { IconType } from "react-icons"
import {
  SiReact,
  SiTypescript,
  SiExpo,
  SiEspressif,
  SiC,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiAstro,
  SiTailwindcss,
  SiPython,
  SiOpencv,
  SiNumpy,
  SiRaspberrypi,
  SiAutodesk,
  SiNextdotjs,
  SiMui,
} from "react-icons/si"

/* ---- central tech registry: key → { display name, logo } ---- */
const TECH: Record<string, { name: string; Icon: IconType }> = {
  react: { name: "React / React Native", Icon: SiReact },
  typescript: { name: "TypeScript", Icon: SiTypescript },
  expo: { name: "Expo", Icon: SiExpo },
  espressif: { name: "ESP32 · Espressif", Icon: SiEspressif },
  c: { name: "C", Icon: SiC },
  nodejs: { name: "Node.js", Icon: SiNodedotjs },
  express: { name: "Express", Icon: SiExpress },
  postgresql: { name: "PostgreSQL", Icon: SiPostgresql },
  astro: { name: "Astro", Icon: SiAstro },
  tailwind: { name: "Tailwind CSS", Icon: SiTailwindcss },
  python: { name: "Python", Icon: SiPython },
  opencv: { name: "OpenCV", Icon: SiOpencv },
  numpy: { name: "NumPy", Icon: SiNumpy },
  raspberrypi: { name: "Raspberry Pi", Icon: SiRaspberrypi },
  autodesk: { name: "Fusion 360", Icon: SiAutodesk },
  nextjs: { name: "Next.js", Icon: SiNextdotjs },
  mui: { name: "Material UI", Icon: SiMui },
}

export function StackStrip({ stack }: { stack: string[] }) {
  const reduce = useReducedMotion()

  // resolve keys → entries, dropping any unknown keys
  const items = stack.map((key) => TECH[key]).filter(Boolean)

  // parent controls the stagger; children do the actual fade/slide
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.05 } },
  }
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  }

  return (
    <motion.ul
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="flex list-none flex-wrap gap-2.5"
      aria-label="Tech stack"
    >
      {items.map(({ name, Icon }) => (
        <motion.li key={name} variants={item} className="group relative">
          {/* logo tile — monochrome by default, teal + lift on hover */}
          <div
            role="img"
            aria-label={name}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-hairline
              bg-card text-ink-soft transition-all duration-150
              group-hover:-translate-y-0.5 group-hover:border-copper group-hover:text-copper
              group-hover:shadow-[0_6px_16px_rgba(16,22,29,0.12)]"
          >
            <Icon className="h-[22px] w-[22px]" aria-hidden />
          </div>

          {/* hover tooltip with the tech's name */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap
              rounded bg-ink px-2 py-1 font-mono text-[0.68rem] text-white opacity-0
              transition-opacity duration-150 group-hover:opacity-100"
          >
            {name}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  )
}
