import { useEffect, useRef, useState } from "react"

export default function useInView(options) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect()
      }
    }, { threshold: 0, rootMargin: "0px 0px -20% 0px", ...options })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, inView]
}
