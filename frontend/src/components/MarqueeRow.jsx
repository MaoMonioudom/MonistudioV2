import { useEffect, useRef } from "react"

export default function MarqueeRow({ items, speed = 40, direction = 1, renderItem, className = "" }) {
  const trackRef = useRef(null)
  const containerRef = useRef(null)
  const posRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const third = track.scrollWidth / 3
    posRef.current = -third

    let last = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      const dt = (now - last) / 1000
      last = now

      const third = track.scrollWidth / 3
      posRef.current -= direction * speed * dt
      while (third > 0 && posRef.current <= -third * 2) posRef.current += third
      while (third > 0 && posRef.current >= 0) posRef.current -= third
      track.style.transform = `translate3d(${posRef.current}px, 0, 0)`

      frame = requestAnimationFrame(step)
    })

    return () => cancelAnimationFrame(frame)
  }, [direction, speed])

  return (
    <div ref={containerRef} className={`trusted-by-scroll overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex items-center gap-5 md:gap-8 px-4 md:px-6 w-max will-change-transform">
        {items.map((item, index) => renderItem(item, index, containerRef))}
      </div>
    </div>
  )
}
