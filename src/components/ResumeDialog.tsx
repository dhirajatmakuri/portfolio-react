/**
 * =============================================================================
 * ResumeDialog.tsx — preview-then-download modal for the resume PDF.
 *
 * Every "resume" affordance on the site (nav icon, hero button, skills prose
 * link, contact link) used to be a plain `target="_blank"` anchor that dumped
 * the visitor into the browser's PDF viewer and lost the page. Now they open
 * this dialog: preview first, download or open-in-tab as deliberate actions.
 *
 * Wiring:
 *   <ResumeProvider>   mounts the single dialog + supplies the open callback
 *   useResumeLinkProps()  returns {href, onClick} to spread onto any anchor
 *
 * The anchors keep a real `href`, so middle-click, ⌘/Ctrl-click and "open in
 * new tab" all still work — the click handler bails out on modified clicks and
 * only intercepts a plain left click.
 *
 * Built on the native <dialog> element, which gives us the focus trap, the
 * Escape-to-close behaviour, inertness of the page behind, and focus restore
 * for free — all things a hand-rolled modal usually gets wrong.
 * =============================================================================
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react"
import { IDENTITY } from "@/data/content"
import { Download, ExternalLink, X } from "lucide-react"

const ResumeContext = createContext<(() => void) | null>(null)

/**
 * Props to spread onto an anchor so it opens the preview instead of navigating.
 * Keeps the href intact so the link degrades gracefully without JS and honours
 * modified clicks.
 */
export function useResumeLinkProps() {
  const open = useContext(ResumeContext)
  return {
    href: IDENTITY.resume,
    onClick(e: MouseEvent<HTMLAnchorElement>) {
      // Let the browser handle new-tab / new-window / download intents.
      if (
        e.defaultPrevented ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0
      ) {
        return
      }
      if (!open) return // no provider mounted — fall back to normal navigation
      e.preventDefault()
      open()
    },
  }
}

export function ResumeProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)

  // Deliberately NOT mirroring open/closed in React state. <dialog> is an
  // imperative element that closes itself (Escape, form method=dialog), so a
  // boolean prop is a second source of truth that can drift out of sync — and
  // when it drifts to `true` while the element is actually closed, the next
  // open() is a no-op that never re-runs showModal() and the dialog silently
  // refuses to reopen. Driving the element directly makes that impossible.
  const [loaded, setLoaded] = useState(false)

  const show = useCallback(() => {
    setLoaded(true) // one-way latch: mount the PDF on first open, keep it mounted
    const el = ref.current
    if (el && !el.open) el.showModal()
  }, [])

  return (
    <ResumeContext.Provider value={show}>
      {children}
      <ResumeDialog ref={ref} loaded={loaded} />
    </ResumeContext.Provider>
  )
}

/* ---------------------------------------------------------------------------
 * The dialog itself
 * ------------------------------------------------------------------------- */
function ResumeDialog({
  ref,
  loaded,
}: {
  ref: React.RefObject<HTMLDialogElement | null>
  loaded: boolean
}) {
  const close = () => ref.current?.close()

  return (
    <dialog
      ref={ref}
      aria-labelledby="resume-dialog-title"
      // Clicking the backdrop (i.e. the dialog element itself, outside the
      // inner panel) dismisses — matching what people expect from a lightbox.
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
      className="m-auto w-[min(940px,94vw)] rounded-xl border border-hairline bg-background p-0
        text-foreground shadow-[0_28px_70px_rgba(16,22,29,0.35)]
        backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex h-[min(86vh,1000px)] flex-col">
        {/* header: title + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-4 py-3 sm:px-5">
          <h2
            id="resume-dialog-title"
            className="font-[family-name:var(--font-display)] text-lg font-bold text-ink"
          >
            Résumé
          </h2>

          <div className="flex items-center gap-2">
            <a
              href={IDENTITY.resume}
              download
              className="inline-flex h-11 items-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-white no-underline transition-colors hover:bg-copper"
            >
              <Download className="h-[17px] w-[17px]" strokeWidth={1.9} aria-hidden />
              Download
            </a>
            <a
              href={IDENTITY.resume}
              target="_blank"
              rel="noopener"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-hairline px-3.5 text-sm font-semibold text-ink-soft no-underline transition-colors hover:border-copper hover:text-copper"
            >
              <ExternalLink className="h-[17px] w-[17px]" strokeWidth={1.9} aria-hidden />
              <span className="hidden sm:inline">Open in new tab</span>
            </a>
            <button
              type="button"
              onClick={close}
              aria-label="Close resume preview"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink-soft transition-colors hover:text-copper"
            >
              <X className="h-5 w-5" strokeWidth={1.9} aria-hidden />
            </button>
          </div>
        </div>

        {/* preview — only rendered once the dialog has been opened, so the PDF
            isn't fetched on page load for visitors who never ask for it */}
        <div className="min-h-0 flex-1 bg-muted">
          {open && (
            <>
              {/* Desktop: inline preview. */}
              <iframe
                src={`${IDENTITY.resume}#view=FitH`}
                title="Resume preview"
                className="hidden h-full w-full border-0 md:block"
              />
              {/* Mobile: iOS Safari and most mobile browsers refuse to render a
                  PDF inside an iframe — it silently shows a blank box. Offer the
                  two things that do work instead of a broken frame. */}
              <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center md:hidden">
                <p className="text-[0.95rem] text-ink-soft">
                  Mobile browsers can't preview PDFs inline. Download it or open
                  it in a new tab.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <a
                    href={IDENTITY.resume}
                    download
                    className="inline-flex h-11 items-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-white no-underline"
                  >
                    <Download className="h-[17px] w-[17px]" strokeWidth={1.9} aria-hidden />
                    Download PDF
                  </a>
                  <a
                    href={IDENTITY.resume}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex h-11 items-center gap-2 rounded-md border border-hairline px-4 text-sm font-semibold text-ink-soft no-underline"
                  >
                    <ExternalLink className="h-[17px] w-[17px]" strokeWidth={1.9} aria-hidden />
                    Open in new tab
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </dialog>
  )
}
