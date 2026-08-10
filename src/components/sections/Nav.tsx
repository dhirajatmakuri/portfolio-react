/**
 * =============================================================================
 * Nav.tsx — sticky top navigation bar. This is now the site's SINGLE piece of
 * persistent chrome (the old floating dock was removed to avoid two bars).
 *
 * Layout:
 *   md and up → logo on the left; section links + divider + quick-action icons
 *               (GitHub · LinkedIn · Email · Resume) inline on the right
 *   below md  → logo on the left, hamburger on the right; the links and icons
 *               move into a collapsible panel underneath. Previously the full
 *               desktop row just wrapped onto three lines on a phone.
 *
 * Section links come from NAV_LINKS; the icon links come from IDENTITY
 * (both in src/data/content.tsx).
 * =============================================================================
 */

import { useEffect, useRef, useState } from "react"
import { NAV_LINKS, IDENTITY } from "@/data/content"
import { GitHubIcon, LinkedInIcon } from "@/components/primitives"
import { useActiveSection } from "@/hooks/useActiveSection"
import { useResumeLinkProps } from "@/components/ResumeDialog"
import { Mail, FileText, Menu, X } from "lucide-react"

// Section ids the scroll-spy watches (derived once, module scope = stable ref).
const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace("#", ""))

export function Nav() {
  // id of the section currently in view — used to highlight its nav link
  const active = useActiveSection(SECTION_IDS)
  // mobile disclosure panel state (never rendered at md and up)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  /* Escape closes the panel and returns focus to the toggle, so keyboard users
     don't get stranded inside a menu they can't dismiss. */
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  /* If the viewport grows past the mobile breakpoint while the panel is open,
     close it — otherwise it stays mounted as a stray block under the bar. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    function onChange(e: MediaQueryListEvent) {
      if (e.matches) setOpen(false)
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 border-b border-hairline bg-background/85 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2 sm:px-6 sm:py-3.5">
        {/* logo: mono "> dhiraj.atmakuri" with a teal prompt tick */}
        <a
          href="#"
          className="inline-flex min-h-11 items-center font-mono text-sm font-medium text-ink no-underline"
        >
          <span className="text-copper">&gt;</span> dhiraj.atmakuri
        </a>

        {/* --- desktop: links + divider + icons, all inline --- */}
        <div className="hidden items-center justify-end gap-x-1 md:flex md:gap-x-2">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.label} link={link} active={active} />
          ))}

          {/* divider between navigation and actions */}
          <span aria-hidden="true" className="mx-1 h-4 w-px bg-hairline" />

          <ActionIcons />
        </div>

        {/* --- mobile: hamburger toggle (44x44 touch target) --- */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-ink-soft transition-colors hover:text-copper md:hidden"
        >
          {open ? (
            <X className="h-5 w-5" strokeWidth={1.8} aria-hidden />
          ) : (
            <Menu className="h-5 w-5" strokeWidth={1.8} aria-hidden />
          )}
        </button>
      </div>

      {/* --- mobile: collapsible panel with the same links + icons --- */}
      {open && (
        // Absolutely positioned so opening the menu OVERLAYS the page instead of
        // growing the sticky bar. As a normal-flow child it enlarged <nav>'s own
        // footprint, shoving every section below it down by ~336px — a visible
        // content jump, and it moved sections out from under the scroll-spy.
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-t border-hairline bg-background/95 px-4 pb-3 pt-1 shadow-[0_12px_24px_rgba(16,22,29,0.10)] backdrop-blur-md sm:px-6 md:hidden"
        >
          <ul className="flex list-none flex-col">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === `#${active}`
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "true" : undefined}
                    className={
                      "block border-l-2 py-3 pl-3 text-sm font-medium no-underline transition-colors " +
                      (isActive
                        ? "border-copper text-copper"
                        : "border-transparent text-ink-soft hover:text-copper")
                    }
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* quick-action icons, spaced out as a row under the links */}
          <div className="mt-2 flex items-center gap-2 border-t border-hairline pl-1 pt-3">
            <ActionIcons />
          </div>
        </div>
      )}
    </nav>
  )
}

/* ---------------------------------------------------------------------------
 * NavLink — one inline section link in the desktop bar, with the active
 * underline indicator driven by the scroll-spy.
 * ------------------------------------------------------------------------- */
function NavLink({
  link,
  active,
}: {
  link: { label: string; href: string }
  active: string
}) {
  const isActive = link.href === `#${active}`
  return (
    <a
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
}

/* ---------------------------------------------------------------------------
 * ActionIcons — the GitHub / LinkedIn / Email / Resume cluster. Rendered in
 * both the desktop bar and the mobile panel so the markup stays in one place.
 * ------------------------------------------------------------------------- */
function ActionIcons() {
  const resumeLink = useResumeLinkProps()

  return (
    <>
      <NavIcon href={IDENTITY.github} label="GitHub" external>
        <GitHubIcon className="h-[18px] w-[18px]" />
      </NavIcon>
      <NavIcon href={IDENTITY.linkedin} label="LinkedIn" external>
        <LinkedInIcon className="h-[18px] w-[18px]" />
      </NavIcon>
      <NavIcon href={`mailto:${IDENTITY.email}`} label="Email me">
        <Mail className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </NavIcon>
      <NavIcon {...resumeLink} label="Resume (PDF)" external>
        <FileText className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </NavIcon>
    </>
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
  onClick,
  children,
}: {
  href: string
  label: string
  external?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      title={label}
      aria-label={label}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className="inline-flex items-center justify-center rounded-md p-2 text-ink-soft transition-colors hover:text-copper"
    >
      {children}
    </a>
  )
}
