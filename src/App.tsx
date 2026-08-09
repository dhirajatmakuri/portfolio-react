/**
 * =============================================================================
 * App.tsx — top-level page layout. Just composes the sections in order:
 *
 *   Nav        sticky frosted-glass navigation
 *   Hero       name + thesis + framed headshot
 *   About      bio + quick facts
 *   Now        job-hunt status + boot/whoami terminal
 *   Projects   featured projects (with live demos) + more-work grid
 *   Experience research role(s)
 *   Skills     toolbox marquee
 *   Contact    dark footer band with form + links
 *
 * All text/content lives in src/data/content.tsx — edit there, not here.
 * =============================================================================
 */

import { Nav } from "@/components/sections/Nav"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Now } from "@/components/sections/Now"
import { Projects } from "@/components/sections/Projects"
import { Experience } from "@/components/sections/Experience"
import { Skills } from "@/components/sections/Skills"
import { Contact } from "@/components/sections/Contact"
import { TraceDivider } from "@/components/primitives"
import { ResumeProvider } from "@/components/ResumeDialog"
// Vercel telemetry. The `/react` entrypoints are the framework-agnostic ones —
// the dashboard's default snippet shows `@vercel/analytics/next`, which is for
// Next.js and would fail to resolve in this Vite app.
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <ResumeProvider>
      <div className="min-h-screen bg-background text-foreground">
        {/* skip link for keyboard users — appears on first Tab press */}
        <a
          href="#main"
          className="absolute -top-12 left-4 z-[100] rounded-b-md bg-ink px-4 py-2.5 font-semibold text-white no-underline transition-[top] focus:top-0"
        >
          Skip to main content
        </a>

        <Nav />

        <main id="main">
          <Hero />
          <TraceDivider /> {/* decorative PCB-trace divider */}
          <About />
          <Now />
          <Projects />
          <Experience />
          <Skills />
        </main>

        <Contact />

        {/* Render nothing visible; they only inject the tracking beacons.
            Both no-op in development and outside Vercel. */}
        <Analytics />
        <SpeedInsights />
      </div>
    </ResumeProvider>
  )
}

export default App
