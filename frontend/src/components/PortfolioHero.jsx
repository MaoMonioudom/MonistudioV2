import { useState, useEffect, useCallback } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export default function PortfolioHero() {
  const [banners, setBanners] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${API_URL}/portfolio-banners`)
        setBanners(response.data)
      } catch (error) {
        console.error("Error fetching portfolio banners:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, banners.length, nextSlide])

  // Nothing configured in admin yet: render nothing, page keeps its plain title
  if (loading || banners.length === 0) return null

  const currentBanner = banners[currentIndex]

  return (
    <div
      className="relative isolate overflow-hidden rounded-2xl h-64 md:h-80 mb-14"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={banner.imageUrl}
            alt={banner.title || "Portfolio banner"}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            draggable="false"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          {(banner.title || banner.subtitle) && (
            <div className="relative z-10 flex flex-col items-start justify-end h-full px-6 pb-6 md:px-10 md:pb-8">
              {banner.title && (
                <h2 className="text-white text-2xl md:text-4xl font-bold">{banner.title}</h2>
              )}
              {banner.subtitle && (
                <p className="text-brand-white text-sm md:text-lg mt-2">{banner.subtitle}</p>
              )}
            </div>
          )}
        </div>
      ))}

      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-brand-green w-6" : "bg-white/50 hover:bg-white/75 w-2"
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
