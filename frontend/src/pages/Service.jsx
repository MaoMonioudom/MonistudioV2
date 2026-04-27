import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Nav from "../components/Nav.jsx"
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
      <Nav />

      <section className="min-h-screen bg-[#0a0a0a] pt-32 px-6">
        
        {/* Page Title */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Services
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            We provide creative solutions tailored to your vision, from concept
            to final delivery.
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-white text-center text-xl">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="text-gray-400 text-center text-xl">No services available at the moment.</div>
        ) : (
          <>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
              {services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((service) => (
              <Link
                to={`/service/${service._id}`}
                key={service._id}
                className="group bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition cursor-pointer"
              >
                {/* Image */}
                {service.imageUrl && (
                  <div className="overflow-hidden">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-white font-bold text-xl mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
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
                  className="px-4 py-2 rounded-lg font-bold bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.ceil(services.length / itemsPerPage) }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-2 rounded-lg font-bold transition ${
                        currentPage === i + 1
                          ? "bg-white text-black"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(Math.ceil(services.length / itemsPerPage), currentPage + 1))}
                  disabled={currentPage === Math.ceil(services.length / itemsPerPage)}
                  className="px-4 py-2 rounded-lg font-bold bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
                >
                  Next
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
