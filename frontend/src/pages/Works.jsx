import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import Nav from "../components/Nav.jsx"
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
      <Nav />

      <section className="relative isolate overflow-hidden min-h-screen bg-[#0a0a0a] pt-32 px-6">
        <div className="absolute -z-10 -top-24 -right-24 w-[45%] h-[400px] bg-brand-green/15 blur-[150px] rounded-full pointer-events-none"></div>

        {/* Page Title */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Our Portfolio
          </h1>
          <p className="text-gray-400 mt-4">
            A selection of projects crafted with passion
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-8 mb-16 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category)
                setCurrentPage(1)
              }}
              className={`uppercase text-sm font-bold tracking-wider transition pb-1
                ${
                  activeCategory === category
                    ? "text-white border-b-2 border-white"
                    : "text-gray-500 hover:text-white"
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
          <div className="text-gray-400 text-center text-xl">No works found yet.</div>
        ) : (
          <>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {works.map((work) => (
              <Link
                to={`/feature/${work._id}`}
                key={work._id}
                className="group cursor-pointer block"
              >

                {/* Image */}
                <div className="overflow-hidden rounded-lg relative">
                  <img
                    src={work.imageUrl}
                    alt={work.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
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
                  <p className="text-gray-400 mt-1 line-clamp-2">
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
                  className="px-4 py-2 rounded-lg font-bold bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
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
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
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
