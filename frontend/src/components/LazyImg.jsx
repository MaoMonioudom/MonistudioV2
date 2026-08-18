import { useEffect, useRef, useState } from "react"

export default function LazyImg({ src, alt, className, containerRef, ...props }) {
  const imgRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (shouldLoad) return
    const node = imgRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { root: containerRef?.current || null, rootMargin: "150px", threshold: 0 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [shouldLoad, containerRef])

  return (
    <img
      ref={imgRef}
      src={shouldLoad ? src : undefined}
      alt={alt}
      className={className}
      decoding="async"
      {...props}
    />
  )
}
