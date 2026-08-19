import { useEffect, useRef } from "react"

export default function TestimonialMarquee({ testimonials, speed = 30 }) {
  const trackRef = useRef(null)
  const containerRef = useRef(null)
  const posRef = useRef(0)
  const itemRefs = useRef([])

  const loopedItems = [...testimonials, ...testimonials, ...testimonials]

  useEffect(() => {
    const track = trackRef.current
    const container = containerRef.current
    if (!track || !container) return

    const third = track.scrollWidth / 3
    posRef.current = -third

    let last = performance.now()
    let frame = requestAnimationFrame(function step(now) {
      const dt = (now - last) / 1000
      last = now

      const third = track.scrollWidth / 3
      posRef.current -= speed * dt
      while (third > 0 && posRef.current <= -third * 2) posRef.current += third
      while (third > 0 && posRef.current >= 0) posRef.current -= third
      track.style.transform = `translate3d(${posRef.current}px, 0, 0)`

      const containerRect = container.getBoundingClientRect()
      const centerX = containerRect.left + containerRect.width / 2
      const half = containerRect.width / 2

      itemRefs.current.forEach((el) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const norm = Math.min(Math.abs(cx - centerX) / half, 1)
        const scale = 1.15 - norm * 0.3
        const opacity = 1 - norm * 0.35
        el.style.transform = `scale(${scale.toFixed(3)})`
        el.style.opacity = opacity.toFixed(3)
      })

      frame = requestAnimationFrame(step)
    })

    return () => cancelAnimationFrame(frame)
  }, [speed])

  return (
    <div ref={containerRef} className="trusted-by-scroll overflow-hidden px-6 md:px-16 py-6">
      <div ref={trackRef} className="flex items-center gap-8 w-max will-change-transform">
        {loopedItems.map((testimonial, index) => (
          <div
            key={`${testimonial.name}-${index}`}
            ref={(el) => { itemRefs.current[index] = el }}
            className="flex-shrink-0 w-[240px] md:w-[300px] h-[340px] md:h-[380px]"
          >
            <div className="relative overflow-hidden bg-black/40 border border-white/10 rounded-xl p-8 hover:border-brand-green/50 transition-colors duration-300 h-full flex flex-col">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-green via-white/40 to-transparent"></div>
              <p className="text-brand-green text-3xl font-serif leading-none mb-3">&ldquo;</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-7 flex-1">
                {testimonial.quote}
              </p>
              <div>
                <p className="text-white font-bold">{testimonial.name}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
