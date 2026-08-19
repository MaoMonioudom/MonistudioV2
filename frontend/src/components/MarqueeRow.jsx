import { useEffect, useRef } from "react"

export default function MarqueeRow({ items, speed = 40, direction = 1, renderItem, className = "" }) {
  const trackRef = useRef(null)
  const containerRef = useRef(null)
  const pausedRef = useRef(false)
  const resumeTimeoutRef = useRef(null)
  const posRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const halfWidth = track.scrollWidth / 2
    posRef.current = direction > 0 ? 0 : -halfWidth
    track.style.transform = `translate3d(${posRef.current}px, 0, 0)`

    let last = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      const dt = (now - last) / 1000
      last = now

      if (!pausedRef.current) {
        const half = track.scrollWidth / 2
        posRef.current -= direction * speed * dt
        if (posRef.current <= -half) {
          posRef.current += half
        } else if (posRef.current > 0) {
          posRef.current -= half
        }
        track.style.transform = `translate3d(${posRef.current}px, 0, 0)`
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
      ref={containerRef}
      className={`trusted-by-scroll overflow-hidden ${className}`}
      onTouchStart={pause}
      onTouchEnd={resumeAfterDelay}
      onTouchCancel={resumeAfterDelay}
      onPointerDown={pause}
      onPointerUp={resumeAfterDelay}
      onPointerCancel={resumeAfterDelay}
    >
      <div ref={trackRef} className="flex items-center gap-5 md:gap-8 px-4 md:px-6 w-max will-change-transform">
        {items.map((item, index) => renderItem(item, index, containerRef))}
      </div>
    </div>
  )
}
