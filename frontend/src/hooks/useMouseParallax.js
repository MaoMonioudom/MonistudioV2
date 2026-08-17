import { useEffect } from "react"

export default function useMouseParallax({ customCursor = false } = {}) {
  useEffect(() => {
    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    if (!supportsHover) return

    if (customCursor) {
      document.body.classList.add("custom-cursor-active")
    }

    let frame = null

    const handleMove = (e) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        const mx = (e.clientX / window.innerWidth) * 2 - 1
        const my = (e.clientY / window.innerHeight) * 2 - 1
        document.documentElement.style.setProperty("--mx", mx.toFixed(3))
        document.documentElement.style.setProperty("--my", my.toFixed(3))
        document.documentElement.style.setProperty("--cursor-x", `${e.clientX}px`)
        document.documentElement.style.setProperty("--cursor-y", `${e.clientY}px`)
        frame = null
      })
    }

    window.addEventListener("mousemove", handleMove)
    return () => {
      window.removeEventListener("mousemove", handleMove)
      if (frame) cancelAnimationFrame(frame)
      if (customCursor) {
        document.body.classList.remove("custom-cursor-active")
      }
    }
  }, [customCursor])
}
