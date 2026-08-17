import { useEffect, useRef } from "react"

export default function MarqueeRow({ items, speed = 40, direction = 1, renderItem, className = "" }) {
  const trackRef = useRef(null)
  const pausedRef = useRef(false)
  const resumeTimeoutRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const halfWidth = track.scrollWidth / 2
    track.scrollLeft = direction > 0 ? 0 : halfWidth

    let last = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      const dt = (now - last) / 1000
      last = now

      if (!pausedRef.current) {
        const half = track.scrollWidth / 2
        track.scrollLeft += direction * speed * dt
        if (track.scrollLeft >= half) {
          track.scrollLeft -= half
        } else if (track.scrollLeft <= 0) {
          track.scrollLeft += half
        }
      }

      frame = requestAnimationFrame(step)
    })

    return () => cancelAnimationFrame(frame)
  }, [direction, speed])

  const pause = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    pausedRef.current = true
  }

  const resumeAfterDelay = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false
    }, 1200)
  }

  return (
    <div
      ref={trackRef}
      className={`trusted-by-scroll flex items-center gap-5 md:gap-8 px-4 md:px-6 overflow-x-auto ${className}`}
      onMouseEnter={pause}
      onMouseLeave={() => { pausedRef.current = false }}
      onTouchStart={pause}
      onTouchEnd={resumeAfterDelay}
      onPointerDown={pause}
      onPointerUp={resumeAfterDelay}
    >
      {items.map(renderItem)}
    </div>
  )
}
