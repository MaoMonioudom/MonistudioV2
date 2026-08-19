import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import SmokeWisp from "./SmokeWisp"
import ServiceCard from "./ServiceCard"
import useInView from "../hooks/useInView"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Services() {
  const [ref, inView] = useInView()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!inView) return
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
  }, [inView])

  return (
    <section ref={ref} className={`relative isolate overflow-hidden py-20 px-6 bg-transparent reveal ${inView ? "in-view" : ""}`}>
      <SmokeWisp flip rotate={-15} className="absolute -z-10 top-[3%] left-[12%] w-[100px] h-[92%] pointer-events-none" />
      <SmokeWisp rotate={14} className="absolute -z-10 bottom-6 right-[10%] w-[70px] h-[160px] pointer-events-none" />
      <SmokeWisp color="#f8f8f8" rotate={-9} className="absolute -z-10 bottom-10 left-[35%] w-[60px] h-[140px] pointer-events-none" />
      {/* Section Title */}
      <div className="text-center mb-16">
        <div className="w-12 h-1 bg-brand-green rounded-full mx-auto mb-4"></div>
        <h2 className="text-3xl md:text-4xl font-bold text-white hover:text-brand-green transition-colors duration-300 inline-block cursor-default">
          Our Services
        </h2>
        <p className="text-brand-white mt-4 max-w-2xl mx-auto">
          We provide creative solutions tailored to your vision, from concept
          to final delivery.
        </p>
      </div>

      {loading ? (
        <div className="text-white text-center text-xl">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="text-brand-white text-center text-xl">No services available at the moment.</div>
      ) : (
        <>
          {/* Mobile horizontal scroll, Desktop grid */}
          <div className="flex sm:hidden overflow-x-auto gap-6 pb-4 -mx-6 px-6">
            {services.filter(service => service.showOnHome).slice(0, 6).map((service, index) => (
              <ServiceCard
                key={service._id}
                service={service}
                delay={index * 0.1}
                extraClassName="flex-shrink-0 w-72"
              />
            ))}
          </div>

          {/* Desktop grid view */}
          <div className="hidden sm:block">
            <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-12">
              {services.filter(service => service.showOnHome).slice(0, 6).map((service, index) => (
                <ServiceCard key={service._id} service={service} delay={(index % 3) * 0.12} />
              ))}
            </div>
          </div>
          {/* </div> */}
          <div className="mt-12 text-center">
            <Link
              to="/service"
              className="inline-block bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-brand-green hover:text-white transition-colors duration-300"
            >
              View All Services
            </Link>
          </div>
        </>
      )}
    </section>
  )
}

