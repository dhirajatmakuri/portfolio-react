/**
 * =============================================================================
 * ScanPanel.tsx — the hero's signature element: a fake "live BLE scan".
 *
 * Two parts:
 *   1. A <canvas> drawing a scrolling RSSI-style signal trace
 *      (layered sine waves + noise so it looks like a real radio signal).
 *   2. A rolling 3-line "scan log" of fake MAC addresses + signal strengths.
 *
 * This is a direct React port of the vanilla-JS version from the old site.
 * All animation runs inside useEffect with proper cleanup, and both parts
 * freeze into a static snapshot when the user prefers reduced motion.
 * =============================================================================
 */

import { useEffect, useRef, useState } from "react"

/* Canvas dimensions (logical pixels — CSS scales it responsively) */
const W = 440
const H = 130

/** One fake scan-log line, e.g. "> a4:c1:38:6e:0f:2a  -62 dBm  ~1.3 m" */
interface LogLine {
  id: number
  mac: string
  rssi: number
  dist: string
}

/* ---------------------------------------------------------------------------
 * Helpers for generating fake-but-plausible BLE data
 * ------------------------------------------------------------------------- */

/** Layered sines + noise → a wave that looks like a live RSSI trace */
function rssiSample(t: number): number {
  return (
    Math.sin(t / 22) * 14 +
    Math.sin(t / 9 + 1.7) * 7 +
    Math.sin(t / 53) * 16 +
    (Math.random() - 0.5) * 6
  )
}

/** Random hex byte, e.g. "3f" */
function hexByte(): string {
  return Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
}

let nextId = 0

/** Build one random scan-log entry (MAC prefix pool + random suffix) */
function makeLogLine(): LogLine {
  const prefixes = ["a4:c1:38:6e", "d8:3a:dd:12", "f0:9e:4a:77", "5c:02:14:b9", "e8:6b:ea:03"]
  const mac = `${prefixes[Math.floor(Math.random() * prefixes.length)]}:${hexByte()}:${hexByte()}`
  const rssi = -(40 + Math.floor(Math.random() * 45))
  // log-distance path-loss model — same formula the real firmware used
  const dist = Math.pow(10, (-59 - rssi) / 25).toFixed(1)
  return { id: nextId++, mac, rssi, dist }
}

/* ---------------------------------------------------------------------------
 * Component
 * ------------------------------------------------------------------------- */
export function ScanPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // The rolling scan log — start with 3 lines already on screen
  const [lines, setLines] = useState<LogLine[]>(() => [
    makeLogLine(),
    makeLogLine(),
    makeLogLine(),
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    /* -- signal trace state -- */
    const points: number[] = [] // most recent samples, one per x-pixel
    let t = 0
    let rafId = 0

    /** Draw one full frame: grid, then trace, then leading dot */
    function draw() {
      t++
      points.push(rssiSample(t))
      if (points.length > W) points.shift()

      ctx!.clearRect(0, 0, W, H)

      // faint background grid
      ctx!.strokeStyle = "rgba(255,255,255,0.06)"
      ctx!.lineWidth = 1
      for (let y = 0; y <= H; y += 26) {
        ctx!.beginPath(); ctx!.moveTo(0, y); ctx!.lineTo(W, y); ctx!.stroke()
      }
      for (let x = 0; x <= W; x += 44) {
        ctx!.beginPath(); ctx!.moveTo(x, 0); ctx!.lineTo(x, H); ctx!.stroke()
      }

      // the signal trace (newest sample pinned to the right edge)
      ctx!.beginPath()
      for (let i = 0; i < points.length; i++) {
        const x = W - points.length + i
        const y = H / 2 + points[i]
        if (i === 0) ctx!.moveTo(x, y)
        else ctx!.lineTo(x, y)
      }
      ctx!.strokeStyle = "#5BC0BE" // teal-bright
      ctx!.lineWidth = 1.8
      ctx!.stroke()

      // glowing dot at the newest sample
      const yLead = H / 2 + points[points.length - 1]
      ctx!.beginPath()
      ctx!.arc(W - 1, yLead, 3, 0, Math.PI * 2)
      ctx!.fillStyle = "#6FFFE9" // neon-ice
      ctx!.fill()

      if (!reduced) rafId = requestAnimationFrame(draw)
    }

    let logTimer: ReturnType<typeof setInterval> | undefined

    if (reduced) {
      // Reduced motion: pre-fill the whole trace and draw ONE static frame
      for (let i = 0; i < W; i++) {
        t++
        points.push(rssiSample(t))
      }
      draw()
    } else {
      // Normal: animate the trace + push a new log line every 1.8 s
      draw()
      logTimer = setInterval(() => {
        setLines((prev) => [...prev, makeLogLine()].slice(-3)) // keep last 3
      }, 1800)
    }

    // Cleanup: stop the animation + interval when unmounting
    return () => {
      cancelAnimationFrame(rafId)
      if (logTimer) clearInterval(logTimer)
    }
  }, [])

  return (
    // The whole panel is decorative "flavor" — hide it from screen readers
    <div
      aria-hidden="true"
      className="rounded-[10px] bg-ink-panel p-[22px] pb-4 text-[#C9D2CE] shadow-[0_18px_44px_rgba(16,22,29,0.28)]"
    >
      {/* header row: title + pulsing LIVE badge */}
      <div className="mb-3.5 flex items-center justify-between font-mono text-xs tracking-[0.04em] text-[#8A9590]">
        <span>blustick — ble scan</span>
        <span className="flex items-center gap-2 text-teal-bright">
          <span className="h-[7px] w-[7px] rounded-full bg-copper motion-safe:animate-[pulse_1.6s_ease-in-out_infinite]" />
          LIVE
        </span>
      </div>

      {/* the signal trace */}
      <canvas ref={canvasRef} width={W} height={H} className="block w-full rounded" />

      {/* rolling scan log (last 3 detections) */}
      <div className="mt-3 flex min-h-[74px] flex-col gap-[5px] border-t border-white/10 pt-2.5 font-mono text-xs">
        {lines.map((l) => (
          <div key={l.id} className="truncate text-[#97A39E]">
            &gt; {l.mac} &nbsp;
            <span className="text-teal-bright">{l.rssi} dBm</span> &nbsp;~{l.dist} m
          </div>
        ))}
      </div>
    </div>
  )
}
