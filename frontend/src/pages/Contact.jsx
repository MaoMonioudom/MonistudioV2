import { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import contactImage from "../assets/temp.webp"; // fallback image

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Contact() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${API_URL}/contact-banners`);
        setBanners(response.data);
      } catch (error) {
        console.error("Error fetching contact banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Auto-swipe effect
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleImageClick = (link) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <>
      <Nav />

      <section className="min-h-screen bg-[#0a0a0a] pt-32 px-6 flex flex-col items-center">
        {/* Hero Image Carousel */}
        <div className="max-w-4xl w-full overflow-hidden rounded-xl mb-12 relative">
          {loading ? (
            <div className="w-full h-96 bg-gray-800 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : banners.length === 0 ? (
            <img
              src={contactImage}
              alt="Our Team"
              className="w-full h-96 object-cover"
            />
          ) : (
            <>
              {/* Carousel Images */}
              <div className="relative h-96 overflow-hidden">
                {banners.map((banner, index) => (
                  <div
                    key={banner._id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <img
                      src={banner.imageUrl}
                      alt={banner.title || 'Contact banner'}
                      onClick={() => handleImageClick(banner.link)}
                      className={`w-full h-full object-cover ${
                        banner.link ? 'cursor-pointer hover:scale-105 transition-transform duration-500' : ''
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              {banners.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition duration-300"
                    aria-label="Previous"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition duration-300"
                    aria-label="Next"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Dot Indicators */}
              {banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition duration-300 ${
                        index === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Contact Info */}
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-400 mb-8">
            We’d love to hear from you! You can reach us via email, phone, or visit our studio.
          </p>

          <div className="text-gray-300 space-y-4 text-lg">
            <p>Email: <span className="text-white">monirathnakmao@gmail.com</span></p>
            <p>Phone: <span className="text-white">+855 15 966 757</span></p>
            <p>Website: <span className="text-white">www.monistudio.com</span></p>
            <p>Address: <span className="text-white">ផ្លូវ៣៧១ សង្គាត់ចោមចៅទី១ ខណ្ឌពោធិ៍សែនជ័យ រាជធានីភ្នំពេញ</span></p>
            <p><a href="https://maps.app.goo.gl/4pwCS1sz1dweLWXt6">(Google Map)</a></p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
