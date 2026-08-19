import { useEffect, useRef } from "react"

export default function MarqueeRow({ items, speed = 40, direction = 1, renderItem, className = "" }) {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const third = track.scrollWidth / 3
    track.scrollLeft = third

    let last = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      const dt = (now - last) / 1000
      last = now

      const third = track.scrollWidth / 3
      track.scrollLeft += direction * speed * dt
      if (track.scrollLeft >= third * 2) {
        track.scrollLeft -= third
      } else if (track.scrollLeft <= 0) {
        track.scrollLeft += third
      }

      frame = requestAnimationFrame(step)
    })

    return () => cancelAnimationFrame(frame)
  }, [direction, speed])

  return (
    <div ref={trackRef} className={`trusted-by-scroll flex items-center gap-5 md:gap-8 px-4 md:px-6 overflow-x-auto ${className}`}>
      {items.map((item, index) => renderItem(item, index, trackRef))}
    </div>
  )
}
