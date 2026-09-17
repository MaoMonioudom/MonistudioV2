import { useEffect, useRef } from "react"

const TRAIL_LENGTH = 12

export default function CustomCursor() {
  const dotRef = useRef(null)
  const polylineRef = useRef(null)
  const historyRef = useRef(Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 })))

  useEffect(() => {
    let frame = requestAnimationFrame(function step() {
      const style = getComputedStyle(document.documentElement)
      const x = parseFloat(style.getPropertyValue("--cursor-x")) || -100
      const y = parseFloat(style.getPropertyValue("--cursor-y")) || -100

      const history = historyRef.current
      history.push({ x, y })
      history.shift()

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      }

      if (polylineRef.current) {
        polylineRef.current.setAttribute("points", history.map((p) => `${p.x},${p.y}`).join(" "))
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
        <polyline
          ref={polylineRef}
          fill="none"
          stroke="#3ea108"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
          style={{ filter: "blur(1px)" }}
        />
      </svg>

      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[100] pointer-events-none"
        style={{ transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)" }}
      >
        <span
          className="block w-3 h-3 rounded-full bg-brand-green"
          style={{ boxShadow: "0 0 10px 2px rgba(62,161,8,0.85)" }}
        />
      </div>
    </>
  )
}
