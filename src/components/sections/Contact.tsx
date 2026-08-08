/**
 * =============================================================================
 * Contact.tsx — the dark footer band: heading, contact form, and links.
 *
 * The form does NOT send anything itself — on submit it opens the visitor's
 * mail app with a pre-filled email (mailto:). No backend needed, and the
 * visitor stays in control of what actually gets sent.
 * =============================================================================
 */

import { useState, type FormEvent } from "react"
import { GitHubIcon } from "@/components/primitives"
import { IDENTITY } from "@/data/content"

/* The "reaching out about" dropdown options */
const TOPICS = ["A job opportunity", "Feedback on my work", "Something else"]

export function Contact() {
  // Controlled form fields
  const [name, setName] = useState("")
  const [topic, setTopic] = useState(TOPICS[0])
  const [message, setMessage] = useState("")

  /** Build a mailto: URL from the form fields and open the mail app */
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const subject = `${topic} — ${name.trim()}`
    const body = `${message.trim()}\n\n— ${name.trim()}`
    window.location.href =
      `mailto:${IDENTITY.email}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`
  }

  /* Shared input styling (dark panel inputs) */
  const inputClasses =
    "rounded-md border border-white/[0.16] bg-white/5 px-3 py-2.5 text-base text-[#E9F0F8] " +
    "outline-none focus:border-copper focus-visible:outline-2 focus-visible:outline-copper"

  return (
    <footer
      id="contact"
      className="mt-10 scroll-mt-[70px] bg-ink-panel text-[#E8EAE6]"
    >
      <div className="mx-auto max-w-5xl px-6 pb-14 pt-16">
        {/* section label (teal-bright variant for the dark background) */}
        <p className="mb-8 flex items-center gap-3 font-mono text-xs tracking-[0.04em] text-teal-bright after:h-px after:flex-1 after:bg-white/10 after:content-['']">
          CONTACT
        </p>

        <h2 className="mb-4 max-w-[17em] font-[family-name:var(--font-display)] text-[clamp(1.7rem,3.4vw,2.3rem)] font-bold leading-[1.15] tracking-[-0.015em] text-white">
          Class of May 2026. Looking for a team that ships.
        </h2>
        <p className="mb-8 max-w-[36em] text-[#97A39E]">
          I'm open to software engineering, full-stack, mobile, and
          hardware-adjacent roles. If any of the work above is relevant to what
          you're building, I'd like to hear about it.
        </p>

        <div className="mb-14 grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-14">
          {/* ---- Left: the pre-filled email form ---- */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-[10px] border border-white/10 bg-white/[0.04] p-6"
          >
            <label className="flex flex-col gap-1.5 font-mono text-[0.68rem] tracking-[0.07em] text-[#97A39E]">
              YOUR NAME
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                className={inputClasses}
              />
            </label>

            <label className="flex flex-col gap-1.5 font-mono text-[0.68rem] tracking-[0.07em] text-[#97A39E]">
              REACHING OUT ABOUT
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={inputClasses + " cursor-pointer [&_option]:bg-ink-panel"}
              >
                {TOPICS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 font-mono text-[0.68rem] tracking-[0.07em] text-[#97A39E]">
              MESSAGE
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="A role you're hiring for, a question about a project, or anything else."
                className={inputClasses + " min-h-[110px] resize-y"}
              />
            </label>

            <button
              type="submit"
              className="cursor-pointer rounded-md border-0 bg-copper px-5 py-3 text-[0.95rem] font-semibold text-white transition-colors hover:bg-copper-deep"
            >
              Send via your email app
            </button>

            <p className="text-[0.8rem] text-[#6E7A75]">
              This opens a pre-filled email in your mail app — nothing is sent
              until you hit send there. Prefer to write directly?{" "}
              <a href={`mailto:${IDENTITY.email}`} className="text-[#97A39E] underline underline-offset-2">
                {IDENTITY.email}
              </a>
            </p>
          </form>

          {/* ---- Right: direct contact links ---- */}
          <div className="flex flex-col items-stretch gap-3.5">
            <ContactLink href={`mailto:${IDENTITY.email}`} label={IDENTITY.email}>
              <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-current">
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.24-8 5-8-5V6.51l8 5 8-5v1.73z" />
              </svg>
            </ContactLink>
            <ContactLink href={IDENTITY.linkedin} label="LinkedIn" external>
              <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-current">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </ContactLink>
            <ContactLink href={IDENTITY.github} label="GitHub" external>
              <GitHubIcon className="h-[17px] w-[17px]" />
            </ContactLink>
            <ContactLink href={IDENTITY.phoneHref} label={IDENTITY.phone}>
              <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-current">
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
              </svg>
            </ContactLink>
            <ContactLink href={IDENTITY.resume} label="Resume (PDF)" external>
              <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] fill-current">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
            </ContactLink>
          </div>
        </div>

        {/* copyright line */}
        <div className="flex flex-wrap justify-between gap-2.5 border-t border-white/10 pt-5 font-mono text-xs text-[#97A39E]">
          <span>© 2026 {IDENTITY.name}</span>
          <span>{IDENTITY.location}</span>
        </div>
      </div>
    </footer>
  )
}

/* ---------------------------------------------------------------------------
 * ContactLink — one bordered link row with an icon
 * ------------------------------------------------------------------------- */
function ContactLink({
  href,
  label,
  external,
  children, // the icon SVG
}: {
  href: string
  label: string
  external?: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className="inline-flex items-center gap-2.5 rounded-md border border-white/20 px-5 py-2.5 text-[0.95rem] font-medium text-[#E8EAE6] no-underline transition-colors hover:border-copper hover:text-teal-bright"
    >
      {children}
      {label}
    </a>
  )
}
