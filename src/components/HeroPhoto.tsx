/**
 * =============================================================================
 * HeroPhoto.tsx — the hero's right-column visual: a framed headshot.
 *
 * Replaces the old live BLE scan panel. Styled to stay on-brand with the
 * rest of the site: a dark "panel" frame (like the scan/agent cards), the
 * same deep drop-shadow, and a soft teal glow behind it so it doesn't feel
 * flat.
 *
 * The photo lives at: public/assets/headshot.png
 * =============================================================================
 */

import { IDENTITY } from "@/data/content"

export function HeroPhoto() {
  return (
    // relative wrapper so the teal glow can sit behind the framed card
    <div className="relative mx-auto w-full max-w-[360px]">
      {/* soft teal glow behind the card (decorative) */}
      <div
        aria-hidden="true"
        className="absolute -inset-4 -z-10 rounded-[24px] bg-copper/15 blur-2xl"
      />

      {/* the dark panel frame */}
      <div className="overflow-hidden rounded-[14px] bg-ink-panel p-2 shadow-[0_18px_44px_rgba(16,22,29,0.28)]">
        {/* the photo itself */}
        <img
          src="/assets/headshot.png"
          alt={`${IDENTITY.name}, Computer Engineer`}
          width={400}
          height={400}
          className="block w-full rounded-[8px] object-cover"
        />
      </div>
    </div>
  )
}
