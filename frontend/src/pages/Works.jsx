import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import Seo from "../components/Seo.jsx"
import Nav from "../components/Nav.jsx"
import SmokeWisp from "../components/SmokeWisp.jsx"
import PortfolioHero from "../components/PortfolioHero.jsx"
import InTouchMessage from "../components/InTouchMessage.jsx"
import Footer from "../components/Footer.jsx"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Works() {
  const [works, setWorks] = useState([])
  const [services, setServices] = useState([])
  const [activeCategory, setActiveCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 12

  // Fetch the (small) service list once, just to build the filter buttons.
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/services`)
        setServices(response.data)
      } catch (error) {
        console.error("Error fetching services:", error)
      }
    }

    fetchServices()
  }, [])

  // Fetch only the current page/category of works.
  useEffect(() => {
    const fetchWorks = async () => {
      setLoading(true)
      try {
        const activeService = services.find(s => s.title === activeCategory)
        const response = await axios.get(`${API_URL}/features`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            ...(activeService ? { serviceId: activeService._id } : {}),
          },
        })
        setWorks(response.data.features)
        setTotalPages(response.data.totalPages)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching works:", error)
        setLoading(false)
      }
    }

    fetchWorks()
  }, [currentPage, activeCategory, services])

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  const categories = ["All", ...services.map(s => s.title)]

  return (
    <>
      <Seo
        title="Portfolio | Moni Image Studio"
        description="Browse Moni Image Studio's photography portfolio, featuring portrait, event, product, and commercial work."
        path="/portfolio"
      />
      <Nav />

      <section className="relative isolate overflow-hidden min-h-screen bg-[#0a0a0a] pt-32 px-6">
        <div className="absolute -z-10 -top-24 -right-24 w-[45%] h-[400px] bg-brand-green/15 blur-[150px] rounded-full pointer-events-none"></div>
        <SmokeWisp flip rotate={-12} className="absolute -z-10 top-[6%] left-[10%] w-[100px] h-[92%] pointer-events-none" />
        <SmokeWisp rotate={16} className="absolute -z-10 bottom-6 right-[12%] w-[70px] h-[160px] pointer-events-none" />
        <SmokeWisp color="#f8f8f8" rotate={-8} className="absolute -z-10 top-10 right-[35%] w-[60px] h-[140px] pointer-events-none" />

        <div>
          <div className="max-w-[1360px] mx-auto">
            <PortfolioHero />
          </div>

          {/* Page Title */}
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Our Portfolio
            </h1>
            <p className="text-brand-white mt-4">
              A selection of projects crafted with passion
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-[1360px] mx-auto flex justify-start gap-3 mb-16 overflow-x-auto no-scrollbar px-1 -mx-1">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category)
                  setCurrentPage(1)
                }}
                className={`flex-shrink-0 uppercase text-xs md:text-sm font-bold tracking-wider px-4 py-2 rounded-full border transition-colors duration-300
                  ${
                    activeCategory === category
                      ? "bg-brand-green text-white border-brand-green"
                      : "text-gray-400 border-white/15 hover:text-white hover:border-white/40"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Works Grid */}
          {loading ? (
            <div className="text-white text-center text-xl">Loading works...</div>
          ) : works.length === 0 ? (
            <div className="text-brand-white text-center text-xl">No works found yet.</div>
          ) : (
            <>
              <div className="max-w-[1360px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {works.map((work) => (
                <Link
                  to={`/feature/${work._id}`}
                  key={work._id}
                  className="group cursor-pointer block"
                >

                  {/* Image */}
                  <div className="overflow-hidden rounded-lg relative aspect-[4/3]">
                    <img
                      src={work.imageUrl}
                      alt={work.title}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {/* Category Badge */}
                    {work.serviceId && (
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                          {work.serviceId.title}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mt-4">
                    <h3 className="text-white text-xl font-bold group-hover:text-gray-300 transition">
                      {work.title}
                    </h3>
                    <p className="text-brand-white mt-1 line-clamp-2">
                      {work.description}
                    </p>
                  </div>

                </Link>
              ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
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
                    {Array.from({ length: totalPages }).map((_, i) => (
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
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-green hover:text-brand-green transition"
                  >
                    <FiChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
        <InTouchMessage />
      <Footer />
    </>
  )
}
