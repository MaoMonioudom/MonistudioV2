import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import heroImg from "../assets/heroImg.jpg"; // Fallback image

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Hero() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${API_URL}/banners`);
        setBanners(response.data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Auto-swap functionality
  const nextSlide = useCallback(() => {
    if (banners.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    if (banners.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }
  }, [banners.length]);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length, nextSlide]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Go to specific slide
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Fallback banner if no banners exist
  const fallbackBanner = {
    title: "MONI IMAGE",
    subtitle: "Visual storytelling through design & code",
    imageUrl: heroImg,
  };

  const displayBanners = banners.length > 0 ? banners : [fallbackBanner];
  const currentBanner = displayBanners[currentIndex] || fallbackBanner;

  if (loading) {
    return (
      <section className="relative h-screen w-full bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </section>
    );
  }

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Banner Slides */}
      {displayBanners.map((banner, index) => (
        <div
          key={banner._id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            {/* Title */}
            <h1 className="text-white text-5xl md:text-7xl font-bold mb-4 animate-fadeIn">
              {banner.title}
            </h1>

            {/* Subtitle */}
            {banner.subtitle && (
              <p className="text-gray-300 text-lg md:text-2xl mb-8 animate-fadeIn animation-delay-200">
                {banner.subtitle}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Only show if multiple banners */}
      {displayBanners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
            aria-label="Previous slide"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
            aria-label="Next slide"
          >
            <FiChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dot Indicators - Only show if multiple banners */}
      {displayBanners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {displayBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Optional scroll indicator */}
      <span className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 text-gray-400 animate-bounce text-2xl">
        ↓
      </span>
    </section>
  );
}
