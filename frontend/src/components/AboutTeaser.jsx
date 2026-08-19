import { useEffect, useState } from "react"

export default function AboutTeaser() {
  const [dismissed, setDismissed] = useState(false)

  // Visible only until the user scrolls down a bit, then gone for good this session
  useEffect(() => {
    const dismissThreshold = 120
    const onScroll = () => {
      if (window.scrollY > dismissThreshold) {
        setDismissed(true)
        window.removeEventListener("scroll", onScroll)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (dismissed) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-24 md:h-28 flex items-center justify-end px-6 md:px-16 translate-y-full animate-slideInFromBottom bg-gradient-to-l from-brand-green to-transparent"
      aria-hidden="true"
    >
      <div className="text-right">
        <h2 className="text-white text-lg md:text-2xl font-bold">About Moni Image Studio</h2>
        <p className="text-white/90 text-xs md:text-base mt-1">
          Cambodia&apos;s creative studio for photography, branding, and visual storytelling.
        </p>
      </div>
    </div>
  )
}
