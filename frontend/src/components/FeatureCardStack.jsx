import { useEffect, useRef, useState } from "react"

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const lerp = (a, b, t) => a + (b - a) * t

export default function FeatureCardStack({ projects, heroRef, gridRef }) {
  const [enabled, setEnabled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [landed, setLanded] = useState(false)
  const [, forceRender] = useState(0)
  const measureRef = useRef({ heroAnchor: null, finalRects: [], startY: 0, endY: 0 })
  const frameRef = useRef(null)
  const scrollYRef = useRef(0)
  const landedRef = useRef(false)

  useEffect(() => {
    const checkSize = () => setEnabled(window.innerWidth >= 768)
    checkSize()
    window.addEventListener("resize", checkSize)
    return () => window.removeEventListener("resize", checkSize)
  }, [])

  useEffect(() => {
    if (!enabled || !projects || projects.length === 0 || landed) return

    const measure = () => {
      const hero = heroRef.current
      const grid = gridRef.current
      if (!hero || !grid || grid.children.length === 0) return

      const heroRect = hero.getBoundingClientRect()
      const scrollY = window.scrollY
      const heroTopAbs = heroRect.top + scrollY
      const heroAnchor = {
        x: heroRect.left + heroRect.width / 2,
        y: heroTopAbs + heroRect.height * 0.72,
      }

      const gridRect = grid.getBoundingClientRect()
      const gridTopAbs = gridRect.top + scrollY

      const finalRects = Array.from(grid.children)
        .slice(0, projects.length)
        .map((child) => {
          const imgEl = child.querySelector("img")
          const imgHeight = imgEl ? imgEl.offsetHeight : child.offsetHeight
          return {
            left: gridRect.left + child.offsetLeft,
            top: gridTopAbs + child.offsetTop,
            width: child.offsetWidth,
            imgHeight,
          }
        })

      measureRef.current = {
        heroAnchor,
        finalRects,
        startY: heroTopAbs,
        endY: heroTopAbs + 260,
      }
      forceRender((n) => n + 1)
    }

    measure()
    window.addEventListener("resize", measure)

    const resizeObserver = new ResizeObserver(() => measure())
    resizeObserver.observe(gridRef.current)
    resizeObserver.observe(heroRef.current)

    const settleTimers = [setTimeout(measure, 200), setTimeout(measure, 800)]

    const onScroll = () => {
      scrollYRef.current = window.scrollY
      if (frameRef.current) return
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null
        if (landedRef.current) return
        const { startY, endY } = measureRef.current
        const span = endY - startY || 1
        const p = clamp((scrollYRef.current - startY) / span, 0, 1)
        setProgress(p)
        if (p >= 1) {
          landedRef.current = true
          setLanded(true)
        }
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener("resize", measure)
      window.removeEventListener("scroll", onScroll)
      resizeObserver.disconnect()
      settleTimers.forEach(clearTimeout)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [enabled, projects, heroRef, gridRef, landed])

  if (!enabled || landed || !projects || projects.length === 0) return null

  const { heroAnchor, finalRects } = measureRef.current
  if (!heroAnchor || finalRects.length === 0) return null

  const scrollY = window.scrollY
  const overallOpacity = progress > 0.9 ? clamp(1 - (progress - 0.9) / 0.1, 0, 1) : 1
  const captionOpacity = progress > 0.6 ? clamp((progress - 0.6) / 0.3, 0, 1) : 0

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {projects.slice(0, 6).map((project, index) => {
        const final = finalRects[index]
        if (!final) return null

        const startX = heroAnchor.x + ((index % 3) - 1) * 30
        const startY = heroAnchor.y + Math.floor(index / 3) * 22

        const width = final.width
        const imgHeight = final.imgHeight
        const centerX = lerp(startX, final.left + final.width / 2, progress)
        const centerYAbs = lerp(startY, final.top + final.imgHeight / 2, progress)
        const centerY = centerYAbs - scrollY
        const rotate = lerp((index - 2.5) * 6, 0, progress)

        return (
          <div
            key={project._id}
            style={{
              position: "absolute",
              width,
              left: centerX - width / 2,
              top: centerY - imgHeight / 2,
              transform: `rotate(${rotate}deg)`,
              opacity: overallOpacity,
              zIndex: 10 + index,
            }}
          >
            <div className="overflow-hidden rounded-lg shadow-2xl" style={{ width, height: imgHeight }}>
              <img src={project.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div
              className="mt-2 text-white text-xs md:text-sm font-bold truncate"
              style={{ opacity: captionOpacity }}
            >
              {project.title}
            </div>
          </div>
        )
      })}
    </div>
  )
}
