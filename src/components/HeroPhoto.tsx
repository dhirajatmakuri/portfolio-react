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
        {/* 4:5 portrait window. The source is a 2:3 full-body shot, already
            cropped to 4:5 and centred on the subject at build time (900x1125),
            so the img needs no transform trickery — object-cover just fills. */}
        <div className="aspect-[4/5] overflow-hidden rounded-[8px]">
          <img
            src="/assets/portrait.jpg"
            alt={`${IDENTITY.name} standing on a pier at sunrise, arms crossed`}
            width={900}
            height={1125}
            className="block h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
