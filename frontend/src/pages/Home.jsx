import { useState, useEffect, useRef } from "react"
import axios from "axios"
import Nav from "../components/Nav"
import Hero from "../components/Hero"
import AboutTeaser from "../components/AboutTeaser"
import Gallery from "../components/Gallery"
import Service from "../components/Service"
import TrustedBy from "../components/TrustedBy"
import Testimonials from "../components/Testimonials"
import InTouchMessage from "../components/InTouchMessage"
// import Contact from "../components/Contact"
import Footer from "../components/Footer"
import CustomCursor from "../components/CustomCursor"
import FeatureCardStack from "../components/FeatureCardStack"
import useMouseParallax from "../hooks/useMouseParallax"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const Home = () => {
  useMouseParallax({ customCursor: true })
  const heroRef = useRef(null)
  const galleryGridRef = useRef(null)
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_URL}/features`, {
          params: { showOnHome: true, limit: 6 },
        })
        setProjects(response.data.features)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoadingProjects(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div
      className="min-h-screen bg-[#0a0a0a]"
      style={{
        backgroundImage: "url('/bgelement.jpg')",
        backgroundSize: "100% auto",
        backgroundPosition: "top center",
        backgroundRepeat: "repeat-y",
      }}
    >
        <CustomCursor />
        <Nav />
        <div ref={heroRef}>
          <Hero />
        </div>
        <TrustedBy />
        <Gallery projects={projects} loading={loadingProjects} gridRef={galleryGridRef} />
        <Service />
        <Testimonials />
        <InTouchMessage />
        <Footer />
        <FeatureCardStack projects={projects} heroRef={heroRef} gridRef={galleryGridRef} />
        <AboutTeaser />
    </div>
  )
}

export default Home
