import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import Seo from "../components/Seo.jsx"
import Nav from "../components/Nav.jsx"
import SmokeWisp from "../components/SmokeWisp.jsx"
import InTouchMessage from "../components/InTouchMessage.jsx"
import Footer from "../components/Footer.jsx"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Service() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/services`)
        setServices(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching services:", error)
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  return (
    <>
      <Seo
        title="Services | Moni Image Studio"
        description="Explore the photography and imaging services offered by Moni Image Studio, including portraits, events, products, and commercial shoots."
        path="/service"
      />
      <Nav />

      <section className="relative isolate overflow-hidden min-h-screen bg-[#0a0a0a] pt-32 px-6">
        <div className="absolute -z-10 -top-24 -right-24 w-[45%] h-[400px] bg-brand-green/15 blur-[150px] rounded-full pointer-events-none"></div>
        <SmokeWisp rotate={10} className="absolute -z-10 top-[5%] left-[15%] w-[90px] h-[92%] pointer-events-none" />
        <SmokeWisp flip rotate={-16} className="absolute -z-10 bottom-8 right-[10%] w-[70px] h-[160px] pointer-events-none" />
        <SmokeWisp color="#f8f8f8" flip rotate={7} className="absolute -z-10 top-16 right-[32%] w-[55px] h-[130px] pointer-events-none" />

        {/* Page Title */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Services
          </h1>
          <p className="text-brand-white mt-4 max-w-2xl mx-auto">
            We provide creative solutions tailored to your vision, from concept
            to final delivery.
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-white text-center text-xl">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="text-brand-white text-center text-xl">No services available at the moment.</div>
        ) : (
          <>
            <div className="max-w-[1360px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
              {services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((service) => (
              <Link
                to={`/service/${service._id}`}
                key={service._id}
                className="group bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition cursor-pointer"
              >
                {/* Image */}
                {service.imageUrl && (
                  <div className="overflow-hidden relative aspect-[4/3]">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-white font-bold text-xl mb-3">
                    {service.title}
                  </h3>
                  <p className="text-brand-white text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Link>
            ))}
            </div>

            {/* Pagination */}
            {services.length > itemsPerPage && (
              <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-green hover:text-brand-green transition"
                >
                  <FiChevronLeft size={18} />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.ceil(services.length / itemsPerPage) }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-full font-bold transition ${
                        currentPage === i + 1
                          ? "bg-brand-green text-white"
                          : "border border-white/15 text-white hover:border-brand-green hover:text-brand-green"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(Math.ceil(services.length / itemsPerPage), currentPage + 1))}
                  disabled={currentPage === Math.ceil(services.length / itemsPerPage)}
                  aria-label="Next page"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-green hover:text-brand-green transition"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
        <InTouchMessage />
      <Footer />
    </>
  )
}
