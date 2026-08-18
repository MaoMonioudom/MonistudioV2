import { useEffect, useRef } from "react"

const TRAIL_LENGTH = 10

export default function CustomCursor() {
  const arrowRef = useRef(null)
  const lineRefs = useRef([])
  const historyRef = useRef(Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 })))

  useEffect(() => {
    let frame = requestAnimationFrame(function step() {
      const style = getComputedStyle(document.documentElement)
      const x = parseFloat(style.getPropertyValue("--cursor-x")) || -100
      const y = parseFloat(style.getPropertyValue("--cursor-y")) || -100

      const history = historyRef.current
      history.push({ x, y })
      history.shift()

      if (arrowRef.current) {
        arrowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }

      for (let i = 0; i < TRAIL_LENGTH - 1; i++) {
        const line = lineRefs.current[i]
        if (!line) continue
        const a = history[i]
        const b = history[i + 1]
        line.setAttribute("x1", a.x)
        line.setAttribute("y1", a.y)
        line.setAttribute("x2", b.x)
        line.setAttribute("y2", b.y)
      }

      frame = requestAnimationFrame(step)
    })

    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <>
      <svg
        className="fixed inset-0 w-screen h-screen pointer-events-none z-[99]"
        style={{ mixBlendMode: "screen" }}
        aria-hidden="true"
      >
        {Array.from({ length: TRAIL_LENGTH - 1 }).map((_, i) => (
          <line
            key={i}
            ref={(el) => { lineRefs.current[i] = el }}
            stroke="#3ea108"
            strokeWidth="2"
            strokeLinecap="round"
            opacity={((i + 1) / (TRAIL_LENGTH - 1))}
          />
        ))}
      </svg>

      <div
        ref={arrowRef}
        className="fixed top-0 left-0 z-[100] pointer-events-none"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" style={{ filter: "drop-shadow(0 0 4px rgba(62,161,8,0.8))" }}>
          <path
            d="M2 1 L2 18 L6.5 14.3 L9.5 20.5 L12.8 19 L9.8 12.8 L16 12.3 Z"
            fill="#3ea108"
            stroke="#0a0a0a"
            strokeWidth="0"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  )
}
