import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Nav from "../components/Nav.jsx"
import Footer from "../components/Footer.jsx"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Service() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

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
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {services.map((service) => (
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
        )}
      </section>
      <Footer />
    </>
  )
}
