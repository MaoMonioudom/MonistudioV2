import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import SmokeWisp from "./SmokeWisp"
import FeatureCard from "./FeatureCard"
import useInView from "../hooks/useInView"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Gallery() {
  const [ref, inView] = useInView()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!inView) return
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/features`, {
          params: { showOnHome: true, limit: 6 },
        })
        setProjects(response.data.features)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching projects:", error)
        setLoading(false)
      }
    }

    fetchProjects()
  }, [inView])

  return (
    <section ref={ref} className={`relative isolate overflow-hidden py-16 bg-[#0a0a0a] px-6 reveal ${inView ? "in-view" : ""}`}>
      <SmokeWisp rotate={-10} className="absolute -z-10 top-[3%] right-[15%] w-[100px] h-[92%] pointer-events-none" />
      <SmokeWisp flip rotate={18} className="absolute -z-10 bottom-4 left-[4%] w-[70px] h-[160px] pointer-events-none" />
      <SmokeWisp color="#f8f8f8" flip rotate={-8} className="absolute -z-10 bottom-8 right-[25%] w-[60px] h-[140px] pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        <div className="w-12 h-1 bg-brand-green rounded-full mb-4"></div>
        <h2 className="text-3xl font-bold text-white mb-12 hover:text-brand-green transition-colors duration-300 inline-block cursor-default">Featured Works</h2>

        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : projects.length === 0 ? (
          <p className="text-brand-white text-center">No projects yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {projects.map((project, index) => {
                const cols = 3
                const col = index % cols
                const row = Math.floor(index / cols)
                const centerCol = (cols - 1) / 2
                const originX = (centerCol - col) * 90
                const originY = -(row + 1) * 50 - 40
                const originRotate = (col - centerCol) * 7 + (row % 2 === 0 ? -4 : 4)
                return (
                  <FeatureCard
                    key={project._id}
                    project={project}
                    delay={index * 0.09}
                    originX={originX}
                    originY={originY}
                    originRotate={originRotate}
                  />
                )
              })}
            </div>
            <div className="mt-12 text-center">
              <Link
                to="/portfolio"
                className="inline-block bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-brand-green hover:text-white transition-colors duration-300"
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
