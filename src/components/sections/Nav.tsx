/**
 * =============================================================================
 * Nav.tsx — sticky top navigation bar. This is now the site's SINGLE piece of
 * persistent chrome (the old floating dock was removed to avoid two bars).
 *
 * Layout:
 *   left   → logo "> dhiraj.atmakuri"
 *   right  → section links (About, Now, …, Contact)
 *            + a divider
 *            + quick-action icons: GitHub · LinkedIn · Email · Resume
 *
 * Section links come from NAV_LINKS; the icon links come from IDENTITY
 * (both in src/data/content.tsx).
 * =============================================================================
 */

import { NAV_LINKS, IDENTITY } from "@/data/content"
import { GitHubIcon, LinkedInIcon } from "@/components/primitives"
import { useActiveSection } from "@/hooks/useActiveSection"
import { Mail, FileText } from "lucide-react"

// Section ids the scroll-spy watches (derived once, module scope = stable ref).
const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace("#", ""))

export function Nav() {
  // id of the section currently in view — used to highlight its nav link
  const active = useActiveSection(SECTION_IDS)

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 border-b border-hairline bg-background/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-1 px-4 py-2 sm:px-6 sm:py-3.5">
        {/* logo: mono "> dhiraj.atmakuri" with a teal prompt tick */}
        <a href="#" className="font-mono text-sm font-medium text-ink no-underline">
          <span className="text-copper">&gt;</span> dhiraj.atmakuri
        </a>

        {/* right side: section links + divider + quick-action icons */}
        <div className="flex flex-wrap items-center justify-end gap-x-1 gap-y-0 sm:gap-x-2">
          {/* --- section anchor links --- */}
          {NAV_LINKS.map((link) => {
            // active when this link's target is the section currently in view
            const isActive = link.href === `#${active}`
            return (
              <a
                key={link.label}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                className={
                  "relative inline-block px-1.5 py-2 text-sm font-medium no-underline transition-colors " +
                  (isActive
                    ? // active: teal text + a small teal underline indicator
                      "text-copper after:absolute after:inset-x-1.5 after:bottom-1 after:h-[2px] after:rounded-full after:bg-copper after:content-['']"
                    : "text-ink-soft hover:text-copper")
                }
              >
                {link.label}
              </a>
            )
          })}

          {/* --- divider between navigation and actions --- */}
          <span aria-hidden="true" className="mx-1 hidden h-4 w-px bg-hairline sm:inline-block" />

          {/* --- quick-action icons (external + resume) --- */}
          <NavIcon href={IDENTITY.github} label="GitHub" external>
            <GitHubIcon className="h-[18px] w-[18px]" />
          </NavIcon>
          <NavIcon href={IDENTITY.linkedin} label="LinkedIn" external>
            <LinkedInIcon className="h-[18px] w-[18px]" />
          </NavIcon>
          <NavIcon href={`mailto:${IDENTITY.email}`} label="Email me">
            <Mail className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </NavIcon>
          <NavIcon href={IDENTITY.resume} label="Resume (PDF)" external>
            <FileText className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </NavIcon>
        </div>
      </div>
    </nav>
  )
}

/* ---------------------------------------------------------------------------
 * NavIcon — one icon link in the nav's action cluster.
 * `title`/`aria-label` give a hover tooltip + screen-reader name.
 * ------------------------------------------------------------------------- */
function NavIcon({
  href,
  label,
  external,
  children,
}: {
  href: string
  label: string
  external?: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      title={label}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className="inline-flex items-center justify-center rounded-md p-2 text-ink-soft transition-colors hover:text-copper"
    >
      {children}
    </a>
  )
}
