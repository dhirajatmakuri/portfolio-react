/**
 * =============================================================================
 * WaterReflection.tsx — interactive in-browser port of the Python/OpenCV
 * water-reflection pipeline from the CSCE 448 project.
 *
 * Pipeline stages (mirrors perspective.py):
 *   flip → vertical compression → perspective narrowing → sine ripple
 *   → blur → darken/vertical fade → composite at the waterline.
 *
 * Interactions:
 *   - Click the image to move the waterline
 *   - Four sliders tune amplitude / frequency / compression / darkness
 *
 * Performance notes:
 *   - "Dirty flag" rendering: we only redraw when something changed
 *   - IntersectionObserver pauses the ripple when scrolled off-screen
 *   - Ripple animation is skipped entirely under reduced motion
 * =============================================================================
 */

import { useEffect, useRef, useState } from "react"

/* Canvas geometry (logical pixels) */
const W = 800
const H = 600
const IMG_H = 450 // the source photo occupies the top 450px
const SHRINK = 0.12 // perspective_shrink default from the Python tool

/** The four user-tunable parameters (slider state) */
interface FxParams {
  amp: number   // ripple amplitude in px
  freq: number  // ripple frequency
  comp: number  // vertical compression of the reflection (0.5–1)
  dark: number  // how much the reflection is darkened (0.3–1)
}

export function WaterReflection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Slider values live in React state so the UI labels update...
  const [params, setParams] = useState<FxParams>({ amp: 6, freq: 0.06, comp: 0.82, dark: 0.78 })

  // ...but the render loop reads them through refs to avoid re-running
  // the whole effect (and rebuilding canvases) on every slider tick.
  const paramsRef = useRef(params)
  paramsRef.current = params

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    /* -- mutable animation state (not React state: changes every frame) -- */
    let waterY = 320        // y-position of the waterline
    let phase = 0           // ripple phase (advances each frame)
    let visible = false     // is the canvas on screen? (IntersectionObserver)
    let needsFrame = true   // dirty flag — redraw only when true
    let rafId = 0

    /* Offscreen canvases: one holds the source photo, one builds the
       reflection row-by-row before compositing */
    const imgCanvas = document.createElement("canvas")
    imgCanvas.width = W
    imgCanvas.height = IMG_H
    const reflCanvas = document.createElement("canvas")
    reflCanvas.width = W
    const reflCtx = reflCanvas.getContext("2d")!

    /** Draw one full frame of the effect */
    function render() {
      const p = paramsRef.current

      // 1. background + source photo + water area
      ctx!.fillStyle = "#0B132B"
      ctx!.fillRect(0, 0, W, H)
      ctx!.drawImage(imgCanvas, 0, 0)
      ctx!.fillRect(0, waterY, W, H - waterY)

      // 2. build the reflection: read the photo bottom-up, one row at a time
      const compressedH = Math.min(Math.round(waterY * p.comp), H - waterY)
      if (compressedH < 2) return
      reflCanvas.height = compressedH
      reflCtx.fillStyle = "#0B132B"
      reflCtx.fillRect(0, 0, W, compressedH)

      for (let y = 0; y < compressedH; y++) {
        const frac = y / compressedH
        // source row: mirrored (bottom of photo → top of reflection)
        const srcY = Math.max(0, waterY - 1 - Math.floor(frac * (waterY - 1)))
        // ripple grows stronger further from the waterline
        const localAmp = p.amp * (0.25 + 0.75 * frac)
        const shift = localAmp * Math.sin(2 * Math.PI * p.freq * y + phase)
        // perspective narrowing: rows squeeze inward with depth
        const inset = ((W * SHRINK) / 2) * frac
        reflCtx.drawImage(imgCanvas, 0, srcY, W, 1, inset + shift, y, W - 2 * inset, 1)
      }

      // 3. composite the reflection below the waterline, slightly blurred
      ctx!.filter = "blur(1.4px)"
      ctx!.drawImage(reflCanvas, 0, waterY)
      ctx!.filter = "none"

      // 4. darken + vertical fade so the reflection reads as water
      const g = ctx!.createLinearGradient(0, waterY, 0, waterY + compressedH)
      g.addColorStop(0, `rgba(10,14,22,${1 - p.dark})`)
      g.addColorStop(1, `rgba(10,14,22,${1 - p.dark * 0.12})`)
      ctx!.fillStyle = g
      ctx!.fillRect(0, waterY, W, compressedH)

      // 5. thin teal waterline guide (like the OpenCV picker)
      ctx!.strokeStyle = "rgba(91,192,190,0.55)"
      ctx!.lineWidth = 1
      ctx!.beginPath()
      ctx!.moveTo(0, waterY + 0.5)
      ctx!.lineTo(W, waterY + 0.5)
      ctx!.stroke()
    }

    /* Animation loop: ~30fps ripple, but ONLY while visible & motion is ok.
       Slider/click changes still repaint via the dirty flag even when the
       ripple itself is paused. */
    let last = 0
    function loop(now: number) {
      if (visible) {
        if (!reduced && paramsRef.current.amp > 0 && now - last > 33) {
          phase += 0.09
          needsFrame = true
          last = now
        }
        if (needsFrame) {
          render()
          needsFrame = false
        }
      }
      rafId = requestAnimationFrame(loop)
    }

    /* Load the demo photo, then start the loop */
    const img = new Image()
    img.src = "/assets/ferrari.jpg"
    img.onload = () => {
      imgCanvas.getContext("2d")!.drawImage(img, 0, 0, W, IMG_H)
      needsFrame = true
      rafId = requestAnimationFrame(loop)
    }
    img.onerror = () => {
      // graceful fallback if the image is missing
      ctx!.fillStyle = "#0B132B"
      ctx!.fillRect(0, 0, W, H)
      ctx!.fillStyle = "#97A39E"
      ctx!.font = "24px monospace"
      ctx!.textAlign = "center"
      ctx!.fillText("demo image unavailable — see the source on GitHub", W / 2, H / 2)
    }

    /* Pause rendering while scrolled off-screen (saves CPU/battery) */
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting
      },
      { threshold: 0.05 }
    )
    io.observe(canvas)

    /* Click moves the waterline (clamped so some photo always remains) */
    function onClick(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect()
      const y = Math.round(((e.clientY - r.top) / r.height) * H)
      waterY = Math.max(80, Math.min(y, IMG_H - 20))
      needsFrame = true
    }
    canvas.addEventListener("click", onClick)

    /* Repaint when sliders change: watch params via a tiny rAF-free trick —
       the paramsRef is updated by React, so we just mark dirty on prop flow.
       (Handled in the slider onChange below via `markDirtyRef`.) */
    markDirtyRef.current = () => {
      needsFrame = true
    }

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(rafId)
      io.disconnect()
      canvas.removeEventListener("click", onClick)
    }
  }, [])

  /** Lets slider handlers poke the render loop's dirty flag */
  const markDirtyRef = useRef<() => void>(() => {})

  /** Update one param from a slider and request a repaint */
  function setParam(key: keyof FxParams, value: number) {
    setParams((prev) => ({ ...prev, [key]: value }))
    markDirtyRef.current()
  }

  /* The slider definitions: [label, key, min, max, step, rawValue, display] —
     raw slider ints are mapped to the real float values where needed */
  return (
    <div>
      {/* canvas + hint overlay */}
      <div className="relative bg-ink-panel">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block h-auto w-full cursor-crosshair"
          role="img"
          aria-label="Interactive water-reflection demo: the Python pipeline ported to JavaScript. Click the image to move the waterline; use the sliders below to tune the effect."
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-2.5 rounded bg-[rgba(10,14,22,0.55)] px-2.5 py-1 font-mono text-[0.68rem] text-[rgba(233,240,248,0.75)]"
        >
          click image to set waterline
        </span>
      </div>

      {/* the four parameter sliders */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-white/10 bg-white/[0.04] p-4 sm:grid-cols-4">
        <FxSlider
          label="WAVE AMP"
          display={String(params.amp)}
          min={0} max={30} step={1} value={params.amp}
          onChange={(v) => setParam("amp", v)}
        />
        <FxSlider
          label="WAVE FREQ"
          display={params.freq.toFixed(2)}
          min={1} max={20} step={1} value={params.freq * 100}
          onChange={(v) => setParam("freq", v / 100)}
        />
        <FxSlider
          label="COMPRESS"
          display={params.comp.toFixed(2)}
          min={50} max={100} step={1} value={params.comp * 100}
          onChange={(v) => setParam("comp", v / 100)}
        />
        <FxSlider
          label="DARKEN"
          display={params.dark.toFixed(2)}
          min={30} max={100} step={1} value={params.dark * 100}
          onChange={(v) => setParam("dark", v / 100)}
        />
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * FxSlider — one labeled range input used by the panel above
 * ------------------------------------------------------------------------- */
function FxSlider({
  label,
  display,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string
  display: string // formatted value shown next to the label
  min: number
  max: number
  step: number
  value: number
  onChange: (rawValue: number) => void
}) {
  return (
    <label className="flex flex-col gap-1.5 font-mono text-[0.66rem] tracking-[0.06em] text-[#97A39E]">
      <span>
        {label} <span className="text-teal-bright">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-copper"
      />
    </label>
  )
}
