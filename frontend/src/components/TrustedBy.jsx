import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function TrustedBy() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get(`${API_URL}/partners`)
        setPartners(response.data)
      } catch (error) {
        console.error("Error fetching partners:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  if (loading) {
    return (
      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </section>
    )
  }

  if (partners.length === 0) {
    return null
  }

  return (
    <section className="py-16 px-6 bg-[#0a0a0a] border-t border-white/10">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Trusted By
        </h2>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
          Proud to have worked with these amazing organizations
        </p>
      </div>

      {/* Partners Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <a
              key={partner._id}
              href={partner.website || '#'}
              target={partner.website ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className={`group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition duration-300 ${
                partner.website ? 'cursor-pointer' : 'cursor-default'
              }`}
              onClick={(e) => !partner.website && e.preventDefault()}
            >
              <img
                src={partner.logoUrl}
                alt={partner.name}
                className="h-12 md:h-16 w-auto object-contain transition duration-300 opacity-80 group-hover:opacity-100"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
