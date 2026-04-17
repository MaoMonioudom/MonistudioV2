import { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import contactImage from "../assets/temp.webp"; // fallback image
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiSend } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Contact() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');

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

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormMessage('');

    try {
      console.log('Form submitted:', formData);
      setFormMessage('Thank you! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormMessage(''), 3000);
    } catch (error) {
      setFormMessage('An error occurred. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <>
      <Nav />

      {/* Banner Section */}
      <section className="bg-[#0a0a0a] pt-24 pb-12 px-6">
        <div className="max-w-4xl w-full mx-auto overflow-hidden rounded-2xl mb-8 relative">
          {loading ? (
            <div className="w-full h-96 bg-gray-800 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : banners.length === 0 ? (
            <img src={contactImage} alt="Contact" className="w-full h-96 object-cover" />
          ) : (
            <>
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
                      alt={banner.title}
                      onClick={() => handleImageClick(banner.link)}
                      className={`w-full h-full object-cover ${
                        banner.link ? 'cursor-pointer hover:scale-105 transition-transform duration-500' : ''
                      }`}
                    />
                  </div>
                ))}
              </div>

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
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#0a0a0a] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Let's Connect
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We're here to help and answer any question you might have. Reach out to us through any of the channels below.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-8">Contact Information</h2>

              {/* Email */}
              <div className="flex gap-4 items-start p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition">
                <FiMail size={24} className="text-white flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Email</h3>
                  <a href="mailto:monirathnakmao@gmail.com" className="text-gray-400 hover:text-white transition">
                    monirathnakmao@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 items-start p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition">
                <FiPhone size={24} className="text-white flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Phone</h3>
                  <a href="tel:+85515966757" className="text-gray-400 hover:text-white transition">
                    +855 15 966 757
                  </a>
                </div>
              </div>

              {/* Website */}
              <div className="flex gap-4 items-start p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition">
                <FiGlobe size={24} className="text-white flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Website</h3>
                  <a href="https://www.monistudio.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                    www.monistudio.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-4 items-start p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition">
                <FiMapPin size={24} className="text-white flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Address</h3>
                  <p className="text-gray-400 mb-3">
                    áž•áŸ’áž›áž¼ážœáŸ£áŸ§áŸ¡ ážŸáž„áŸ’áž‚áž¶ážáŸ‹áž…áŸ„áž˜áž…áŸ…áž‘áž¸áŸ¡ ážážŽáŸ’ážŒáž–áŸ„áž’áž·áŸážŸáŸ‚áž“áž‡áŸáž™ ážšáž¶áž‡áž’áž¶áž“áž¸áž—áŸ’áž“áŸ†áž–áŸáž‰
                  </p>
                  <a 
                    href="https://maps.app.goo.gl/4pwCS1sz1dweLWXt6" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition font-semibold"
                  >
                    View on Google Maps â†’
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Send us a Message</h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="john@example.com"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-gray-300 text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Tell us about your project..."
                    rows={4}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition duration-300 disabled:opacity-50"
                >
                  <FiSend size={18} />
                  {formSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                {/* Form Message */}
                {formMessage && (
                  <p className={`text-center text-sm py-2 rounded-lg ${
                    formMessage.includes('error') 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {formMessage}
                  </p>
                )}
              </form>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
