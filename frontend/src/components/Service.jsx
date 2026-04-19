import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Services() {
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
    <section className="py-20 px-6 bg-[#0a0a0a]">
      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Our Services
        </h2>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          We provide creative solutions tailored to your vision, from concept
          to final delivery.
        </p>
      </div>

      {loading ? (
        <div className="text-white text-center text-xl">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="text-gray-400 text-center text-xl">No services available at the moment.</div>
      ) : (
        <>
          {/* Mobile horizontal scroll, Desktop grid */}
          <div className="flex sm:hidden overflow-x-auto gap-6 pb-4 -mx-6 px-6">
            {services.filter(service => service.showOnHome).slice(0, 6).map((service) => (
              <Link
                to={`/service/${service._id}`}
                key={service._id}
                className="group bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition cursor-pointer flex-shrink-0 w-72"
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

          {/* Desktop grid view */}
          <div className="hidden sm:block">
            <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-12">
              {services.filter(service => service.showOnHome).slice(0, 6).map((service) => (
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
          </div>
          {/* </div> */}
          <div className="mt-12 text-center">
            <Link 
              to="/service"
              className="inline-block bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
            >
              View All Services
            </Link>
          </div>
        </>
      )}
    </section>
  )
}

