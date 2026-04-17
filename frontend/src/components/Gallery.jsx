import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Gallery() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/features`)
        setProjects(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching projects:", error)
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <section className="py-16 bg-[#0a0a0a] px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-12">Featured Works</h2>

        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : projects.length === 0 ? (
          <p className="text-gray-400 text-center">No projects yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {projects.slice(0, 6).map((project) => (
              <Link 
                to={`/feature/${project._id}`} 
                key={project._id} 
                className="group cursor-pointer block"
              >
                {/* Image */}
                <div className="overflow-hidden rounded-lg relative">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
                  />
                  {/* Category Badge */}
                  {project.serviceId && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                        {project.serviceId.title}
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="mt-4">
                  <h3 className="text-white text-xl font-bold group-hover:text-gray-300 transition">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mt-1 line-clamp-2">
                    {project.description}
                  </p>
                </div>

              </Link>
            ))}
            </div>
            <div className="mt-12 text-center">
              <Link 
                to="/portfolio"
                className="inline-block bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
              >
                View More Works
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
