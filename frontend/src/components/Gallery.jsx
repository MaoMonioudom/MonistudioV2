import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Gallery() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/features`)
        setProjects(response.data)
      } catch (error) {
        console.error("Error fetching projects:", error)
      }
    }

    fetchProjects()
  }, [])

  return (
    <section className="py-20 px-4 bg-[#0a0a0a]">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
        Featured Works
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {projects.map((project) => (
          <Link 
            to={`/feature/${project._id}`}
            key={project._id}
            className="relative group overflow-hidden rounded-lg cursor-pointer block"
          >
            {/* Image */}
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
            />

            {/* Hover overlay (optional) */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
              <p className="text-white font-bold text-lg">{project.title}</p>
            </div>

            {/* Title + description under image */}
            <div className="mt-2 text-center">
              <h3 className="text-white font-bold">{project.title}</h3>
              <p className="text-gray-400 text-sm">{project.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
